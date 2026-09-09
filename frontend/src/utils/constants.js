/**
 * EDUNEXIS Application Constants
 * Standardized configuration defaults and API route paths
 */

export const APP_NAME = "EDUNEXIS";
export const APP_TAGLINE = "Smart Multilingual AI Adaptive Learning Platform";
export const SIH_EDITION = "Smart India Hackathon 2026";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  HEALTH: "/health",
  CHAT: "/api/v1/chat",
  LANGUAGE_DETECT: "/api/v1/language/detect",
  TRANSLATE: "/api/v1/translate",
  SPEECH_TO_TEXT: "/api/v1/speech-to-text",
  TEXT_TO_SPEECH: "/api/v1/text-to-speech",
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
];
