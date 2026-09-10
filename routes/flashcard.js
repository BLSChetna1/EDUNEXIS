const express = require("express");
const {
  checkGeminiCredentials,
  generateContent,
} = require("../services/gemini");
const database = require("../services/database");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      classLevel,
      subject,
      topic,
      language = "hi",
      count = 5,
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

    const safeCount = Math.max(1, Math.min(Number(count) || 5, 10));

    const prompt = `
You are an expert primary-school teacher creating
educational flashcards for children in tribal-area
schools in Jharkhand, India.

Create ${safeCount} simple educational flashcards.

Class: ${classLevel}
Subject: ${subject}
Topic: ${topic}
Primary language: Hindi
Mother tongue: Mundari

The flashcards should:
- Be suitable for young primary-school children.
- Use simple language.
- Teach useful concepts related to the topic.
- Use familiar and concrete examples.
- Be easy for a teacher to use in a classroom.
- Include a short visual description that could be given to an image-generation system.

Return ONLY valid JSON in exactly this structure:

{
  "title": "",
  "flashcards": [
    {
      "id": 1,
      "front": "",
      "back": "",
      "example": "",
      "imagePrompt": ""
    }
  ]
}

Do not include markdown.
Do not include code fences.
Do not invent Mundari translations.
Do not put explanations outside the JSON.
`;

    const generatedText = await generateContent(prompt);

    let flashcardSet;

    try {
      const cleanedText = generatedText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      flashcardSet = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini flashcard JSON parsing error:", parseError);
      console.error("Gemini response:", generatedText);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid flashcard format",
      });
    }

    const response = {
      success: true,

      flashcardSet: {
        ...flashcardSet,
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
          note: "Generated flashcards can be cached locally for offline classroom use.",
        },
      },

      provider: "gemini",
    };

    try {
      response.storage = {
        saved: true,
        ids: database.saveFlashcardSet({
          classLevel,
          subject,
          topic,
          language,
          flashcards: flashcardSet.flashcards,
        }),
      };
    } catch (databaseError) {
      console.error("Flashcard database save error:", databaseError);
      response.storage = { saved: false };
    }

    res.json(response);
  } catch (error) {
    console.error("Flashcard generation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate flashcards",
    });
  }
});

module.exports = router;