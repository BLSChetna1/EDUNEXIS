/**
 * EDUNEXIS Student AI Assistant Service (EDU AI)
 * Provides conversational pedagogical support, topic-aware explanations,
 * vernacular vocabulary bridges, and Simple Learning Mode adjustments.
 * Prepared for future FastAPI connection (POST /api/v1/student/chat).
 */

import { TOPIC_DETAILS_MAP } from "./studentMockData";

export const SUGGESTED_PROMPTS = [
  { id: "simple", label: "🌱 Explain this simply", prompt: "इसे बहुत सरल और आसान तरीके से समझाइए।" },
  { id: "example", label: "🌾 Give me an example", prompt: "मुझे गाँव या घर का कोई आसान उदाहरण देकर समझाइए।" },
  { id: "revise", label: "📝 Help me revise", prompt: "मुझे इस पाठ के मुख्य बिंदु संक्षेप में दोहराने में मदद कीजिए।" },
  { id: "practice", label: "❓ Ask me a practice question", prompt: "मेरी परीक्षा लेने के लिए मुझसे एक अभ्यास प्रश्न पूछिए।" },
  { id: "vernacular", label: "🗣️ Explain in my language", prompt: "इस विषय के मुख्य शब्दों को संथाली/मातृभाषा में बताइए।" },
];

export class StudentAIService {
  /**
   * Get initial welcome greeting for the student
   */
  getInitialGreeting(studentName = "विद्यार्थी", topicId = null, language = "sat") {
    if (topicId && TOPIC_DETAILS_MAP[topicId]) {
      const topic = TOPIC_DETAILS_MAP[topicId];
      return {
        id: "greet-topic",
        sender: "assistant",
        text: `जोहार ${studentName}! 👋 मैं आपका **EDU AI Assistant** हूँ।\n\nआज हम **${topic.title}** के बारे में बात कर रहे हैं। आप इस पाठ से जुड़ा कोई भी सवाल पूछ सकते हैं या नीचे दिए गए सुझाव बटन दबा सकते हैं! 🌱`,
        timestamp: "Just now",
        topicId,
      };
    }

    return {
      id: "greet-general",
      sender: "assistant",
      text: `जोहार ${studentName}! 👋 मैं आपका **EDU AI Learning Assistant** हूँ।\n\nगणित, भाषा या पर्यावरण का कोई भी पाठ समझ नहीं आ रहा हो, तो मुझसे बेझिझक पूछिए। हम मिलकर सरल और मजेदार तरीके से सीखेंगे! 🎒✨`,
      timestamp: "Just now",
    };
  }

  /**
   * Send a query to the student AI service
   * Ready for: const res = await fetch('/api/v1/student/chat', { method: 'POST', body: JSON.stringify(payload) });
   */
  async askAssistant({
    message,
    topicId = null,
    language = "sat",
    simpleMode = true,
    studentName = "Asha",
  }) {
    // Simulate realistic AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 550));

    const query = (message || "").toLowerCase().trim();
    const activeTopic = topicId ? TOPIC_DETAILS_MAP[topicId] : null;

    // 1. "Explain this simply"
    if (query.includes("सरल") || query.includes("simply") || query.includes("आसान")) {
      if (activeTopic) {
        return {
          reply: `यहाँ **${activeTopic.title}** की बिल्कुल सरल व्याख्या है:\n\n${activeTopic.simpleExplanation}\n\n💡 **याद रखने की बात:** ${activeTopic.importantConcepts[0].text}\n\nक्या आप कोई उदाहरण देखना चाहते हैं?`,
          followUps: ["मुझे एक उदाहरण दीजिए", "अभ्यास प्रश्न पूछिए"],
        };
      }
      return {
        reply: `बिल्कुल! किसी भी चीज़ को सीखने का सबसे अच्छा तरीका है उसे अपने आस-पास की चीजों से जोड़ना।\n\nजैसे अगर हम 5 जामुन में से 2 जामुन खा लेते हैं, तो बचते हैं 3 जामुन। इसी को गणित में घटाव कहते हैं!\n\nआप किस विषय या पाठ को सरल भाषा में समझना चाहते हैं?`,
        followUps: ["घटाव समझाइए", "पेड़ों के बारे में बताइए"],
      };
    }

    // 2. "Give me an example"
    if (query.includes("उदाहरण") || query.includes("example")) {
      if (activeTopic && activeTopic.villageExample) {
        return {
          reply: `${activeTopic.villageExample.title}\n\n${activeTopic.villageExample.story}\n\nदेखा आपने? हमारे गाँव के हाट और दैनिक जीवन में भी गणित और विज्ञान हर जगह मौजूद है! 🌾`,
          followUps: ["एक और उदाहरण दीजिए", "अभ्यास प्रश्न पूछिए"],
        };
      }
      return {
        reply: `🌾 **गाँव का उदाहरण:**\nसोचिए कि आपके पास 12 महुआ के फूल हैं। आपकी सहेली ने आपको 8 और महुआ के फूल दिए। अब आपके पास कुल 12 + 8 = 20 फूल हो गए!\n\nयह जोड़ का सीधा उदाहरण है। क्या आप भी कोई उदाहरण बनाना चाहते हैं?`,
        followUps: ["हाँ, मुझसे सवाल पूछिए", "इसे संथाली में बताइए"],
      };
    }

    // 3. "Help me revise"
    if (query.includes("दोहरा") || query.includes("revise") || query.includes("रिवीजन") || query.includes("संक्षेप")) {
      if (activeTopic) {
        const bullets = activeTopic.importantConcepts.map((c) => `• **${c.title}**: ${c.text}`).join("\n");
        return {
          reply: `📝 **${activeTopic.title} — मुख्य बातें (Revision):**\n\n${bullets}\n\nशाबाश! इन बिंदुओं को अपनी कॉपी में नोट कर लें या एक बार ज़ोर से बोलकर पढ़ें। 🌟`,
          followUps: ["एक अभ्यास प्रश्न पूछिए", "मातृभाषा में शब्द बताइए"],
        };
      }
      return {
        reply: `📝 **रिवीजन टिप्स:**\n1. पाठ को ध्यान से पढ़ें।\n2. कठिन शब्दों को अपनी मातृभाषा में समझें।\n3. कम से कम 2 अभ्यास प्रश्न खुद हल करें।\n\nआप किस पाठ का रिवीजन करना चाहते हैं? मुझे बताइए!`,
        followUps: ["घटाव का रिवीजन", "साल के पेड़ का रिवीजन"],
      };
    }

    // 4. "Ask me a practice question"
    if (query.includes("प्रश्न") || query.includes("question") || query.includes("सवाल") || query.includes("परीक्षा")) {
      if (activeTopic && activeTopic.practiceActivity) {
        return {
          reply: `❓ **आपके लिए अभ्यास प्रश्न:**\n\n${activeTopic.practiceActivity.question}\n\n💭 **संकेत (Hint):** ${activeTopic.practiceActivity.hint}\n\nसोचिए और अपना उत्तर लिखकर मुझे भेजिए! 🤔`,
          followUps: ["उत्तर बताइए", "एक और प्रश्न दीजिए"],
        };
      }
      return {
        reply: `❓ **गणित का त्वरित प्रश्न:**\n\nयदि एक पेड़ पर 9 तोते बैठे थे और 3 तोते उड़ गए, तो पेड़ पर कितने तोते बचे?\n\n(संकेत: 9 में से 3 घटाइए)`,
        followUps: ["6 तोते", "उत्तर समझाइए"],
      };
    }

    // 5. "Explain in my language" / Vernacular vocabulary
    if (query.includes("भाषा") || query.includes("संथाली") || query.includes("language") || query.includes("हो") || query.includes("मुंडारी")) {
      if (activeTopic && activeTopic.vocabularyBridge) {
        const words = activeTopic.vocabularyBridge
          .slice(0, 4)
          .map((v) => `• **${v.hindi}** → संथाली: \`${v.sat}\` | अंग्रेजी: ${v.english}`)
          .join("\n");
        return {
          reply: `🗣️ **मातृभाषा शब्द सेतु (Vernacular Word Bridge):**\n\n${words}\n\nइन शब्दों को अपनी भाषा में बोलने का अभ्यास करें। क्या आपको कोई अन्य शब्द जानना है?`,
          followUps: ["सरल व्याख्या दीजिए", "उदाहरण दीजिए"],
        };
      }
      return {
        reply: `🗣️ **संताली शब्द सेतु (Santali Bridge):**\n• किताब (Book) → **ᱯᱩᱛᱷᱤ (पुथी)**\n• पानी (Water) → **ᱫᱟᱜ (दाग)**\n• पेड़ (Tree) → **ᱫᱟᱨᱮ (दारे)**\n• फूल (Flower) → **ᱵᱟᱦᱟ (बाहा)**\n\nआप किस शब्द का अनुवाद जानना चाहते हैं?`,
        followUps: ["पेड़ के बारे में बताइए", "अभ्यास प्रश्न दीजिए"],
      };
    }

    // 6. Generic query or topic matching
    if (activeTopic) {
      return {
        reply: `बहुत अच्छा सवाल! **${activeTopic.title}** के संदर्भ में:\n\n${activeTopic.simpleExplanation}\n\n${
          simpleMode
            ? "🌱 *सरल अध्ययन मोड सक्रिय है: व्याख्या को प्राथमिक स्तर के अनुकूल रखा गया है।* "
            : ""
        }\n\nक्या आप चाहते हैं कि मैं इसका कोई गाँव से जुड़ा उदाहरण दूँ?`,
        followUps: ["गाँव का उदाहरण दीजिए", "अभ्यास प्रश्न पूछिए", "मातृभाषा में शब्द बताइए"],
      };
    }

    // Default friendly response
    return {
      reply: `नमस्ते ${studentName}! आपने पूछा: "${message}"।\n\nयह बहुत अच्छा प्रश्न है! जब हम स्कूल में सीखते हैं, तो सवाल पूछना ही सबसे अच्छी आदत है।\n\nयदि आप आज की कक्षा के विषय जैसे **घटाव (Subtraction)** या **पेड़-पौधे (Trees)** के बारे में पूछना चाहते हैं, तो मुझे बताइए। मैं आपको चित्र और सरल उदाहरणों से समझाऊँगा! 😊`,
      followUps: ["घटाव समझाइए", "गाँव का उदाहरण दीजिए", "सरल अभ्यास प्रश्न पूछिए"],
    };
  }
}

export const studentAIService = new StudentAIService();
export default studentAIService;
