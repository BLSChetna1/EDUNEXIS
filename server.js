const express = require("express");
const cors = require("cors");
require("dotenv").config();

const translateRoute = require("./routes/translate");
const lessonRoute = require("./routes/lesson");
const worksheetRoute = require("./routes/worksheet");
const speechRoute = require("./routes/speech");
const flashcardRoute = require("./routes/flashcard");

const {
  checkBhashiniCredentials,
} = require("./services/bhashini");

const {
  checkGeminiCredentials,
} = require("./services/gemini");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api/translate", translateRoute);
app.use("/api/lesson", lessonRoute);
app.use("/api/worksheet", worksheetRoute);
app.use("/api/speech", speechRoute);
app.use("/api/flashcard", flashcardRoute);

// System status
app.get("/api/status", (req, res) => {
  const bhashini = checkBhashiniCredentials();
  const gemini = checkGeminiCredentials();

  res.json({
    success: true,

    project: "PALASH MITRA",
    version: "1.0.0",

    services: {
      lessonGeneration: {
        provider: "Gemini",
        configured: gemini.configured,
        status: gemini.configured ? "ready" : "not-configured",
      },

      worksheetGeneration: {
        provider: "Gemini",
        configured: gemini.configured,
        status: gemini.configured ? "ready" : "not-configured",
      },

      flashcardGeneration: {
        provider: "Gemini",
        configured: gemini.configured,
        status: gemini.configured ? "ready" : "not-configured",
      },

      translation: {
        preferredProvider: "BHASHINI",
        configured: bhashini.configured,
        status: bhashini.configured
          ? "configured"
          : "pending-approval",
      },

      speechToText: {
        provider: "BHASHINI",
        configured: bhashini.configured,
        status: bhashini.configured
          ? "endpoint-pending"
          : "pending-approval",
      },

      textToSpeech: {
        provider: "BHASHINI",
        configured: bhashini.configured,
        status: bhashini.configured
          ? "endpoint-pending"
          : "pending-approval",
      },
    },

    languages: {
      primary: "Hindi",
      target: "Mundari",
      futureExpansion: ["Ho", "Santhali"],
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PALASH backend is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});