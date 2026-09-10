import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { CLASSROOM_QUICK_PHRASES } from "../services/mockData";

export function LiveClassroom() {
  const { user } = useAuth();
  const [selectedLangCode, setSelectedLangCode] = useState(user?.targetLanguage || "sat");

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLangCode) ||
    SUPPORTED_LANGUAGES[0];

  const [isListening, setIsListening] = useState(false);
  const [hindiInput, setHindiInput] = useState("सभी बच्चे बैठ जाएं और अपनी किताब खोलें।");
  const [activePhraseId, setActivePhraseId] = useState("p1");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active translation lookup based on selected tribal language
  const activeSample =
    CLASSROOM_QUICK_PHRASES.find((p) => p.hindi === hindiInput) ||
    CLASSROOM_QUICK_PHRASES.find((p) => p.id === activePhraseId) ||
    CLASSROOM_QUICK_PHRASES[0];

  const translation =
    activeSample.translations[selectedLangCode] ||
    activeSample.translations.sat ||
    activeSample.translations.hoc ||
    activeSample.translations.unr ||
    activeSample.translations.kru ||
    activeSample.translations.kha || {
      script: activeSample.hindi,
      devanagari: activeSample.hindi,
      audioText: activeSample.phonetic || activeSample.hindi,
    };

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSelectQuickPhrase = (phrase) => {
    setActivePhraseId(phrase.id);
    setHindiInput(phrase.hindi);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    if ("speechSynthesis" in window && translation.devanagari) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(translation.devanagari);
        utterance.lang = "hi-IN";
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }
    } else {
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 2000);
    }
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Live Classroom Voice Assistant"
        subtitle="Real-time Hindi-to-tribal-language speech translation bridge for interactive classroom communication."
        badge={`Language: ${currentLang.name}`}
      />

      <div className="feature-workspace-grid">
        {/* Left Column: Voice & Speech Input Panel */}
        <div className="workspace-panel">
          <div className="panel-header">
            <h2 className="panel-title">🎙️ Teacher Voice Input (शिक्षक की आवाज)</h2>
            <span className="panel-badge green-badge">Hindi Input (हिंदी)</span>
          </div>

          <div className="mic-interaction-zone">
            <button
              type="button"
              className={`mic-hero-btn ${isListening ? "mic-listening" : ""}`}
              onClick={handleMicToggle}
              title={isListening ? "Listening... Click to stop" : "Click to Speak in Hindi"}
              aria-label="Toggle Microphone Input"
            >
              <span className="mic-icon">{isListening ? "⏹️" : "🎙️"}</span>
              <span className="mic-ripple"></span>
            </button>
            <div className="mic-status-label">
              {isListening ? (
                <span className="listening-text">
                  🔴 Recording teacher voice... Listening for Hindi speech
                </span>
              ) : (
                <span className="idle-text">
                  Tap microphone or select a quick classroom phrase below
                </span>
              )}
            </div>
          </div>

          {/* Hindi Text Input Area */}
          <div className="input-field-group">
            <label htmlFor="hindi-speech-text" className="field-label">
              शिक्षक द्वारा बोला गया वाक्य (Teacher Speech Text):
            </label>
            <textarea
              id="hindi-speech-text"
              className="styled-textarea"
              rows={3}
              value={hindiInput}
              onChange={(e) => setHindiInput(e.target.value)}
              placeholder="Type or speak a classroom instruction in Hindi..."
            />
          </div>

          {/* Quick Classroom Phrases Palette */}
          <div className="quick-phrases-palette">
            <label className="palette-label">⚡ Frequent Classroom Prompts (त्वरित निर्देश):</label>
            <div className="phrases-chip-list">
              {CLASSROOM_QUICK_PHRASES.map((phrase) => (
                <button
                  key={phrase.id}
                  type="button"
                  className={`phrase-chip ${activePhraseId === phrase.id ? "phrase-chip-active" : ""}`}
                  onClick={() => handleSelectQuickPhrase(phrase)}
                >
                  <span className="chip-category">{phrase.category}:</span>
                  <span className="chip-text">"{phrase.hindi.substring(0, 24)}..."</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Translated Tribal Speech Output */}
        <div className="workspace-panel">
          <div className="panel-header">
            <h2 className="panel-title">🔊 Translated Audio &amp; Script (मातृभाषा अनुवाद)</h2>
            <div className="panel-lang-selector-wrap">
              <select
                id="target-tribal-language"
                className="live-lang-dropdown"
                value={selectedLangCode}
                onChange={(e) => setSelectedLangCode(e.target.value)}
                aria-label="Select target tribal language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="translation-output-card">
            <div className="output-script-header">
              <span className="output-script-label">Indigenous Script:</span>
              <span className="script-badge-tag">{currentLang.script}</span>
            </div>

            {/* Native script display */}
            <div className="output-script-body">
              <p className="large-tribal-text font-ol-chiki">
                {translation.script}
              </p>
            </div>

            {/* Devanagari Transliteration */}
            <div className="transliteration-box">
              <span className="transliteration-label">देवनागरी लिपि में उच्चारण:</span>
              <p className="transliteration-text font-devanagari">
                {translation.devanagari}
              </p>
            </div>

            {/* Phonetic Pronunciation Guide */}
            <div className="phonetic-strip">
              <span className="phonetic-guide-label">Phonetic Guide:</span>
              <span className="phonetic-guide-val">"{translation.audioText}"</span>
            </div>

            {/* Audio Playback Control */}
            <div className="audio-actions-row">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                icon={<span>{isPlayingAudio ? "🔊 Playing..." : "▶️ Speak in Class"}</span>}
              >
                {isPlayingAudio ? "उच्चारण चल रहा है..." : `कक्षा में सुनाएं (${currentLang.name} Native Audio)`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveClassroom;

