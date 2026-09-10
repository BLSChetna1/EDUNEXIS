/**
 * EDUNEXIS Student Dashboard
 * Route: /student-dashboard
 * Friendly, encouraging, touch-friendly primary learning hub.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { useStudentAuth } from "../hooks/useStudentAuth";
import {
  TOPICS_LEARNED,
  TODAYS_TOPICS,
  UPCOMING_TOPICS,
  SYLLABUS_DATA,
} from "../services/studentMockData";

export function StudentDashboard() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();

  const studentClass = student?.class || "Class 3";
  const classSyllabus = SYLLABUS_DATA[studentClass] || SYLLABUS_DATA["Class 3"];

  return (
    <div className="student-dashboard-page">
      {/* 1. Personalized Encouraging Hero Greeting */}
      <section className="student-hero-banner" aria-label="Student Welcome">
        <div className="student-hero-decorations" aria-hidden="true">
          <div className="student-hero-glow"></div>
          <span className="student-float-icon icon-1">🌱</span>
          <span className="student-float-icon icon-2">📖</span>
          <span className="student-float-icon icon-3">✨</span>
          <span className="student-float-icon icon-4">✏️</span>
        </div>

        <div className="student-hero-inner">
          <div className="student-greeting-text">
            <div className="student-level-tag">
              <span>🎒 {studentClass} • Section {student?.section || "A"}</span>
              <span className="school-bullet">•</span>
              <span>{student?.schoolName || "Rajkiya Prathmik Vidyalaya, Torpa"}</span>
            </div>

            <h1 className="student-greeting-title">
              Hello, {student?.name || "Asha Murmu"}! 👋
            </h1>

            <p className="student-greeting-subtitle">
              Ready to learn something new today? / आज कुछ नया और मजेदार सीखने के लिए तैयार हैं?
            </p>
          </div>

          <div className="student-hero-action-card">
            <div className="assistant-quick-card">
              <div className="assistant-quick-icon">🤖</div>
              <div className="assistant-quick-text">
                <span className="quick-title">Need help with homework?</span>
                <span className="quick-sub">Ask EDU AI Assistant in your mother tongue</span>
              </div>
              <button
                className="assistant-quick-btn"
                onClick={() => navigate(ROUTES.STUDENT_AI_ASSISTANT)}
              >
                Ask EDU AI →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION B: CURRENT / TODAY'S CLASS TOPICS */}
      <section id="todays-learning" className="student-section-block" aria-label="Today's Topics">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-emoji-badge">📖</span>
            <div>
              <h2 className="section-heading">Today's Learning</h2>
              <span className="section-subtext">Topics being discussed in your classroom today</span>
            </div>
          </div>
          <span className="live-status-pill">
            <span className="live-dot-pulse"></span>
            <span>Live Class Content</span>
          </span>
        </div>

        <div className="todays-topics-grid">
          {TODAYS_TOPICS.map((topic) => (
            <div key={topic.id} className="today-topic-card">
              <div className="today-card-top">
                <span className="topic-icon-large">{topic.icon}</span>
                <div className="topic-meta-tags">
                  <span className="subject-pill-tag">{topic.subject}</span>
                  <span className="time-pill-tag">{topic.time}</span>
                </div>
              </div>

              <h3 className="today-topic-title">{topic.title}</h3>
              <p className="today-topic-summary">{topic.summary}</p>

              <div className="today-card-bottom">
                <div className="today-teacher-info">
                  <span className="teacher-avatar-mini">👩‍🏫</span>
                  <span>Teacher: <strong>{topic.teacher}</strong></span>
                </div>
                <button
                  className="start-study-btn"
                  onClick={() => navigate(`/student-learning/${topic.id}`)}
                >
                  {topic.actionLabel} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION A: TOPICS DISCUSSED IN CLASS (COMPLETED / PREVIOUS LESSONS) */}
      <section id="topics-learned" className="student-section-block" aria-label="Topics We Learned">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-emoji-badge">📚</span>
            <div>
              <h2 className="section-heading">Topics We Learned</h2>
              <span className="section-subtext">Click any topic to revise with simple explanations and village examples</span>
            </div>
          </div>
          <span className="completed-count-badge">
            ✅ {TOPICS_LEARNED.length} Lessons Completed
          </span>
        </div>

        <div className="topics-learned-grid">
          {TOPICS_LEARNED.map((topic) => (
            <div
              key={topic.id}
              className="topic-learned-card"
              onClick={() => navigate(`/student-learning/${topic.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/student-learning/${topic.id}`);
                }
              }}
            >
              <div className="learned-card-header">
                <div className="learned-icon-box">{topic.icon}</div>
                <span className="learned-status-pill">
                  <span>✓ {topic.status}</span>
                </span>
              </div>

              <div className="learned-subject-row">
                <span className="learned-subject-text">{topic.subject}</span>
                <span className="learned-date-text">{topic.date}</span>
              </div>

              <h3 className="learned-topic-title">{topic.title}</h3>
              <p className="learned-topic-summary">{topic.summary}</p>

              <div className="learned-card-footer">
                <span className="learned-read-time">⏱️ {topic.readTime}</span>
                <span className="learned-explore-link">
                  Revise Lesson <span className="arrow-sym">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION C: UPCOMING TOPICS & SECTION D: SYLLABUS OVERVIEW */}
      <div className="student-dashboard-split-row">
        {/* Upcoming Topics */}
        <section className="student-split-col" aria-label="Upcoming Topics">
          <div className="section-header-row-simple">
            <span className="section-emoji-badge">🚀</span>
            <div>
              <h2 className="section-heading-sm">Coming Up Next</h2>
              <span className="section-subtext-sm">Topics planned for future classes</span>
            </div>
          </div>

          <div className="upcoming-topics-list">
            {UPCOMING_TOPICS.map((topic) => (
              <div key={topic.id} className="upcoming-topic-item">
                <div className="upcoming-icon-circle">{topic.icon}</div>
                <div className="upcoming-text-col">
                  <div className="upcoming-top-line">
                    <span className="upcoming-subject">{topic.subject}</span>
                    <span className="upcoming-date-pill">{topic.plannedDate}</span>
                  </div>
                  <h4 className="upcoming-title">{topic.title}</h4>
                  <p className="upcoming-summary">{topic.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Syllabus Quick Access Card */}
        <section className="student-split-col" aria-label="My Syllabus">
          <div className="section-header-row-simple">
            <span className="section-emoji-badge">📋</span>
            <div>
              <h2 className="section-heading-sm">My Syllabus</h2>
              <span className="section-subtext-sm">Track your progress across subjects</span>
            </div>
          </div>

          <div className="syllabus-overview-card">
            <div className="syllabus-class-badge">
              <span>{studentClass} Curriculum</span>
              <span className="syllabus-fln-tag">NEP 2020 Aligned</span>
            </div>

            <div className="syllabus-subjects-preview">
              {classSyllabus.subjects.map((subj) => (
                <div key={subj.id} className="subj-progress-item">
                  <div className="subj-progress-top">
                    <span className="subj-icon">{subj.icon}</span>
                    <span className="subj-name">{subj.name}</span>
                  </div>
                  <div className="subj-units-meta">
                    <span>{subj.units.length} Learning Units</span>
                    <span className="progress-percentage">
                      {Math.round(
                        (subj.units.reduce((acc, u) => acc + u.completed, 0) /
                          subj.units.reduce((acc, u) => acc + u.total, 0)) *
                          100
                      )}% Done
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="open-syllabus-btn"
              onClick={() => navigate(ROUTES.STUDENT_SYLLABUS)}
            >
              View Full Syllabus &amp; Chapters →
            </button>
          </div>
        </section>
      </div>

      {/* 5. Vernacular Education Encouragement Banner */}
      <section className="vernacular-community-banner" aria-label="Mother Tongue Pride">
        <div className="vernacular-banner-content">
          <span className="vernacular-banner-icon">🗣️</span>
          <div className="vernacular-banner-text">
            <h3>अपनी मातृभाषा में सीखें, आगे बढ़ें!</h3>
            <p>
              EDUNEXIS connects classroom concepts with Santali, Ho, Mundari, Kudukh, and Khadia. Every child has the right to understand and excel in their own mother tongue.
            </p>
          </div>
          <button
            className="vernacular-chat-cta"
            onClick={() => navigate(ROUTES.STUDENT_AI_ASSISTANT)}
          >
            Chat with EDU AI ✨
          </button>
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
