/**
 * EDUNEXIS Student Topic Learning Detail Page
 * Route: /student-learning/:topicId
 * Child-friendly, age-appropriate breakdown of classroom concepts with:
 * - Simple explanation
 * - Important concepts
 * - Vernacular vocabulary bridge (Hindi + Santhali / Ho / Mundari)
 * - Relatable village-life examples
 * - Direct "Ask AI About This Topic" interactive button
 */

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { TOPIC_DETAILS_MAP, TOPICS_LEARNED, TODAYS_TOPICS } from "../services/studentMockData";

export function StudentLearningDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // Find detailed content or fallback
  const topic =
    TOPIC_DETAILS_MAP[topicId] ||
    TOPICS_LEARNED.find((t) => t.id === topicId) ||
    TODAYS_TOPICS.find((t) => t.id === topicId) ||
    TOPIC_DETAILS_MAP["math-subtraction"];

  return (
    <div className="topic-learning-page">
      {/* Navigation Breadcrumb / Back Button */}
      <div className="topic-nav-back-row">
        <button
          className="topic-back-btn"
          onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
        >
          ← Back to Dashboard
        </button>
        <div className="topic-header-tags">
          <span className="topic-subject-badge">{topic.subject || "Mathematics"}</span>
          <span className="topic-class-badge">{topic.grade || "Class 3"}</span>
          <span className="topic-read-badge">⏱️ {topic.readTime || "10 mins read"}</span>
        </div>
      </div>

      {/* Main Topic Hero Card */}
      <section className="topic-hero-card">
        <div className="topic-hero-icon-box">{topic.icon || "📖"}</div>
        <div className="topic-hero-info">
          <h1 className="topic-main-title">{topic.title}</h1>
          <p className="topic-hero-intro">
            {topic.heroDescription ||
              "Learn this foundational classroom concept step-by-step with simple examples and mother tongue vocabulary."}
          </p>
        </div>

        {/* Prominent "Ask AI About This Topic" Action */}
        <div className="topic-ai-hero-action">
          <button
            className="ask-ai-topic-btn"
            onClick={() =>
              navigate(`${ROUTES.STUDENT_AI_ASSISTANT}?topic=${encodeURIComponent(topic.id || topicId)}`)
            }
          >
            <span className="btn-sparkle">🤖</span>
            <span>Ask AI About This Topic</span>
          </button>
          <span className="ask-ai-subnote">Ask questions in Hindi or Santhali</span>
        </div>
      </section>

      {/* Content Section 1: Simple Age-Appropriate Explanation */}
      <section className="topic-content-card">
        <div className="card-section-title-row">
          <span className="section-badge-icon">🌱</span>
          <h2 className="card-section-title">सरल व्याख्या (Simple Explanation)</h2>
        </div>
        <div className="topic-explanation-text">
          <p>
            {topic.simpleExplanation ||
              "यह पाठ प्राथमिक स्तर के विद्यार्थियों के लिए सरल उदाहरणों द्वारा तैयार किया गया है।"}
          </p>
        </div>
      </section>

      {/* Content Section 2: Important Concepts */}
      {topic.importantConcepts && topic.importantConcepts.length > 0 && (
        <section className="topic-content-card">
          <div className="card-section-title-row">
            <span className="section-badge-icon">💡</span>
            <h2 className="card-section-title">याद रखने योग्य मुख्य बातें (Key Concepts)</h2>
          </div>
          <div className="important-concepts-grid">
            {topic.importantConcepts.map((concept, idx) => (
              <div key={idx} className="concept-box-card">
                <div className="concept-number-badge">{idx + 1}</div>
                <div className="concept-box-body">
                  <h3 className="concept-title">{concept.title}</h3>
                  <p className="concept-desc">{concept.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Section 3: Vernacular Vocabulary Bridge */}
      {topic.vocabularyBridge && topic.vocabularyBridge.length > 0 && (
        <section className="topic-content-card">
          <div className="card-section-title-row">
            <span className="section-badge-icon">🗣️</span>
            <div>
              <h2 className="card-section-title">मातृभाषा शब्द सेतु (Mother Tongue Vocabulary Bridge)</h2>
              <p className="card-section-subtitle">
                Understand the key terms in Hindi, Santhali, Ho, and Mundari:
              </p>
            </div>
          </div>

          <div className="vocab-table-responsive">
            <table className="vocab-bridge-table">
              <thead>
                <tr>
                  <th>Hindi (हिंदी)</th>
                  <th>Santhali (ᱥᱟᱱᱛᱟᱲᱤ)</th>
                  <th>Ho (ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)</th>
                  <th>Mundari (ᱢᱩᱱᱰᱟᱨᱤ)</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {topic.vocabularyBridge.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-charcoal">{item.hindi}</td>
                    <td className="vernacular-script-cell text-forestGreen">{item.sat || "—"}</td>
                    <td className="vernacular-script-cell text-amberBrown">{item.hoc || "—"}</td>
                    <td className="vernacular-script-cell text-tealBlue">{item.unr || "—"}</td>
                    <td className="text-secondary">{item.english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Content Section 4: Village Life Relatable Example */}
      {topic.villageExample && (
        <section className="topic-content-card village-story-card">
          <div className="card-section-title-row">
            <span className="section-badge-icon">🌾</span>
            <h2 className="card-section-title">{topic.villageExample.title}</h2>
          </div>
          <div className="village-story-content">
            <p>{topic.villageExample.story}</p>
          </div>
        </section>
      )}

      {/* Content Section 5: Practice Question & Hint */}
      {topic.practiceActivity && (
        <section className="topic-content-card practice-exercise-card">
          <div className="card-section-title-row">
            <span className="section-badge-icon">❓</span>
            <h2 className="card-section-title">स्वयं जाँचें (Practice Question)</h2>
          </div>
          <div className="practice-box">
            <p className="practice-question-text">
              <strong>प्रश्न:</strong> {topic.practiceActivity.question}
            </p>
            <div className="practice-hint-pill">
              <span>💡 <strong>संकेत (Hint):</strong> {topic.practiceActivity.hint}</span>
            </div>
            <div className="practice-answer-reveal">
              <span>✅ <strong>सही उत्तर:</strong> {topic.practiceActivity.answer}</span>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Floating/Sticky AI CTA */}
      <div className="topic-bottom-cta-strip">
        <div className="strip-left-info">
          <span className="strip-icon">🤖</span>
          <div>
            <strong>Still have questions about {topic.title}?</strong>
            <p>EDU AI can explain further with pictures, riddles, or stories.</p>
          </div>
        </div>
        <button
          className="strip-action-btn"
          onClick={() =>
            navigate(`${ROUTES.STUDENT_AI_ASSISTANT}?topic=${encodeURIComponent(topic.id || topicId)}`)
          }
        >
          Ask AI Now →
        </button>
      </div>
    </div>
  );
}

export default StudentLearningDetail;
