/**
 * EDUNEXIS Application Constants
 * AI-Powered Vernacular Pedagogy & Real-Time Translation Platform
 */

export const APP_NAME = "EDUNEXIS";
export const APP_TAGLINE = "AI-Powered Vernacular Learning for Every Classroom";
export const APP_MISSION = "Teach Every Child in Their Mother Tongue";
export const APP_SUBTITLE = "AI-Powered Vernacular Education";
export const PLATFORM_EDITION = "Jharkhand Primary Education Mission";
export const TARGET_REGION = "Jharkhand Primary Education Mission";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const API_ENDPOINTS = {
  HEALTH: "/health",
  CHAT: "/api/v1/chat",
  LANGUAGE_DETECT: "/api/v1/language/detect",
  TRANSLATE: "/api/v1/translate",
  SPEECH_TO_TEXT: "/api/v1/speech-to-text",
  TEXT_TO_SPEECH: "/api/v1/text-to-speech",
  LESSONS: "/api/v1/lessons",
  WORKSHEETS: "/api/v1/worksheets",
  FLASHCARDS: "/api/v1/flashcards",
  OFFLINE_SYNC: "/api/v1/offline-sync",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LIVE_CLASSROOM: "/live-classroom",
  TRANSLATE: "/translate",
  LESSON_GENERATOR: "/lesson-generator",
  WORKSHEET_GENERATOR: "/worksheet-generator",
  FLASHCARDS: "/flashcards",
  OFFLINE_LIBRARY: "/offline-library",
  MY_LESSONS: "/my-lessons",
  LESSON_DETAIL: "/my-lessons/:lessonId",
  STUDENT_LOGIN: "/student-login",
  STUDENT_DASHBOARD: "/student-dashboard",
  STUDENT_SYLLABUS: "/student-syllabus",
  STUDENT_LEARNING: "/student-learning/:topicId",
  STUDENT_AI_ASSISTANT: "/student-ai-assistant",
};

export const JHARKHAND_DISTRICTS = [
  "Khunti",
  "West Singhbhum (Chaibasa)",
  "East Singhbhum (Jamshedpur)",
  "Ranchi",
  "Gumla",
  "Simdega",
  "Latehar",
  "Lohardaga",
  "Dumka",
  "Deoghar",
  "Godda",
  "Jamtara",
  "Pakur",
  "Sahibganj",
  "Saraikela Kharsawan",
  "Bokaro",
  "Dhanbad",
  "Giridih",
  "Hazaribagh",
  "Ramgarh",
  "Chatra",
  "Koderma",
  "Palamu",
  "Garhwa",
];

export const SUPPORTED_LANGUAGES = [
  {
    code: "sat",
    name: "Santhali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ / संथाली",
    script: "Ol Chiki / Devanagari",
    speakers: "~7.6M Speakers",
    region: "Santhal Pargana & Chota Nagpur",
    badgeColor: "#2D6A4F",
  },
  {
    code: "hoc",
    name: "Ho",
    nativeName: "ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ / हो",
    script: "Warang Chiti / Devanagari",
    speakers: "~1.4M Speakers",
    region: "Kolhan Division, West Singhbhum",
    badgeColor: "#C85A32",
  },
  {
    code: "unr",
    name: "Mundari",
    nativeName: "ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी",
    script: "Bani Hisir / Devanagari",
    speakers: "~1.1M Speakers",
    region: "Ranchi, Khunti, Simdega",
    badgeColor: "#007791",
  },
  {
    code: "kru",
    name: "Kurukh (Oraon)",
    nativeName: "कुड़ुख़ / ᱛᱚᱞᱚᱝ ᱥᱤᱠᱤ",
    script: "Tolong Siki / Devanagari",
    speakers: "~2.0M Speakers",
    region: "Gumla, Lohardaga, Latehar",
    badgeColor: "#7B2CBF",
  },
];

export const PRIMARY_GRADES = [
  { id: 1, label: "Class 1 (Balvatika - Grade 1)", focus: "Foundational Oral Language & Phonemic Awareness" },
  { id: 2, label: "Class 2", focus: "Basic Vocabulary, Word Blends & Number Sense" },
  { id: 3, label: "Class 3", focus: "Bilingual Sentence Reading & Environmental Concepts" },
  { id: 4, label: "Class 4", focus: "Guided Composition & Problem Solving" },
  { id: 5, label: "Class 5", focus: "Bridge Transition to Standard Hindi Curriculum" },
];

export const AVAILABLE_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
];

export const DEMO_TEACHER = {
  name: "Sunita Murmu",
  role: "Primary Assistant Teacher",
  school: "Rajkiya Utkramit Prathmik Vidyalaya",
  district: "Khunti, Jharkhand",
  assignedGrades: "Class 1 to 3",
  classesTaught: ["Class 1", "Class 2", "Class 3"],
  nativeLanguage: "Hindi",
  targetLanguage: "sat",
  avatar: "👩‍🏫",
};

export const STUDENT_SECTIONS = ["A", "B", "C", "Other"];

export const DEMO_STUDENT = {
  id: "JH-STU-3014",
  name: "Asha Murmu",
  schoolName: "Rajkiya Prathmik Vidyalaya, Torpa",
  class: "Class 3",
  section: "A",
  rollNumber: "14",
  contactNumber: "+91 ******3210", // Masked for privacy
  preferredLanguage: "sat", // Santhali
  avatar: "👧",
  isDemo: true,
};
