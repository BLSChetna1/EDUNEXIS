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
      duration = 30,
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

    const prompt = `
You are an expert primary-school teacher helping create
Mother Tongue-Based Multilingual Education material for
children in tribal-area schools in Jharkhand, India.

Create a simple lesson plan.

Class: ${classLevel}
Subject: ${subject}
Topic: ${topic}
Primary language: Hindi
Mother tongue: Mundari
Duration: ${duration} minutes

The lesson must be suitable for young primary-school children.

Return ONLY valid JSON in exactly this structure:

{
  "title": "",
  "learningObjectives": [],
  "materials": [],
  "activities": [
    {
      "type": "",
      "duration": "",
      "description": ""
    }
  ],
  "assessment": [],
  "teacherTips": []
}

Keep the language simple and practical.
Use culturally appropriate examples where possible.
Do not invent claims about Mundari vocabulary.
Do not include markdown or code fences.
`;

    const generatedText = await generateContent(prompt);

    let lessonPlan;

    try {
      const cleanedText = generatedText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      lessonPlan = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini JSON parsing error:", parseError);
      console.error("Gemini response:", generatedText);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid lesson format",
      });
    }

    res.json({
      success: true,
      lessonPlan: {
        ...lessonPlan,
        classLevel,
        subject,
        topic,
        language,
        duration: `${duration} minutes`,
        languageSupport: {
          primaryLanguage: "Hindi",
          motherTongue: "Mundari",
          translationAvailable: true,
          translationProvider: "BHASHINI",
        },
        offlineSupport: {
          available: true,
          note: "Generated lessons can be cached locally for offline classroom use.",
        },
      },
      provider: "gemini",
    });
  } catch (error) {
    console.error("Lesson generation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate lesson plan",
    });
  }
});

module.exports = router;