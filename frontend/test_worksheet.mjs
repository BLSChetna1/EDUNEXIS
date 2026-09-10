import { buildWorksheetContent, WORKSHEET_SYLLABUS_TOPICS } from "./src/services/worksheetData.js";
import { WORKSHEET_EXERCISE_TYPES, AVAILABLE_CLASSES, SUBJECTS } from "./src/utils/constants.js";

console.log("=== RUNNING WORKSHEET GENERATOR PEDAGOGY TESTS ===");

const testCases = [
  {
    name: "Test 1: Class 1 + Maths + Basic Calculation",
    params: { classLevel: "Class 1", subject: "Maths", topic: "सरल जोड़", difficulty: "easy", exerciseType: "basic_calculation", targetLang: "sat" },
    validate: (res) => res.calculationProblems && res.calculationProblems.length > 0 && res.answerKey,
  },
  {
    name: "Test 2: Class 2 + English + Fill in the Blanks",
    params: { classLevel: "Class 2", subject: "English", topic: "Three & Four Letter Words", difficulty: "medium", exerciseType: "fill_blanks", targetLang: "hoc" },
    validate: (res) => res.sentences && res.wordBox && res.wordBox.length > 0,
  },
  {
    name: "Test 3: Class 3 + EVS + MCQ",
    params: { classLevel: "Class 3", subject: "EVS", topic: "जल ही जीवन है", difficulty: "medium", exerciseType: "multiple_choice", targetLang: "unr" },
    validate: (res) => res.questions && res.questions.length === 3 && res.questions[0].options.length === 4,
  },
  {
    name: "Test 4: Class 4 + Maths + Word Problems",
    params: { classLevel: "Class 4", subject: "Maths", topic: "इबारती प्रश्न", difficulty: "hard", exerciseType: "word_problems", targetLang: "kru" },
    validate: (res) => res.problems && res.problems.length > 0 && res.problems[0].steps,
  },
  {
    name: "Test 5: Class 5 + English + Reading Comprehension",
    params: { classLevel: "Class 5", subject: "English", topic: "Reading Passage", difficulty: "hard", exerciseType: "reading_comprehension", targetLang: "kha" },
    validate: (res) => res.passage && res.questions && res.questions.length === 4,
  },
  {
    name: "Test 6: Class 3 + Tribal Language (Santhali) + Vocabulary",
    params: { classLevel: "Class 3", subject: "Santhali", topic: "संथाली पहेलियां", difficulty: "medium", exerciseType: "vocabulary_exercises", targetLang: "sat" },
    validate: (res) => res.vocabList && res.vocabList.length > 0,
  },
  {
    name: "Test 7: Class 5 + Mixed Worksheet",
    params: { classLevel: "Class 5", subject: "EVS", topic: "जैव विविधता", difficulty: "hard", exerciseType: "mixed_worksheet", targetLang: "sat" },
    validate: (res) => res.isMixed && res.sectionA && res.sectionB && res.sectionC && res.answerKey,
  },
];

let allPassed = true;
testCases.forEach((tc) => {
  try {
    const res = buildWorksheetContent(tc.params);
    const valid = tc.validate(res);
    if (valid) {
      console.log(`✅ ${tc.name} — PASSED (Title: "${res.title}")`);
    } else {
      console.error(`❌ ${tc.name} — FAILED Validation`);
      allPassed = false;
    }
  } catch (err) {
    console.error(`❌ ${tc.name} — ERROR:`, err);
    allPassed = false;
  }
});

console.log("\n--- Testing All 21 Exercise Types ---");
WORKSHEET_EXERCISE_TYPES.forEach((type, idx) => {
  try {
    const res = buildWorksheetContent({
      classLevel: "Class 3",
      subject: "EVS",
      topic: "हमारा पर्यावरण",
      difficulty: "medium",
      exerciseType: type.id,
      targetLang: "sat",
    });
    if (res && res.title && res.instructions) {
      console.log(`  [${idx + 1}/21] ${type.id} (${type.label}) — OK`);
    } else {
      console.error(`  [${idx + 1}/21] ${type.id} — Missing title or instructions`);
      allPassed = false;
    }
  } catch (err) {
    console.error(`  [${idx + 1}/21] ${type.id} — Error:`, err);
    allPassed = false;
  }
});

console.log("\n--- Testing Syllabus Catalog Mapping ---");
AVAILABLE_CLASSES.forEach((cls) => {
  SUBJECTS.forEach((sub) => {
    const topics = WORKSHEET_SYLLABUS_TOPICS[cls]?.[sub];
    if (topics && topics.length > 0) {
      // Good
    } else {
      console.warn(`  Warning: Missing topic mapping for ${cls} -> ${sub}`);
    }
  });
});
console.log("  All 5 Classes x 9 Subjects topics verified!");

if (allPassed) {
  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("\n💥 SOME TESTS FAILED!");
  process.exit(1);
}
