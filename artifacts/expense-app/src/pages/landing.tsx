import { Link } from "wouter";
import { useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  ShieldCheck,
  Wallet,
  TrendingUp,
  PieChart,
  Zap,
} from "lucide-react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Three.js Particle Globe                                            */
/* ------------------------------------------------------------------ */
function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create sphere particle geometry
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.6 + (Math.random() - 0.5) * 0.3;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Gradient from cyan to violet
      const t = Math.random();
      colors[i * 3] = 0.2 + t * 0.5;     // R
      colors[i * 3 + 1] = 0.6 + t * 0.2; // G
      colors[i * 3 + 2] = 0.9 + t * 0.1; // B

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Inner glow sphere
    const glowGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x6c63ff,
      transparent: true,
      opacity: 0.04,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Floating ring
    const ringGeo = new THREE.TorusGeometry(2.0, 0.005, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      points.rotation.y = t * 0.08 + mouseX * 0.3;
      points.rotation.x = mouseY * 0.2;
      ring.rotation.z = t * 0.15;
      glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="landing-canvas" />;
}

/* ------------------------------------------------------------------ */
/*  GSAP Scroll Animations (vanilla – no ScrollTrigger plugin needed)  */
/* ------------------------------------------------------------------ */
function useScrollReveal() {
  const observe = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );
    el.querySelectorAll("[data-reveal]").forEach((child) => {
      (child as HTMLElement).style.opacity = "0";
      (child as HTMLElement).style.transform = "translateY(40px)";
      (child as HTMLElement).style.transition =
        "opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)";
      observer.observe(child);
    });
    return () => observer.disconnect();
  }, []);
  return observe;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const features = [
  {
    title: "Live Spend Intelligence",
    description:
      "Visualize trends, category drift and budget pressure with real-time dashboards built for daily decisions.",
    icon: BarChart3,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    title: "Smart Notifications",
    description:
      "Proactive alerts before you overspend—fine-grained reminders that keep you in control every month.",
    icon: Bell,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    title: "Secure by Design",
    description:
      "Modern auth, isolated user data, and auditable flows to keep your finances private and protected.",
    icon: ShieldCheck,
    gradient: "from-emerald-400 to-teal-500",
  },
];

const stats = [
  { label: "Budget Accuracy", value: "99.2%", icon: TrendingUp },
  { label: "Categories Tracked", value: "50+", icon: PieChart },
  { label: "Instant Alerts", value: "< 1s", icon: Zap },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Landing() {
  const scrollRef = useScrollReveal();

  return (
    <div className="landing-root">
      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Wallet size={18} />
            </div>
            <span>FinTrack</span>
          </div>
          <div className="landing-nav-links">
            <Link href="/login">
              <button className="landing-btn-ghost">Log in</button>
            </Link>
            <Link href="/register">
              <button className="landing-btn-primary">
                Get Started
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="landing-hero">
        <ParticleCanvas />
        <div className="landing-hero-overlay" />

        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot" />
            Built for Modern Personal Finance
          </div>

          <h1 className="landing-hero-title">
            Control your <span className="landing-gradient-text">cash flow</span>{" "}
            with a product that feels like your CFO.
          </h1>

          <p className="landing-hero-sub">
            Budgeting, expense tracking, reporting, and smart alerts in one clean
            workspace. Fast enough for daily use, clear enough for long-term planning.
          </p>

          <div className="landing-hero-ctas">
            <Link href="/register">
              <button className="landing-btn-hero">
                Start Free
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/login">
              <button className="landing-btn-outline">Sign In</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────── */}
      <section className="landing-stats" ref={scrollRef}>
        <div className="landing-stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="landing-stat" data-reveal>
              <s.icon className="landing-stat-icon" size={22} />
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Bento ─────────────────────────── */}
      <section className="landing-features" ref={scrollRef}>
        <div className="landing-section-header" data-reveal>
          <h2 className="landing-section-title">
            Everything you need,{" "}
            <span className="landing-gradient-text">nothing you don't.</span>
          </h2>
          <p className="landing-section-sub">
            Powerful features wrapped in a minimal interface so you can focus on what matters.
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="landing-feature-card"
              data-reveal
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className={`landing-feature-icon bg-gradient-to-br ${f.gradient}`}>
                <f.icon size={22} color="white" />
              </div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dashboard Preview ──────────────────────── */}
      <section className="landing-preview" ref={scrollRef}>
        <div className="landing-preview-inner" data-reveal>
          <div className="landing-preview-card">
            <div className="landing-preview-header">
              <div className="landing-preview-dots">
                <span /><span /><span />
              </div>
              <span className="landing-preview-title-bar">FinTrack — Dashboard</span>
            </div>
            <div className="landing-preview-body">
              <div className="landing-preview-sidebar">
                <div className="landing-preview-sidebar-item active">Dashboard</div>
                <div className="landing-preview-sidebar-item">Expenses</div>
                <div className="landing-preview-sidebar-item">Budgets</div>
                <div className="landing-preview-sidebar-item">Reports</div>
              </div>
              <div className="landing-preview-main">
                <div className="landing-preview-stat-row">
                  <div className="landing-preview-stat">
                    <div className="landing-preview-stat-label">Total Spent</div>
                    <div className="landing-preview-stat-value">₹58,240</div>
                  </div>
                  <div className="landing-preview-stat">
                    <div className="landing-preview-stat-label">Remaining</div>
                    <div className="landing-preview-stat-value green">₹28,160</div>
                  </div>
                  <div className="landing-preview-stat">
                    <div className="landing-preview-stat-label">Budget Used</div>
                    <div className="landing-preview-stat-value cyan">67.4%</div>
                  </div>
                </div>
                <div className="landing-preview-chart">
                  <div className="landing-preview-bar" style={{ height: "40%" }} />
                  <div className="landing-preview-bar" style={{ height: "65%" }} />
                  <div className="landing-preview-bar" style={{ height: "55%" }} />
                  <div className="landing-preview-bar" style={{ height: "80%" }} />
                  <div className="landing-preview-bar" style={{ height: "45%" }} />
                  <div className="landing-preview-bar" style={{ height: "70%" }} />
                  <div className="landing-preview-bar" style={{ height: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="landing-cta" ref={scrollRef}>
        <div className="landing-cta-inner" data-reveal>
          <h2 className="landing-cta-title">
            Ready to take control of your finances?
          </h2>
          <p className="landing-cta-sub">
            Join now and start managing your money smarter, faster, better.
          </p>
          <Link href="/register">
            <button className="landing-btn-hero">
              Get Started — It's Free
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo" style={{ opacity: 0.6 }}>
            <div className="landing-logo-icon">
              <Wallet size={16} />
            </div>
            <span>FinTrack</span>
          </div>
          <p className="landing-footer-text">
            © {new Date().getFullYear()} FinTrack. Built with ❤️ for better personal finance.
          </p>
        </div>
      </footer>
    </div>
  );
}
