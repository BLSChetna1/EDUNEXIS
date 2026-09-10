const express = require("express");
const database = require("../services/database");

const router = express.Router();

function listResource(table, res) {
  try {
    return res.json({ success: true, items: database.list(table) });
  } catch (error) {
    console.error(`Database list error [${table}]:`, error);
    return res.status(500).json({
      success: false,
      message: "Unable to read saved database records",
    });
  }
}

router.get("/lessons", (req, res) => listResource("lessons", res));
router.get("/worksheets", (req, res) => listResource("worksheets", res));
router.get("/flashcards", (req, res) => listResource("flashcards", res));
router.get("/translations", (req, res) => listResource("translations", res));

router.get("/db-test", (req, res) => {
  try {
    const status = database.getStatus();
    return res.json({
      success: status.connected,
      database: "sqlite",
      connected: status.connected,
      path: status.path,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return res.status(500).json({
      success: false,
      database: "sqlite",
      connected: false,
      message: "SQLite connection test failed",
    });
  }
});

module.exports = router;
