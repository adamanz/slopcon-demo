"use client";

import { useState } from "react";

interface Walk {
  id: number;
  distance: number; // km
  time: number; // minutes
  date: string;
}

export default function WalkingPage() {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const addWalk = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (!d || !t || d <= 0 || t <= 0) return;
    setWalks((prev) => [
      { id: Date.now(), distance: d, time: t, date: new Date().toLocaleDateString() },
      ...prev,
    ]);
    setDistance("");
    setTime("");
  };

  const totalDistance = walks.reduce((s, w) => s + w.distance, 0);
  const totalTime = walks.reduce((s, w) => s + w.time, 0);
  const avgPace = totalTime > 0 ? totalTime / totalDistance : 0;

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "system-ui", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>🚶 Strava for Walking</h1>
      <p style={{ color: "#666", marginTop: 0 }}>Log your walks. See your stats.</p>

      {/* Stats Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", margin: "1.5rem 0" }}>
        <StatCard label="Total Distance" value={`${totalDistance.toFixed(1)} km`} />
        <StatCard label="Total Time" value={`${totalTime.toFixed(0)} min`} />
        <StatCard label="Avg Pace" value={avgPace ? `${avgPace.toFixed(1)} min/km` : "—"} />
      </div>

      {/* Log Form */}
      <form onSubmit={addWalk} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          step="1"
          min="1"
          placeholder="Time (min)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>+ Log Walk</button>
      </form>

      {/* Walk History */}
      {walks.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center" }}>No walks yet. Log your first one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {walks.map((w) => (
            <li key={w.id} style={rowStyle}>
              <span style={{ fontWeight: 500 }}>{w.distance} km</span>
              <span style={{ color: "#666" }}>{w.time} min</span>
              <span style={{ color: "#999", fontSize: "0.85rem" }}>{w.date}</span>
              <span style={{ color: "#888", fontSize: "0.85rem" }}>
                {(w.time / w.distance).toFixed(1)} min/km
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
      <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>{label}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 120,
  padding: "0.5rem 0.75rem",
  border: "1px solid #ddd",
  borderRadius: 6,
  fontSize: "0.95rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "0.95rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.75rem 0",
  borderBottom: "1px solid #eee",
};
