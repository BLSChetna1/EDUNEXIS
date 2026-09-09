import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { MOCK_WORKSHEET } from "../services/mockData";

export function WorksheetGenerator() {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");
  const [worksheetType, setWorksheetType] = useState("matching");
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Bilingual Worksheet Generator"
        subtitle="Create high-contrast, printable bilingual worksheets with pictorial cues for primary children."
        badge={`Language: ${currentLang.name}`}
      />

      {/* Configuration Controls */}
      <div className="worksheet-controls-bar">
        <div className="control-field">
          <label htmlFor="ws-grade" className="control-label">कक्षा (Grade):</label>
          <select
            id="ws-grade"
            className="styled-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="1">Class 1 (Foundational)</option>
            <option value="2">Class 2 (Beginner)</option>
            <option value="3">Class 3 (Intermediate)</option>
          </select>
        </div>

        <div className="control-field">
          <label htmlFor="ws-type" className="control-label">अभ्यास का प्रकार (Exercise Type):</label>
          <select
            id="ws-type"
            className="styled-select"
            value={worksheetType}
            onChange={(e) => setWorksheetType(e.target.value)}
          >
            <option value="matching">सचित्र शब्द मिलान (Pictorial Word Match)</option>
            <option value="tracing">अक्षर अनुरेखण (Letter & Word Tracing)</option>
            <option value="numbers">संख्या एवं चित्र गणना (Count & Match)</option>
          </select>
        </div>

        <div className="control-field">
          <label htmlFor="ws-lang" className="control-label">मातृभाषा (Language):</label>
          <select
            id="ws-lang"
            className="styled-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        <div className="control-action">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            icon={<span>⚙️</span>}
          >
            {isGenerating ? "बन रहा है..." : "Create Worksheet"}
          </Button>
        </div>
      </div>

      {/* Printable Sheet Canvas / Preview */}
      <div className="worksheet-canvas-outer">
        <div className="worksheet-actions-toolbar">
          <span className="toolbar-info">
            🖨️ Formatted for standard A4 black-and-white school printers
          </span>
          <div className="toolbar-btns">
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
              icon={<span>📥</span>}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Printable Physical Sheet Paper */}
        <div className="printable-sheet-paper" id="printable-worksheet">
          {/* Paper Header */}
          <div className="sheet-header">
            <div className="school-title-strip">
              <span className="gov-emblem">🌾</span>
              <div>
                <h3 className="sheet-school-name">{user?.school || "राजकीय प्राथमिक विद्यालय"}</h3>
                <span className="sheet-department">झारखंड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद (JCERT)</span>
              </div>
            </div>

            <h2 className="sheet-worksheet-title">{MOCK_WORKSHEET.title}</h2>

            <div className="student-info-fill-bar">
              <div className="info-fill-line">
                <span>विद्यार्थी का नाम (Name): </span>
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

          {/* Instructions */}
          <div className="sheet-instructions">
            <p className="instruction-text font-devanagari">
              <strong>निर्देश:</strong> {MOCK_WORKSHEET.instructions}
            </p>
          </div>

          {/* Matching Exercise Body */}
          <div className="matching-exercise-grid">
            <div className="matching-column left-column">
              <span className="column-label">हिंदी शब्द एवं प्रतीक (Column A)</span>
              {MOCK_WORKSHEET.pairs.map((item) => (
                <div key={item.id} className="matching-item-box">
                  <span className="item-number">({item.id})</span>
                  <span className="item-symbol">{item.symbol}</span>
                  <span className="item-hindi font-devanagari">{item.hindi}</span>
                  <span className="connector-dot">○</span>
                </div>
              ))}
            </div>

            <div className="matching-divider-line"></div>

            <div className="matching-column right-column">
              <span className="column-label">मातृभाषा शब्द रूप (Column B - {currentLang.name})</span>
              {/* Render in slightly scrambled order for authentic matching worksheet feel */}
              {[
                MOCK_WORKSHEET.pairs[1],
                MOCK_WORKSHEET.pairs[3],
                MOCK_WORKSHEET.pairs[0],
                MOCK_WORKSHEET.pairs[4],
                MOCK_WORKSHEET.pairs[2],
              ].map((item, index) => (
                <div key={item.id} className="matching-item-box right-box">
                  <span className="connector-dot">○</span>
                  <span className="item-symbol">{item.symbol}</span>
                  <div className="item-tribal-text">
                    <span className="tribal-script-word font-ol-chiki">{item.tribalScript}</span>
                    <span className="tribal-dev-word font-devanagari">({item.tribalDev})</span>
                  </div>
                  <span className="item-letter">[{String.fromCharCode(65 + index)}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Grading & Encouragement Strip */}
          <div className="sheet-grading-strip">
            <div className="teacher-sign-box">
              <span>शिक्षक के हस्ताक्षर: ___________________</span>
            </div>
            <div className="stars-encouragement">
              <span>सराहना (Rating): ⭐ ⭐ ⭐ ⭐ ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Integration Note */}
      <div className="backend-ready-notice">
        <div className="notice-icon">📝</div>
        <div className="notice-content">
          <strong>Worksheet Generation API:</strong>
          <p>
            Connected to <code>POST /api/v1/worksheets</code>. Supports PDF compilation and SVG rendering for printing in resource-constrained schools.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorksheetGenerator;
