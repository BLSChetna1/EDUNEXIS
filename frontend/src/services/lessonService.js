/**
 * EDUNEXIS Lesson Service
 * Manages saved teacher lesson plans with local persistence (localStorage).
 * Structured for direct drop-in integration with the FastAPI GET/POST /api/v1/lessons endpoint.
 */

import { MOCK_LESSON_PLAN } from "./mockData";
import authService from "./authService";

const STORAGE_KEY_LESSONS = "edunexis_saved_lessons";

// Authentic starter lessons for Jharkhand tribal classrooms
const INITIAL_LESSONS = [
  {
    id: "lesson-sat-evs-01",
    teacherId: "JH-EDU-1048",
    title: "जंगल के पेड़ और हमारे मित्र (Forest Trees & Our Friends)",
    subject: "Environmental Studies (EVS)",
    grade: "Class 2",
    targetLanguage: "sat",
    targetLanguageName: "Santhali (ᱥᱟᱱᱛᱟᱲᱤ)",
    duration: "40 Minutes",
    flnCompetency: "FLN-EVS-02: Local flora identification and vocabulary building in mother tongue",
    summary: "Bilingual nature exploration lesson introducing local forest trees, leaves, and indigenous folklore.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    learningObjectives: MOCK_LESSON_PLAN.learningObjectives,
    steps: MOCK_LESSON_PLAN.steps,
    vocabularyBridge: MOCK_LESSON_PLAN.vocabularyBridge,
    teacherInstructions: "Take students near the campus garden. Use actual Sal (ᱥᱟᱨᱡᱚᱢ) and Mahua leaves to anchor the mother tongue words before moving to the state curriculum textbook.",
  },
  {
    id: "lesson-hoc-math-02",
    teacherId: "JH-EDU-1048",
    title: "बुनियादी संख्या ज्ञान १ से १० (Counting 1 to 10 in Ho)",
    subject: "Mathematics / Ganit",
    grade: "Class 1",
    targetLanguage: "hoc",
    targetLanguageName: "Ho (ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)",
    duration: "35 Minutes",
    flnCompetency: "FLN-NUM-01: One-to-one correspondence and number naming in mother tongue",
    summary: "Foundational numeracy activity utilizing tamarind seeds and pebbles to teach counting 1-10 in Ho.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    learningObjectives: [
      "Count sets of 1 to 10 objects using concrete tribal counting rhymes.",
      "Match spoken Ho numerals (ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱩᱯᱩᱱ, ᱢᱚᱬᱮ) with Hindi numbers.",
      "Trace basic numeral shapes using sand trays or slate chalk.",
    ],
    steps: [
      {
        step: 1,
        name: "Hands-on Gathering (10 mins)",
        teacherAction: "Teacher places 5 tamarind seeds on each desk and demonstrates counting: 'एक, दो, तीन... अब हो भाषा में गिनेंगे: ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ...'.",
        studentAction: "Children touch each seed and repeat the Ho numerals aloud in unison.",
      },
      {
        step: 2,
        name: "Pair Matching Game (15 mins)",
        teacherAction: "Teacher holds up number cards and asks: 'ये तीन हैं, हो में क्या कहेंगे?'.",
        studentAction: "Students hold up 3 fingers and call out: 'ᱯᱮ! (पे!)'.",
      },
      {
        step: 3,
        name: "Rhythmic Rhyme & Closing (10 mins)",
        teacherAction: "Lead the Ho number song with hand-clapping: 'ᱢᱤᱫ-ᱵᱟᱨ-ᱯᱮ, ᱦᱟᱹᱛᱤ ᱫᱟᱨᱩ ᱨᱮ...'.",
        studentAction: "Children clap along and demonstrate 1-to-5 finger counts.",
      },
    ],
    vocabularyBridge: [
      { hindi: "एक (1)", tribal: "ᱢᱤᱫ (मिद)", english: "One (1)" },
      { hindi: "दो (2)", tribal: "ᱵᱟᱨ (बार)", english: "Two (2)" },
      { hindi: "तीन (3)", tribal: "ᱯᱮ (पे)", english: "Three (3)" },
      { hindi: "चार (4)", tribal: "ᱩᱯᱩᱱ (उपुन)", english: "Four (4)" },
      { hindi: "पाँच (5)", tribal: "ᱢᱚᱬᱮᱭᱟ (मोणेया)", english: "Five (5)" },
    ],
    teacherInstructions: "Use concrete local objects like neem sticks, pebbles, or tamarind seeds so children connect abstract numbers to tangible items.",
  },
  {
    id: "lesson-unr-evs-03",
    teacherId: "JH-EDU-1048",
    title: "हमारा परिवेश और जल संरक्षण (Water & Village Life in Mundari)",
    subject: "Environmental Studies (EVS)",
    grade: "Class 3",
    targetLanguage: "unr",
    targetLanguageName: "Mundari (ᱢᱩᱱᱰᱟᱨᱤ)",
    duration: "45 Minutes",
    flnCompetency: "FLN-EVS-05: Understanding local water sources and traditional village conservation",
    summary: "Explores village water bodies (Dari, Bandh, Joria) and traditional water conservation in Mundari culture.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    learningObjectives: [
      "Identify natural water sources in Jharkhand villages in Mundari.",
      "Explain why keeping drinking water clean is essential for village health.",
      "Connect indigenous traditional knowledge with the primary EVS textbook.",
    ],
    steps: [
      {
        step: 1,
        name: "Village Water Map (15 mins)",
        teacherAction: "Draw a simple village map on the blackboard showing a well (ᱫᱟᱹᱨᱤ) and stream (ᱜᱟᱰᱟ). Ask in Hindi: 'गांव में पीने का पानी कहां से आता है?'.",
        studentAction: "Students point to their village springs and reply: 'ᱫᱟᱹᱨᱤ ᱮᱛᱮ ᱫᱟᱜ ᱞᱮ ᱟᱹᱜᱩᱭᱟ!'.",
      },
      {
        step: 2,
        name: "Hygiene & Storage Concept (15 mins)",
        teacherAction: "Demonstrate covering a water pitcher. Introduce the bilingual concept of safe drinking water.",
        studentAction: "Students explain how water is filtered at home using a clean cloth.",
      },
      {
        step: 3,
        name: "Interactive Worksheet Review (15 mins)",
        teacherAction: "Distribute EDUNEXIS bilingual worksheet for water source matching.",
        studentAction: "Draw lines matching Hindi terms to Mundari scripts.",
      },
    ],
    vocabularyBridge: [
      { hindi: "पानी", tribal: "ᱫᱟᱜ (दाग)", english: "Water" },
      { hindi: "नदी / नाला", tribal: "ᱜᱟᱰᱟ (गाड़ा)", english: "River / Stream" },
      { hindi: "कुआं / चोआ", tribal: "ᱫᱟᱹᱨᱤ (दạरी)", english: "Natural Spring / Well" },
      { hindi: "बारिश", tribal: "ᱜᱟᱢᱟ (गामा)", english: "Rain" },
      { hindi: "साफ पानी", tribal: "ᱥᱟᱯᱷᱟ ᱫᱟᱜ (साफा दाग)", english: "Clean Water" },
    ],
    teacherInstructions: "Encourage children to share indigenous knowledge from village elders regarding how sacred groves (Sarna Sthal) protect village spring water.",
  },
];

class LessonService {
  /**
   * Read raw lessons array from localStorage.
   * If empty on first boot, seeds default authentic lessons.
   */
  _readStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LESSONS);
      if (data) {
        return JSON.parse(data);
      }
      // Seed initial lessons
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(INITIAL_LESSONS));
      return INITIAL_LESSONS;
    } catch (err) {
      console.error("[LessonService] Error accessing localStorage", err);
      return INITIAL_LESSONS;
    }
  }

  /**
   * Write lessons array to localStorage
   */
  _writeStorage(lessons) {
    try {
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons));
    } catch (err) {
      console.error("[LessonService] Error writing to localStorage", err);
    }
  }

  /**
   * Get lessons with optional filtering & sorting
   */
  getLessons(filters = {}) {
    const { search = "", subject = "All", grade = "All", language = "All" } = filters;
    let list = this._readStorage();

    // Text search (title, summary, competency, subject)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.summary && l.summary.toLowerCase().includes(q)) ||
          (l.flnCompetency && l.flnCompetency.toLowerCase().includes(q)) ||
          (l.subject && l.subject.toLowerCase().includes(q))
      );
    }

    // Subject filter
    if (subject && subject !== "All") {
      list = list.filter((l) => l.subject && l.subject.toLowerCase().includes(subject.toLowerCase()));
    }

    // Grade filter
    if (grade && grade !== "All") {
      list = list.filter((l) => l.grade && l.grade.toLowerCase().includes(grade.toLowerCase()));
    }

    // Language filter
    if (language && language !== "All") {
      list = list.filter(
        (l) =>
          (l.targetLanguage && l.targetLanguage.toLowerCase() === language.toLowerCase()) ||
          (l.targetLanguageName && l.targetLanguageName.toLowerCase().includes(language.toLowerCase()))
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }

  /**
   * Get single lesson by ID
   */
  getLessonById(id) {
    const list = this._readStorage();
    return list.find((l) => l.id === id) || null;
  }

  /**
   * Save a lesson (creates new or updates existing)
   */
  saveLesson(lessonData) {
    const list = this._readStorage();
    const currentTeacher = authService.getCurrentTeacher();
    const now = new Date().toISOString();

    const lessonId = lessonData.id || `lesson_${Date.now()}`;
    const existingIndex = list.findIndex((l) => l.id === lessonId);

    const formattedLesson = {
      ...lessonData,
      id: lessonId,
      teacherId: lessonData.teacherId || currentTeacher?.teacherId || "JH-EDU-1048",
      createdAt: existingIndex !== -1 ? list[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex !== -1) {
      list[existingIndex] = formattedLesson;
    } else {
      list.unshift(formattedLesson);
    }

    this._writeStorage(list);
    return formattedLesson;
  }

  /**
   * Update existing lesson
   */
  updateLesson(id, updates) {
    const list = this._readStorage();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    this._writeStorage(list);
    return updated;
  }

  /**
   * Delete lesson by ID
   */
  deleteLesson(id) {
    const list = this._readStorage();
    const filtered = list.filter((l) => l.id !== id);
    this._writeStorage(filtered);
    return filtered.length < list.length;
  }
}

export const lessonService = new LessonService();
export default lessonService;
