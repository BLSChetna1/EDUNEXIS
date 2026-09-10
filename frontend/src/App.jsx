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

        {/* Fallback Catch-All (Redirects dead or legacy student routes back to teacher login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

