import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_MISSION,
  ROUTES,
  SUPPORTED_LANGUAGES,
} from "../utils/constants";
import { CLASSROOM_QUICK_PHRASES } from "../services/mockData";

export function Landing() {
  const navigate = useNavigate();
  const [selectedDemoLang, setSelectedDemoLang] = useState("sat");
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const activePhrase = CLASSROOM_QUICK_PHRASES[activePhraseIndex];
  const demoTranslation = activePhrase.translations[selectedDemoLang] || activePhrase.translations.sat;

  const capabilities = [
    {
      icon: "🎙️",
      title: "Real-Time Classroom Voice Bridge",
      description: "Teacher speaks in standard Hindi; EDUNEXIS translates live into spoken Santhali, Ho, or Mundari with indigenous script and clear audio pronunciation.",
      badge: "Real-Time Speech",
      color: "green",
    },
    {
      icon: "🌐",
      title: "Vernacular Content Translation",
      description: "Instantly translate classroom instructions, story scripts, question papers, and school notices into authentic tribal dialects.",
      badge: "Multilingual",
      color: "amber",
    },
    {
      icon: "📖",
      title: "AI Pedagogical Lesson Planner",
      description: "Generates age-appropriate, bilingual FLN (Foundational Literacy and Numeracy) lesson plans that bridge tribal oral vocabulary to standard curricula.",
      badge: "NIPUN Bharat / FLN",
      color: "green",
    },
    {
      icon: "📝",
      title: "Bilingual Printable Worksheets",
      description: "Customized pictorial matching sheets, letter tracing, and math exercises designed for simple black-and-white printing in rural schools.",
      badge: "Print-Ready",
      color: "terracotta",
    },
    {
      icon: "🎴",
      title: "Visual Flashcards & Phonics",
      description: "Child-friendly visual cards featuring native wildlife, forest trees, local festivals, and village objects with Ol Chiki, Warang Chiti, and Devanagari.",
      badge: "Visual Learning",
      color: "amber",
    },
    {
      icon: "💾",
      title: "Offline-First Tribal Hub",
      description: "Download entire semester modules at the cluster resource centre or block office and run 100% offline in deep forest village schools without internet.",
      badge: "Zero Network Ready",
      color: "green",
    },
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" aria-label="Introduction">
        {/* Multi-Layered Hero Background Decorations (Pointer-events: none, Pure Vector & CSS) */}
        <div className="hero-bg-decorations" aria-hidden="true">
          <div className="hero-glow-green"></div>
          <div className="hero-glow-amber"></div>
          <div className="hero-pattern-mesh"></div>
          <span className="hero-float-node node-1" title="Language">🗣️</span>
          <span className="hero-float-node node-2" title="Growth">🌱</span>
          <span className="hero-float-node node-3" title="Ol Chiki Script">ᱚ</span>
          <span className="hero-float-node node-4" title="AI Intelligence">✦</span>
          <span className="hero-float-node node-5" title="Learning">📖</span>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-category-pill">
              <span className="badge-sparkle">🌱</span>
              <span>Mother Tongue-Based Learning • Primary Education</span>
            </div>

            {/* Powerful Value Statement */}
            <div className="hero-value-statement">
              <span className="value-sparkle">✦</span>
              <span className="value-statement-text">One Teacher. Multiple Languages. Every Child Understood.</span>
            </div>

            <h1 className="hero-headline">
              {APP_MISSION.split("Mother Tongue")[0]}
              <span className="text-highlight-green">Mother Tongue</span>
            </h1>

            <p className="hero-tagline">{APP_TAGLINE}</p>

            {/* Verified, Safe Problem & Bridge Statement */}
            <p className="hero-description">
              Many Hindi-medium teachers in Jharkhand's tribal regions do not speak the mother tongue of their students. This language gap can make classroom learning difficult for children.
              <br />
              <strong>EDUNEXIS</strong> bridges this gap through real-time voice translation, FLN-aligned bilingual learning materials, and offline-first educational support.
            </p>

            {/* Core Solution at a Glance */}
            <div className="hero-at-a-glance" aria-label="EDUNEXIS Core Context">
              <div className="glance-item">
                <div className="glance-icon-box">🤝</div>
                <div className="glance-text">
                  <span className="glance-label">WHO IS EDUNEXIS FOR?</span>
                  <span className="glance-value">Teachers delivering multilingual education &amp; students learning in mother tongue</span>
                </div>
              </div>

              <div className="glance-item">
                <div className="glance-icon-box">🗣️</div>
                <div className="glance-text">
                  <span className="glance-label">WHAT IS THE PROBLEM?</span>
                  <span className="glance-value">Teacher and students do not share the same mother tongue</span>
                </div>
              </div>

              <div className="glance-item">
                <div className="glance-icon-box">💡</div>
                <div className="glance-text">
                  <span className="glance-label">HOW DOES EDUNEXIS SOLVE IT?</span>
                  <span className="glance-value">AI voice translation, vernacular lessons &amp; interactive student revision</span>
                </div>
              </div>
            </div>

            {/* Hero Dual Portal CTAs */}
            <div className="hero-cta-group hero-dual-portal-group">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.LOGIN)}
                icon={<span className="btn-icon">👩‍🏫</span>}
              >
                Teacher Portal
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="btn-student-portal-cta"
                onClick={() => navigate(ROUTES.STUDENT_LOGIN)}
                icon={<span className="btn-icon">🎓</span>}
              >
                Student Portal
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("demo-interactive");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                icon={<span className="btn-icon">✨</span>}
              >
                Interactive Demo
              </Button>
            </div>

            {/* Offline-First Trust Indicator */}
            <div className="hero-offline-trust-indicator">
              <div className="trust-indicator-badge">
                <span className="trust-icon">📴</span>
                <span className="trust-title">Built for Low-Connectivity Classrooms</span>
              </div>
              <p className="trust-subtitle">
                Access synchronized learning resources even when internet connectivity is unavailable.
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="stat-number">3+</span>
                <span className="stat-label">Tribal Languages (Santhali, Ho, Mundari)</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat-item">
                <span className="stat-number">Offline</span>
                <span className="stat-label">Accessible via Cached Modules</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat-item">
                <span className="stat-number">FLN</span>
                <span className="stat-label">Aligned to NEP 2020 &amp; NIPUN Bharat</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Artwork (Clear 5-Step AI Translation Communication Flow) */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-card">
              <div className="hero-visual-header">
                <div className="visual-badge">
                  <span className="visual-badge-dot"></span>
                  <span>Live Classroom AI Bridge</span>
                </div>
                <span className="visual-edition-tag">Classroom Flow</span>
              </div>

              {/* Step-by-Step AI Communication Pipeline */}
              <div className="classroom-visual-scene">
                {/* 1. Teacher Speaks Hindi */}
                <div className="ai-flow-card flow-teacher">
                  <div className="flow-card-badge">
                    <span className="flow-badge-step">1</span>
                    <span className="flow-badge-lang">TEACHER LANGUAGE • HINDI (हिंदी)</span>
                  </div>
                  <div className="flow-speech-content">
                    <div className="speech-avatar">👩‍🏫</div>
                    <div className="speech-text-wrap">
                      <span className="speech-action-hint">Teacher speaks Hindi in class:</span>
                      <p className="speech-text">"सभी बच्चे बैठ जाएं और अपनी किताब खोलें।"</p>
                      <span className="speech-phonetic-sub">(Sabhi bacche baith jayein aur apni kitaab kholein)</span>
                    </div>
                  </div>
                </div>

                {/* 2 & 3. AI Pipeline Bridge */}
                <div className="ai-pipeline-connector">
                  <div className="pipeline-arrow-down">↓</div>
                  <div className="pipeline-steps-bar">
                    <span className="pipeline-step-item">
                      <span className="pipe-icon">🎙️</span> Speech Recognition
                    </span>
                    <span className="pipe-divider">→</span>
                    <span className="pipeline-step-item highlight-pipe">
                      <span className="pipe-icon">⚡</span> AI Translation Bridge
                    </span>
                    <span className="pipe-divider">→</span>
                    <span className="pipeline-step-item">
                      <span className="pipe-icon">📜</span> Ol Chiki Script
                    </span>
                  </div>
                  <div className="pipeline-arrow-down">↓</div>
                </div>

                {/* 4. Target Language: Santhali (Ol Chiki) - Verified Project Demo Data */}
                <div className="ai-flow-card flow-tribal">
                  <div className="flow-card-badge tribal-badge-header">
                    <span className="flow-badge-step">2</span>
                    <span className="flow-badge-lang">TARGET LANGUAGE • SANTHALI (ᱥᱟᱱᱛᱟᱲᱤ)</span>
                    <span className="verified-tag">✓ Verified Project Demo Translation</span>
                  </div>
                  <div className="flow-speech-content">
                    <div className="speech-avatar">🧒👦</div>
                    <div className="speech-text-wrap">
                      <span className="speech-action-hint">Translated tribal mother tongue script:</span>
                      <p className="speech-text speech-tribal-text font-ol-chiki">
                        "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ ᱟᱨ ᱟᱯᱱᱟᱨᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱯᱮ᱾"
                      </p>
                      <span className="speech-devanagari font-devanagari">
                        देवनागरी रूप: सनाम गिद्रạ दुऱुब पे आर अपनाराग पुथी झिज पे।
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Audio Output */}
                <div className="ai-audio-output-strip">
                  <div className="audio-output-header">
                    <span className="audio-step-pill">3</span>
                    <span className="audio-title">AUDIO SPEECH OUTPUT</span>
                  </div>
                  <div className="audio-output-body">
                    <span className="audio-wave-icon">🔊</span>
                    <span className="audio-phonetic-text">
                      "Sanam gidra durub pe aar apnarag puthi jhij pe"
                    </span>
                  </div>
                  <span className="audio-desc-note">
                    Synthesized native pronunciation for classroom speakers
                  </span>
                </div>

                {/* Pedagogical Feature Pills */}
                <div className="scene-feature-pills">
                  <span className="scene-pill">👩‍🏫 Hindi-Medium Teacher</span>
                  <span className="scene-pill">⚡ Instant Translation</span>
                  <span className="scene-pill">🧒 Mother Tongue Understood</span>
                </div>
              </div>

              <div className="visual-card-footer">
                <span>🌾 Inspiring tribal children through mother-tongue learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Soft Organic Wave Transition into Problem Section */}
        <div className="section-divider-curve curve-hero-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C380,36 1060,36 1440,0 L1440,48 L0,48 Z" fill="#F7F4EE" />
          </svg>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="problem" className="problem-section" aria-label="The Problem in Jharkhand">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">The Classroom Reality</span>
            <h2 className="section-title">The Mother Tongue Barrier in Primary Education</h2>
            <p className="section-lead">
              Under India's National Education Policy (NEP 2020), primary learning must be imparted in the child's home language. In Jharkhand's tribal heartland, this vision faces a severe human resource challenge:
            </p>
          </div>

          <div className="problem-cards-grid">
            <div className="problem-card">
              <div className="problem-icon">🗣️</div>
              <h3 className="problem-title">Linguistic Mismatch</h3>
              <p className="problem-desc">
                Recruited teachers are typically fluent only in Hindi, while primary children in villages speak exclusively <strong>Santhali, Ho, or Mundari</strong> at home.
              </p>
              <div className="problem-stat">
                <strong>Linguistic Disconnect:</strong> Children face a steep comprehension hurdle transitioning from their home mother tongue to an unfamiliar classroom language.
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3 className="problem-title">FLN Learning Poverty</h3>
              <p className="problem-desc">
                Without understanding classroom instructions, foundational literacy and numeracy (FLN) targets fall behind, causing high early-grade silent dropout rates.
              </p>
              <div className="problem-stat">
                <strong>NIPUN Bharat:</strong> Foundational learning objectives require early mother tongue scaffolding to succeed.
              </div>
            </div>

            <div className="problem-card">
              <div className="problem-icon">📵</div>
              <h3 className="problem-title">Connectivity Dead Zones</h3>
              <p className="problem-desc">
                Schools located in forested, hilly tracts of Khunti, West Singhbhum, and Dumka lack continuous 4G or broadband internet access.
              </p>
              <div className="problem-stat">
                EdTech solutions requiring live internet fail inside rural classrooms.
              </div>
            </div>
          </div>

          {/* Solution Callout */}
          <div className="solution-banner">
            <div className="solution-banner-content">
              <span className="solution-tag">THE EDUNEXIS SOLUTION</span>
              <h3 className="solution-headline">An AI Teaching Copilot that Speaks Both Worlds</h3>
              <p className="solution-text">
                EDUNEXIS empowers Hindi-speaking teachers with real-time translation, phonetically guided speech, FLN lesson plans, and offline educational resources—turning linguistic hesitation into classroom warmth and confidence.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Enter Teacher Portal →
            </Button>
          </div>
        </div>

        {/* Soft Organic Wave Transition into Demo Section */}
        <div className="section-divider-curve curve-problem-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C420,36 1020,36 1440,0 L1440,48 L0,48 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* Interactive Live Demo Widget */}
      <section id="demo-interactive" className="demo-section" aria-label="Interactive Language Demo">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">Interactive Preview</span>
            <h2 className="section-title">Experience the Real-Time Translation Bridge</h2>
            <p className="section-lead">
              Select a tribal language and sample classroom sentence to see how EDUNEXIS translates instructions into indigenous scripts with pronunciation support.
            </p>
          </div>

          <div className="interactive-demo-card">
            {/* Language Selector Tabs */}
            <div className="demo-tabs-bar">
              <span className="demo-tab-label">Target Tribal Language:</span>
              <div className="demo-tabs">
                {SUPPORTED_LANGUAGES.slice(0, 3).map((lang) => (
                  <button
                    key={lang.code}
                    className={`demo-lang-tab ${selectedDemoLang === lang.code ? "demo-tab-active" : ""}`}
                    onClick={() => setSelectedDemoLang(lang.code)}
                  >
                    <span className="tab-name">{lang.name}</span>
                    <span className="tab-script">({lang.script.split("/")[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="demo-sample-pills">
              <span className="sample-pills-label">Sample Teacher Phrase:</span>
              {CLASSROOM_QUICK_PHRASES.map((phrase, idx) => (
                <button
                  key={phrase.id}
                  className={`sample-phrase-btn ${activePhraseIndex === idx ? "active-sample" : ""}`}
                  onClick={() => setActivePhraseIndex(idx)}
                >
                  {phrase.category}
                </button>
              ))}
            </div>

            {/* Comparison Grid */}
            <div className="demo-translation-grid">
              {/* Hindi Source */}
              <div className="demo-box demo-box-source">
                <div className="box-header">
                  <span className="box-tag">Teacher's Spoken Hindi</span>
                  <span className="box-lang-badge">हिंदी</span>
                </div>
                <div className="box-body">
                  <p className="source-hindi-text">{activePhrase.hindi}</p>
                  <p className="source-phonetic">{activePhrase.phonetic}</p>
                </div>
                <div className="box-footer">
                  <span className="box-note">Input via teacher microphone or text prompt</span>
                </div>
              </div>

              {/* Translation Output */}
              <div className="demo-box demo-box-target">
                <div className="box-header">
                  <span className="box-tag">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === selectedDemoLang)?.name} Translation (Verified Demo)
                  </span>
                  <span className="box-lang-badge highlight-badge">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === selectedDemoLang)?.nativeName}
                  </span>
                </div>
                <div className="box-body">
                  <span className="verified-demo-pill">✓ Verified Project Demo Translation</span>
                  <p className="target-script-text font-ol-chiki">
                    {demoTranslation.script}
                  </p>
                  <p className="target-devanagari font-devanagari">
                    Devanagari: {demoTranslation.devanagari}
                  </p>
                  <div className="phonetic-audio-strip">
                    <span className="phonetic-icon">🔊</span>
                    <span className="phonetic-guide">"{demoTranslation.audioText}"</span>
                  </div>
                </div>
                <div className="box-footer">
                  <span className="box-note">Audio pronunciation available 100% offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soft Organic Wave Transition into Capabilities Section */}
        <div className="section-divider-curve curve-demo-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C360,36 1080,36 1440,0 L1440,48 L0,48 Z" fill="#F5EFE6" />
          </svg>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section id="capabilities" className="capabilities-section" aria-label="Platform Capabilities">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">Comprehensive Toolkit</span>
            <h2 className="section-title">Six Pillars of Vernacular Primary Pedagogy</h2>
            <p className="section-lead">
              Engineered specifically for low-cost Android tablets used in government primary schools across Jharkhand.
            </p>
          </div>

          <div className="capabilities-grid">
            {capabilities.map((cap, index) => (
              <div key={index} className="capability-card">
                <div className="capability-card-top">
                  <div className="capability-icon">{cap.icon}</div>
                  <span className={`capability-badge badge-${cap.color}`}>
                    {cap.badge}
                  </span>
                </div>
                <h3 className="capability-title">{cap.title}</h3>
                <p className="capability-desc">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Accessibility Section */}
      <section id="offline" className="offline-feature-section" aria-label="Offline Accessibility">
        <div className="section-container">
          <div className="offline-highlight-card">
            <div className="offline-content">
              <div className="offline-status-pill">
                <span className="pulse-orange-dot"></span>
                <span>Designed for Zero-Network Rural Schools</span>
              </div>

              <h2 className="offline-title">
                Works Without Internet in Jharkhand’s Deepest Forest Clusters
              </h2>

              <p className="offline-desc">
                Many schools in districts like <strong>West Singhbhum, Gumla, Latehar, and Simdega</strong> have zero or unreliable cellular reception. EDUNEXIS features an <em>offline-first local synchronization architecture</em>:
              </p>

              <div className="offline-steps-list">
                <div className="offline-step">
                  <div className="step-number">1</div>
                  <div className="step-info">
                    <strong>Weekly Sync at Cluster Resource Centre (CRC)</strong>
                    <p>Teachers synchronize syllabus modules, audio models, and worksheets whenever they visit the cluster or block panchayat with internet.</p>
                  </div>
                </div>

                <div className="offline-step">
                  <div className="step-number">2</div>
                  <div className="step-info">
                    <strong>100% On-Device Offline Classroom Operation</strong>
                    <p>Inside the classroom, translation, audio playback, lesson views, and flashcards function entirely from local tablet storage with zero data consumption.</p>
                  </div>
                </div>

                <div className="offline-step">
                  <div className="step-number">3</div>
                  <div className="step-info">
                    <strong>Automatic Progress Log Synchronization</strong>
                    <p>Student engagement metrics and lesson completion statuses queue locally and automatically upload upon next internet connectivity.</p>
                  </div>
                </div>
              </div>

              <div className="offline-action-box">
                <Button
                  variant="primary"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Explore Offline Library in Dashboard →
                </Button>
              </div>
            </div>

            <div className="offline-badge-graphic">
              <div className="offline-device-mockup">
                <div className="mockup-screen">
                  <div className="mockup-header">
                    <span className="mockup-dot red"></span>
                    <span className="mockup-dot yellow"></span>
                    <span className="mockup-dot green"></span>
                    <span className="mockup-title">EDUNEXIS Tablet OS</span>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-status-bar">
                      <span>🟠 Offline Mode: Active</span>
                      <span>🔋 94%</span>
                    </div>
                    <div className="mockup-content-item">
                      <span>📁 Santhali Class 2 EVS</span>
                      <span className="status-tag-green">Synced ✓</span>
                    </div>
                    <div className="mockup-content-item">
                      <span>📁 Ho Number Sense Flashcards</span>
                      <span className="status-tag-green">Synced ✓</span>
                    </div>
                    <div className="mockup-content-item">
                      <span>📁 Mundari Rhyme Audio Pack</span>
                      <span className="status-tag-green">Synced ✓</span>
                    </div>
                    <div className="mockup-stats-bar">
                      <span>Total Offline Storage: 142 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Overview Section */}
      <section id="languages" className="languages-section" aria-label="Supported Tribal Languages">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">Indigenous Linguistic Heritage</span>
            <h2 className="section-title">Supported Tribal Languages of Jharkhand</h2>
            <p className="section-lead">
              Preserving and uplifting UNESCO-recognized indigenous languages through contemporary AI technology.
            </p>
          </div>

          <div className="languages-grid">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div key={lang.code} className="lang-heritage-card">
                <div className="lang-card-header">
                  <h3 className="lang-name">{lang.name}</h3>
                  <span className="lang-script-badge">{lang.script}</span>
                </div>
                <p className="lang-native-script">{lang.nativeName}</p>
                <div className="lang-details">
                  <div className="lang-detail-row">
                    <span className="detail-key">Primary Region:</span>
                    <span className="detail-val">{lang.region}</span>
                  </div>
                  <div className="lang-detail-row">
                    <span className="detail-key">Community Speakers:</span>
                    <span className="detail-val">{lang.speakers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="edunexis-footer">
        <div className="footer-container">
          <div className="footer-main-col">
            <div className="footer-brand">
              <span className="footer-logo">🌱</span>
              <span className="footer-title">{APP_NAME}</span>
            </div>
            <p className="footer-tagline">
              AI-Powered Vernacular Pedagogy and Real-Time Translation for Mother Tongue-Based Primary Education in Jharkhand.
            </p>
            <div className="footer-product-tag">
              🌱 Inclusive Multilingual Classrooms
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links-list">
              <li><a href="#problem">The Problem</a></li>
              <li><a href="#capabilities">Core Capabilities</a></li>
              <li><a href="#demo-interactive">Interactive Demo</a></li>
              <li><a href="#offline">Offline Architecture</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Portals &amp; Learning</h4>
            <ul className="footer-links-list">
              <li><button className="footer-link-btn" onClick={() => navigate(ROUTES.LOGIN)}>Teacher Portal</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate(ROUTES.STUDENT_LOGIN)}>Student Portal</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>Student Dashboard</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate(ROUTES.STUDENT_AI_ASSISTANT)}>EDU AI Assistant</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Target Languages</h4>
            <ul className="footer-links-list">
              <li><span>Santhali (ᱥᱟᱱᱛᱟᱲᱤ)</span></li>
              <li><span>Ho (ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)</span></li>
              <li><span>Mundari (ᱢᱩᱱᱰᱟᱨᱤ)</span></li>
              <li><span>Kurukh (कुड़ुख़)</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-bottom-main">EDUNEXIS — AI-Powered Vernacular Education</p>
          <p className="footer-bottom-sub">Breaking language barriers. Enabling every child to learn.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
