import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useProgress } from "./hooks/useProgress";
import AuthScreen from "./components/AuthScreen";
import LevelMap from "./components/LevelMap";
import GameEngine from "./components/GameEngine";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [view, setView] = useState("map");
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);

  const { progress, loading: progressLoading } = useProgress(user || null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading splash
  if (user === undefined || (user && progressLoading)) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0d0520, #1a0a2e)",
      }}>
        <div style={{ fontSize: "5rem", animation: "float 2s ease-in-out infinite" }}>🧙‍♂️</div>
        <p style={{ color: "#a78bfa", fontSize: "1.3rem", marginTop: "1rem", fontFamily: "Alef" }}>
          טוֹעֵן אֶת הַקְּסָמִים...
        </p>
        <div style={{ width: "120px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", marginTop: "1.5rem", overflow: "hidden" }}>
          <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, #7c3aed, #f59e0b)", borderRadius: "9999px", animation: "shimmer 1.2s ease-in-out infinite" }} />
        </div>
        <style>{`
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        `}</style>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (view === "game" && activeRoom && activeLevel) {
    return (
      <GameEngine
        user={user}
        roomId={activeRoom}
        levelId={activeLevel}
        onBack={() => setView("map")}
        onComplete={() => setView("map")}
      />
    );
  }

  return (
    <LevelMap
      user={user}
      progress={progress}
      onSelectLevel={(roomId, levelId) => {
        setActiveRoom(roomId);
        setActiveLevel(levelId);
        setView("game");
      }}
    />
  );
}
