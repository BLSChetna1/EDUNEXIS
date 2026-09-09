/**
 * EDUNEXIS API Service Client
 * Clean abstraction layer for communicating with the FastAPI backend
 */

import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

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
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Health Check
  checkHealth() {
    return this.request(API_ENDPOINTS.HEALTH);
  }

  // AI Chat & Pedagogy
  sendChatMessage(payload) {
    return this.request(API_ENDPOINTS.CHAT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Language Detection
  detectLanguage(text) {
    return this.request(API_ENDPOINTS.LANGUAGE_DETECT, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  // Translation Service
  translateText(text, sourceLang, targetLang) {
    return this.request(API_ENDPOINTS.TRANSLATE, {
      method: "POST",
      body: JSON.stringify({ text, source_language: sourceLang, target_language: targetLang }),
    });
  }

  // Speech-to-Text
  speechToText(audioData, language) {
    return this.request(API_ENDPOINTS.SPEECH_TO_TEXT, {
      method: "POST",
      body: JSON.stringify({ audio_data: audioData, language }),
    });
  }

  // Text-to-Speech
  textToSpeech(text, targetLanguage, voice = "default") {
    return this.request(API_ENDPOINTS.TEXT_TO_SPEECH, {
      method: "POST",
      body: JSON.stringify({ text, target_language: targetLanguage, voice }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
