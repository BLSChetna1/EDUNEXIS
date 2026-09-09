import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { ROUTES, SUPPORTED_LANGUAGES, PRIMARY_GRADES } from "../utils/constants";
import lessonService from "../services/lessonService";

export function MyLessons() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedLang, setSelectedLang] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState("");

  // Load lessons from service
  const loadLessons = () => {
    const list = lessonService.getLessons({
      search: searchQuery,
      subject: selectedSubject,
      grade: selectedGrade,
      language: selectedLang,
    });
    setLessons(list);
  };

  useEffect(() => {
    loadLessons();
  }, [searchQuery, selectedSubject, selectedGrade, selectedLang]);

  // Handle Delete
  const handleDelete = (id, title) => {
    const success = lessonService.deleteLesson(id);
    if (success) {
      setNotification(`"${title}" को सफलतापूर्वक हटाया गया (Lesson deleted).`);
      setDeleteConfirmId(null);
      loadLessons();
      setTimeout(() => setNotification(""), 3500);
    }
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "Recently";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  // Helper to find language name & script
  const getLanguageDetails = (code) => {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (found) {
      return {
        name: found.name,
        native: found.nativeName.split("/")[0].trim(),
        color: found.badgeColor,
      };
    }
    return { name: code || "Vernacular", native: "", color: "#2D6A4F" };
  };

  return (
    <div className="feature-page-container my-lessons-page">
      <PageHeader
        title="My Lessons (मेरे सहेजे गए पाठ)"
        subtitle="Your saved AI-generated teaching materials and multilingual lesson blueprints."
        badge={`${lessons.length} Saved Lessons`}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="lessons-notification-banner" role="status">
          <span>✅ {notification}</span>
        </div>
      )}

      {/* Top Controls: Search, Filters & Action Bar */}
      <div className="my-lessons-controls-card">
        <div className="controls-top-row">
          {/* Search bar */}
          <div className="search-bar-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="lessons-search-input"
              placeholder="Search by lesson title, topic, or FLN competency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* New Lesson CTA Button */}
          <div className="new-lesson-cta-wrap">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.LESSON_GENERATOR)}
              icon={<span>✨</span>}
            >
              Generate New Lesson
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="filters-row">
          {/* Subject Filter */}
          <div className="filter-item">
            <label htmlFor="filter-subject" className="filter-label">विषय (Subject):</label>
            <select
              id="filter-subject"
              className="filter-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects (सभी विषय)</option>
              <option value="Environmental Studies">Environmental Studies (EVS)</option>
              <option value="Language">Language & Literacy (भाषा)</option>
              <option value="Mathematics">Mathematics (गणित)</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="filter-item">
            <label htmlFor="filter-grade" className="filter-label">कक्षा (Grade):</label>
            <select
              id="filter-grade"
              className="filter-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="All">All Grades (सभी कक्षाएं)</option>
              {PRIMARY_GRADES.map((g) => (
                <option key={g.id} value={`Class ${g.id}`}>
                  {g.label.split("(")[0].trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="filter-item">
            <label htmlFor="filter-lang" className="filter-label">मातृभाषा (Language):</label>
            <select
              id="filter-lang"
              className="filter-select"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              <option value="All">All Languages (सभी भाषाएं)</option>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName.split("/")[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if any active */}
          {(selectedSubject !== "All" || selectedGrade !== "All" || selectedLang !== "All" || searchQuery) && (
            <div className="reset-filters-wrap">
              <button
                type="button"
                className="reset-filters-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("All");
                  setSelectedGrade("All");
                  setSelectedLang("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="lessons-grid-section">
        {lessons.length > 0 ? (
          <div className="lessons-cards-grid">
            {lessons.map((lesson) => {
              const langInfo = getLanguageDetails(lesson.targetLanguage);

              return (
                <article key={lesson.id} className="lesson-repository-card">
                  {/* Card top banner */}
                  <div className="lesson-card-top">
                    <div className="lesson-pill-badges">
                      <span className="badge-grade">{lesson.grade || "Class 2"}</span>
                      <span className="badge-subject">{lesson.subject || "EVS"}</span>
                    </div>

                    <div
                      className="badge-language"
                      style={{ borderColor: `${langInfo.color}33`, color: langInfo.color }}
                      title={`Target Language: ${langInfo.name}`}
                    >
                      <span className="lang-dot" style={{ backgroundColor: langInfo.color }}></span>
                      <span>{langInfo.name}</span>
                      {langInfo.native && <span className="lang-native">({langInfo.native})</span>}
                    </div>
                  </div>

                  {/* Card Title & Meta */}
                  <h2 className="lesson-card-title">{lesson.title}</h2>

                  {lesson.flnCompetency && (
                    <div className="lesson-competency-pill">
                      <span className="comp-icon">🎯</span>
                      <span className="comp-text">{lesson.flnCompetency}</span>
                    </div>
                  )}

                  <p className="lesson-card-summary">
                    {lesson.summary || "Bilingual foundational learning plan designed for tribal primary classroom pedagogy."}
                  </p>

                  <div className="lesson-card-meta-line">
                    <span className="meta-time">⏱️ {lesson.duration || "40 Mins"}</span>
                    <span className="meta-divider">•</span>
                    <span className="meta-date">📅 {formatDate(lesson.updatedAt || lesson.createdAt)}</span>
                    <span className="meta-divider">•</span>
                    <span className="meta-steps">📋 {lesson.steps?.length || 4} Steps</span>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="lesson-card-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/my-lessons/${lesson.id}`)}
                      icon={<span>👁️</span>}
                    >
                      View Lesson
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${ROUTES.LESSON_GENERATOR}?edit=${lesson.id}`)}
                      icon={<span>✏️</span>}
                      title="Continue editing this lesson in generator"
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      className="delete-card-btn"
                      onClick={() => setDeleteConfirmId(lesson.id)}
                      title="Delete lesson"
                      aria-label={`Delete ${lesson.title}`}
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Inline Delete Confirmation Overlay */}
                  {deleteConfirmId === lesson.id && (
                    <div className="delete-confirm-overlay">
                      <p className="delete-confirm-text">
                        क्या आप इस पाठ को हटाना चाहते हैं? (Delete this lesson?)
                      </p>
                      <div className="delete-confirm-buttons">
                        <button
                          type="button"
                          className="confirm-btn confirm-delete"
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                        >
                          हटाएं (Delete)
                        </button>
                        <button
                          type="button"
                          className="confirm-btn confirm-cancel"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          रद्द करें (Cancel)
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="lessons-empty-card">
            <div className="empty-icon-wrap">📚</div>
            <h3 className="empty-title">
              {searchQuery || selectedSubject !== "All" || selectedGrade !== "All" || selectedLang !== "All"
                ? "कोई पाठ नहीं मिला (No Lessons Found)"
                : "कोई पाठ नहीं मिला (No Lessons Yet)"}
            </h3>
            <p className="empty-desc">
              {searchQuery || selectedSubject !== "All" || selectedGrade !== "All" || selectedLang !== "All"
                ? "Try adjusting your search criteria or resetting the filters."
                : "Generate your first AI-powered lesson plan and it will appear here in your personalized teaching library."}
            </p>
            <div className="empty-action-wrap">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(ROUTES.LESSON_GENERATOR)}
                icon={<span>✨</span>}
              >
                Generate a Lesson Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLessons;
