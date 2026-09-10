import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { CLASSROOM_QUICK_PHRASES } from "../services/mockData";
import apiService from "../services/api";

export function Translate() {
  const { user } = useAuth();
  const [selectedTargetLang, setSelectedTargetLang] = useState(user?.targetLanguage || "sat");
  const [inputText, setInputText] = useState("आज हम सब मिलकर जंगल के सुंदर पेड़ों के बारे में जानेंगे।");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active translation state
  const [translatedData, setTranslatedData] = useState({
    script: "ᱛᱮᱦᱮᱧ ᱵᱚ ᱥᱟᱱᱟᱢ ᱠᱚ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱵᱤᱨ ᱨᱮᱱᱟᱜ ᱪᱚᱨᱚᱠ ᱫᱟᱨᱮ ᱠᱚ ᱵᱟᱵᱚᱛ ᱵᱚ ᱵᱟᱰᱟᱭᱟ᱾",
    devanagari: "तेहेञ बो सनाम को मेसा काते बीर रेनाग चोरॉक दारे को बाबत बो बाड़ाया।",
    phonetic: "Tehenj bo sanam ko mesa kate bir renag chorok dare ko babot bo badaya",
  });

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

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await apiService.translateText(inputText, "hi", selectedTargetLang);
      if (res) {
        setTranslatedData({
          script: res.translated_text || res.original_text,
          devanagari: res.devanagari_transliteration || res.translated_text,
          phonetic: res.phonetic_guide || "",
        });
      }
    } catch {
      // Local fallback lookup
      const sample = CLASSROOM_QUICK_PHRASES[0].translations[selectedTargetLang] || CLASSROOM_QUICK_PHRASES[0].translations.sat;
      setTranslatedData({
        script: sample.script,
        devanagari: sample.devanagari,
        phonetic: sample.audioText,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedTargetLang(newLang);
    const sample = CLASSROOM_QUICK_PHRASES[0].translations[newLang] || CLASSROOM_QUICK_PHRASES[0].translations.sat;
    setTranslatedData({
      script: sample.script,
      devanagari: sample.devanagari,
      phonetic: sample.audioText,
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    if ("speechSynthesis" in window && translatedData.devanagari) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(translatedData.devanagari);
        utterance.lang = "hi-IN";
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
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
                <strong>{currentLang.name} (मातृभाषा अनुवाद)</strong>
              </div>

              {/* Target Language Dropdown */}
              <select
                className="target-lang-select"
                value={selectedTargetLang}
                onChange={handleLanguageChange}
                aria-label="Select target language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="translation-output-view">
              <div className="script-display-box">
                <span className="script-name-tag">Native Script ({currentLang.script}):</span>
                <p className="script-primary-text font-ol-chiki">
                  {translatedData.script}
                </p>
              </div>

              <div className="script-display-box devanagari-variant">
                <span className="script-name-tag">देवनागरी रूप (Devanagari Transliteration):</span>
                <p className="script-secondary-text font-devanagari">
                  {translatedData.devanagari}
                </p>
              </div>

              {translatedData.phonetic && (
                <div className="phonetic-strip">
                  <span className="phonetic-guide-label">Phonetic Speech Guide:</span>
                  <span className="phonetic-guide-val">
                    "{translatedData.phonetic}"
                  </span>
                </div>
              )}
            </div>

            <div className="translate-card-footer">
              <div className="footer-action-buttons">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(translatedData.script)}
                  icon={<span>📋</span>}
                >
                  {copied ? "Copied! ✓" : "Copy Translation"}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio}
                  icon={<span>🔊</span>}
                >
                  {isPlayingAudio ? "Playing..." : "Listen Audio"}
                </Button>
              </div>
              <span className="sync-status-tag">Ready for Offline Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Translate;

