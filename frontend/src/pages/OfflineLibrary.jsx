import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { OFFLINE_PACKAGES } from "../services/mockData";

export function OfflineLibrary() {
  const { isOnline } = useOfflineStatus();
  const [packages, setPackages] = useState(OFFLINE_PACKAGES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "FLN Core", "Math / Ganit", "EVS / Culture", "Voice Engine"];

  const filteredPackages =
    filterCategory === "All"
      ? packages
      : packages.filter((p) => p.category === filterCategory);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      // Mark all as downloaded
      setPackages((prev) =>
        prev.map((p) => ({
          ...p,
          status: "Downloaded",
          lastSynced: "Just now",
        }))
      );
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="feature-page-container">
      <PageHeader
        title="Offline Educational Library & Sync Hub"
        subtitle="Access synchronized bilingual lessons, worksheets, audio dictionaries, and flashcards without an internet connection."
        badge={isOnline ? "Cloud Sync Ready" : "Local Storage Active"}
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
              : "No internet connection detected. All 4 downloaded modules below are fully functioning from local tablet memory with zero data consumption."}
          </p>
        </div>
      </div>

      {syncSuccess && (
        <div className="sync-success-alert" role="alert">
          <span>✓ All educational packages successfully synchronized with cluster server!</span>
        </div>
      )}

      {/* Storage Meter & Health Card */}
      <div className="storage-meter-card">
        <div className="meter-header">
          <div className="meter-title-wrap">
            <span className="meter-icon">💾</span>
            <strong>Tablet Internal Storage Reserved for EDUNEXIS:</strong>
          </div>
          <span className="meter-val-text">121.5 MB of 512 MB Allocated (24% Used)</span>
        </div>

        <div className="meter-progress-track">
          <div className="meter-progress-fill" style={{ width: "24%" }}></div>
        </div>

        <div className="meter-meta-row">
          <span>4 Offline Bundles Synced</span>
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
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="offline-pkg-card">
            <div className="pkg-header">
              <div className="pkg-icon-box">📁</div>
              <div className="pkg-title-group">
                <span className="pkg-category-tag">{pkg.category}</span>
                <h3 className="pkg-title">{pkg.title}</h3>
              </div>
              <span
                className={`pkg-status-badge ${
                  pkg.status === "Downloaded" ? "status-downloaded" : "status-pending"
                }`}
              >
                {pkg.status === "Downloaded" ? "✓ Cached" : "⬇ Ready"}
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
                <span className="spec-label">Last Synced:</span>
                <span className="spec-val">{pkg.lastSynced}</span>
              </div>
            </div>

            <div className="pkg-footer-actions">
              <Button
                variant={pkg.status === "Downloaded" ? "secondary" : "primary"}
                size="sm"
                fullWidth
                icon={<span>{pkg.status === "Downloaded" ? "📖" : "📥"}</span>}
              >
                {pkg.status === "Downloaded" ? "Access Offline Content" : "Download to Tablet"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Backend Integration Note */}
      <div className="backend-ready-notice">
        <div className="notice-icon">💾</div>
        <div className="notice-content">
          <strong>Offline Storage Integration Placeholder:</strong>
          <p>
            Connected to <code>GET /api/v1/offline-sync</code>. Structured for progressive web app (PWA) cache API, Service Worker background synchronization, and SQLite / IndexedDB persistence on Android tablets.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfflineLibrary;
