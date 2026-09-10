import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import {
  SUPPORTED_LANGUAGES,
  AVAILABLE_CLASSES,
  SUBJECTS,
  WORKSHEET_DIFFICULTIES,
  WORKSHEET_EXERCISE_TYPES,
} from "../utils/constants";
import { apiService } from "../services/api";
import {
  WORKSHEET_SYLLABUS_TOPICS,
  buildWorksheetContent,
} from "../services/worksheetData";

export function WorksheetGenerator() {
  const { user } = useAuth();

  // 6-Step Workflow State
  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [selectedSubject, setSelectedSubject] = useState("Maths");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [isCustomTopicActive, setIsCustomTopicActive] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [exerciseType, setExerciseType] = useState("multiple_choice");
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");

  // Interaction State
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Get current language metadata
  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [selectedLang]);

  // Derived available topics for selected Class + Subject
  const availableTopics = useMemo(() => {
    const classData = WORKSHEET_SYLLABUS_TOPICS[selectedClass];
    if (classData && classData[selectedSubject] && classData[selectedSubject].length > 0) {
      return classData[selectedSubject];
    }
    return [
      "बुनियादी अवधारणाएं एवं शब्द ज्ञान (Foundational Concepts & Vocabulary)",
      "प्रकृति, पर्यावरण एवं संस्कृति (Nature, Environment & Heritage)",
      "दैनिक जीवन में अनुप्रयोग (Daily Life Application)",
    ];
  }, [selectedClass, selectedSubject]);

  // Sync selected topic when class or subject changes
  useEffect(() => {
    if (availableTopics.length > 0 && !availableTopics.includes(selectedTopic)) {
      setSelectedTopic(availableTopics[0]);
    }
  }, [availableTopics, selectedTopic]);

  // Active worksheet content generated based on criteria
  const [worksheetContent, setWorksheetContent] = useState(() => {
    return buildWorksheetContent({
      classLevel: "Class 1",
      subject: "Maths",
      topic: "गिनती और संख्या पहचान (Counting & Number Sense 1 to 10)",
      difficulty: "medium",
      exerciseType: "multiple_choice",
      targetLang: user?.targetLanguage || "sat",
    });
  });

  // Handle Worksheet Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    const activeTopicName = isCustomTopicActive && customTopic.trim() ? customTopic.trim() : selectedTopic;

    try {
      // Send structured payload to backend API (or fallback gracefully)
      await apiService.generateWorksheet({
        class: selectedClass,
        grade: selectedClass,
        subject: selectedSubject,
        topic: activeTopicName,
        difficulty,
        exerciseType,
        language: selectedLang,
        targetLanguage: selectedLang,
        school: user?.school || "राजकीय प्राथमिक विद्यालय",
      });

      // Build authentic pedagogical worksheet
      const generated = buildWorksheetContent({
        classLevel: selectedClass,
        subject: selectedSubject,
        topic: activeTopicName,
        difficulty,
        exerciseType,
        targetLang: selectedLang,
      });

      setWorksheetContent(generated);
      setToastMessage("कार्यपत्रक सफलतापूर्वक तैयार किया गया (Worksheet Generated Successfully)!");
      setTimeout(() => setToastMessage(""), 3500);
    } catch (err) {
      console.warn("Worksheet generation fallback active:", err);
      const generated = buildWorksheetContent({
        classLevel: selectedClass,
        subject: selectedSubject,
        topic: activeTopicName,
        difficulty,
        exerciseType,
        targetLang: selectedLang,
      });
      setWorksheetContent(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  // Find exercise type metadata
  const currentExerciseMeta = useMemo(() => {
    return (
      WORKSHEET_EXERCISE_TYPES.find((t) => t.id === exerciseType) ||
      WORKSHEET_EXERCISE_TYPES[0]
    );
  }, [exerciseType]);

  return (
    <div className="feature-page-container worksheet-generator-page">
      <PageHeader
        title="Bilingual Worksheet Generator"
        subtitle="Generate printable, high-contrast bilingual classroom worksheets mapped across Class 1 to 5, 9 subjects, 21 exercise formats, and 5 tribal languages."
        badge={`Language: ${currentLang.name}`}
      />

      {toastMessage && (
        <div className="worksheet-success-toast" role="status">
          <span>✅ {toastMessage}</span>
        </div>
      )}

      {/* 6-STEP GENERATOR CONTROLS BAR */}
      <div className="worksheet-controls-panel">
        <div className="panel-step-banner">
          <span className="step-badge">6-Step Flow</span>
          <span className="step-flow-text">
            <strong>Class</strong> ➔ <strong>Subject</strong> ➔ <strong>Chapter / Topic</strong> ➔ <strong>Difficulty</strong> ➔ <strong>Exercise Type</strong> ➔ <strong>Language</strong>
          </span>
        </div>

        <div className="controls-grid-6col">
          {/* 1. Class Selector */}
          <div className="control-form-group">
            <label htmlFor="ws-class" className="control-label">
              <span className="label-step-num">1</span> कक्षा (Class):
            </label>
            <select
              id="ws-class"
              className="styled-select"
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

          {/* 2. Subject Selector */}
          <div className="control-form-group">
            <label htmlFor="ws-subject" className="control-label">
              <span className="label-step-num">2</span> विषय (Subject):
            </label>
            <select
              id="ws-subject"
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

          {/* 3. Chapter / Topic Selector */}
          <div className="control-form-group topic-field-span">
            <div className="topic-label-wrap">
              <label htmlFor="ws-topic" className="control-label">
                <span className="label-step-num">3</span> अध्याय / विषयवस्तु (Chapter / Topic):
              </label>
              <button
                type="button"
                className="toggle-custom-topic-btn"
                onClick={() => setIsCustomTopicActive(!isCustomTopicActive)}
              >
                {isCustomTopicActive ? "पाठ्य विवरण से चुनें" : "+ अन्य विषय"}
              </button>
            </div>

            {isCustomTopicActive ? (
              <input
                id="ws-topic-custom"
                type="text"
                className="styled-input"
                placeholder="उदा. सोहराय पर्व, पत्तियों के प्रकार, संख्या जोड़..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />
            ) : (
              <select
                id="ws-topic"
                className="styled-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {availableTopics.map((top, idx) => (
                  <option key={idx} value={top}>
                    {top}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 4. Difficulty Selector */}
          <div className="control-form-group">
            <label htmlFor="ws-difficulty" className="control-label">
              <span className="label-step-num">4</span> कठिनाई स्तर (Difficulty):
            </label>
            <select
              id="ws-difficulty"
              className="styled-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {WORKSHEET_DIFFICULTIES.map((diff) => (
                <option key={diff.id} value={diff.id}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Exercise Type Selector (21 Options) */}
          <div className="control-form-group exercise-type-span">
            <label htmlFor="ws-type" className="control-label">
              <span className="label-step-num">5</span> अभ्यास का प्रकार (Exercise Type - 21 Options):
            </label>
            <select
              id="ws-type"
              className="styled-select"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
            >
              {WORKSHEET_EXERCISE_TYPES.map((type, idx) => {
                const isRecommended = type.recommendedClasses?.includes(selectedClass);
                return (
                  <option key={type.id} value={type.id}>
                    {idx + 1}. {type.icon} {type.label} ({type.hindi}) {isRecommended ? "⭐ [Recommended]" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 6. Language Selector (5 Options) */}
          <div className="control-form-group">
            <label htmlFor="ws-lang" className="control-label">
              <span className="label-step-num">6</span> मातृभाषा (Tribal Language):
            </label>
            <select
              id="ws-lang"
              className="styled-select"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName.split("/")[0].trim()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="generate-submit-row">
          <div className="active-selection-summary">
            <span>
              🎯 तैयार हो रहा है: <strong>{selectedClass}</strong> • <strong>{selectedSubject}</strong> • <strong>{currentExerciseMeta.label}</strong> • <strong>{currentLang.name}</strong>
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
            icon={<span>{isGenerating ? "⏳" : "⚙️"}</span>}
          >
            {isGenerating ? "कार्यपत्रक तैयार हो रहा है..." : "Generate Worksheet (कार्यपत्रक बनाएं)"}
          </Button>
        </div>
      </div>

      {/* PRINTABLE SHEET PREVIEW STAGE */}
      <div className="worksheet-canvas-outer">
        {/* Actions Toolbar */}
        <div className="worksheet-actions-toolbar">
          <div className="toolbar-left-info">
            <span className="a4-tag">🖨️ A4 High-Contrast Print Ready</span>
            <span className="toolbar-details-pill">
              {worksheetContent.classLevel} • {worksheetContent.subject} • {worksheetContent.languageName}
            </span>
          </div>

          <div className="toolbar-btns">
            <button
              type="button"
              className={`toggle-answer-key-btn ${showAnswerKey ? "answer-key-active" : ""}`}
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              title="Toggle Teacher Solutions & Answer Key"
            >
              {showAnswerKey ? "🙈 Hide Answer Key" : "🔑 Teacher Answer Key"}
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              icon={<span>🖨️</span>}
            >
              Print Worksheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<span>📥</span>}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* PHYSICAL PRINTABLE SHEET CANVAS */}
        <div className="printable-sheet-paper" id="printable-worksheet">
          {/* Sheet Header */}
          <div className="sheet-header">
            <div className="school-title-strip">
              <span className="gov-emblem">🌾</span>
              <div>
                <h3 className="sheet-school-name">{user?.school || "राजकीय प्राथमिक विद्यालय"}</h3>
                <span className="sheet-department">
                  {worksheetContent.schoolBoard} • {worksheetContent.classLevel} • {worksheetContent.subject}
                </span>
              </div>
            </div>

            <h2 className="sheet-worksheet-title">{worksheetContent.title}</h2>

            <div className="worksheet-meta-strip">
              <span><strong>विषय (Subject):</strong> {worksheetContent.subject}</span>
              <span><strong>अध्याय (Topic):</strong> {worksheetContent.topic}</span>
              <span><strong>मातृभाषा (Language):</strong> {worksheetContent.languageName}</span>
              <span><strong>पूर्णांक (Max Marks):</strong> {worksheetContent.maxMarks}</span>
              <span><strong>समय (Time):</strong> {worksheetContent.timeAllowed}</span>
            </div>

            {/* Student Fill Bar */}
            <div className="student-info-fill-bar">
              <div className="info-fill-line">
                <span>विद्यार्थी का नाम (Student Name): </span>
                <span className="line-blank">___________________________</span>
              </div>
              <div className="info-fill-line">
                <span>अनुक्रमांक (Roll No): </span>
                <span className="line-blank">_______</span>
              </div>
              <div className="info-fill-line">
                <span>दिनांक (Date): </span>
                <span className="line-blank">___/___/20__</span>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="sheet-instructions">
            <p className="instruction-text font-devanagari">
              <strong>निर्देश (Instructions):</strong> {worksheetContent.instructions}
            </p>
          </div>

          {/* =========================================================================
              DYNAMIC EXERCISE TYPE RENDERERS (ALL 21 TYPES)
              ========================================================================= */}

          {/* 1. Multiple Choice Questions */}
          {(exerciseType === "multiple_choice" || exerciseType === "mcq") && worksheetContent.questions && (
            <div className="worksheet-mcq-section">
              {worksheetContent.questions.map((q) => (
                <div key={q.id} className="mcq-question-card">
                  <div className="mcq-question-header">
                    <span className="mcq-q-num">प्र. {q.id}.</span>
                    <div>
                      <p className="mcq-q-title font-devanagari">{q.question}</p>
                      {q.tribalHint && <span className="mcq-q-hint">{q.tribalHint}</span>}
                    </div>
                  </div>
                  <div className="mcq-options-grid">
                    {q.options.map((opt) => (
                      <div key={opt.key} className="mcq-option-pill">
                        <span className="mcq-bubble">○</span>
                        <strong className="mcq-opt-key">({opt.key})</strong>
                        <span className="mcq-opt-text font-ol-chiki">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Fill in the Blanks with Word Bank */}
          {exerciseType === "fill_blanks" && worksheetContent.sentences && (
            <div className="worksheet-fillblanks-section">
              {worksheetContent.wordBox && (
                <div className="word-bank-box">
                  <span className="word-bank-label">शब्द-पेटी (Word Bank):</span>
                  <div className="word-bank-pills">
                    {worksheetContent.wordBox.map((w, i) => (
                      <span key={i} className="word-pill font-ol-chiki">{w}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="fillblanks-list">
                {worksheetContent.sentences.map((s) => (
                  <div key={s.id} className="fillblank-row">
                    <span className="fillblank-num">({s.id})</span>
                    <p className="fillblank-text font-devanagari">
                      {s.text.split("_________")[0]}
                      <span className="blank-underline">___________________</span>
                      {s.text.split("_________")[1]}
                    </p>
                    {s.hint && <span className="fillblank-hint">[{s.hint}]</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Match the Following */}
          {exerciseType === "match_following" && worksheetContent.leftColumn && (
            <div className="matching-exercise-grid">
              <div className="matching-column left-column">
                <span className="column-label">स्तम्भ 'क' (Column A - हिंदी व चित्र)</span>
                {worksheetContent.leftColumn.map((item) => (
                  <div key={item.id} className="matching-item-box">
                    <span className="item-number">({item.id})</span>
                    <span className="item-symbol">{item.symbol}</span>
                    <span className="item-hindi font-devanagari">{item.left}</span>
                    <span className="connector-dot">○</span>
                  </div>
                ))}
              </div>

              <div className="matching-divider-line"></div>

              <div className="matching-column right-column">
                <span className="column-label">स्तम्भ 'ख' (Column B - {worksheetContent.languageName})</span>
                {worksheetContent.rightColumn.map((item) => (
                  <div key={item.letter} className="matching-item-box right-box">
                    <span className="connector-dot">○</span>
                    <span className="item-symbol">{item.symbol}</span>
                    <div className="item-tribal-text">
                      <span className="tribal-script-word font-ol-chiki">{item.rightScript}</span>
                      <span className="tribal-dev-word font-devanagari">({item.rightDev})</span>
                    </div>
                    <span className="item-letter">[{item.letter}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. True / False */}
          {exerciseType === "true_false" && worksheetContent.statements && (
            <div className="worksheet-truefalse-section">
              {worksheetContent.statements.map((st) => (
                <div key={st.id} className="truefalse-row">
                  <span className="tf-num">({st.id})</span>
                  <p className="tf-statement font-devanagari">{st.text}</p>
                  <div className="tf-checkbox-pair">
                    <span className="tf-box">[ &nbsp; ] सत्य (True)</span>
                    <span className="tf-box">[ &nbsp; ] असत्य (False)</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Choose the Correct Picture */}
          {exerciseType === "choose_correct_picture" && worksheetContent.pictureItems && (
            <div className="worksheet-choose-picture-section">
              {worksheetContent.pictureItems.map((item) => (
                <div key={item.id} className="choose-picture-card">
                  <p className="choose-picture-prompt font-devanagari">
                    <strong>प्र. {item.id}.</strong> {item.prompt}
                  </p>
                  <div className="picture-options-row">
                    {item.options.map((opt) => (
                      <div key={opt.id} className="picture-option-box">
                        <span className="picture-emoji">{opt.emoji}</span>
                        <div className="picture-radio-label">
                          <span className="opt-bubble">○</span>
                          <strong>({opt.id}) {opt.label}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. Picture-Based Questions */}
          {exerciseType === "picture_based" && worksheetContent.scenarioItems && (
            <div className="worksheet-scenario-section">
              {worksheetContent.scenarioItems.map((sc) => (
                <div key={sc.id} className="scenario-card-block">
                  <div className="scenario-visual-box">
                    <span className="scenario-emojis">{sc.emoji}</span>
                    <span className="scenario-caption">{sc.caption}</span>
                  </div>
                  <div className="scenario-questions-list">
                    {sc.questions.map((q, idx) => (
                      <div key={idx} className="scenario-q-row">
                        <span className="q-index">({idx + 1})</span>
                        <div className="q-wrap">
                          <p className="q-text font-devanagari">{q.q}</p>
                          <div className="scenario-answer-line">
                            <span>उत्तर: </span>
                            <span className="line-blank-full">________________________________________</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 7. Identify / Name */}
          {exerciseType === "identify_name" && worksheetContent.items && (
            <div className="worksheet-picture-grid">
              {worksheetContent.items.map((item) => (
                <div key={item.id} className="picture-card-box">
                  <div className="picture-card-visual">{item.emoji}</div>
                  <div className="picture-fill-lines">
                    <div className="fill-line-row">
                      <span>हिंदी नाम: </span>
                      <span className="line-blank">______________</span>
                    </div>
                    <div className="fill-line-row">
                      <span>मातृभाषा ({worksheetContent.languageName}): </span>
                      <span className="line-blank">______________</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. Arrange in Order */}
          {exerciseType === "arrange_order" && worksheetContent.steps && (
            <div className="worksheet-arrange-section">
              {worksheetContent.steps.map((step, idx) => (
                <div key={idx} className="arrange-step-row">
                  <span className="order-box-blank">[ &nbsp; ]</span>
                  <span className="step-emoji">{step.emoji}</span>
                  <div className="step-text-wrap">
                    <strong className="font-devanagari">{step.text}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 9. Odd One Out */}
          {exerciseType === "odd_one_out" && worksheetContent.sets && (
            <div className="worksheet-oddoneout-section">
              {worksheetContent.sets.map((set) => (
                <div key={set.id} className="oddoneout-card">
                  <div className="oddoneout-header">
                    <span className="set-num">समूह {set.id}.</span>
                    <span className="set-inst">बेमेल शब्द पर गोला [○] बनाएँ:</span>
                  </div>
                  <div className="oddoneout-chips">
                    {set.items.map((it, i) => (
                      <div key={i} className="odd-item-chip font-devanagari">
                        <span className="chip-circle">○</span>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                  <div className="odd-reason-line">
                    <span>अलग होने का कारण: </span>
                    <span className="line-blank-full">________________________________________________</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 10. Counting / Number Questions */}
          {exerciseType === "counting_numbers" && worksheetContent.countingItems && (
            <div className="worksheet-counting-grid">
              {worksheetContent.countingItems.map((c) => (
                <div key={c.id} className="counting-card-box">
                  <div className="counting-emojis-cluster">{c.emojiGroup}</div>
                  <p className="counting-task-label font-devanagari">{c.task}</p>
                  <div className="counting-fill-row">
                    <div className="count-num-box">
                      <span>अंक (Number): </span>
                      <span className="box-blank">[ &nbsp;&nbsp;&nbsp; ]</span>
                    </div>
                    <div className="count-word-box">
                      <span>मातृभाषा शब्द: </span>
                      <span className="line-blank">________________</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 11. Basic Calculation */}
          {exerciseType === "basic_calculation" && worksheetContent.calculationProblems && (
            <div className="worksheet-calc-section">
              <div className="calc-problems-grid">
                {worksheetContent.calculationProblems.map((p) => (
                  <div key={p.id} className="calc-problem-card">
                    <div className="calc-q-header">
                      <span className="calc-num">({p.id})</span>
                      <h4 className="calc-formula font-devanagari">{p.problem}</h4>
                    </div>
                    {p.hint && <span className="calc-hint-text">संकेत: {p.hint}</span>}
                    <div className="calc-rough-space">
                      <span>हल करने का स्थान (Rough Work):</span>
                      <div className="rough-lines">
                        <div className="guide-line"></div>
                        <div className="guide-line"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. Word Problems */}
          {exerciseType === "word_problems" && worksheetContent.problems && (
            <div className="worksheet-wordproblems-section">
              {worksheetContent.problems.map((pr) => (
                <div key={pr.id} className="wordproblem-card">
                  <div className="wordproblem-header">
                    <span className="wp-badge">प्रश्न {pr.id}.</span>
                    <p className="wp-text font-devanagari">{pr.problem}</p>
                  </div>
                  <div className="wp-solution-area">
                    <span className="solution-label">चरणबद्ध हल (Step-by-step Solution):</span>
                    <div className="handwriting-guidelines">
                      <div className="guide-line"></div>
                      <div className="guide-line"></div>
                      <div className="guide-line"></div>
                      <div className="guide-line"></div>
                    </div>
                    <div className="wp-final-answer">
                      <span>उत्तर: </span>
                      <span className="line-blank">__________________________________</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 13. Short Answer Questions */}
          {exerciseType === "short_answer" && worksheetContent.questions && (
            <div className="worksheet-shortanswer-section">
              {worksheetContent.questions.map((q) => (
                <div key={q.id} className="shortanswer-block">
                  <p className="shortanswer-q font-devanagari">{q.q}</p>
                  <div className="handwriting-guidelines">
                    <div className="guide-line"></div>
                    <div className="guide-line"></div>
                    <div className="guide-line"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 14. Reading Comprehension */}
          {exerciseType === "reading_comprehension" && (
            <div className="worksheet-comprehension-section">
              <div className="comprehension-passage-box">
                <span className="passage-title-tag">📖 पठन गद्यांश (Reading Passage):</span>
                <p className="passage-body font-devanagari">{worksheetContent.passage}</p>
              </div>

              <div className="comprehension-questions-block">
                <h4 className="comprehension-q-heading">प्रश्नोत्तरी (Comprehension Questions):</h4>
                {worksheetContent.questions.map((q) => (
                  <div key={q.id} className="comprehension-q-item">
                    <p className="comp-q-text font-devanagari">
                      <strong>प्र. {q.id}.</strong> {q.q}
                    </p>
                    <div className="handwriting-guidelines">
                      <div className="guide-line"></div>
                      <div className="guide-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15. Grammar Exercises */}
          {exerciseType === "grammar_exercises" && worksheetContent.tasks && (
            <div className="worksheet-grammar-section">
              {worksheetContent.tasks.map((task) => (
                <div key={task.id} className="grammar-task-card">
                  <span className="grammar-num">({task.id})</span>
                  <div className="grammar-task-body">
                    <p className="grammar-prompt font-devanagari"><strong>निर्देश:</strong> {task.prompt}</p>
                    <p className="grammar-sentence font-devanagari">वाक्य: <em>"{task.sentence}"</em></p>
                    <div className="grammar-answer-fill">
                      <span>उत्तर: </span>
                      <span className="line-blank-full">____________________________________________</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 16. Vocabulary Exercises */}
          {exerciseType === "vocabulary_exercises" && worksheetContent.vocabList && (
            <div className="worksheet-vocab-section">
              <table className="vocab-exercise-table">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>शब्द (Word)</th>
                    <th>अर्थ (Meaning in Hindi)</th>
                    <th>मातृभाषा समानार्थी रूप ({worksheetContent.languageName})</th>
                  </tr>
                </thead>
                <tbody>
                  {worksheetContent.vocabList.map((v, i) => (
                    <tr key={i}>
                      <td>{i + 1}.</td>
                      <td><strong>{v.word}</strong></td>
                      <td>{v.meaning}</td>
                      <td>
                        <span className="table-line-blank">___________________</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 17. Sequencing a Story */}
          {exerciseType === "sequencing_story" && worksheetContent.storyEvents && (
            <div className="worksheet-storyseq-section">
              <div className="story-events-list">
                {worksheetContent.storyEvents.map((ev, i) => (
                  <div key={i} className="story-event-row">
                    <span className="seq-order-box">[ &nbsp;&nbsp; ]</span>
                    <p className="story-event-text font-devanagari">{ev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 18. Reasoning / Logic */}
          {exerciseType === "reasoning_logic" && worksheetContent.logicPuzzles && (
            <div className="worksheet-reasoning-section">
              {worksheetContent.logicPuzzles.map((lp) => (
                <div key={lp.id} className="reasoning-puzzle-card">
                  <p className="puzzle-title font-devanagari">
                    <strong>पहेली / तर्क {lp.id}:</strong> {lp.puzzle}
                  </p>
                  <div className="puzzle-options-row">
                    {lp.options.map((opt, idx) => (
                      <div key={idx} className="puzzle-opt-pill">
                        <span className="mcq-bubble">○</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="puzzle-exp-line">
                    <span>तर्क / कारण: </span>
                    <span className="line-blank-full">________________________________________________</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 19. Real-Life / Application Questions */}
          {exerciseType === "real_life_application" && worksheetContent.scenarios && (
            <div className="worksheet-reallife-section">
              {worksheetContent.scenarios.map((sc) => (
                <div key={sc.id} className="reallife-scenario-card">
                  <div className="reallife-header">
                    <span className="reallife-badge">स्थिति {sc.id}</span>
                    <strong className="reallife-context font-devanagari">{sc.context}</strong>
                  </div>
                  <p className="reallife-question font-devanagari">{sc.question}</p>
                  <div className="handwriting-guidelines">
                    <div className="guide-line"></div>
                    <div className="guide-line"></div>
                    <div className="guide-line"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 20. Activity / Project Questions */}
          {exerciseType === "activity_project" && worksheetContent.activities && (
            <div className="worksheet-activity-section">
              {worksheetContent.activities.map((act) => (
                <div key={act.id} className="activity-card-block">
                  <h4 className="activity-title font-devanagari">
                    🌟 गतिविधि {act.id}: {act.title}
                  </h4>
                  <div className="activity-steps-box">
                    <span className="steps-heading">कार्य विधि (Instructions):</span>
                    <ol className="activity-steps-list">
                      {act.steps.map((st, sIdx) => (
                        <li key={sIdx} className="font-devanagari">{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="activity-student-workspace">
                    <span>विद्यार्थी कार्य क्षेत्र (Paste / Draw / Write here):</span>
                    <div className="activity-drawing-box"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 21. Mixed Worksheet (Comprehensive Exam Paper) */}
          {exerciseType === "mixed_worksheet" && worksheetContent.isMixed && (
            <div className="worksheet-mixed-comprehensive-section">
              {/* Section A */}
              <div className="mixed-section-block">
                <h4 className="mixed-section-title">{worksheetContent.sectionA.title}</h4>
                <div className="mixed-questions-list">
                  {worksheetContent.sectionA.questions.map((q) => (
                    <div key={q.id} className="mcq-question-card">
                      <p className="mcq-q-title font-devanagari">
                        <strong>Q{q.id}.</strong> {q.q}
                      </p>
                      <div className="mcq-options-grid">
                        {q.options.map((opt, i) => (
                          <div key={i} className="mcq-option-pill">
                            <span className="mcq-bubble">○</span>
                            <span className="font-ol-chiki">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B */}
              <div className="mixed-section-block">
                <h4 className="mixed-section-title">{worksheetContent.sectionB.title}</h4>
                <div className="word-bank-box">
                  <span className="word-bank-label">शब्द-पेटी:</span>
                  <div className="word-bank-pills">
                    {worksheetContent.sectionB.wordBox.map((w, i) => (
                      <span key={i} className="word-pill font-ol-chiki">{w}</span>
                    ))}
                  </div>
                </div>
                <div className="fillblanks-list">
                  {worksheetContent.sectionB.sentences.map((s) => (
                    <div key={s.id} className="fillblank-row">
                      <span className="fillblank-num">({s.id})</span>
                      <p className="fillblank-text font-devanagari">
                        {s.text.split("_________")[0]}
                        <span className="blank-underline">___________________</span>
                        {s.text.split("_________")[1]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C */}
              <div className="mixed-section-block">
                <h4 className="mixed-section-title">{worksheetContent.sectionC.title}</h4>
                <div className="shortanswer-list">
                  {worksheetContent.sectionC.questions.map((q, i) => (
                    <div key={i} className="shortanswer-block">
                      <p className="shortanswer-q font-devanagari">{q.q}</p>
                      <div className="handwriting-guidelines">
                        <div className="guide-line"></div>
                        <div className="guide-line"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Teacher Grading & Encouragement Strip */}
          <div className="sheet-grading-strip">
            <div className="teacher-sign-box">
              <span>शिक्षक के हस्ताक्षर (Teacher Sign): ___________________</span>
            </div>
            <div className="stars-encouragement">
              <span>सराहना (Teacher Rating): ⭐ ⭐ ⭐ ⭐ ⭐</span>
            </div>
          </div>
        </div>

        {/* TEACHER ANSWER KEY COLLAPSIBLE DRAWER */}
        {showAnswerKey && worksheetContent.answerKey && (
          <div className="teacher-answer-key-drawer" id="teacher-answer-key">
            <div className="answer-key-header">
              <div className="key-title-group">
                <span className="key-badge">🔑 शिक्षक उत्तर कुंजी (Teacher Answer Key & Guide)</span>
                <h3 className="key-title">{worksheetContent.title}</h3>
              </div>
              <button
                type="button"
                className="close-key-btn"
                onClick={() => setShowAnswerKey(false)}
              >
                ✕
              </button>
            </div>

            <div className="answer-key-body">
              <p className="key-instructions-note">
                💡 <strong>मूल्यांकन मार्गदर्शिका:</strong> छात्रों के मातृभाषा उच्चारण एवं द्विभाषी समझ को प्रोत्साहित करें।
              </p>

              <div className="answer-items-list">
                {Array.isArray(worksheetContent.answerKey) ? (
                  worksheetContent.answerKey.map((item, idx) => (
                    <div key={idx} className="answer-item-row">
                      <span className="ans-bullet">✓</span>
                      <span className="ans-text font-devanagari">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="ans-text">{String(worksheetContent.answerKey)}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorksheetGenerator;
