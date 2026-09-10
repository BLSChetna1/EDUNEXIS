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

export const API_BASE_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

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

export const TRIBAL_LANGUAGES = [
  {
    code: "sat",
    name: "Santhali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ / संताली",
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
    name: "Kudukh",
    nativeName: "कुड़ुख़ / ᱛᱚᱞᱚᱝ ᱥᱤᱠᱤ",
    script: "Tolong Siki / Devanagari",
    speakers: "~2.0M Speakers",
    region: "Gumla, Lohardaga, Latehar",
    badgeColor: "#7B2CBF",
  },
  {
    code: "kha",
    name: "Khadia",
    nativeName: "खड़िया / Khadia",
    script: "Devanagari",
    speakers: "~0.3M Speakers",
    region: "Simdega, Gumla, Ranchi",
    badgeColor: "#D97706",
  },
];

export const SUPPORTED_LANGUAGES = TRIBAL_LANGUAGES;
export const TRIBAL_LANGUAGE_NAMES = TRIBAL_LANGUAGES.map((l) => l.name);

export const AVAILABLE_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
];

export const PRIMARY_GRADES = [
  { id: 1, label: "Class 1", focus: "Foundational Oral Language & Phonemic Awareness" },
  { id: 2, label: "Class 2", focus: "Basic Vocabulary, Word Blends & Number Sense" },
  { id: 3, label: "Class 3", focus: "Bilingual Sentence Reading & Environmental Concepts" },
  { id: 4, label: "Class 4", focus: "Guided Composition & Problem Solving" },
  { id: 5, label: "Class 5", focus: "Bridge Transition to Standard Hindi Curriculum" },
];

export const SUBJECTS = [
  "Santhali",
  "Ho",
  "Mundari",
  "Kudukh",
  "Khadia",
  "Hindi",
  "English",
  "Maths",
  "EVS",
];

export const AVAILABLE_SUBJECTS = SUBJECTS;

export const FLASHCARD_SUBJECTS = SUBJECTS;

export const WORKSHEET_DIFFICULTIES = [
  { id: "easy", label: "Easy (सरल)" },
  { id: "medium", label: "Medium (मध्यम)" },
  { id: "hard", label: "Hard (कठिन)" },
];

export const WORKSHEET_EXERCISE_TYPES = [
  { id: "multiple_choice", label: "Multiple Choice Questions", hindi: "बहुविकल्पीय प्रश्न (MCQ)", icon: "🔘", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "fill_blanks", label: "Fill in the Blanks", hindi: "रिक्त स्थान भरें", icon: "✏️", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "match_following", label: "Match the Following", hindi: "उचित मिलान करें", icon: "🔗", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "true_false", label: "True / False", hindi: "सही या गलत", icon: "⚖️", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "choose_correct_picture", label: "Choose the Correct Picture", hindi: "सही चित्र चुनें", icon: "🖼️", recommendedClasses: ["Class 1", "Class 2", "Class 3"] },
  { id: "picture_based", label: "Picture-Based Questions", hindi: "चित्र आधारित प्रश्न", icon: "🎨", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4"] },
  { id: "identify_name", label: "Identify / Name", hindi: "पहचानें और नाम लिखें", icon: "🔍", recommendedClasses: ["Class 1", "Class 2", "Class 3"] },
  { id: "arrange_order", label: "Arrange in Order", hindi: "क्रम में सजाएं", icon: "🔢", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "odd_one_out", label: "Odd One Out", hindi: "अलग / बेमेल चुनें", icon: "🧩", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4"] },
  { id: "counting_numbers", label: "Counting / Number Questions", hindi: "गिनती एवं संख्या अभ्यास", icon: "🖐️", recommendedClasses: ["Class 1", "Class 2"] },
  { id: "basic_calculation", label: "Basic Calculation", hindi: "मूल अंकगणित (जोड़ / घटाव / गुणा / भाग)", icon: "➕", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "word_problems", label: "Word Problems", hindi: "इबारती / व्यावहारिक प्रश्न", icon: "📐", recommendedClasses: ["Class 3", "Class 4", "Class 5"] },
  { id: "short_answer", label: "Short Answer", hindi: "लघु उत्तरीय प्रश्न", icon: "📝", recommendedClasses: ["Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "reading_comprehension", label: "Reading Comprehension", hindi: "पठन बोध (अनुच्छेद एवं प्रश्न)", icon: "📖", recommendedClasses: ["Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "grammar_exercises", label: "Grammar Exercises", hindi: "व्याकरण अभ्यास", icon: "🔤", recommendedClasses: ["Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "vocabulary_exercises", label: "Vocabulary Exercises", hindi: "शब्द ज्ञान / शब्दावली", icon: "📚", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "sequencing_story", label: "Sequencing a Story", hindi: "कहानी का कालक्रम", icon: "📜", recommendedClasses: ["Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "reasoning_logic", label: "Reasoning / Logic", hindi: "तर्क एवं समझ आधारित प्रश्न", icon: "💡", recommendedClasses: ["Class 3", "Class 4", "Class 5"] },
  { id: "real_life_application", label: "Real-Life / Application Questions", hindi: "दैनिक जीवन अनुप्रयोग", icon: "🌾", recommendedClasses: ["Class 3", "Class 4", "Class 5"] },
  { id: "activity_project", label: "Activity / Project Questions", hindi: "गतिविधि एवं प्रोजेक्ट कार्य", icon: "✂️", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { id: "mixed_worksheet", label: "Mixed Worksheet", hindi: "मिश्रित अभ्यास पत्र (Comprehensive Exam)", icon: "📑", recommendedClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
];

export const TEACHER_AVATARS = [
  // 5 Male / Human Avatars
  { id: "male-1", emoji: "👨‍🏫", label: "Primary Teacher (Male)", category: "Male / Human" },
  { id: "male-2", emoji: "👨‍💼", label: "Academic Coordinator", category: "Male / Human" },
  { id: "male-3", emoji: "👨‍🎓", label: "Language Scholar", category: "Male / Human" },
  { id: "male-4", emoji: "👨🏽‍🏫", label: "Gramin Shikshak", category: "Male / Human" },
  { id: "male-5", emoji: "🧑‍🏫", label: "Classroom Instructor", category: "Male / Human" },

  // 5 Female / Human Avatars
  { id: "female-1", emoji: "👩‍🏫", label: "Primary Educator (Female)", category: "Female / Human" },
  { id: "female-2", emoji: "👩‍💼", label: "Headmistress / Mentor", category: "Female / Human" },
  { id: "female-3", emoji: "👩‍🎓", label: "Vernacular Pedagogy Lead", category: "Female / Human" },
  { id: "female-4", emoji: "👩🏽‍🏫", label: "Gramin Shikshika", category: "Female / Human" },
  { id: "female-5", emoji: "🧕", label: "Community Teacher", category: "Female / Human" },

  // 5 Cute Non-Human Avatars
  { id: "nonhuman-1", emoji: "⭐", label: "Bright Star", category: "Cute Non-Human" },
  { id: "nonhuman-2", emoji: "☀️", label: "Morning Sun", category: "Cute Non-Human" },
  { id: "nonhuman-3", emoji: "☁️", label: "Rain Cloud", category: "Cute Non-Human" },
  { id: "nonhuman-4", emoji: "🐱", label: "Friendly Cat", category: "Cute Non-Human" },
  { id: "nonhuman-5", emoji: "🌱", label: "Green Sprout", category: "Cute Non-Human" },
];

export const DEMO_TEACHER = {
  name: "Sunita Murmu",
  role: "Primary Assistant Teacher",
  school: "Rajkiya Utkramit Prathmik Vidyalaya",
  district: "Khunti, Jharkhand",
  assignedGrades: "Class 1, Class 2, Class 3",
  classesTaught: ["Class 1", "Class 2", "Class 3"],
  nativeLanguage: "Hindi",
  targetLanguage: "sat",
  avatar: "👩‍🏫",
};

