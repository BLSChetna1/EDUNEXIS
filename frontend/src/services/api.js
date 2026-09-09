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
    const { timeoutMs, ...fetchOptions } = options;
    const controller = timeoutMs ? new AbortController() : null;
    const timeoutId = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const headers = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        ...(controller ? { signal: controller.signal } : {}),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      if (error.name === "AbortError") {
        throw new Error("The tutor took too long to respond. Please try again.");
      }
      throw error;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
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
      timeoutMs: 20000,
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
  speechToText(audioBase64, language = "auto", audioFormat = "wav") {
    return this.request(API_ENDPOINTS.SPEECH_TO_TEXT, {
      method: "POST",
      body: JSON.stringify({
        audio_base64: audioBase64,
        audio_format: audioFormat,
        language_code: language,
      }),
    });
  }

  // Text-to-Speech
  textToSpeech(text, targetLanguage, voiceGender = "female") {
    return this.request(API_ENDPOINTS.TEXT_TO_SPEECH, {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
        voice_gender: voiceGender,
      }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
