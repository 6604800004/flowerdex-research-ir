import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Flower2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Floating petal animation data
const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  emoji: ["🌸", "🌺", "🌼", "🌷", "💮"][i % 5],
  left: `${8 + (i * 7.5) % 88}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${6 + (i * 1.1) % 5}s`,
  size: `${14 + (i * 3) % 16}px`,
}));

export default function Login() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // ถ้า login แล้วให้ redirect
  useEffect(() => {
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      // แปล error message เป็นไทย
      const msg =
        error.includes("Invalid login credentials")
          ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          : error.includes("Email not confirmed")
          ? "กรุณายืนยันอีเมลก่อน"
          : error.includes("Too many requests")
          ? "ลองใหม่อีกครั้งในภายหลัง (พยายามเกินกำหนด)"
          : "เกิดข้อผิดพลาด กรุณาลองใหม่";
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      navigate("/admin", { replace: true });
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      {/* Floating petals background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PETALS.map((p) => (
          <span
            key={p.id}
            className="absolute opacity-30 animate-float select-none"
            style={{
              left: p.left,
              top: "-2rem",
              fontSize: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, hsl(350 60% 55% / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Back button — top left */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 font-sarabun text-sm text-primary hover:underline transition-colors z-10"
      >
        ← กลับหน้าหลัก
      </button>

      {/* Card */}
      <div
        className={`relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-8 transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Flower2 size={32} className="text-primary" />
          </div>
          <h1 className="font-kanit font-bold text-2xl text-foreground tracking-wide">
            FLOWER DEX
          </h1>
          <p className="font-sarabun text-sm text-muted-foreground mt-1">
            เข้าสู่ระบบผู้ดูแล
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1.5">
              อีเมล
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground font-sarabun text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1.5">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-border bg-background text-foreground font-sarabun text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <span className="text-base leading-none mt-0.5">⚠️</span>
              <p className="font-sarabun text-xs text-destructive leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-kanit text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="font-sarabun text-xs text-muted-foreground text-center mt-6">
          เฉพาะผู้ดูแลระบบเท่านั้น
        </p>
      </div>

      {/* Float + shake keyframes */}
      <style>{`
        @keyframes floatDown {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.3; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation: floatDown linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.45s ease-in-out;
        }
      `}</style>
    </div>
  );
}
