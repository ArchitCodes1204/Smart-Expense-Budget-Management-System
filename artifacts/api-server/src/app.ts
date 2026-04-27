import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Serve static frontend files
const frontendDistPath = path.resolve(__dirname, "../../expense-app/dist/public");
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled API error");
  const errorText = String(err);
  const cause = (err as { cause?: unknown } | null)?.cause;
  const causeText = String(cause ?? "");
  const causeErrors = Array.isArray((cause as { errors?: unknown[] } | null)?.errors)
    ? ((cause as { errors: unknown[] }).errors ?? []).map((item) => String(item)).join(" ")
    : "";
  const combinedErrorText = `${errorText} ${causeText} ${causeErrors}`;
  const isDatabaseUnavailable = combinedErrorText.includes("ECONNREFUSED");
  const isSchemaMissing =
    combinedErrorText.includes('relation "users" does not exist') ||
    combinedErrorText.includes('relation "budgets" does not exist');

  if (isDatabaseUnavailable) {
    res.status(503).json({
      error: "Database unavailable",
      message: "Database connection failed. Start PostgreSQL and run schema push before using auth features.",
    });
    return;
  }

  if (isSchemaMissing) {
    res.status(503).json({
      error: "Database schema not initialized",
      message: "Run schema push/migrations before using the application.",
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env["NODE_ENV"] === "development" ? combinedErrorText : undefined,
  });
});

export default app;
