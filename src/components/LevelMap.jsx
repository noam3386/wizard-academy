import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ROOMS } from "../data";
import { Lock, Star, ChevronRight, LogOut } from "lucide-react";

export default function LevelMap({ user, progress, onSelectLevel }) {
  const [activeRoom, setActiveRoom] = useState(0);
  const room = ROOMS[activeRoom];
  const roomProgress = progress?.[room.id] || { currentLevel: 1, stars: {} };

  const totalStars = Object.values(progress || {}).reduce((acc, r) => {
    return acc + Object.values(r.stars || {}).reduce((s, v) => s + v, 0);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #0d0520 0%, #1a0a2e 100%)" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20"
        style={{
          background: "rgba(13,5,32,0.95)",
          borderBottom: "1px solid rgba(124,58,237,0.3)",
          backdropFilter: "blur(10px)",
        }}>
        <button onClick={() => signOut(auth)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl active:scale-95 transition-all"
          style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}>
          <LogOut size={16} />
          <span style={{ fontSize: "0.85rem" }}>יְצִיאָה</span>
        </button>

        <div className="text-center">
          <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "1.1rem", fontFamily: "Alef" }}>
            🧙‍♂️ {user.displayName || "קוֹסֵם"}
          </div>
          <div className="flex items-center justify-center gap-1" style={{ color: "#fbbf24", fontSize: "0.85rem" }}>
            <Star size={14} fill="#fbbf24" />
            <span>{totalStars} כּוֹכָבִים</span>
          </div>
        </div>

        <div style={{ width: "80px" }} /> {/* spacer */}
      </header>

      {/* Room Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {ROOMS.map((r, i) => (
          <button key={r.id} onClick={() => setActiveRoom(i)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all active:scale-95"
            style={{
              background: activeRoom === i
                ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                : "rgba(255,255,255,0.05)",
              border: activeRoom === i ? "2px solid #a78bfa" : "2px solid rgba(124,58,237,0.2)",
              minWidth: "90px",
            }}>
            <span style={{ fontSize: "1.6rem" }}>{r.emoji}</span>
            <span style={{ color: activeRoom === i ? "#fff" : "#a78bfa", fontSize: "0.8rem", fontWeight: 600 }}>
              {r.shortName}
            </span>
          </button>
        ))}
      </div>

      {/* Room Banner */}
      <div className="mx-4 mb-4 p-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(124,58,237,0.2), rgba(30,58,95,0.3))`,
          border: `1px solid ${room.accent}44`,
        }}>
        <h2 style={{ color: room.accent, fontSize: "1.3rem", fontWeight: 700, fontFamily: "Alef" }}>
          {room.emoji} {room.name}
        </h2>
        <p style={{ color: "#c084fc", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          {room.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div style={{
            background: "rgba(245,158,11,0.2)", borderRadius: "8px",
            padding: "2px 10px", color: "#fbbf24", fontSize: "0.85rem"
          }}>
            ⭐ {Object.values(roomProgress.stars || {}).reduce((a, b) => a + b, 0)} / {room.levels.length * 3}
          </div>
          <div style={{
            background: "rgba(124,58,237,0.2)", borderRadius: "8px",
            padding: "2px 10px", color: "#a78bfa", fontSize: "0.85rem"
          }}>
            שְׁלַב {roomProgress.currentLevel} / {room.levels.length}
          </div>
        </div>
      </div>

      {/* Level Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-4 gap-3">
          {room.levels.map((level) => {
            const levelNum = level.id;
            const isUnlocked = levelNum <= roomProgress.currentLevel;
            const isCompleted = levelNum < roomProgress.currentLevel;
            const stars = roomProgress.stars?.[levelNum] || 0;
            const isCurrent = levelNum === roomProgress.currentLevel;

            return (
              <button key={levelNum}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onSelectLevel(room.id, levelNum)}
                className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all active:scale-95"
                style={{
                  background: isCompleted
                    ? "linear-gradient(135deg, #7c3aed44, #5b21b644)"
                    : isCurrent
                    ? "linear-gradient(135deg, #f59e0b33, #d9770633)"
                    : "rgba(255,255,255,0.03)",
                  border: isCurrent
                    ? "2px solid #f59e0b"
                    : isCompleted
                    ? "2px solid #7c3aed"
                    : "2px solid rgba(255,255,255,0.08)",
                  boxShadow: isCurrent ? "0 0 15px rgba(245,158,11,0.3)" : "none",
                  opacity: isUnlocked ? 1 : 0.4,
                  cursor: isUnlocked ? "pointer" : "default",
                  animation: isCurrent ? "pulse-gold 2s ease-in-out infinite" : "none",
                }}>
                <span style={{ fontSize: "1.2rem" }}>
                  {!isUnlocked ? "🔒" : isCompleted ? "✅" : isCurrent ? "⚡" : "📝"}
                </span>
                <span style={{ color: isCurrent ? "#fbbf24" : isCompleted ? "#a78bfa" : "#6b7280", fontWeight: 700, fontSize: "1rem" }}>
                  {levelNum}
                </span>
                {isCompleted && stars > 0 && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star key={s} size={10} fill={s <= stars ? "#fbbf24" : "transparent"} color={s <= stars ? "#fbbf24" : "#4b5563"} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
