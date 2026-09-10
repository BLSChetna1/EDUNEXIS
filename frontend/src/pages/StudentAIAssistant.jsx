/**
 * EDUNEXIS Student AI Assistant Page (EDU AI)
 * Route: /student-ai-assistant
 * Original EDUNEXIS-branded educational conversational assistant.
 * Features:
 * - Topic-aware context (?topic=:topicId)
 * - "Simple Learning Mode" toggle
 * - Suggested prompt chips ("Explain this simply", "Give me an example", etc.)
 * - Multilingual support (Santhali, Ho, Mundari, Hindi)
 * - Safe conversational history for students
 */

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";
import { useStudentAuth } from "../hooks/useStudentAuth";
import { studentAIService, SUGGESTED_PROMPTS } from "../services/studentAIService";
import { TOPIC_DETAILS_MAP } from "../services/studentMockData";

export function StudentAIAssistant() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { student, setLanguage } = useStudentAuth();

  const topicId = searchParams.get("topic");
  const initialQuery = searchParams.get("q") || "";

  const activeTopic = topicId ? TOPIC_DETAILS_MAP[topicId] : null;

  const [simpleMode, setSimpleMode] = useState(true); // Default ON for primary students
  const [currentLang, setCurrentLang] = useState(student?.preferredLanguage || "sat");
  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // Initialize conversation with welcome greeting or initial query
  useEffect(() => {
    const greeting = studentAIService.getInitialGreeting(
      student?.name || "Asha",
      topicId,
      currentLang
    );
    setMessages([greeting]);

    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [topicId, student?.name]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await studentAIService.askAssistant({
        message: query,
        topicId,
        language: currentLang,
        simpleMode,
        studentName: student?.name || "Asha",
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: response.reply,
        followUps: response.followUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "माफ कीजिए, मुझे आपकी बात समझने में थोड़ी परेशानी हुई। कृपया दोबारा पूछें! 😊",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSwitch = (newLang) => {
    setCurrentLang(newLang);
    setLanguage(newLang);
  };

  return (
    <div className="student-ai-page">
      {/* AI Assistant Topbar */}
      <header className="assistant-header-bar">
        <div className="assistant-header-left">
          <div className="assistant-avatar-badge">🤖</div>
          <div className="assistant-title-group">
            <h1 className="assistant-title">EDUNEXIS Learning Assistant</h1>
            <p className="assistant-subtitle">EDU AI • Your Mother Tongue Study Friend</p>
          </div>
        </div>

        <div className="assistant-header-right">
          {/* Simple Learning Mode Toggle */}
          <div
            className={`simple-mode-toggle ${simpleMode ? "active" : ""}`}
            onClick={() => setSimpleMode(!simpleMode)}
            role="button"
            tabIndex={0}
            title="Toggle simplified, age-appropriate explanations for primary students"
          >
            <span className="toggle-dot"></span>
            <span className="toggle-text">
              {simpleMode ? "🟢 Simple Learning Mode: ON" : "⚪ Normal Mode"}
            </span>
          </div>

          {/* Assistant Language Selector */}
          <div className="assistant-lang-pill">
            <span className="lang-icon">🌐</span>
            <select
              value={currentLang}
              onChange={(e) => handleLanguageSwitch(e.target.value)}
              className="assistant-lang-select"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Active Topic Context Banner (if launched from a topic) */}
      {activeTopic && (
        <div className="assistant-topic-context-banner">
          <div className="context-banner-text">
            <span className="context-icon">📖</span>
            <span>
              Discussing: <strong>{activeTopic.title}</strong> ({activeTopic.subject})
            </span>
          </div>
          <div className="context-banner-actions">
            <button
              className="context-view-topic-btn"
              onClick={() => navigate(`/student-learning/${topicId}`)}
            >
              View Lesson Page →
            </button>
            <button
              className="context-clear-btn"
              onClick={() => navigate(ROUTES.STUDENT_AI_ASSISTANT)}
              title="Clear topic context"
            >
              ✕ General Chat
            </button>
          </div>
        </div>
      )}

      {/* Main Conversational Viewport */}
      <div className="assistant-chat-viewport">
        <div className="chat-messages-scroll-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-row ${msg.sender === "user" ? "row-user" : "row-ai"}`}
            >
              {msg.sender === "assistant" && (
                <div className="ai-chat-avatar" aria-hidden="true">
                  🤖
                </div>
              )}

              <div className={`chat-bubble-card ${msg.sender === "user" ? "bubble-user" : "bubble-ai"}`}>
                <div className="chat-bubble-text">
                  {msg.text.split("\n\n").map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                <span className="chat-timestamp">{msg.timestamp}</span>

                {/* Follow-up suggestion pills */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="followup-chips-container">
                    <span className="followup-title">You can ask:</span>
                    <div className="followup-pills-row">
                      {msg.followUps.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          className="followup-chip-btn"
                          onClick={() => handleSendMessage(chip)}
                        >
                          {chip} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="user-chat-avatar" aria-hidden="true">
                  {student?.avatar || "👧"}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row row-ai">
              <div className="ai-chat-avatar">🤖</div>
              <div className="chat-bubble-card bubble-ai bubble-thinking">
                <div className="typing-dots-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="thinking-text">EDU AI सोच रहा है... (Thinking...)</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Buttons Strip */}
        <div className="suggested-prompts-strip">
          <span className="suggested-prompt-label">Quick Suggestions:</span>
          <div className="suggested-prompt-pills">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p.id}
                className="suggested-prompt-pill"
                onClick={() => handleSendMessage(p.prompt)}
                disabled={loading}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          className="assistant-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <div className="assistant-input-wrapper">
            <input
              type="text"
              className="assistant-text-input"
              placeholder={
                currentLang === "sat"
                  ? "संथाली या हिंदी में सवाल पूछें... (Ask a question in your mother tongue)"
                  : "सवाल पूछें... (Ask a question about your lessons)"
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              className="assistant-send-btn"
              disabled={!inputMessage.trim() || loading}
              aria-label="Send Message"
            >
              <span>भेजें</span>
              <span className="send-arrow-icon">➤</span>
            </button>
          </div>
        </form>

        {/* Child Safety & Architecture Notice */}
        <div className="assistant-safety-footer">
          <span>🔒 Safe Child Educational Assistant</span>
          <span>•</span>
          <span>Prototype Service • Ready for FastAPI Integration</span>
        </div>
      </div>
    </div>
  );
}

export default StudentAIAssistant;
