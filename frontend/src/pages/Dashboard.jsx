import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";
import TeacherProfileModal from "../components/TeacherProfileModal";
import { ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import lessonService from "../services/lessonService";

export function Dashboard() {
  const { user, updateTeacherLanguage } = useAuth();
  const navigate = useNavigate();

  const [recentLessons, setRecentLessons] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const list = lessonService.getLessons();
    setRecentLessons(list.slice(0, 3));
  }, []);

  const currentLanguageCode = user?.targetLanguage || "sat";
  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguageCode) ||
    SUPPORTED_LANGUAGES[0];

  // Core Tools + My Lessons
  const features = [
    {
      id: "my-lessons",
      icon: "📚",
      title: "My Lessons",
      badge: "Repository",
      badgeColor: "green",
      description:
        "Access, review, and continue your previously generated AI vernacular lessons and blueprints.",
      to: ROUTES.MY_LESSONS,
      highlight: true,
    },
    {
      id: "live-classroom",
      icon: "🎙️",
      title: "Live Classroom",
      badge: "Real-Time Voice",
      badgeColor: "green",
      description:
        "Real-time Hindi-to-tribal-language classroom communication with voice input and translated audio output.",
      to: ROUTES.LIVE_CLASSROOM,
      highlight: false,
    },
    {
      id: "translate",
      icon: "🌐",
      title: "Translate Content",
      badge: "Multilingual",
      badgeColor: "amber",
      description:
        "Translate Hindi educational content, classroom instructions, lesson scripts, and assessment prompts into the selected tribal language.",
      to: ROUTES.TRANSLATE,
    },
    {
      id: "lesson-generator",
      icon: "📖",
      title: "AI Lesson Generator",
      badge: "NIPUN / FLN",
      badgeColor: "green",
      description:
        "Generate simplified, multilingual, age-appropriate lesson plans aligned with foundational literacy and numeracy learning objectives.",
      to: ROUTES.LESSON_GENERATOR,
    },
    {
      id: "worksheet-generator",
      icon: "📝",
      title: "Worksheet Generator",
      badge: "Printable",
      badgeColor: "terracotta",
      description:
        "Generate bilingual educational worksheets containing Hindi and the selected tribal language.",
      to: ROUTES.WORKSHEET_GENERATOR,
    },
    {
      id: "flashcards",
      icon: "🎴",
      title: "AI Flashcards",
      badge: "Visual & Phonics",
      badgeColor: "amber",
      description:
        "Generate visual bilingual flashcards to help children learn through images, words, and audio.",
      to: ROUTES.FLASHCARDS,
    },
    {
      id: "offline-library",
      icon: "💾",
      title: "Offline Library",
      badge: "Zero Network",
      badgeColor: "green",
      description:
        "Access previously synchronized lessons, translations, worksheets, flashcards, and educational resources without an internet connection.",
      to: ROUTES.OFFLINE_LIBRARY,
    },
  ];

  const formatDate = (isoString) => {
    if (!isoString) return "Recently";
    try {
      return new Date(isoString).toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="dashboard-page">
      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Teacher Welcome & Overview Banner */}
      <section className="dashboard-welcome-banner" aria-label="Teacher Welcome">
        <div className="welcome-banner-decorations">
          <div className="decor-circle decor-1"></div>
          <div className="decor-circle decor-2"></div>
        </div>

        <div className="welcome-content-row">
          <div className="welcome-profile-info">
            <div
              className="welcome-avatar-box clickable-avatar-box"
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to view full teacher profile"
            >
              <span className="welcome-avatar">{user?.avatar || "👩‍🏫"}</span>
            </div>
            <div className="welcome-text-group">
              <div className="welcome-badge-line">
                <span className="district-pill">📍 {user?.district || "Khunti, Jharkhand"}</span>
                <span className="school-pill">🏫 {user?.school || "Rajkiya Prathmik Vidyalaya"}</span>
                <button
                  type="button"
                  className="edit-profile-badge-btn"
                  onClick={() => setIsProfileModalOpen(true)}
                  title="Edit Teacher Profile"
                >
                  ✏️ Edit Profile
                </button>
              </div>
              <h1 className="welcome-heading">
                जोहार! Welcome back, {user?.name || "Teacher"}
              </h1>
              <p className="welcome-subtext">
                Your multilingual teaching workspace is ready. Active Classroom Mother Tongue:{" "}
                <strong className="welcome-active-lang">
                  {currentLanguage.name} ({currentLanguage.nativeName})
                </strong>
                {" • "}
                <span>Script: {currentLanguage.script}</span>
              </p>
            </div>
          </div>

          <div className="welcome-banner-actions">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.LIVE_CLASSROOM)}
              icon={<span>🎙️</span>}
            >
              Start Live Classroom
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(ROUTES.MY_LESSONS)}
              icon={<span>📚</span>}
            >
              My Lessons
            </Button>
          </div>
        </div>

        {/* Quick Language Switcher Bar */}
        <div className="dashboard-lang-switcher-bar">
          <span className="switcher-title">Switch Target Language:</span>
          <div className="switcher-pills">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`lang-pill-btn ${currentLanguageCode === lang.code ? "lang-pill-active" : ""}`}
                onClick={() => updateTeacherLanguage(lang.code)}
              >
                <span className="pill-dot"></span>
                <span className="pill-lang-name">{lang.name}</span>
                <span className="pill-native-name">({lang.nativeName.split("/")[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Quick Stats Row */}
      <section className="dashboard-stats-strip" aria-label="Classroom Statistics">
        <div className="stat-card" onClick={() => navigate(ROUTES.MY_LESSONS)} style={{ cursor: "pointer" }}>
          <div className="stat-icon-wrapper green-tone">📚</div>
          <div className="stat-meta">
            <span className="stat-val">{recentLessons.length > 0 ? `${recentLessons.length}+ Saved` : "3 Saved"}</span>
            <span className="stat-lbl">AI Lessons in My Repository</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber-tone">🗣️</div>
          <div className="stat-meta">
            <span className="stat-val">200+ Phrases</span>
            <span className="stat-lbl">Classroom Hindi ↔ {currentLanguage.name}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper terracotta-tone">🎯</div>
          <div className="stat-meta">
            <span className="stat-val">Class 1-3 FLN</span>
            <span className="stat-lbl">Foundational Literacy &amp; Numeracy</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green-tone">🔋</div>
          <div className="stat-meta">
            <span className="stat-val">100% Synced</span>
            <span className="stat-lbl">Cluster Resource Center Package</span>
          </div>
        </div>
      </section>

      {/* RECENT LESSONS SECTION */}
      <section className="dashboard-recent-lessons-section" aria-label="Recent AI Generated Lessons">
        <div className="section-title-bar">
          <div>
            <h2 className="section-title-text">हालिया सहेजे गए पाठ (Recent Generated Lessons)</h2>
            <p className="section-subtitle-text">
              Quickly review or continue teaching your AI-generated vernacular lesson blueprints.
            </p>
          </div>
          <Link to={ROUTES.MY_LESSONS} className="view-all-link">
            View All Lessons ({recentLessons.length}) →
          </Link>
        </div>

        {recentLessons.length > 0 ? (
          <div className="recent-lessons-grid">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="recent-lesson-card">
                <div className="recent-lesson-top">
                  <span className="recent-badge-grade">{lesson.grade}</span>
                  <span className="recent-badge-subject">{lesson.subject}</span>
                  <span className="recent-badge-lang">{lesson.targetLanguageName || lesson.targetLanguage}</span>
                </div>

                <h3 className="recent-lesson-title">{lesson.title}</h3>
                <p className="recent-lesson-desc">{lesson.summary || "Bilingual lesson blueprint aligned with state FLN curriculum."}</p>

                <div className="recent-lesson-footer">
                  <span className="recent-lesson-date">📅 {formatDate(lesson.updatedAt || lesson.createdAt)}</span>
                  <button
                    type="button"
                    className="recent-view-btn"
                    onClick={() => navigate(`/my-lessons/${lesson.id}`)}
                  >
                    View Lesson →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-lessons-card">
            <span className="empty-book-icon">📚</span>
            <div className="empty-text-wrap">
              <h3 className="empty-head">No lessons yet</h3>
              <p className="empty-sub">Generate your first AI-powered lesson and it will appear here.</p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.LESSON_GENERATOR)}
              icon={<span>✨</span>}
            >
              Generate a Lesson
            </Button>
          </div>
        )}
      </section>

      {/* 7 Core Feature Grid */}
      <section className="dashboard-features-section" aria-label="Core Feature Modules">
        <div className="section-title-bar">
          <div>
            <h2 className="section-title-text">शिक्षण सहायक मॉड्यूल (Teacher Workspace Tools)</h2>
            <p className="section-subtitle-text">
              Select a module below to start teaching, translating, or generating bilingual classroom materials.
            </p>
          </div>
          <span className="modules-count-tag">{features.length} Tools Active</span>
        </div>

        <div className="feature-cards-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              badge={feature.badge}
              badgeColor={feature.badgeColor}
              title={feature.title}
              description={feature.description}
              to={feature.to}
              highlight={feature.highlight}
            />
          ))}
        </div>
      </section>

      {/* Quick Classroom Helper Widget */}
      <section className="dashboard-recent-section" aria-label="Recent Classroom Activities">
        <div className="recent-card">
          <div className="recent-header">
            <div>
              <h3 className="recent-title">⚡ त्वरित कक्षा संकेत (Quick Classroom Prompts)</h3>
              <p className="recent-subtitle">Most frequently used teacher commands translated into {currentLanguage.name}:</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.LIVE_CLASSROOM)}
            >
              Open Live Assistant →
            </Button>
          </div>

          <div className="recent-phrases-grid">
            <div className="phrase-pill-card">
              <span className="pill-category">Attention</span>
              <p className="pill-hindi">"सभी बच्चे ध्यान दें"</p>
              <p className="pill-tribal font-ol-chiki">ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱢᱚᱱᱮ ᱮᱢ ᱯᱮ</p>
              <span className="pill-audio">🔊 Play Speech</span>
            </div>

            <div className="phrase-pill-card">
              <span className="pill-category">Activity</span>
              <p className="pill-hindi">"अपनी कॉपी निकालिए"</p>
              <p className="pill-tribal font-ol-chiki">ᱟᱯᱱᱟᱨ ᱠᱷᱟᱛᱟ ᱚᱰᱚᱠ ᱯᱮ</p>
              <span className="pill-audio">🔊 Play Speech</span>
            </div>

            <div className="phrase-pill-card">
              <span className="pill-category">Encouragement</span>
              <p className="pill-hindi">"बहुत अच्छा प्रयास!"</p>
              <p className="pill-tribal font-ol-chiki">ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱠᱩᱨᱩᱢᱩᱴᱩ!</p>
              <span className="pill-audio">🔊 Play Speech</span>
            </div>

            <div className="phrase-pill-card">
              <span className="pill-category">Math / Counting</span>
              <p className="pill-hindi">"एक, दो, तीन गिनें"</p>
              <p className="pill-tribal font-ol-chiki">ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ ᱞᱮᱠᱷᱟᱭ ᱯᱮ</p>
              <span className="pill-audio">🔊 Play Speech</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
