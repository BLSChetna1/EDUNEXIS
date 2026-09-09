/**
 * EDUNEXIS Student Syllabus Page
 * Route: /student-syllabus
 * Interactive, structured curriculum view across Class 1 to 5
 * Organized by Subject, Unit, and Topics with progress indicators and AI study shortcuts.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_CLASSES, ROUTES } from "../utils/constants";
import { useStudentAuth } from "../hooks/useStudentAuth";
import { SYLLABUS_DATA } from "../services/studentMockData";

export function StudentSyllabus() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();

  const [selectedClass, setSelectedClass] = useState(student?.class || "Class 3");
  const [activeSubjectId, setActiveSubjectId] = useState("math");

  const currentClassData = SYLLABUS_DATA[selectedClass] || SYLLABUS_DATA["Class 3"];
  const currentSubject =
    currentClassData.subjects.find((s) => s.id === activeSubjectId) ||
    currentClassData.subjects[0];

  return (
    <div className="student-syllabus-page">
      {/* Page Header */}
      <header className="syllabus-page-header">
        <div className="syllabus-header-left">
          <div className="syllabus-header-badge">
            <span>📋 Primary Curriculum</span>
          </div>
          <h1 className="syllabus-title">My Syllabus / मेरा पाठ्यक्रम</h1>
          <p className="syllabus-subtitle">
            Curriculum framework structured by units and foundational learning outcomes.
          </p>
        </div>

        {/* Class Switcher */}
        <div className="syllabus-class-selector-box">
          <label htmlFor="syllabus-class-select" className="syllabus-select-label">
            Select Class:
          </label>
          <select
            id="syllabus-class-select"
            className="syllabus-class-dropdown"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {AVAILABLE_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Curriculum Disclaimer Note */}
      <div className="syllabus-notice-bar">
        <span className="notice-icon">ℹ️</span>
        <span className="notice-text">
          {currentClassData.meta} • <em>Sample FLN curriculum structure for classroom demonstration purposes.</em>
        </span>
      </div>

      {/* Subject Navigation Tabs */}
      <div className="syllabus-subject-tabs" role="tablist">
        {currentClassData.subjects.map((subj) => (
          <button
            key={subj.id}
            role="tab"
            aria-selected={activeSubjectId === subj.id}
            className={`syllabus-subj-tab ${activeSubjectId === subj.id ? "active" : ""}`}
            onClick={() => setActiveSubjectId(subj.id)}
          >
            <span className="subj-tab-icon">{subj.icon}</span>
            <span className="subj-tab-name">{subj.name}</span>
          </button>
        ))}
      </div>

      {/* Active Subject Units Accordion / List */}
      <div className="syllabus-units-container">
        <div className="active-subj-banner">
          <div className="active-subj-icon-box">{currentSubject.icon}</div>
          <div>
            <h2 className="active-subj-title">{currentSubject.name}</h2>
            <p className="active-subj-desc">{currentSubject.description}</p>
          </div>
        </div>

        <div className="units-list-wrapper">
          {currentSubject.units.map((unit, idx) => (
            <div key={unit.unitNumber || idx} className="syllabus-unit-card">
              <div className="unit-card-header">
                <div className="unit-header-title-group">
                  <span className="unit-tag-pill">{unit.unitNumber}</span>
                  <h3 className="unit-title">{unit.title}</h3>
                </div>
                <div className="unit-progress-chip">
                  <span>
                    {unit.completed} of {unit.total} Topics Covered
                  </span>
                </div>
              </div>

              {/* Topics inside Unit */}
              <div className="unit-topics-list">
                {unit.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="unit-topic-row">
                    <div className="topic-name-col">
                      <span className={`topic-status-dot ${topic.status}`}></span>
                      <span className="topic-display-name">{topic.name}</span>
                    </div>

                    <div className="topic-actions-col">
                      {topic.status === "completed" && (
                        <span className="status-label-done">✅ Completed</span>
                      )}
                      {topic.status === "in-progress" && (
                        <span className="status-label-progress">📖 Current Topic</span>
                      )}
                      {topic.status === "upcoming" && (
                        <span className="status-label-upcoming">⏳ Upcoming</span>
                      )}

                      {topic.topicId ? (
                        <button
                          className="topic-action-link-btn"
                          onClick={() => navigate(`/student-learning/${topic.topicId}`)}
                        >
                          Learn Topic →
                        </button>
                      ) : (
                        <button
                          className="topic-ai-ask-btn"
                          onClick={() =>
                            navigate(
                              `${ROUTES.STUDENT_AI_ASSISTANT}?q=${encodeURIComponent(
                                `मुझे ${topic.name} के बारे में सरल तरीके से समझाइए`
                              )}`
                            )
                          }
                        >
                          Ask AI 🤖
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentSyllabus;
