import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { OFFLINE_PACKAGES } from "../services/mockData";
import lessonService from "../services/lessonService";

export function OfflineLibrary() {
  const { isOnline } = useOfflineStatus();
  const [packages, setPackages] = useState(OFFLINE_PACKAGES);
  const [offlineItems, setOfflineItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  // Offline Content Reader Modal
  const [activeReaderItem, setActiveReaderItem] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Storage usage estimation state
  const [storageInfo, setStorageInfo] = useState({
    available: true,
    usageMB: "Calculating...",
    quotaMB: "",
    percent: 0,
  });

  // Remove confirmation modal
  const [itemToRemove, setItemToRemove] = useState(null);
  const [actionNotice, setActionNotice] = useState("");

  const categories = ["All", "FLN Core", "Math / Ganit", "EVS / Culture", "Voice Engine"];

  const loadOfflineData = async () => {
    const items = lessonService.getOfflineItems();
    setOfflineItems(items);

    const estimate = await lessonService.getStorageEstimate();
    setStorageInfo(estimate);
  };

  useEffect(() => {
    loadOfflineData();
  }, []);

  const filteredPackages =
    filterCategory === "All"
      ? packages
      : packages.filter((p) => p.category === filterCategory);

  const handleDownloadPackage = (pkg) => {
    setActionNotice(`डाउनलोड हो रहा है (Downloading "${pkg.title}")...`);
    setTimeout(() => {
      lessonService.saveToOffline({
        id: pkg.id,
        title: pkg.title,
        category: pkg.category,
        size: pkg.size,
        lessonsCount: pkg.lessonsCount,
        flashcardsCount: pkg.flashcardsCount,
        description: pkg.description,
      });

      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? { ...p, status: "Downloaded", lastSynced: "Just now" }
            : p
        )
      );

      loadOfflineData();
      setActionNotice(`"${pkg.title}" ऑफ़लाइन उपयोग के लिए उपलब्ध है (Available Offline)!`);
      setTimeout(() => setActionNotice(""), 3500);
    }, 600);
  };

  const handleConfirmRemoveOffline = () => {
    if (!itemToRemove) return;
    lessonService.removeFromOffline(itemToRemove.id);

    setPackages((prev) =>
      prev.map((p) =>
        p.id === itemToRemove.id
          ? { ...p, status: "Pending", lastSynced: "Removed from offline" }
          : p
      )
    );

    setItemToRemove(null);
    loadOfflineData();
    setActionNotice(`सामग्री ऑफ़लाइन मेमोरी से हटाई गई (Removed from offline). मूल ऑनलाइन सामग्री सुरक्षित है।`);
    setTimeout(() => setActionNotice(""), 3500);
  };

  const handleOpenOfflineReader = (pkg) => {
    setActiveReaderItem(pkg);
    setIsReaderOpen(true);
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      // Save all packages to offline storage
      packages.forEach((pkg) => {
        lessonService.saveToOffline({
          id: pkg.id,
          title: pkg.title,
          category: pkg.category,
          size: pkg.size,
          lessonsCount: pkg.lessonsCount,
          flashcardsCount: pkg.flashcardsCount,
          description: pkg.description,
        });
      });

      setPackages((prev) =>
        prev.map((p) => ({
          ...p,
          status: "Downloaded",
          lastSynced: "Just now",
        }))
      );
      loadOfflineData();
      setTimeout(() => setSyncSuccess(false), 3500);
    }, 1000);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Offline Educational Library & Sync Hub"
        subtitle="Access synchronized bilingual lessons, worksheets, audio dictionaries, and flashcards without an internet connection."
        badge={isOnline ? "Cloud Sync Ready" : "Local Offline Active"}
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={handleSyncAll}
            disabled={isSyncing}
            icon={<span>{isSyncing ? "⏳" : "🔄"}</span>}
          >
            {isSyncing ? "Synchronizing..." : "Sync All Modules"}
          </Button>
        }
      />

      {/* Sync Status Banner */}
      <div className={`offline-hub-banner ${isOnline ? "banner-online" : "banner-offline"}`}>
        <div className="banner-icon-badge">
          {isOnline ? "🟢" : "🟠"}
        </div>
        <div className="banner-details">
          <h2 className="banner-title">
            {isOnline
              ? "Internet Connection Active • Ready to Sync CRC Updates"
              : "Offline Classroom Mode Active • 100% Local Storage Operation"}
          </h2>
          <p className="banner-subtitle">
            {isOnline
              ? "Your tablet is connected to the internet. You can download newly published curriculum modules from your block or district educational server."
              : "No internet connection detected. All downloaded modules below are fully functioning from local tablet memory with zero data consumption."}
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="offline-action-toast" role="status">
          <span>✅ {actionNotice}</span>
        </div>
      )}

      {syncSuccess && (
        <div className="sync-success-alert" role="alert">
          <span>✓ All educational packages successfully synchronized with cluster server!</span>
        </div>
      )}

      {/* Dynamic Storage Meter Card */}
      <div className="storage-meter-card">
        <div className="meter-header">
          <div className="meter-title-wrap">
            <span className="meter-icon">💾</span>
            <strong>Tablet Internal Storage Reserved for EDUNEXIS:</strong>
          </div>
          <span className="meter-val-text">
            {storageInfo.available ? `${storageInfo.usageMB} (Safe Local Storage)` : "Storage usage unavailable"}
          </span>
        </div>

        <div className="meter-progress-track">
          <div
            className="meter-progress-fill"
            style={{ width: `${Math.max(5, storageInfo.percent || 15)}%` }}
          ></div>
        </div>

        <div className="meter-meta-row">
          <span>{packages.filter((p) => p.status === "Downloaded" || lessonService.isItemOffline(p.id)).length} Offline Bundles Cached</span>
          <span>118 Audio Guides Cached</span>
          <span>100% Available Without SIM Card</span>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="library-filter-bar">
        <span className="filter-label">Filter Packages:</span>
        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip-btn ${filterCategory === cat ? "filter-chip-active" : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="packages-grid">
        {filteredPackages.map((pkg) => {
          const isOfflineDownloaded = pkg.status === "Downloaded" || lessonService.isItemOffline(pkg.id);
          return (
            <div key={pkg.id} className="offline-pkg-card">
              <div className="pkg-header">
                <div className="pkg-icon-box">📁</div>
                <div className="pkg-title-group">
                  <span className="pkg-category-tag">{pkg.category}</span>
                  <h3 className="pkg-title">{pkg.title}</h3>
                </div>
                <span
                  className={`pkg-status-badge ${
                    isOfflineDownloaded ? "status-downloaded" : "status-pending"
                  }`}
                >
                  {isOfflineDownloaded ? "✓ Available Offline" : "⬇ Available Online"}
                </span>
              </div>

              <p className="pkg-desc">{pkg.description}</p>

              <div className="pkg-specs-grid">
                <div className="pkg-spec">
                  <span className="spec-label">Storage Size:</span>
                  <span className="spec-val">{pkg.size}</span>
                </div>
                <div className="pkg-spec">
                  <span className="spec-label">Lesson Plans:</span>
                  <span className="spec-val">{pkg.lessonsCount} Modules</span>
                </div>
                <div className="pkg-spec">
                  <span className="spec-label">Flashcards:</span>
                  <span className="spec-val">{pkg.flashcardsCount} Cards</span>
                </div>
                <div className="pkg-spec">
                  <span className="spec-label">Status:</span>
                  <span className="spec-val">{isOfflineDownloaded ? "Ready on Device" : "Cloud Ready"}</span>
                </div>
              </div>

              {/* Package Action Buttons */}
              <div className="pkg-footer-actions">
                {isOfflineDownloaded ? (
                  <div className="offline-dual-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenOfflineReader(pkg)}
                      icon={<span>📖</span>}
                    >
                      Access Offline Content
                    </Button>
                    <button
                      type="button"
                      className="remove-offline-btn"
                      onClick={() => setItemToRemove(pkg)}
                      title="Remove downloaded data from tablet without deleting original online lesson"
                    >
                      🗑️ Remove from Offline
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleDownloadPackage(pkg)}
                    icon={<span>📥</span>}
                  >
                    Download to Tablet
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remove Confirmation Modal */}
      {itemToRemove && (
        <div className="delete-modal-backdrop" onClick={() => setItemToRemove(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">💾</div>
            <h3 className="delete-modal-title">Remove from Offline Storage?</h3>
            <p className="delete-modal-text">
              Do you want to remove <strong>"{itemToRemove.title}"</strong> from offline tablet cache?
              <br />
              <br />
              <em className="text-muted">
                (Note: The original content will remain safely available in your Online Library and can be downloaded again anytime).
              </em>
            </p>
            <div className="delete-modal-actions">
              <Button variant="outline" size="sm" onClick={() => setItemToRemove(null)}>
                Cancel
              </Button>
              <button
                type="button"
                className="modal-danger-btn"
                onClick={handleConfirmRemoveOffline}
              >
                Yes, Remove from Offline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Content Reader Modal */}
      {isReaderOpen && activeReaderItem && (
        <div className="profile-modal-backdrop" onClick={() => setIsReaderOpen(false)}>
          <div className="offline-reader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reader-modal-header">
              <div className="reader-title-group">
                <span className="reader-badge">📴 Offline Classroom Viewer</span>
                <h2 className="reader-title">{activeReaderItem.title}</h2>
                <span className="reader-category">{activeReaderItem.category} • {activeReaderItem.size}</span>
              </div>
              <button
                type="button"
                className="profile-modal-close-btn"
                onClick={() => setIsReaderOpen(false)}
                aria-label="Close offline viewer"
              >
                ✕
              </button>
            </div>

            <div className="reader-modal-body">
              <div className="reader-offline-notice">
                <span>🟢 <strong>100% Offline Active:</strong> This content is running entirely from local tablet storage. No internet connection is needed.</span>
              </div>

              <div className="reader-module-content">
                <h3 className="reader-section-title">📚 Included Teaching Resources:</h3>
                <div className="reader-resource-cards">
                  <div className="reader-resource-card">
                    <span className="res-icon">📖</span>
                    <div className="res-info">
                      <strong>Bilingual Lesson Plan Blueprint</strong>
                      <p>Full 4-step classroom pedagogy with teacher Hindi prompt and students' mother tongue oral response.</p>
                    </div>
                  </div>
                  <div className="reader-resource-card">
                    <span className="res-icon">🔤</span>
                    <div className="res-info">
                      <strong>Vocabulary Bridge Table</strong>
                      <p>Hindi, Tribal native script, and Devanagari transliteration pairs for classroom chalkboard.</p>
                    </div>
                  </div>
                  <div className="reader-resource-card">
                    <span className="res-icon">🔊</span>
                    <div className="res-info">
                      <strong>Cached Audio Pronunciation Guide</strong>
                      <p>Natural speech synthesized guides cached locally for offline classroom speaker playback.</p>
                    </div>
                  </div>
                  <div className="reader-resource-card">
                    <span className="res-icon">📝</span>
                    <div className="res-info">
                      <strong>Printable Bilingual Worksheets</strong>
                      <p>High-contrast worksheets ready to print or view on tablet in offline mode.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reader-modal-footer">
              <Button variant="primary" size="md" onClick={() => setIsReaderOpen(false)}>
                Done Reading
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfflineLibrary;
