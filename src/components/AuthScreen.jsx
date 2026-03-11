import { useState } from "react";
import { supabase } from "../supabase";
import { Wand2, Star, BookOpen } from "lucide-react";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (!name.trim()) {
          setError("נָא לְהַזִּין שֵׁם");
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        });
        if (error) throw error;

        // Create progress row
        if (data.user) {
          await supabase.from("user_progress").upsert({
            user_id: data.user.id,
            name,
            reading_current_level: 1,
            reading_stars: {},
            math_current_level: 1,
            math_stars: {},
            grammar_current_level: 1,
            grammar_stars: {},
          });
        }
      }
    } catch (err) {
      const msgs = {
        "Invalid login credentials": "הָאִמַיְל אוֹ הַסִּיסְמָה שְׁגוּיִים",
        "User already registered": "הָאִמַיְל כְּבָר בְּשִׁמּוּשׁ",
        "Password should be at least 6 characters": "הַסִּיסְמָה חַלָּשָׁה מִדַּי (לְפָחוֹת 6 תָּוִים)",
        "Unable to validate email address: invalid format": "כְּתֹבֶת אִמַיְל לֹא תְּקִינָה",
      };
      setError(msgs[err.message] || err.message || "אֵרְעָה שְׁגִיאָה. נַסֵּה שׁוּב.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden star-bg"
      style={{ background: "linear-gradient(135deg, #0d0520 0%, #1a0a2e 50%, #0f172a 100%)" }}
    >
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float pointer-events-none"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.4}s`,
            fontSize: "1.5rem",
          }}
        >
          {["✨", "⭐", "🌟", "💫", "✨", "⭐", "🌟", "💫"][i]}
        </div>
      ))}

      {/* Card */}
      <div
        className="w-full max-w-md relative z-10"
        style={{
          background: "rgba(26, 10, 46, 0.95)",
          border: "2px solid rgba(124, 58, 237, 0.5)",
          borderRadius: "24px",
          boxShadow: "0 0 60px rgba(124,58,237,0.3), 0 0 120px rgba(124,58,237,0.1)",
          padding: "2rem",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-float">🧙‍♂️</div>
          <h1
            style={{
              fontFamily: "Alef, sans-serif",
              color: "#f59e0b",
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            אֲקָדֶמְיַת הַקּוֹסְמִים
          </h1>
          <p style={{ color: "#c084fc", fontSize: "1rem", marginTop: "0.5rem" }}>
            {isLogin ? "בְּרוּכִים הַשָּׁבִים! 🌟" : "הִצְטָרְפוּ לָאֲקָדֶמְיָה! ✨"}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl overflow-hidden mb-6"
          style={{ border: "1px solid rgba(124,58,237,0.4)" }}
        >
          {[
            { label: "כְּנִיסָה", val: true },
            { label: "הִירָשְׁמוּ", val: false },
          ].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => { setIsLogin(val); setError(""); setSuccessMsg(""); }}
              className="flex-1 py-3 text-center font-bold transition-all"
              style={{
                background:
                  isLogin === val
                    ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                    : "transparent",
                color: isLogin === val ? "#fff" : "#a78bfa",
                fontSize: "1rem",
                fontFamily: "Assistant, sans-serif",
                border: "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label style={{ color: "#c084fc", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
                👤 שֵׁם הַקּוֹסֵם
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הַשֵּׁם שֶׁלִּי הוּא..."
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ color: "#c084fc", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
              📧 אִמַיְל
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
            />
          </div>
          <div>
            <label style={{ color: "#c084fc", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
              🔒 סִיסְמָה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "12px",
              padding: "0.75rem",
              marginTop: "1rem",
              color: "#fca5a5",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: "rgba(52,211,153,0.15)",
              border: "1px solid rgba(52,211,153,0.4)",
              borderRadius: "12px",
              padding: "0.75rem",
              marginTop: "1rem",
              color: "#34d399",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {successMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-4 font-bold text-lg transition-all active:scale-95"
          style={{
            background: loading
              ? "#4c1d95"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#1a0a2e",
            borderRadius: "16px",
            fontSize: "1.2rem",
            fontFamily: "Alef, sans-serif",
            boxShadow: loading ? "none" : "0 0 20px rgba(245,158,11,0.4)",
            border: "none",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading
            ? "⏳ רֶגַע..."
            : isLogin
            ? "🚪 כְּנִיסָה לָאֲקָדֶמְיָה"
            : "✨ הִצְטָרְפוּ עַכְשָׁו!"}
        </button>

        <div className="flex justify-center gap-4 mt-6" style={{ opacity: 0.4 }}>
          <Star size={20} color="#f59e0b" />
          <BookOpen size={20} color="#818cf8" />
          <Wand2 size={20} color="#34d399" />
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(124,58,237,0.4)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "#f3e8ff",
  fontSize: "1rem",
  fontFamily: "Assistant, sans-serif",
  outline: "none",
};
