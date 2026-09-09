const ERROR_MESSAGES = {
  "not-allowed": "Microphone permission was denied. Allow microphone access and try again.",
  "service-not-allowed": "The browser speech service is unavailable. Try a supported browser.",
  "no-speech": "No clear speech was detected. Please try speaking again.",
  "audio-capture": "No microphone was found. Check your microphone and try again.",
  aborted: "Speech recognition was stopped before a transcript was captured.",
};

export class BrowserSpeechRecognizer {
  constructor(language = "en-IN", windowObject = typeof window === "undefined" ? {} : window) {
    this.language = language;
    this.windowObject = windowObject;
    this.recognition = null;
  }

  get isSupported() {
    return Boolean(this.windowObject.SpeechRecognition || this.windowObject.webkitSpeechRecognition);
  }

  recognize({ onInterimTranscript } = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Speech recognition is not supported in this browser."));
        return;
      }

      const SpeechRecognition = this.windowObject.SpeechRecognition || this.windowObject.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      this.recognition = recognition;
      recognition.lang = this.language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let combinedTranscript = "";
        let finalTranscript = "";
        for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const text = result[0]?.transcript || "";
          combinedTranscript += text;
          if (result.isFinal) {
            finalTranscript += text;
          }
        }
        if (onInterimTranscript) {
          onInterimTranscript(combinedTranscript.trim());
        }
        if (finalTranscript.trim()) {
          resolve(combinedTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        this.recognition = null;
        reject(new Error(ERROR_MESSAGES[event.error] || "Speech recognition failed. Please try again."));
      };

      recognition.onend = () => {
        this.recognition = null;
        resolve("");
      };

      recognition.start();
    });
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

export class BrowserSpeechSynthesizer {
  constructor(windowObject = typeof window === "undefined" ? {} : window) {
    this.windowObject = windowObject;
    this.activeCancel = null;
  }

  get isSupported() {
    return "speechSynthesis" in this.windowObject && "SpeechSynthesisUtterance" in this.windowObject;
  }

  speak(text, language = "en-IN") {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Text-to-speech is not supported in this browser."));
        return;
      }

      this.cancel();
      let cancelled = false;
      const utterance = new this.windowObject.SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onend = () => {
        this.activeCancel = null;
        resolve();
      };
      utterance.onerror = () => {
        this.activeCancel = null;
        if (cancelled) {
          resolve();
        } else {
          reject(new Error("Audio playback failed. Please try again."));
        }
      };
      this.activeCancel = () => {
        cancelled = true;
        this.windowObject.speechSynthesis.cancel();
        resolve();
      };
      this.windowObject.speechSynthesis.speak(utterance);
    });
  }

  cancel() {
    if (this.activeCancel) {
      const cancelActiveSpeech = this.activeCancel;
      this.activeCancel = null;
      cancelActiveSpeech();
    } else if (this.isSupported) {
      this.windowObject.speechSynthesis.cancel();
    }
  }
}

export function getSpeechLocale(languageCode) {
  return `${languageCode || "en"}-IN`;
}
