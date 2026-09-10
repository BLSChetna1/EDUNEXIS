import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { PRIMARY_GRADES, SUPPORTED_LANGUAGES, ROUTES, SUBJECTS } from "../utils/constants";
import { MOCK_LESSON_PLAN } from "../services/mockData";
import lessonService from "../services/lessonService";

export function LessonGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [selectedGrade, setSelectedGrade] = useState("2");
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0] || "Santali");
  const [topicPrompt, setTopicPrompt] = useState("जंगल के पेड़, पत्ते और फूल (Forest Trees & Plants)");
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("steps"); // 'steps', 'vocab', 'objectives'
  const [currentPlan, setCurrentPlan] = useState(MOCK_LESSON_PLAN);
  const [savedNotification, setSavedNotification] = useState("");
  const [lastSavedId, setLastSavedId] = useState(editId || null);

  // Load lesson if in edit mode
  useEffect(() => {
    if (editId) {
      const existing = lessonService.getLessonById(editId);
      if (existing) {
        setTopicPrompt(existing.title || "");
        setSelectedSubject(existing.subject || "Environmental Studies (EVS)");
        if (existing.grade) {
          const num = existing.grade.replace(/\D/g, "");
          if (num) setSelectedGrade(num);
        }
        if (existing.targetLanguage) {
          setSelectedLang(existing.targetLanguage);
        }
        setCurrentPlan({
          ...existing,
          title: existing.title,
          grade: existing.grade,
          subject: existing.subject,
          duration: existing.duration || "40 Minutes",
          flnCompetency: existing.flnCompetency || MOCK_LESSON_PLAN.flnCompetency,
          learningObjectives: existing.learningObjectives || MOCK_LESSON_PLAN.learningObjectives,
          vocabularyBridge: existing.vocabularyBridge || MOCK_LESSON_PLAN.vocabularyBridge,
          steps: existing.steps || MOCK_LESSON_PLAN.steps,
        });
        setLastSavedId(existing.id);
      }
    }
  }, [editId]);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setSavedNotification("");

    setTimeout(() => {
      // Create fresh dynamic lesson plan aligned with criteria
      const newPlan = {
        id: lastSavedId || `lesson_${Date.now()}`,
        title: topicPrompt || "FLN Multilingual Lesson",
        grade: `Class ${selectedGrade}`,
        subject: selectedSubject,
        duration: "40 Minutes",
        targetLanguage: selectedLang,
        targetLanguageName: currentLang.name,
        flnCompetency: `FLN-${selectedSubject.substring(0, 3).toUpperCase()}-0${selectedGrade}: Foundational understanding and vocabulary in ${currentLang.name}`,
        summary: `Interactive bilingual lesson for ${selectedSubject} in ${currentLang.name}, designed for Grade ${selectedGrade} foundational competencies.`,
        learningObjectives: [
          `Master 5 core vocabulary words for "${topicPrompt}" in ${currentLang.name}.`,
          `Express understanding through bilingual oral responses and peer interactions.`,
          `Demonstrate concept mastery through hands-on classroom activities.`,
        ],
        vocabularyBridge: MOCK_LESSON_PLAN.vocabularyBridge,
        steps: MOCK_LESSON_PLAN.steps,
        teacherInstructions: `Begin by engaging children with familiar local context in ${currentLang.name}. Use real-life objects to anchor the concepts before reading from the textbook.`,
      };

      setCurrentPlan(newPlan);
      setIsGenerating(false);

      // Save automatically to My Lessons
      const saved = lessonService.saveLesson(newPlan);
      setLastSavedId(saved.id);
      setSavedNotification("पाठ सफलतापूर्वक उत्पन्न हुआ और 'My Lessons' में सहेजा गया (Lesson generated & saved to My Lessons)!");
    }, 550);
  };

  const handleManualSave = () => {
    const toSave = {
      ...currentPlan,
      id: lastSavedId || `lesson_${Date.now()}`,
      title: topicPrompt || currentPlan.title,
      grade: `Class ${selectedGrade}`,
      subject: selectedSubject,
      targetLanguage: selectedLang,
      targetLanguageName: currentLang.name,
    };
    const saved = lessonService.saveLesson(toSave);
    setLastSavedId(saved.id);
    setSavedNotification("पाठ 'My Lessons' में सहेज लिया गया है (Saved to My Lessons)!");
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="AI Vernacular Lesson Generator"
        subtitle="Generate simplified, multilingual, age-appropriate lesson plans aligned with NIPUN Bharat FLN competencies."
        badge={`Language: ${currentLang.name}`}
      />

      {/* Save Notification Toast */}
      {savedNotification && (
        <div className="lesson-save-toast">
          <div className="toast-left">
            <span className="toast-icon">✅</span>
            <span className="toast-text">{savedNotification}</span>
          </div>
          <div className="toast-right">
            {lastSavedId && (
              <Link to={`/my-lessons/${lastSavedId}`} className="toast-link">
                View in My Lessons →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Generator Configuration Card */}
      <div className="generator-config-card">
        <h2 className="config-title">⚙️ Lesson Criteria &amp; Foundational Competencies</h2>

        <div className="config-inputs-grid">
          {/* Class Level */}
          <div className="config-group">
            <label htmlFor="grade-select" className="config-label">कक्षा (Class):</label>
            <select
              id="grade-select"
              className="styled-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {PRIMARY_GRADES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="config-group">
            <label htmlFor="subject-select" className="config-label">विषय (Subject):</label>
            <select
              id="subject-select"
              className="styled-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Target Tribal Language */}
          <div className="config-group">
            <label htmlFor="lang-select" className="config-label">मातृभाषा (Language):</label>
            <select
              id="lang-select"
              className="styled-select"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Input */}
        <div className="config-topic-row">
          <div className="topic-input-wrap">
            <label htmlFor="topic-input" className="config-label">पाठ का विषय (Lesson Topic / Learning Goal):</label>
            <input
              id="topic-input"
              type="text"
              className="styled-input"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. जंगल के पेड़, घरेलू जानवर, गिनती १ से १०"
            />
          </div>

          <div className="generate-btn-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              icon={<span>✨</span>}
            >
              {isGenerating ? "योजना बन रही है..." : editId ? "Update & Save Lesson" : "Generate Lesson Plan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Lesson Plan Preview Card */}
      <div className="lesson-plan-preview-card">
        {/* Document Header */}
        <div className="doc-header">
          <div className="doc-title-group">
            <span className="doc-type-badge">FLN Multilingual Lesson Blueprint</span>
            <h2 className="doc-title">{currentPlan.title}</h2>
            <div className="doc-meta-tags">
              <span className="meta-tag">Class: {currentPlan.grade || `Class ${selectedGrade}`}</span>
              <span className="meta-tag">Subject: {selectedSubject}</span>
              <span className="meta-tag">Language: {currentLang.name}</span>
              <span className="meta-tag">Duration: {currentPlan.duration || "40 Minutes"}</span>
            </div>
          </div>

          <div className="doc-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<span>📚</span>}
              onClick={() => navigate(ROUTES.MY_LESSONS)}
            >
              My Lessons
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<span>🖨️</span>}
              onClick={() => window.print()}
            >
              Print Lesson
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<span>💾</span>}
              onClick={handleManualSave}
            >
              Save to My Lessons
            </Button>
          </div>
        </div>

        {/* FLN Competency Banner */}
        <div className="fln-competency-banner">
          <span className="fln-icon">🎯</span>
          <div className="fln-text">
            <strong>NIPUN Bharat Competency Alignment:</strong>
            <span> {currentPlan.flnCompetency}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="lesson-tabs-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === "steps" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            📋 Classroom Steps (कक्षा चरण)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "vocab" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("vocab")}
          >
            🔤 Vocabulary Bridge (शब्दावली सेतु)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "objectives" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("objectives")}
          >
            🎯 Learning Objectives (अपेक्षित दक्षताएं)
          </button>
        </div>

        {/* Tab Content: Steps */}
        {activeTab === "steps" && (
          <div className="steps-container">
            {currentPlan.steps && currentPlan.steps.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number-badge">Step {s.step}</div>
                <div className="step-details">
                  <h3 className="step-title">{s.name}</h3>

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
            ))}
          </div>
        )}

        {/* Tab Content: Vocabulary Bridge */}
        {activeTab === "vocab" && (
          <div className="vocab-container">
            <p className="vocab-intro">
              Key vernacular words connecting tribal vocabulary to the standard state curriculum:
            </p>
            <div className="vocab-table-wrapper">
              <table className="vocab-table">
                <thead>
                  <tr>
                    <th>हिंदी शब्द (Hindi)</th>
                    <th>मातृभाषा रूप ({currentLang.name})</th>
                    <th>English Concept</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlan.vocabularyBridge && currentPlan.vocabularyBridge.map((item, idx) => (
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
          </div>
        )}

        {/* Tab Content: Objectives */}
        {activeTab === "objectives" && (
          <div className="objectives-container">
            <h3 className="objectives-heading">Target Learning Outcomes:</h3>
            <ul className="objectives-list">
              {currentPlan.learningObjectives && currentPlan.learningObjectives.map((obj, i) => (
                <li key={i} className="objective-item">
                  <span className="obj-check">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonGenerator;
