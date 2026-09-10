const express = require("express");
const {
  checkBhashiniCredentials,
  translateWithBhashini,
} = require("../services/bhashini");

const {
  checkGeminiCredentials,
  generateContent,
} = require("../services/gemini");
const database = require("../services/database");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "text, sourceLanguage and targetLanguage are required",
      });
    }

    /*
     * Preferred provider: BHASHINI
     */
    const bhashini = checkBhashiniCredentials();

    if (bhashini.configured) {
      const result = await translateWithBhashini({
        text,
        sourceLanguage,
        targetLanguage,
      });

      if (result.success) {
        try {
          database.saveTranslation({
            sourceText: text,
            translatedText: result.translatedText || result.translated_text || "",
            sourceLanguage: result.sourceLanguage || sourceLanguage,
            targetLanguage: result.targetLanguage || targetLanguage,
            provider: result.provider || "bhashini",
            verified: result.verified,
          });
        } catch (databaseError) {
          console.error("BHASHINI translation database save error:", databaseError);
        }
        return res.json(result);
      }
    }

    /*
     * Temporary AI fallback.
     *
     * This is NOT presented as a verified Mundari
     * translation provider. It is only for prototype
     * experimentation until BHASHINI access is available.
     */
    const gemini = checkGeminiCredentials();

    if (!gemini.configured) {
      return res.status(503).json({
        success: false,
        message: "No translation provider is currently available",
      });
    }

    const languageNames = {
      hi: "Hindi",
      unr: "Mundari",
    };

    const sourceName =
      languageNames[sourceLanguage] || sourceLanguage;

    const targetName =
      languageNames[targetLanguage] || targetLanguage;

    const prompt = `
You are helping create a multilingual primary education prototype.

Translate the following text from ${sourceName} to ${targetName}.

Source text:
${text}

Important:
- Preserve the meaning.
- Keep the translation short and natural.
- If the target language is Mundari, do not invent a translation.
- If you are uncertain about the Mundari translation, clearly indicate uncertainty.
- Return ONLY the translated text.
`;

    const translatedText = await generateContent(prompt);

    const response = {
      success: true,
      sourceText: text,
      translatedText: translatedText.trim(),
      sourceLanguage,
      targetLanguage,
      provider: "gemini-experimental",
      verified: false,
      message:
        "Experimental AI fallback. Verified Mundari translation will use BHASHINI when access is approved.",
    };

    try {
      database.saveTranslation({
        sourceText: text,
        translatedText: response.translatedText,
        sourceLanguage,
        targetLanguage,
        provider: response.provider,
        verified: response.verified,
      });
    } catch (databaseError) {
      console.error("Translation database save error:", databaseError);
    }

    res.json(response);
  } catch (error) {
    console.error("Translation error:", error);

    res.status(500).json({
      success: false,
      message: "Translation service error",
    });
  }
});

module.exports = router;