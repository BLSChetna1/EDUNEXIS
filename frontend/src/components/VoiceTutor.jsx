import React, { useEffect, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import apiService from "../services/api";
import {
  BrowserSpeechRecognizer,
  BrowserSpeechSynthesizer,
  getSpeechLocale,
} from "../services/voice";

const STATUS_LABELS = {
  idle: "Tap to speak",
  listening: "Listening...",
  transcribing: "Transcribing...",
  detecting: "Detecting language...",
  processing: "Thinking...",
  speaking: "Speaking...",
  error: "Something went wrong. Try again.",
};

export function VoiceTutor() {
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const recognizerRef = useRef(null);
  const synthesizerRef = useRef(new BrowserSpeechSynthesizer());
  const cancelledRef = useRef(false);
  const sessionIdRef = useRef(`voice-${Date.now()}`);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cancelledRef.current = true;
      recognizerRef.current?.stop();
      synthesizerRef.current.cancel();
    };
  }, []);

  const listenAndRespond = async () => {
    if (status === "listening") {
      cancelledRef.current = true;
      recognizerRef.current?.stop();
      setStatus("idle");
      setError("");
      return;
    }

    if (!["idle", "error"].includes(status)) return;

    setError("");
    setTranscript("");
    setDetectedLanguage("");
    setReply("");
    cancelledRef.current = false;

    const recognizer = new BrowserSpeechRecognizer(getSpeechLocale(language));
    recognizerRef.current = recognizer;
    if (!recognizer.isSupported) {
      setStatus("error");
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    setStatus("listening");
    try {
      const capturedTranscript = await recognizer.recognize({
        onInterimTranscript: setTranscript,
      });
      recognizerRef.current = null;

      if (cancelledRef.current || !mountedRef.current) return;
      if (!capturedTranscript) {
        throw new Error("No clear speech was detected. Please try speaking again.");
      }

      setTranscript(capturedTranscript);
      setStatus("transcribing");
      await Promise.resolve();
      if (cancelledRef.current || !mountedRef.current) return;
      setStatus("detecting");
      const languageResult = await apiService.detectLanguage(capturedTranscript);
      if (cancelledRef.current || !mountedRef.current) return;
      const responseLanguage = languageResult.language_code || language;
      setDetectedLanguage(responseLanguage);
      setStatus("processing");
      const response = await apiService.sendChatMessage({
        message: capturedTranscript,
        target_language: responseLanguage,
        pedagogy_level: "beginner",
        session_id: sessionIdRef.current,
      });

      if (cancelledRef.current || !mountedRef.current) return;
      if (!response?.reply?.trim()) {
        throw new Error("EDUNEXIS returned an empty response. Please try again.");
      }

      setReply(response.reply);
      setStatus("speaking");
      await synthesizerRef.current.speak(response.reply, getSpeechLocale(responseLanguage));
      if (!cancelledRef.current && mountedRef.current) setStatus("idle");
    } catch (voiceError) {
      if (cancelledRef.current || !mountedRef.current) return;
      setStatus("error");
      setError(voiceError.message || "Voice interaction failed. Please try again.");
    }
  };

  const stopSpeaking = () => {
    synthesizerRef.current.cancel();
    setStatus("idle");
  };

  const replayResponse = async () => {
    if (!reply || status === "speaking") return;
    setError("");
    setStatus("speaking");
    try {
      await synthesizerRef.current.speak(reply, getSpeechLocale(language));
      if (mountedRef.current) setStatus("idle");
    } catch (voiceError) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(voiceError.message || "Audio playback failed. Please try again.");
    }
  };

  const clearConversation = () => {
    cancelledRef.current = true;
    recognizerRef.current?.stop();
    synthesizerRef.current.cancel();
    setTranscript("");
    setDetectedLanguage("");
    setReply("");
    setError("");
    setStatus("idle");
  };

  const isBusy = ["transcribing", "detecting", "processing", "speaking"].includes(status);
  const hasConversation = Boolean(transcript || reply);

  return (
    <section className="voice-tutor" aria-labelledby="voice-tutor-title">
      <div className="voice-tutor-header">
        <div className="voice-tutor-copy">
          <span className="section-subtitle">Voice Prototype</span>
          <h2 id="voice-tutor-title" className="section-title">Ask EDUNEXIS out loud</h2>
          <p>Speak a learning question and hear an adaptive answer in your chosen language.</p>
        </div>
        {hasConversation && (
          <button type="button" className="text-button" onClick={clearConversation}>Clear conversation</button>
        )}
      </div>

      <div className="voice-tutor-stage">
        <div className={`voice-orb voice-orb-${status}`} aria-hidden="true">
          <span className="voice-orb-icon">{status === "listening" ? "●" : "⌁"}</span>
        </div>
        <div className="voice-stage-copy">
          <p className={`voice-status voice-status-${status}`} role="status" aria-live="polite">
            {STATUS_LABELS[status]}
          </p>
          <p className="voice-hint">
            {status === "listening" ? "Your microphone is on. Tap stop when you are finished." : "Your question will be sent through the existing EDUNEXIS tutor."}
          </p>
        </div>
      </div>

      <div className="voice-tutor-controls">
        <label htmlFor="voice-language">Response language</label>
        <select
          id="voice-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          disabled={status === "listening" || isBusy}
        >
          {SUPPORTED_LANGUAGES.map((option) => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
        <button
          type="button"
          className={`btn voice-button ${status === "listening" ? "voice-button-stop" : "btn-primary"}`}
          onClick={listenAndRespond}
          disabled={isBusy}
          aria-label={status === "listening" ? "Stop recording" : "Start recording"}
        >
          <span className="microphone-icon" aria-hidden="true">{status === "listening" ? "■" : "●"}</span>
          {status === "listening" ? "Stop recording" : "Start voice question"}
        </button>
        {status === "speaking" && (
          <button type="button" className="btn btn-secondary" onClick={stopSpeaking}>Stop speech</button>
        )}
        {reply && status !== "speaking" && (
          <button type="button" className="btn btn-secondary" onClick={replayResponse}>Replay response</button>
        )}
      </div>

      {transcript && (
        <div className="voice-result">
          <span className="voice-result-label">Transcript</span>
          <p>{transcript}</p>
          {detectedLanguage && <small className="voice-language-note">Detected language: {detectedLanguage}</small>}
        </div>
      )}

      {reply && (
        <div className="voice-result voice-response">
          <span className="voice-result-label">EDUNEXIS response</span>
          <p>{reply}</p>
        </div>
      )}

      {error && (
        <div className="voice-error" role="alert">
          <p>{error}</p>
          <button type="button" className="text-button" onClick={listenAndRespond}>Try again</button>
        </div>
      )}
    </section>
  );
}

export default VoiceTutor;
