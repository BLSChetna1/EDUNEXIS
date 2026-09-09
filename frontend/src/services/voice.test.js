import { describe, expect, it, vi } from "vitest";
import { BrowserSpeechRecognizer, BrowserSpeechSynthesizer } from "./voice";

function createRecognitionWindow() {
  class FakeRecognition {
    start() {
      this.started = true;
    }

    stop() {
      this.stopped = true;
      this.onend?.();
    }
  }

  return { SpeechRecognition: FakeRecognition };
}

describe("BrowserSpeechRecognizer", () => {
  it("reports interim text and resolves the final transcript", async () => {
    const browser = createRecognitionWindow();
    const recognizer = new BrowserSpeechRecognizer("en-IN", browser);
    const interim = vi.fn();
    const promise = recognizer.recognize({ onInterimTranscript: interim });
    const instance = recognizer.recognition;

    instance.onresult({
      resultIndex: 0,
      results: [
        { isFinal: false, 0: { transcript: "What is " } },
        { isFinal: true, 0: { transcript: "gravity?" } },
      ],
    });

    await expect(promise).resolves.toBe("What is gravity?");
    expect(interim).toHaveBeenCalledWith("What is gravity?");
  });

  it("supports explicit cancellation", () => {
    const browser = createRecognitionWindow();
    const recognizer = new BrowserSpeechRecognizer("en-IN", browser);
    recognizer.recognize();
    recognizer.stop();

    expect(recognizer.recognition).toBeNull();
  });

  it("reports unsupported browsers without starting recognition", async () => {
    const recognizer = new BrowserSpeechRecognizer("en-IN", {});

    await expect(recognizer.recognize()).rejects.toThrow("not supported");
  });
});

describe("BrowserSpeechSynthesizer", () => {
  it("speaks and can cancel through the browser adapter", async () => {
    const speechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn((utterance) => utterance.onend()),
    };
    class FakeUtterance {
      constructor(text) {
        this.text = text;
      }
    }
    const synthesizer = new BrowserSpeechSynthesizer({ speechSynthesis, SpeechSynthesisUtterance: FakeUtterance });

    await expect(synthesizer.speak("Hello", "en-IN")).resolves.toBeUndefined();
    synthesizer.cancel();
    expect(speechSynthesis.cancel).toHaveBeenCalled();
  });
});