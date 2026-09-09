import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveClassroom from "./pages/LiveClassroom";
import Translate from "./pages/Translate";
import LessonGenerator from "./pages/LessonGenerator";
import WorksheetGenerator from "./pages/WorksheetGenerator";
import Flashcards from "./pages/Flashcards";
import OfflineLibrary from "./pages/OfflineLibrary";
import MyLessons from "./pages/MyLessons";
import LessonDetail from "./pages/LessonDetail";

// Student Portal Components & Pages
import StudentLayout from "./components/StudentLayout";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSyllabus from "./pages/StudentSyllabus";
import StudentLearningDetail from "./pages/StudentLearningDetail";
import StudentAIAssistant from "./pages/StudentAIAssistant";
import "./App.css";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* 2. Teacher Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 3. Main Dashboard & Workspace Feature Pages */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/my-lessons"
          element={
            <Layout>
              <MyLessons />
            </Layout>
          }
        />
        <Route
          path="/my-lessons/:lessonId"
          element={
            <Layout>
              <LessonDetail />
            </Layout>
          }
        />
        <Route
          path="/live-classroom"
          element={
            <Layout>
              <LiveClassroom />
            </Layout>
          }
        />
        <Route
          path="/translate"
          element={
            <Layout>
              <Translate />
            </Layout>
          }
        />
        <Route
          path="/lesson-generator"
          element={
            <Layout>
              <LessonGenerator />
            </Layout>
          }
        />
        <Route
          path="/worksheet-generator"
          element={
            <Layout>
              <WorksheetGenerator />
            </Layout>
          }
        />
        <Route
          path="/flashcards"
          element={
            <Layout>
              <Flashcards />
            </Layout>
          }
        />
        <Route
          path="/offline-library"
          element={
            <Layout>
              <OfflineLibrary />
            </Layout>
          }
        />

        {/* 4. Student Portal Routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route
          path="/student-dashboard"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />
        <Route
          path="/student-syllabus"
          element={
            <StudentLayout>
              <StudentSyllabus />
            </StudentLayout>
          }
        />
        <Route
          path="/student-learning/:topicId"
          element={
            <StudentLayout>
              <StudentLearningDetail />
            </StudentLayout>
          }
        />
        <Route
          path="/student-ai-assistant"
          element={
            <StudentLayout>
              <StudentAIAssistant />
            </StudentLayout>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
