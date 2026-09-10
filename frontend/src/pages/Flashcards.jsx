import React, { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import {
  SUPPORTED_LANGUAGES,
  AVAILABLE_CLASSES,
  FLASHCARD_SUBJECTS,
} from "../utils/constants";
import { MOCK_FLASHCARDS } from "../services/mockData";

// Curriculum-mapped flashcards database across classes, subjects & tribal languages
const CURRICULUM_FLASHCARDS = {
  "Class 1": {
    "Maths": [
      {
        id: "c1-m-1",
        topic: "Counting 1 to 5 (गिनती १ से ५)",
        emoji: "🖐️",
        hindi: "पाँच (संख्या ५)",
        phoneticHindi: "Paanch",
        english: "Five (Number 5)",
        sat: { script: "ᱢᱚᱬᱮ (᱕)", devanagari: "मोणे (५)", phonetic: "Mone" },
        hoc: { script: "ᱢᱚᱬᱮᱭᱟ (᱕)", devanagari: "मोणेया (५)", phonetic: "Moneya" },
        unr: { script: "ᱢᱚᱬᱮ (᱕)", devanagari: "मोणे (५)", phonetic: "Mone" },
        kru: { script: "ᱢᱚᱬᱮ", devanagari: "पंचे (५)", phonetic: "Panche" },
        kha: { script: "ᱢᱚᱬᱮ", devanagari: "मोलोय (५)", phonetic: "Moloy" },
        fact: "बुनियादी संख्या ज्ञान (FLN Competency 1 - Number Sense)",
      },
      {
        id: "c1-m-2",
        topic: "Counting 1 to 5",
        emoji: "☝️",
        hindi: "एक (संख्या १)",
        phoneticHindi: "Ek",
        english: "One (Number 1)",
        sat: { script: "ᱢᱤᱫ (᱑)", devanagari: "मिद (१)", phonetic: "Mid" },
        hoc: { script: "ᱢᱤᱭᱟᱹᱫᱽ (᱑)", devanagari: "मीयद (१)", phonetic: "Miyad" },
        unr: { script: "ᱢᱤᱭᱟᱹᱫᱽ (᱑)", devanagari: "मीयद (१)", phonetic: "Miyad" },
        kru: { script: "ᱢᱤᱫ", devanagari: "ओंद (१)", phonetic: "Ond" },
        kha: { script: "ᱢᱤᱫ", devanagari: "मयंग (१)", phonetic: "Mayang" },
        fact: "गिनती की पहली सीढ़ी — एक वस्तु की पहचान",
      },
    ],
    "EVS": [
      {
        id: "c1-e-1",
        topic: "Flora & Nature (पेड़ और प्रकृति)",
        emoji: "🌳",
        hindi: "साल का पेड़ (सखुआ)",
        phoneticHindi: "Saal ka ped",
        english: "Sal Tree",
        sat: { script: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ", devanagari: "सारजोम दारे", phonetic: "Sarjom Dare" },
        hoc: { script: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱩ", devanagari: "सारजोम दारू", phonetic: "Sarjom Daru" },
        unr: { script: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱩ", devanagari: "सारजोम दारू", phonetic: "Sarjom Daru" },
        kru: { script: "ᱥᱟᱨᱡᱚᱢ", devanagari: "सखुआ / मन्न", phonetic: "Mann" },
        kha: { script: "ᱥᱟᱨᱡᱚᱢ", devanagari: "सखुआ / दारू", phonetic: "Daru" },
        fact: "झारखंड का पवित्र वृक्ष — सरहुल पर्व का केंद्र",
      },
      {
        id: "c1-e-2",
        topic: "Birds Around Us (हमारे पक्षी)",
        emoji: "🐦",
        hindi: "चिड़िया / पक्षी",
        phoneticHindi: "Chidiya / Pakshi",
        english: "Bird",
        sat: { script: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene" },
        hoc: { script: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene" },
        unr: { script: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene" },
        kru: { script: "ᱪᱮᱬᱮ", devanagari: "ओड़ो / खदरा", phonetic: "Odo" },
        kha: { script: "ᱪᱮᱬᱮ", devanagari: "चोड़े (Chode)", phonetic: "Chode" },
        fact: "प्राकृतिक परिवेश और पक्षियों की पहचान",
      },
    ],
    "Santhali": [
      {
        id: "c1-sat-1",
        topic: "Phonemic Sounds & Alphabets (वर्णमाला ध्वनियां)",
        emoji: "📚",
        hindi: "किताब / पुस्तक",
        phoneticHindi: "Kitaab / Pustak",
        english: "Book",
        sat: { script: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी", phonetic: "Puthi" },
        hoc: { script: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी", phonetic: "Puthi" },
        unr: { script: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी", phonetic: "Puthi" },
        kru: { script: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी", phonetic: "Puthi" },
        kha: { script: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी", phonetic: "Puthi" },
        fact: "कक्षा में सीखने की मुख्य साथी सामग्री",
      },
      {
        id: "c1-sat-2",
        topic: "Home & Relations (परिवार एवं घर)",
        emoji: "🏡",
        hindi: "घर / आवास",
        phoneticHindi: "Ghar",
        english: "Home / House",
        sat: { script: "ᱚᱲᱟᱜ", devanagari: "ओड़ाग", phonetic: "Orag" },
        hoc: { script: "ᱚᱲᱟᱜ", devanagari: "ओड़ाग", phonetic: "Orag" },
        unr: { script: "ᱚᱲᱟᱜ", devanagari: "ओड़ाग", phonetic: "Orag" },
        kru: { script: "ᱚᱲᱟᱜ", devanagari: "एड़पा (Erpa)", phonetic: "Erpa" },
        kha: { script: "ᱚᱲᱟᱜ", devanagari: "ओड़ाग", phonetic: "Orag" },
        fact: "पारिवारिक परिवेश और सुरक्षा का स्थान",
      },
    ],
  },
};

export function Flashcards() {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");
  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [selectedSubject, setSelectedSubject] = useState(FLASHCARD_SUBJECTS[0]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  // Derive active deck based on selected class, subject, and fallbacks
  const activeDeck = useMemo(() => {
    const classData = CURRICULUM_FLASHCARDS[selectedClass];
    if (classData && classData[selectedSubject] && classData[selectedSubject].length > 0) {
      return classData[selectedSubject];
    }
    // Search any matching subject in class
    if (classData) {
      const firstAvailable = Object.values(classData)[0];
      if (firstAvailable && firstAvailable.length > 0) return firstAvailable;
    }
    // Fallback to default mock flashcards
    return MOCK_FLASHCARDS;
  }, [selectedClass, selectedSubject]);

  const activeCard = activeDeck[currentCardIndex] || activeDeck[0] || MOCK_FLASHCARDS[0];

  const tribalWord =
    activeCard[selectedLang] ||
    activeCard.sat || {
      script: activeCard.hindi,
      devanagari: activeCard.hindi,
      phonetic: activeCard.phoneticHindi,
    };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlaySound = (e) => {
    e.stopPropagation();
    setIsPlayingSound(true);
    if ("speechSynthesis" in window && tribalWord.devanagari) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(tribalWord.devanagari);
        utterance.lang = "hi-IN";
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlayingSound(false);
        utterance.onerror = () => setIsPlayingSound(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setIsPlayingSound(false), 1500);
      }
    } else {
      setTimeout(() => {
        setIsPlayingSound(false);
      }, 1500);
    }
  };

  return (
    <div className="feature-page-container">
      {/* Top Header with Dynamic Language Selector */}
      <div className="flashcards-top-header">
        <PageHeader
          title="AI Visual Flashcards & Phonics"
          subtitle="Generate interactive visual bilingual flashcards mapped to class syllabus with native audio pronunciation."
        />

        {/* Header Language Dropdown Controls */}
        <div className="flashcard-lang-header-control">
          <label htmlFor="flashcard-lang-select" className="lang-control-label">
            🗣️ Mother Tongue:
          </label>
          <select
            id="flashcard-lang-select"
            className="flashcard-header-lang-select"
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              setIsFlipped(false);
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName.split("/")[0].trim()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class & Subject Filter Bar */}
      <div className="flashcards-curriculum-bar">
        {/* Class Selector */}
        <div className="curriculum-selector-group">
          <label htmlFor="fc-class" className="curriculum-label">कक्षा (Class):</label>
          <div className="class-pills-row">
            {AVAILABLE_CLASSES.map((cls) => (
              <button
                key={cls}
                type="button"
                className={`class-pill-btn ${selectedClass === cls ? "class-pill-active" : ""}`}
                onClick={() => {
                  setSelectedClass(cls);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selector */}
        <div className="curriculum-selector-group">
          <label htmlFor="fc-subject" className="curriculum-label">विषय (Subject):</label>
          <select
            id="fc-subject"
            className="styled-select subject-select-box"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
          >
            {FLASHCARD_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      <div className="flashcard-stage-wrapper">
        <div className="card-counter-badge">
          Card {currentCardIndex + 1} of {activeDeck.length} • {selectedClass} • {selectedSubject} • {currentLang.name}
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
                <span className="face-tag amber-tag">Back: {currentLang.name}</span>
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
                  <span>{isPlayingSound ? "उच्चारण चल रहा है..." : `Play ${currentLang.name} Audio`}</span>
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
            {isFlipped ? "Flip to Hindi" : `Flip to ${currentLang.name}`}
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
        <h3 className="deck-grid-title">All Cards in this Deck ({activeDeck.length}):</h3>
        <div className="deck-thumbnails-grid">
          {activeDeck.map((card, idx) => (
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
                {(card[selectedLang] || card.sat)?.script || card.hindi}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
