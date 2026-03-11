import { useState } from "react";
import { supabase } from "../supabase";
import { ROOMS } from "../data";
import { ChevronRight, Star, CheckCircle, XCircle } from "lucide-react";

export default function GameEngine({ user, roomId, levelId, onBack, onComplete }) {
  const room = ROOMS.find((r) => r.id === roomId);
  const level = room.levels.find((l) => l.id === levelId);

  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [storyPage, setStoryPage] = useState(0);

  const questions = level.questions;
  const totalQ = questions.length;
  const isReading = roomId === "reading";

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const correct = selected === questions[currentQ].answer;
    const newAnswers = [...answers, { selected, correct }];
    setAnswers(newAnswers);
    setSelected(null);
    setShowFeedback(false);

    if (currentQ + 1 < totalQ) {
      setCurrentQ(currentQ + 1);
    } else {
      const correctCount = newAnswers.filter((a) => a.correct).length;
      const stars = correctCount === totalQ ? 3 : correctCount >= totalQ - 1 ? 2 : 1;
      saveProgress(stars);
      setPhase("result");
    }
  };

  const saveProgress = async (stars) => {
    try {
      // Fetch current progress
      const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data) return;

      const starsKey = `${roomId}_stars`;
      const levelKey = `${roomId}_current_level`;
      const prevStars = data[starsKey]?.[levelId] || 0;
      const newStars = {
        ...data[starsKey],
        [levelId]: Math.max(prevStars, stars),
      };
      const nextLevel = Math.max(data[levelKey] || 1, levelId + 1);

      await supabase
        .from("user_progress")
        .update({
          [starsKey]: newStars,
          [levelKey]: nextLevel,
        })
        .eq("user_id", user.id);
    } catch (e) {
      console.error("Save progress error:", e);
    }
  };

  const correctCount = answers.filter((a) => a.correct).length;
  const finalStars =
    correctCount === totalQ ? 3 : correctCount >= totalQ - 1 ? 2 : 1;

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameShell room={room} level={level} onBack={onBack}>
        <div className="flex-1 overflow-y-auto p-4">
          {isReading ? (
            <>
              <h2 style={titleStyle}> 📖 {level.title}</h2>
              <div style={storyBox}>
                <p className="story-text" style={{ color: "#e9d5ff" }}>
                  {level.story[storyPage]}
                </p>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {level.story.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: i === storyPage ? "#f59e0b" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {storyPage > 0 && (
                  <button onClick={() => setStoryPage((p) => p - 1)} style={btnSecondary}>
                    ⬅ הקודם
                  </button>
                )}
                {storyPage < level.story.length - 1 ? (
                  <button onClick={() => setStoryPage((p) => p + 1)} style={btnPrimary} className="flex-1">
                    הַמִּשֵּׁךְ ⬇
                  </button>
                ) : (
                  <button onClick={() => setPhase("questions")} style={btnGold} className="flex-1">
                    לַשְּׁאֵלוֹת! 🧙
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 style={titleStyle}>{room.emoji} {level.title}</h2>
              <div style={storyBox}>
                <p className="story-text" style={{ color: "#e9d5ff", fontSize: "1.2rem" }}>
                  {level.story || level.intro}
                </p>
              </div>
              <button onClick={() => setPhase("questions")} style={btnGold} className="w-full">
                בּוֹאוּ נִפְתֹּר! 🔮
              </button>
            </>
          )}
        </div>
      </GameShell>
    );
  }

  // ── QUESTIONS ─────────────────────────────────────────────────────────────
  if (phase === "questions") {
    const q = questions[currentQ];
    const isCorrect = selected === q.answer;

    return (
      <GameShell room={room} level={level} onBack={onBack}>
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>
              שְׁאֵלָה {currentQ + 1} מִתּוֹךְ {totalQ}
            </span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", height: "8px" }}>
              <div style={{
                width: `${(currentQ / totalQ) * 100}%`,
                background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
                height: "100%", borderRadius: "9999px", transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div style={storyBox}>
            <p style={{ color: "#f3e8ff", fontSize: "1.2rem", fontWeight: 600, lineHeight: 1.8, fontFamily: "Alef" }}>
              {q.q}
            </p>
            {q.hint && selected !== null && !isCorrect && (
              <p style={{ color: "#fbbf24", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                💡 רֶמֶז: {q.hint}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, i) => {
              let bg = "rgba(255,255,255,0.05)";
              let border = "rgba(255,255,255,0.1)";
              let color = "#e9d5ff";
              if (selected !== null) {
                if (i === q.answer) { bg = "rgba(52,211,153,0.2)"; border = "#34d399"; color = "#34d399"; }
                else if (i === selected && !isCorrect) { bg = "rgba(239,68,68,0.2)"; border = "#ef4444"; color = "#ef4444"; }
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="text-right py-4 px-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
                  style={{ background: bg, border: `2px solid ${border}`, color, fontSize: "1.1rem", fontFamily: "Alef, sans-serif", lineHeight: 1.6, cursor: selected !== null ? "default" : "pointer" }}>
                  <span>{opt}</span>
                  <span style={{ fontSize: "1.3rem", marginRight: "auto", marginLeft: "0.75rem" }}>
                    {["א", "ב", "ג", "ד"][i]}
                  </span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={{
              marginTop: "1rem", padding: "1rem", borderRadius: "16px",
              background: isCorrect ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${isCorrect ? "#34d399" : "#ef4444"}`,
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              {isCorrect ? <CheckCircle size={24} color="#34d399" /> : <XCircle size={24} color="#ef4444" />}
              <span style={{ color: isCorrect ? "#34d399" : "#fca5a5", fontSize: "1.1rem", fontFamily: "Alef" }}>
                {isCorrect ? "כָּל הַכָּבוֹד! תְּשׁוּבָה נְכוֹנָה! 🌟" : "לֹא מְדֻיָּק, נַסֵּה שׁוּב 💪"}
              </span>
            </div>
          )}

          {selected !== null && (
            <button onClick={handleNext} style={btnGold} className="w-full mt-4">
              {currentQ + 1 < totalQ ? "הַבָּאָה ➡" : "סִיּוּם! 🎉"}
            </button>
          )}
        </div>
      </GameShell>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  return (
    <GameShell room={room} level={level} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div style={{ fontSize: "5rem", marginBottom: "1rem", animation: "float 2s ease-in-out infinite" }}>
          {finalStars === 3 ? "🏆" : finalStars === 2 ? "🎉" : "💪"}
        </div>
        <h2 style={{ color: "#f59e0b", fontSize: "2rem", fontWeight: 700, fontFamily: "Alef", marginBottom: "0.5rem" }}>
          {finalStars === 3 ? "מְעוּלֶּה!" : finalStars === 2 ? "טוֹב מְאֹד!" : "נִסָּיוֹן טוֹב!"}
        </h2>
        <div className="flex gap-3 my-4">
          {[1, 2, 3].map((s) => (
            <Star key={s} size={44}
              fill={s <= finalStars ? "#fbbf24" : "transparent"}
              color={s <= finalStars ? "#fbbf24" : "#4b5563"}
              style={{ filter: s <= finalStars ? "drop-shadow(0 0 8px #fbbf24)" : "none" }}
            />
          ))}
        </div>
        <p style={{ color: "#c084fc", fontSize: "1.2rem", marginBottom: "2rem" }}>
          עָנִיתָ נָכוֹן עַל {correctCount} מִתּוֹךְ {totalQ} שְׁאֵלוֹת
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={onComplete} style={btnGold}>חֲזָרָה לַמַּפָּה 🗺️</button>
          <button onClick={() => { setPhase("intro"); setCurrentQ(0); setAnswers([]); setSelected(null); setShowFeedback(false); setStoryPage(0); }} style={btnSecondary}>
            נַסֵּה שׁוּב 🔄
          </button>
        </div>
      </div>
    </GameShell>
  );
}

function GameShell({ room, level, onBack, children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0d0520 0%, #1a0a2e 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
        style={{ background: "rgba(13,5,32,0.95)", borderBottom: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(10px)" }}>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 rounded-xl active:scale-95"
          style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
          <ChevronRight size={18} />
          <span style={{ fontSize: "0.9rem" }}>חֲזָרָה</span>
        </button>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontFamily: "Alef", fontSize: "1rem" }}>
          {room.emoji} שְׁלַב {level.id}
        </div>
        <div style={{ width: "80px" }} />
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

const titleStyle = { color: "#f59e0b", fontSize: "1.4rem", fontWeight: 700, fontFamily: "Alef", marginBottom: "1rem", textAlign: "center" };
const storyBox = { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem" };
const btnPrimary = { background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff", borderRadius: "16px", padding: "1rem", fontFamily: "Alef, sans-serif", fontSize: "1.1rem", fontWeight: 700, border: "none" };
const btnGold = { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#1a0a2e", borderRadius: "16px", padding: "1rem", fontFamily: "Alef, sans-serif", fontSize: "1.1rem", fontWeight: 700, border: "none", boxShadow: "0 4px 15px rgba(245,158,11,0.4)" };
const btnSecondary = { background: "rgba(255,255,255,0.08)", color: "#c084fc", borderRadius: "16px", padding: "1rem", fontFamily: "Alef, sans-serif", fontSize: "1rem", fontWeight: 600, border: "1px solid rgba(124,58,237,0.3)" };
