import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { CLASSROOM_QUICK_PHRASES } from "../services/mockData";

export function Translate() {
  const { user } = useAuth();
  const [selectedTargetLang, setSelectedTargetLang] = useState(user?.targetLanguage || "sat");
  const [inputText, setInputText] = useState("आज हम सब मिलकर जंगल के सुंदर पेड़ों के बारे में जानेंगे।");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedTargetLang) ||
    SUPPORTED_LANGUAGES[0];

  const presets = [
    {
      label: "Lesson Intro",
      text: "आज हम सब मिलकर जंगल के सुंदर पेड़ों के बारे में जानेंगे।",
    },
    {
      label: "School Notice",
      text: "कल विद्यालय में सरहुल का पावन पर्व मनाया जाएगा, सभी बच्चे पारंपरिक पोशाक में आएं।",
    },
    {
      label: "Math Problem",
      text: "यदि आपके पास पाँच आम हैं और आपने दो आम अपने मित्र को दिए, तो आपके पास कितने आम बचे?",
    },
    {
      label: "Parent Notice",
      text: "अभिभावक कृपया अपने बच्चों के साथ गृहकार्य में सहायता करें और उन्हें नियमित विद्यालय भेजें।",
    },
  ];

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
    }, 400);
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Translate Educational Content"
        subtitle="Translate curriculum scripts, notices, and assessment prompts from Hindi into authentic Jharkhand tribal languages."
        badge={`Translating to: ${currentLang.name}`}
      />

      <div className="translate-workspace-layout">
        {/* Preset Selector */}
        <div className="translate-presets-bar">
          <span className="presets-title">Quick Preset Prompts:</span>
          <div className="preset-buttons">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-btn"
                onClick={() => setInputText(p.text)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Split Grid */}
        <div className="translate-split-grid">
          {/* Source Box */}
          <div className="translate-card source-card">
            <div className="translate-card-header">
              <div className="lang-indicator">
                <span className="lang-flag">🇮🇳</span>
                <strong>Hindi Source (मूल हिंदी सामग्री)</strong>
              </div>
              <button
                type="button"
                className="clear-btn"
                onClick={() => setInputText("")}
              >
                Clear
              </button>
            </div>

            <textarea
              className="translate-textarea"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Hindi lesson text, instructions, or notices here..."
            />

            <div className="translate-card-footer">
              <span className="char-count">{inputText.length} characters</span>
              <Button
                variant="primary"
                size="md"
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                icon={<span>⇄</span>}
              >
                {isTranslating ? "अनुवाद हो रहा है..." : "Translate Content"}
              </Button>
            </div>
          </div>

          {/* Target Box */}
          <div className="translate-card target-card">
            <div className="translate-card-header">
              <div className="lang-indicator">
                <span className="lang-flag">🌱</span>
                <strong>Target: {currentLang.name} ({currentLang.nativeName})</strong>
              </div>

              {/* Target Language Dropdown */}
              <select
                className="target-lang-select"
                value={selectedTargetLang}
                onChange={(e) => setSelectedTargetLang(e.target.value)}
                aria-label="Select target language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.script})
                  </option>
                ))}
              </select>
            </div>

            <div className="translation-output-view">
              <div className="script-display-box">
                <span className="script-name-tag">Native Script ({currentLang.script}):</span>
                <p className="script-primary-text font-ol-chiki">
                  ᱛᱮᱦᱮᱧ ᱵᱚ ᱥᱟᱱᱟᱢ ᱠᱚ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱵᱤᱨ ᱨᱮᱱᱟᱜ ᱪᱚᱨᱚᱠ ᱫᱟᱨᱮ ᱠᱚ ᱵᱟᱵᱚᱛ ᱵᱚ ᱵᱟᱰᱟᱭᱟ᱾
                </p>
              </div>

              <div className="script-display-box devanagari-variant">
                <span className="script-name-tag">देवनागरी रूप (Devanagari Transliteration):</span>
                <p className="script-secondary-text font-devanagari">
                  तेहेञ बो सनाम को मेसा काते बीर रेनाग चोरॉक दारे को बाबत बो बाड़ाया।
                </p>
              </div>

              <div className="phonetic-strip">
                <span className="phonetic-guide-label">Phonetic Speech Guide:</span>
                <span className="phonetic-guide-val">
                  "Tehenj bo sanam ko mesa kate bir renag chorok dare ko babot bo badaya"
                </span>
              </div>
            </div>

            <div className="translate-card-footer">
              <div className="footer-action-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy("ᱛᱮᱦᱮᱧ ᱵᱚ ᱥᱟᱱᱟᱢ ᱠᱚ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱵᱤᱨ ᱨᱮᱱᱟᱜ ᱪᱚᱨᱚᱠ ᱫᱟᱨᱮ ᱠᱚ ᱵᱟᱵᱚᱛ ᱵᱚ ᱵᱟᱰᱟᱭᱟ᱾")}
                  icon={<span>📋</span>}
                >
                  {copied ? "Copied! ✓" : "Copy Translation"}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<span>🔊</span>}
                >
                  Listen Audio
                </Button>
              </div>
              <span className="sync-status-tag">Ready for Offline Save</span>
            </div>
          </div>
        </div>

        {/* Backend Endpoint Documentation Note */}
        <div className="backend-ready-notice">
          <div className="notice-icon">⚙️</div>
          <div className="notice-content">
            <strong>FastAPI Translation Pipeline:</strong>
            <p>
              Mapped to <code>POST /api/v1/translate</code>. Accepts <code>text</code>, <code>source_language</code>, and <code>target_language</code>. Ready for AI Engine team (Member 3) translation models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Translate;
