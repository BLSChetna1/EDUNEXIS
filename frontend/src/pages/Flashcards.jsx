import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { MOCK_FLASHCARDS } from "../services/mockData";

export function Flashcards() {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  const categories = ["All", "Animals & Nature", "Trees & Flora", "Nature Elements", "Numbers (1-5)", "Family & Relations", "Classroom Objects"];

  const filteredCards =
    selectedCategory === "All"
      ? MOCK_FLASHCARDS
      : MOCK_FLASHCARDS.filter((c) => c.category === selectedCategory);

  const activeCard =
    filteredCards[currentCardIndex] || filteredCards[0] || MOCK_FLASHCARDS[0];

  const tribalWord = activeCard[selectedLang] || activeCard.sat;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlaySound = (e) => {
    e.stopPropagation();
    setIsPlayingSound(true);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1500);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="AI Visual Flashcards & Phonics"
        subtitle="Generate interactive visual bilingual flashcards with audio pronunciation and cultural context."
        badge={`Displaying: ${currentLang.name}`}
      />

      {/* Categories Bar */}
      <div className="flashcards-category-bar">
        <span className="category-bar-label">श्रेणी (Category):</span>
        <div className="category-scroll-strip">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill-btn ${selectedCategory === cat ? "cat-pill-active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Stage */}
      <div className="flashcard-stage-wrapper">
        <div className="card-counter-badge">
          Card {currentCardIndex + 1} of {filteredCards.length} • {activeCard.category}
        </div>

        {/* 3D Flip Card Container */}
        <div
          className={`flashcard-3d-scene ${isFlipped ? "card-is-flipped" : ""}`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFlip();
            }
          }}
          title="Click or press Enter to flip card"
        >
          <div className="flashcard-flipper">
            {/* Front Side: Hindi + Visual Illustration */}
            <div className="card-face card-front">
              <div className="card-face-header">
                <span className="face-tag">Front: Hindi (हिंदी)</span>
                <span className="flip-hint-badge">Click to Flip ↷</span>
              </div>

              <div className="card-visual-center">
                <div className="card-emoji-hero">{activeCard.emoji}</div>
                <h2 className="card-main-word font-devanagari">{activeCard.hindi}</h2>
                <p className="card-phonetic-sub font-devanagari">"{activeCard.phoneticHindi}"</p>
                <span className="card-english-sub">{activeCard.english}</span>
              </div>

              <div className="card-face-footer">
                <span className="footer-flip-instruction">
                  👉 Click to see the {currentLang.name} mother tongue word
                </span>
              </div>
            </div>

            {/* Back Side: Tribal Script + Audio */}
            <div className="card-face card-back">
              <div className="card-face-header">
                <span className="face-tag amber-tag">Back: {currentLang.name} ({currentLang.nativeName})</span>
                <span className="flip-hint-badge">Click to Flip ↶</span>
              </div>

              <div className="card-visual-center">
                <span className="back-emoji-small">{activeCard.emoji}</span>

                {/* Primary Indigenous Script */}
                <h2 className="card-tribal-word font-ol-chiki">
                  {tribalWord.script}
                </h2>

                {/* Devanagari Pronunciation */}
                <div className="card-devanagari-pill font-devanagari">
                  उच्चारण: <strong>{tribalWord.devanagari}</strong>
                </div>

                {/* Phonetic Latin text */}
                <p className="card-phonetic-latin">Phonetic: "{tribalWord.phonetic}"</p>

                {/* Cultural / Educational Context */}
                <div className="card-fact-box">
                  <span className="fact-icon">💡</span>
                  <span className="fact-text">{activeCard.fact}</span>
                </div>
              </div>

              <div className="card-face-footer">
                <button
                  type="button"
                  className="card-audio-btn"
                  onClick={handlePlaySound}
                  disabled={isPlayingSound}
                >
                  <span className="audio-icon">{isPlayingSound ? "🔊" : "▶️"}</span>
                  <span>{isPlayingSound ? "Speaking..." : "Play Native Audio"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flashcard-navigation-bar">
          <Button
            variant="secondary"
            onClick={handlePrev}
            icon={<span>←</span>}
            size="md"
          >
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={handleFlip}
            icon={<span>🔄</span>}
            size="md"
          >
            {isFlipped ? "Flip to Hindi" : "Flip to Mother Tongue"}
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            icon={<span>→</span>}
            iconPosition="right"
            size="md"
          >
            Next Card
          </Button>
        </div>
      </div>

      {/* Deck Grid View */}
      <div className="deck-grid-container">
        <h3 className="deck-grid-title">All Cards in this Deck ({filteredCards.length}):</h3>
        <div className="deck-thumbnails-grid">
          {filteredCards.map((card, idx) => (
            <div
              key={card.id}
              className={`deck-thumb-card ${currentCardIndex === idx ? "thumb-card-selected" : ""}`}
              onClick={() => {
                setCurrentCardIndex(idx);
                setIsFlipped(false);
              }}
            >
              <span className="thumb-emoji">{card.emoji}</span>
              <span className="thumb-hindi">{card.hindi}</span>
              <span className="thumb-tribal font-ol-chiki">
                {(card[selectedLang] || card.sat).script}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Integration Note */}
      <div className="backend-ready-notice">
        <div className="notice-icon">🎴</div>
        <div className="notice-content">
          <strong>Flashcards API Placeholder:</strong>
          <p>
            Connected to <code>GET /api/v1/flashcards</code>. Supports image generation and local SVG rendering for offline tablet learning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
