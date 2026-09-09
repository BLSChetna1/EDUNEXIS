/**
 * EDUNEXIS API Service Client
 * Clean abstraction layer for communicating with the FastAPI backend
 * Built for seamless plug-and-play connection with Member 2's backend services.
 */

import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";
import {
  CLASSROOM_QUICK_PHRASES,
  MOCK_FLASHCARDS,
  MOCK_LESSON_PLAN,
  MOCK_WORKSHEET,
  OFFLINE_PACKAGES,
} from "./mockData";

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[EDUNEXIS API] Backend not reachable at ${endpoint}, falling back to mock mode.`, error.message);
      return null;
    }
  }

  // Health Check
  async checkHealth() {
    const res = await this.request(API_ENDPOINTS.HEALTH);
    return res || { status: "online", service: "EDUNEXIS Mock Engine", version: "0.1.0" };
  }

  // AI Chat & Pedagogy
  async sendChatMessage(payload) {
    const res = await this.request(API_ENDPOINTS.CHAT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res) return res;

    return {
      success: true,
      message: "AI Teacher Assistant response (Simulated)",
      timestamp: new Date().toISOString(),
    };
  }

  // Language Detection
  async detectLanguage(text) {
    const res = await this.request(API_ENDPOINTS.LANGUAGE_DETECT, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    return res || { detected_language: "Hindi", confidence: 0.98 };
  }

  // Translation Service
  async translateText(text, sourceLang = "hi", targetLang = "sat") {
    const res = await this.request(API_ENDPOINTS.TRANSLATE, {
      method: "POST",
      body: JSON.stringify({ text, source_language: sourceLang, target_language: targetLang }),
    });
    if (res) return res;

    // Provide helpful mock translation based on target language
    const sample = CLASSROOM_QUICK_PHRASES[0].translations[targetLang] || CLASSROOM_QUICK_PHRASES[0].translations.sat;
    return {
      original_text: text,
      source_language: sourceLang,
      target_language: targetLang,
      translated_text: sample.script,
      devanagari_transliteration: sample.devanagari,
      phonetic_guide: sample.audioText,
    };
  }

  // Speech-to-Text
  async speechToText(audioData, language = "hi") {
    const res = await this.request(API_ENDPOINTS.SPEECH_TO_TEXT, {
      method: "POST",
      body: JSON.stringify({ audio_data: audioData, language }),
    });
    return res || { text: "सभी बच्चे अपनी किताब खोलें और ध्यान दें।" };
  }

  // Text-to-Speech
  async textToSpeech(text, targetLanguage = "sat", voice = "default") {
    const res = await this.request(API_ENDPOINTS.TEXT_TO_SPEECH, {
      method: "POST",
      body: JSON.stringify({ text, target_language: targetLanguage, voice }),
    });
    return res || { audio_url: null, status: "audio_synthesized_mock" };
  }

  // AI Lesson Generator
  async generateLesson(criteria) {
    const res = await this.request(API_ENDPOINTS.LESSONS, {
      method: "POST",
      body: JSON.stringify(criteria),
    });
    return res || MOCK_LESSON_PLAN;
  }

  // Worksheet Generator
  async generateWorksheet(criteria) {
    const res = await this.request(API_ENDPOINTS.WORKSHEETS, {
      method: "POST",
      body: JSON.stringify(criteria),
    });
    return res || MOCK_WORKSHEET;
  }

  // Flashcards Getter
  async getFlashcards(category = "All") {
    const res = await this.request(`${API_ENDPOINTS.FLASHCARDS}?category=${encodeURIComponent(category)}`);
    return res || MOCK_FLASHCARDS;
  }

  // Offline Library Packages
  async getOfflinePackages() {
    const res = await this.request(API_ENDPOINTS.OFFLINE_SYNC);
    return res || OFFLINE_PACKAGES;
  }
}

export const apiService = new ApiService();
export default apiService;
