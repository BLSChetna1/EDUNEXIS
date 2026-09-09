import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";
import lessonService from "../services/lessonService";

export function LessonDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("steps"); // 'steps' | 'vocab' | 'objectives' | 'instructions'
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (lessonId) {
      const found = lessonService.getLessonById(lessonId);
      setLesson(found);
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="feature-page-container">
        <div className="lesson-not-found-card">
          <div className="not-found-icon">⚠️</div>
          <h2 className="not-found-title">पाठ नहीं मिला (Lesson Not Found)</h2>
          <p className="not-found-desc">
            The requested lesson plan does not exist or may have been removed.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.MY_LESSONS)}
            icon={<span>←</span>}
          >
            Back to My Lessons
          </Button>
        </div>
      </div>
    );
  }

  // Language info
  const langObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === lesson.targetLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const handleDelete = () => {
    lessonService.deleteLesson(lesson.id);
    navigate(ROUTES.MY_LESSONS);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Recently";
    try {
      return new Date(isoString).toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="feature-page-container lesson-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="lesson-breadcrumb-bar" aria-label="Breadcrumb">
        <Link to={ROUTES.DASHBOARD} className="crumb-link">
          Dashboard
        </Link>
        <span className="crumb-sep">/</span>
        <Link to={ROUTES.MY_LESSONS} className="crumb-link">
          My Lessons
        </Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{lesson.title}</span>
      </nav>

      {/* Main Document Card Container */}
      <div className="lesson-document-card">
        {/* Document Actions Bar */}
        <div className="doc-top-actions-bar">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.MY_LESSONS)}
            icon={<span>←</span>}
          >
            Back to Lessons
          </Button>

          <div className="doc-right-buttons">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<span>🖨️</span>}
            >
              Print Lesson
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`${ROUTES.LESSON_GENERATOR}?edit=${lesson.id}`)}
              icon={<span>✏️</span>}
            >
              Continue in Generator
            </Button>
            <button
              type="button"
              className="delete-icon-btn"
              onClick={() => setDeleteConfirm(true)}
              title="Delete Lesson"
              aria-label="Delete Lesson"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal-backdrop">
            <div className="delete-modal-box">
              <div className="delete-modal-icon">⚠️</div>
              <h3 className="delete-modal-title">Delete Lesson Plan?</h3>
              <p className="delete-modal-text">
                Are you sure you want to delete <strong>"{lesson.title}"</strong> from your saved teaching resources?
              </p>
              <div className="delete-modal-actions">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(false)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  className="modal-danger-btn"
                  onClick={handleDelete}
                >
                  Yes, Delete Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Header Banner */}
        <header className="lesson-hero-header">
          <div className="lesson-badge-cluster">
            <span className="doc-type-tag">FLN Vernacular Blueprint</span>
            <span className="grade-badge">{lesson.grade}</span>
            <span className="subject-badge">{lesson.subject}</span>
            <span className="lang-badge">
              🗣️ {langObj.name} ({langObj.nativeName.split("/")[0].trim()})
            </span>
          </div>

          <h1 className="lesson-title-main">{lesson.title}</h1>

          {lesson.summary && (
            <p className="lesson-summary-lead">{lesson.summary}</p>
          )}

          <div className="lesson-meta-strip">
            <span>⏱️ <strong>Duration:</strong> {lesson.duration || "40 Minutes"}</span>
            <span className="sep">•</span>
            <span>📅 <strong>Updated:</strong> {formatDate(lesson.updatedAt || lesson.createdAt)}</span>
            <span className="sep">•</span>
            <span>🔤 <strong>Script:</strong> {langObj.script}</span>
          </div>
        </header>

        {/* NIPUN Bharat FLN Alignment Callout */}
        {lesson.flnCompetency && (
          <div className="fln-competency-banner">
            <span className="fln-icon">🎯</span>
            <div className="fln-text">
              <strong>NIPUN Bharat Competency Alignment:</strong>
              <span> {lesson.flnCompetency}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="lesson-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "steps"}
            className={`tab-btn ${activeTab === "steps" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            📋 Classroom Steps ({lesson.steps?.length || 0})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vocab"}
            className={`tab-btn ${activeTab === "vocab" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("vocab")}
          >
            🔤 Vocabulary Bridge ({lesson.vocabularyBridge?.length || 0})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "objectives"}
            className={`tab-btn ${activeTab === "objectives" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("objectives")}
          >
            🎯 Learning Outcomes ({lesson.learningObjectives?.length || 0})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "instructions"}
            className={`tab-btn ${activeTab === "instructions" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("instructions")}
          >
            💡 Teacher Instructions
          </button>
        </div>

        {/* TAB 1: STEPS */}
        {activeTab === "steps" && (
          <section className="steps-container" aria-label="Classroom Activities">
            {lesson.steps && lesson.steps.length > 0 ? (
              lesson.steps.map((s) => (
                <div key={s.step} className="step-card">
                  <div className="step-number-badge">Step {s.step}</div>
                  <div className="step-details">
                    <h2 className="step-title">{s.name}</h2>

                    <div className="step-action-box teacher-box">
                      <span className="action-role-badge">👩‍🏫 Teacher (Hindi + Native Prompt):</span>
                      <p className="action-desc">{s.teacherAction}</p>
                    </div>

                    <div className="step-action-box student-box">
                      <span className="action-role-badge">🧒 Students (Mother Tongue Response):</span>
                      <p className="action-desc">{s.studentAction}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-steps-text">No classroom steps specified for this lesson.</p>
            )}
          </section>
        )}

        {/* TAB 2: VOCABULARY BRIDGE */}
        {activeTab === "vocab" && (
          <section className="vocab-container" aria-label="Bilingual Vocabulary Bridge">
            <p className="vocab-intro">
              Key vernacular words connecting tribal vocabulary to the standard state curriculum:
            </p>
            {lesson.vocabularyBridge && lesson.vocabularyBridge.length > 0 ? (
              <div className="vocab-table-wrapper">
                <table className="vocab-table">
                  <thead>
                    <tr>
                      <th>हिंदी शब्द (Hindi)</th>
                      <th>मातृभाषा रूप ({langObj.name})</th>
                      <th>English Concept</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.vocabularyBridge.map((item, idx) => (
                      <tr key={idx}>
                        <td className="vocab-hindi font-devanagari">
                          <strong>{item.hindi}</strong>
                        </td>
                        <td className="vocab-tribal font-ol-chiki">
                          {item.tribal}
                        </td>
                        <td className="vocab-english">{item.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No vocabulary mapping available.</p>
            )}
          </section>
        )}

        {/* TAB 3: OBJECTIVES */}
        {activeTab === "objectives" && (
          <section className="objectives-container" aria-label="Target Learning Objectives">
            <h2 className="objectives-heading">Target Learning Outcomes:</h2>
            {lesson.learningObjectives && lesson.learningObjectives.length > 0 ? (
              <ul className="objectives-list">
                {lesson.learningObjectives.map((obj, i) => (
                  <li key={i} className="objective-item">
                    <span className="obj-check">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No specific learning objectives listed.</p>
            )}
          </section>
        )}

        {/* TAB 4: TEACHER INSTRUCTIONS */}
        {activeTab === "instructions" && (
          <section className="instructions-container" aria-label="Teacher Instructions">
            <h2 className="instructions-heading">💡 Pedagogical Guidelines &amp; Cultural Notes:</h2>
            <div className="instructions-callout-box">
              <p className="instructions-body">
                {lesson.teacherInstructions ||
                  "Encourage children to express concepts in their local dialect before connecting with the Hindi textbook terminology. Use concrete village objects (leaves, seeds, sticks) to make abstract ideas tangible."}
              </p>
            </div>

            <div className="rural-classroom-tip">
              <strong>🏫 Multigrade Classroom Strategy:</strong>
              <p>
                In classrooms where Class 1 and Class 2 sit together, assign older children to lead the oral folk rhyme step while foundational learners practice pointing to flashcards.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default LessonDetail;
