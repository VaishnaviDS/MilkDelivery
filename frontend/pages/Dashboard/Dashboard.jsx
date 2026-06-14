import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

import "./dashboard.css";

const Dashboard = () => {
  const {
    stats,
    settings,
    updateSettings,
  } = useAdmin();

  const [cowPrice, setCowPrice] = useState(
    settings?.cowPrice || 0
  );

  const [buffaloPrice, setBuffaloPrice] = useState(
    settings?.buffaloPrice || 0
  );

  // =========================
  // ✅ SAVE SETTINGS
  // =========================
  const handleSave = async () => {
    await updateSettings({
      cowPrice,
      buffaloPrice,
    });

    alert("Settings Updated");
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">
        Dashboard
      </h1>

      {/* ========================= */}
      {/* ✅ STATS */}
      {/* ========================= */}
      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <h3>Total Families</h3>
          <p>{stats.totalFamilies}</p>
        </div>

        <div className="admin-dashboard-card admin-card-revenue">
          <h3>Total Revenue</h3>

          <p>
            ₹{" "}
            {Number(
              stats.totalRevenue || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="admin-dashboard-card admin-card-litres">
          <h3>Total Litres</h3>

          <p>
            {Number(
              stats.totalLitres || 0
            ).toFixed(2)}{" "}
            L
          </p>
        </div>

        <div className="admin-dashboard-card">
          <h3>Total Entries</h3>

          <p>{stats.totalEntries}</p>
        </div>
      </div>

      {/* ========================= */}
      {/* ✅ SETTINGS */}
      {/* ========================= */}
<div className="settings-container">
  <h2 className="settings-title">
    ⚙️ Milk Price Settings
  </h2>

  <div className="settings-group">
    <label>Cow Milk Price</label>

    <input
      type="number"
      value={cowPrice}
      onChange={(e) => setCowPrice(e.target.value)}
      className="settings-input"
    />
  </div>

  <div className="settings-group">
    <label>Buffalo Milk Price</label>

    <input
      type="number"
      value={buffaloPrice}
      onChange={(e) => setBuffaloPrice(e.target.value)}
      className="settings-input"
    />
  </div>

  <button
    className="settings-save-btn"
    onClick={handleSave}
  >
    Save Settings
  </button>
</div>
    </div>
  );
};

export default Dashboard;