import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./App.css";

export function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <Home />
      <footer className="edunexis-footer">
        <p>© 2026 EDUNEXIS Team • Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}

export default App;
