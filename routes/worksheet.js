const express = require("express");
const {
  checkGeminiCredentials,
  generateContent,
} = require("../services/gemini");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      classLevel,
      subject,
      topic,
      language = "hi",
      questionCount = 5,
    } = req.body;

    if (!classLevel || !subject || !topic) {
      return res.status(400).json({
        success: false,
        message: "classLevel, subject and topic are required",
      });
    }

    const gemini = checkGeminiCredentials();

    if (!gemini.configured) {
      return res.status(503).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    const safeCount = Math.max(1, Math.min(Number(questionCount) || 5, 10));

    const prompt = `
You are an expert primary-school teacher creating
Mother Tongue-Based Multilingual Education material
for children in tribal-area schools in Jharkhand, India.

Create a simple worksheet.

Class: ${classLevel}
Subject: ${subject}
Topic: ${topic}
Primary language: Hindi
Mother tongue: Mundari
Number of questions: ${safeCount}

The worksheet must:
- Be suitable for the specified primary-school class.
- Use simple language.
- Be educational and age-appropriate.
- Include a mixture of question types where appropriate.
- Avoid difficult terminology.
- Use familiar examples where possible.

Return ONLY valid JSON in exactly this structure:

{
  "title": "",
  "instructions": "",
  "questions": [
    {
      "number": 1,
      "type": "",
      "question": "",
      "options": [],
      "answer": ""
    }
  ]
}

For questions that do not need options, return an empty array for "options".

Do not include markdown.
Do not include code fences.
Do not invent Mundari translations.
`;

    const generatedText = await generateContent(prompt);

    let worksheet;

    try {
      const cleanedText = generatedText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      worksheet = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini worksheet JSON parsing error:", parseError);
      console.error("Gemini response:", generatedText);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid worksheet format",
      });
    }

    res.json({
      success: true,

      worksheet: {
        ...worksheet,
        classLevel,
        subject,
        topic,
        language,

        languageSupport: {
          primaryLanguage: "Hindi",
          motherTongue: "Mundari",
          translationAvailable: true,
          translationProvider: "BHASHINI",
        },

        offlineSupport: {
          available: true,
          note: "Generated worksheets can be cached locally for offline classroom use.",
        },
      },

      provider: "gemini",
    });
  } catch (error) {
    console.error("Worksheet generation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate worksheet",
    });
  }
});

module.exports = router;