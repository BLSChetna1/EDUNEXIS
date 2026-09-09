import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { CLASSROOM_QUICK_PHRASES } from "../services/mockData";

export function LiveClassroom() {
  const { user } = useAuth();
  const currentLanguageCode = user?.targetLanguage || "sat";
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguageCode) ||
    SUPPORTED_LANGUAGES[0];

  const [isListening, setIsListening] = useState(false);
  const [hindiInput, setHindiInput] = useState("सभी बच्चे बैठ जाएं और अपनी किताब खोलें।");
  const [activePhraseId, setActivePhraseId] = useState("p1");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active translation lookup
  const activeSample =
    CLASSROOM_QUICK_PHRASES.find((p) => p.id === activePhraseId) ||
    CLASSROOM_QUICK_PHRASES[0];

  const translation =
    activeSample.translations[currentLanguageCode] ||
    activeSample.translations.sat;

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
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2000);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Live Classroom Voice Assistant"
        subtitle="Real-time Hindi-to-tribal-language speech translation bridge for interactive classroom communication."
        badge={`Active Language: ${currentLang.name} (${currentLang.script.split("/")[0]})`}
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
            <h2 className="panel-title">🔊 Translated Audio & Script (मातृभाषा अनुवाद)</h2>
            <span className="panel-badge amber-badge">
              {currentLang.name} ({currentLang.nativeName})
            </span>
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
                {isPlayingAudio ? "उच्चारण चल रहा है..." : "कक्षा में सुनाएं (Play Native Audio)"}
              </Button>
            </div>
          </div>

          {/* Integration readiness card */}
          <div className="backend-ready-notice">
            <div className="notice-icon">🔌</div>
            <div className="notice-content">
              <strong>API Integration Placeholder:</strong>
              <p>
                Connected to <code>apiService.speechToText</code> &amp; <code>apiService.textToSpeech</code>.
                Ready for Bhashini Indic STT / TTS endpoints provided by Member 4.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveClassroom;
