const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDirectory = path.join(__dirname, "..", "data");
const databasePath = path.join(dataDirectory, "palash.db");

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_level TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS worksheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_level TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_level TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    language TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    example TEXT,
    image_prompt TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    provider TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const insertLesson = db.prepare(`
  INSERT INTO lessons (class_level, subject, topic, language, title, content)
  VALUES (@classLevel, @subject, @topic, @language, @title, @content)
`);

const insertWorksheet = db.prepare(`
  INSERT INTO worksheets (class_level, subject, topic, language, title, content)
  VALUES (@classLevel, @subject, @topic, @language, @title, @content)
`);

const insertFlashcard = db.prepare(`
  INSERT INTO flashcards (class_level, subject, topic, language, front, back, example, image_prompt)
  VALUES (@classLevel, @subject, @topic, @language, @front, @back, @example, @imagePrompt)
`);

const insertTranslation = db.prepare(`
  INSERT INTO translations (
    source_text, translated_text, source_language, target_language, provider, verified
  ) VALUES (@sourceText, @translatedText, @sourceLanguage, @targetLanguage, @provider, @verified)
`);

const toContent = (value) => (typeof value === "string" ? value : JSON.stringify(value));

function saveLesson({ classLevel, subject, topic, language, title, content }) {
  return insertLesson.run({
    classLevel,
    subject,
    topic,
    language,
    title: title || topic,
    content: toContent(content),
  }).lastInsertRowid;
}

function saveWorksheet({ classLevel, subject, topic, language, title, content }) {
  return insertWorksheet.run({
    classLevel,
    subject,
    topic,
    language,
    title: title || topic,
    content: toContent(content),
  }).lastInsertRowid;
}

function saveFlashcardSet({ classLevel, subject, topic, language, flashcards }) {
  const saveMany = db.transaction((cards) => {
    const ids = [];
    for (const card of cards) {
      ids.push(insertFlashcard.run({
        classLevel,
        subject,
        topic,
        language,
        front: String(card.front || ""),
        back: String(card.back || ""),
        example: card.example ? String(card.example) : null,
        imagePrompt: card.imagePrompt ? String(card.imagePrompt) : null,
      }).lastInsertRowid);
    }
    return ids;
  });

  return saveMany(Array.isArray(flashcards) ? flashcards : []);
}

function saveTranslation({ sourceText, translatedText, sourceLanguage, targetLanguage, provider, verified }) {
  return insertTranslation.run({
    sourceText,
    translatedText,
    sourceLanguage,
    targetLanguage,
    provider: provider || "unknown",
    verified: verified ? 1 : 0,
  }).lastInsertRowid;
}

function list(table) {
  const allowedTables = new Set(["lessons", "worksheets", "flashcards", "translations"]);
  if (!allowedTables.has(table)) throw new Error("Unsupported database table");
  return db.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC, id DESC`).all();
}

function testConnection() {
  return db.prepare("SELECT 1 AS connected").get().connected === 1;
}

function getStatus() {
  return {
    connected: testConnection(),
    path: databasePath,
  };
}

module.exports = {
  databasePath,
  getStatus,
  list,
  saveFlashcardSet,
  saveLesson,
  saveTranslation,
  saveWorksheet,
  testConnection,
};
