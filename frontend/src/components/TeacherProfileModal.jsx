import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";
import {
  SUPPORTED_LANGUAGES,
  JHARKHAND_DISTRICTS,
  AVAILABLE_CLASSES,
} from "../utils/constants";

export function TeacherProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const getInitialClasses = () => {
    if (Array.isArray(user?.classesTaught) && user.classesTaught.length > 0) {
      return user.classesTaught;
    }
    if (typeof user?.assignedGrades === "string") {
      const parts = user.assignedGrades.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return ["Class 1", "Class 2", "Class 3"];
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [school, setSchool] = useState(user?.school || "");
  const [district, setDistrict] = useState(user?.district || "Khunti");
  const [targetLang, setTargetLang] = useState(user?.targetLanguage || "sat");
  const [classesTaught, setClassesTaught] = useState(getInitialClasses);
  const [saveNotice, setSaveNotice] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const sorted = [...classesTaught].sort();
    updateProfile({
      name,
      school,
      district,
      targetLanguage: targetLang,
      classesTaught: sorted,
      assignedGrades: sorted.join(", "),
    });
    setIsEditing(false);
    setSaveNotice("शिक्षक प्रोफाइल अद्यतन किया गया (Profile updated successfully)!");
    setTimeout(() => setSaveNotice(""), 3000);
  };

  const handleToggleClass = (cls) => {
    setClassesTaught((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === (user?.targetLanguage || "sat")) ||
    SUPPORTED_LANGUAGES[0];

  const displayedClasses = Array.isArray(user?.classesTaught) && user.classesTaught.length > 0
    ? user.classesTaught.join(", ")
    : (user?.assignedGrades || "Class 1, Class 2, Class 3");

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="profile-header-left">
            <span className="profile-header-avatar">{user?.avatar || "👩‍🏫"}</span>
            <div>
              <h2 className="profile-modal-title">शिक्षक प्रोफाइल (Teacher Profile)</h2>
              <span className="profile-emp-id">Employee ID: {user?.teacherId || "JH-EDU-1048"}</span>
            </div>
          </div>
          <button
            type="button"
            className="profile-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {saveNotice && (
          <div className="profile-save-notice">
            <span>✅ {saveNotice}</span>
          </div>
        )}

        {!isEditing ? (
          /* View Mode */
          <div className="profile-details-view">
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">पूरा नाम (Full Name)</span>
                <strong className="info-value">{user?.name || "Sunita Murmu"}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">पदनाम (Designation / Role)</span>
                <strong className="info-value">{user?.role || "Primary Assistant Teacher"}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">विद्यालय (School Name)</span>
                <strong className="info-value">{user?.school || "Rajkiya Prathmik Vidyalaya"}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">जिला (District)</span>
                <strong className="info-value">{user?.district || "Khunti, Jharkhand"}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">ईमेल (Registered Email)</span>
                <strong className="info-value">{user?.email || "sunita.murmu@jharkhand.edu.in"}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">सक्रिय मातृभाषा (Teaching Language)</span>
                <strong className="info-value">
                  {currentLangObj.name} ({currentLangObj.nativeName.split("/")[0].trim()})
                </strong>
              </div>

              <div className="info-item">
                <span className="info-label">कक्षा स्तर (Classes Taught)</span>
                <strong className="info-value">{displayedClasses}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">स्थानीय सत्र (Session Status)</span>
                <span className="status-badge-active">🟢 Active Tablet Session</span>
              </div>
            </div>

            <div className="profile-notice-box">
              <span>💾 <strong>Local Persistence Notice:</strong> Your teacher profile is saved locally for offline classroom resilience. When synced, updates automatically propagate to the Jharkhand Education MIS portal.</span>
            </div>

            <div className="profile-footer-actions">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setName(user?.name || "");
                  setSchool(user?.school || "");
                  setDistrict(user?.district || "Khunti");
                  setTargetLang(user?.targetLanguage || "sat");
                  setClassesTaught(getInitialClasses());
                  setIsEditing(true);
                }}
                icon={<span>✏️</span>}
              >
                संपादित करें (Edit Profile)
              </Button>
              <Button variant="primary" size="md" onClick={onClose}>
                पूर्ण (Done)
              </Button>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form className="profile-edit-form" onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">शिक्षक का नाम (Name)</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">विद्यालय (School)</label>
              <input
                type="text"
                className="form-input"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">जिला (District)</label>
                <select
                  className="form-input form-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">मातृभाषा माध्यम (Language)</label>
                <select
                  className="form-input form-select"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Classes Taught Multi-Selection */}
            <div className="form-group">
              <label className="form-label">
                कक्षा स्तर (Classes Taught) — {classesTaught.length} selected
              </label>
              <div className="classes-checkbox-grid">
                {AVAILABLE_CLASSES.map((cls) => (
                  <label key={cls} className={`class-checkbox-pill ${classesTaught.includes(cls) ? "pill-selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={classesTaught.includes(cls)}
                      onChange={() => handleToggleClass(cls)}
                    />
                    <span>{cls}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="profile-footer-actions">
              <Button variant="outline" size="md" type="button" onClick={() => setIsEditing(false)}>
                रद्द करें (Cancel)
              </Button>
              <Button variant="primary" size="md" type="submit" icon={<span>💾</span>}>
                सहेजें (Save Changes)
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TeacherProfileModal;
