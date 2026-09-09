import React from "react";
import { APP_NAME, APP_TAGLINE, SIH_EDITION } from "../utils/constants";

export function Home() {
  const modules = [
    {
      icon: "⚡",
      title: "Frontend Client",
      owner: "Member 1 (Frontend Lead)",
      status: "Active",
      description: "React 19 + Vite architecture with modular components, hooks, and clean state separation.",
    },
    {
      icon: "🚀",
      title: "FastAPI Backend",
      owner: "Member 2 (Backend Lead)",
      status: "Ready",
      description: "High-performance asynchronous Python API with modular routing and OpenAPI documentation.",
    },
    {
      icon: "🧠",
      title: "AI Engine",
      owner: "Member 3 (AI/NLP Specialist)",
      status: "Modular",
      description: "Adaptive pedagogical simplification, prompt pipelines, and decoupled LLM services.",
    },
    {
      icon: "🌐",
      title: "Multilingual & Speech",
      owner: "Member 4 (Speech & Indic Lead)",
      status: "Configured",
      description: "Bhashini/Indic language translation, Speech-to-Text (STT), and Text-to-Speech (TTS) hooks.",
    },
    {
      icon: "🛡️",
      title: "QA & Architecture",
      owner: "Member 5 (DevOps & Data Lead)",
      status: "Ready",
      description: "Unified automated test suites, database-ready models, and strict zero-leak security.",
    },
  ];

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge-pill">
          <span className="badge-sparkle">✦</span>
          <span>{SIH_EDITION} • Unified Repository</span>
        </div>

        <h1 className="hero-title">{APP_NAME}</h1>

        <p className="hero-tagline">{APP_TAGLINE}</p>

        <p className="hero-subtext">
          A centralized, modular platform engineered for seamless 5-member parallel development.
          Bridging language barriers and personalized pedagogy through intelligent technology.
        </p>

        <div className="hero-actions">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span>Swagger API Docs</span>
            <span className="btn-arrow">→</span>
          </a>
          <a
            href="#modules"
            className="btn btn-secondary"
          >
            Explore Architecture
          </a>
        </div>
      </section>

      {/* Module Overview Section */}
      <section id="modules" className="modules-section">
        <div className="section-header">
          <span className="section-subtitle">System Architecture</span>
          <h2 className="section-title">Core Subsystem Workspaces</h2>
        </div>

        <div className="modules-grid">
          {modules.map((mod, index) => (
            <div key={index} className="module-card">
              <div className="module-header">
                <div className="module-icon-box">{mod.icon}</div>
                <span className={`status-tag status-${mod.status.toLowerCase()}`}>
                  {mod.status}
                </span>
              </div>
              <h3 className="module-title">{mod.title}</h3>
              <p className="module-owner">{mod.owner}</p>
              <p className="module-desc">{mod.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
