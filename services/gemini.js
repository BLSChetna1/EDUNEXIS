const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
  });
}

function checkGeminiCredentials() {
  if (!apiKey) {
    return {
      configured: false,
      message: "Gemini API key is not configured",
    };
  }

  return {
    configured: true,
  };
}

async function generateContent(prompt) {
  if (!ai) {
    throw new Error("Gemini API key is not configured");
  }

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
  });

  return interaction.output_text;
}

module.exports = {
  checkGeminiCredentials,
  generateContent,
};