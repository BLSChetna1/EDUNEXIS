const express = require("express");
const {
  checkBhashiniCredentials,
} = require("../services/bhashini");

const router = express.Router();

/*
 * Speech-to-Text
 */
router.post("/speech-to-text", async (req, res) => {
  try {
    const { audio, language } = req.body;

    if (!audio || !language) {
      return res.status(400).json({
        success: false,
        message: "audio and language are required",
      });
    }

    const bhashini = checkBhashiniCredentials();

    if (!bhashini.configured) {
      return res.status(503).json({
        success: false,
        message:
          "Speech-to-Text provider is pending. BHASHINI access is not configured yet.",
        provider: "bhashini",
        status: "pending",
        language,
      });
    }

    /*
     * Real BHASHINI ASR call will be added after
     * the approved inference endpoint is available.
     */
    return res.status(503).json({
      success: false,
      message:
        "BHASHINI credentials are configured, but the ASR inference endpoint is not connected yet.",
      provider: "bhashini",
      status: "endpoint-pending",
      language,
    });
  } catch (error) {
    console.error("Speech-to-Text error:", error);

    res.status(500).json({
      success: false,
      message: "Speech-to-Text service error",
    });
  }
});

/*
 * Text-to-Speech
 */
router.post("/text-to-speech", async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || !language) {
      return res.status(400).json({
        success: false,
        message: "text and language are required",
      });
    }

    const bhashini = checkBhashiniCredentials();

    if (!bhashini.configured) {
      return res.status(503).json({
        success: false,
        message:
          "Text-to-Speech provider is pending. BHASHINI access is not configured yet.",
        provider: "bhashini",
        status: "pending",
        language,
      });
    }

    /*
     * Real BHASHINI TTS call will be added after
     * the approved inference endpoint is available.
     */
    return res.status(503).json({
      success: false,
      message:
        "BHASHINI credentials are configured, but the TTS inference endpoint is not connected yet.",
      provider: "bhashini",
      status: "endpoint-pending",
      language,
    });
  } catch (error) {
    console.error("Text-to-Speech error:", error);

    res.status(500).json({
      success: false,
      message: "Text-to-Speech service error",
    });
  }
});

module.exports = router;