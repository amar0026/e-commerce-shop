import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  ShoppingBag, Zap, ChevronRight, Home
} from "lucide-react";
import { useAuth } from "./authcontext";

/* ─────────────────────────────────────────────
   Dot-grid floating particle
───────────────────────────────────────────── */
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 6, height: 6,
        background: "rgba(249,115,22,.18)",
        ...style,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   LoginPage
───────────────────────────────────────────── */
export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  /* Where to redirect after login */
  const from = (location.state as any)?.from || "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fade = (d: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .7s ${d}s cubic-bezier(.16,1,.3,1), transform .7s ${d}s cubic-bezier(.16,1,.3,1)`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      setLoading(false);
      if (ok) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid email or password. Try: uttamgupta628@gmail.com / password123");
      }
    }, 800);
  };

  const inp = `w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl text-[13px] text-[#111] outline-none transition-all duration-200 placeholder:text-gray-400
    focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes shimmerText{ 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes particleFloat {
          0%   { transform:translateY(0)   scale(1);   opacity:.7; }
          50%  { transform:translateY(-22px) scale(1.2); opacity:.4; }
          100% { transform:translateY(0)   scale(1);   opacity:.7; }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(28px) scale(.97); }
          to   { opacity:1; transform:none; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div
        className="relative min-h-screen bg-white flex flex-col"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* dot-grid bg */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 18s linear infinite",
          }}
        />

        {/* Floating particles */}
        {[
          { top:"12%", left:"8%",  animationDelay:"0s",    animationDuration:"4s" },
          { top:"25%", left:"92%", animationDelay:"1.2s",  animationDuration:"5s" },
          { top:"65%", left:"5%",  animationDelay:"0.6s",  animationDuration:"4.5s" },
          { top:"78%", left:"88%", animationDelay:"2s",    animationDuration:"3.8s" },
          { top:"45%", left:"96%", animationDelay:"0.3s",  animationDuration:"5.2s" },
          { top:"90%", left:"15%", animationDelay:"1.8s",  animationDuration:"4.2s" },
        ].map((s, i) => (
          <Particle key={i} style={{ ...s, animation: `particleFloat ${s.animationDuration} ${s.animationDelay} ease-in-out infinite` }} />
        ))}

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
            <div className="text-[12px] text-gray-400 flex items-center gap-1.5">
              <button
                onClick={() => navigate("/")}
                className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] flex items-center gap-1"
              >
                <Home size={12} />Home
              </button>
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-[#111] font-semibold">Login</span>
            </div>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-14">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-black/8 shadow-[0_32px_80px_rgba(0,0,0,.1)]"
            style={{ animation: "cardIn .6s cubic-bezier(.16,1,.3,1)" }}>

            {/* ── LEFT PANEL — brand ── */}
            <div
              className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden"
              style={{ background: "linear-gradient(135deg,#111 0%,#1c1c1c 50%,#2a1500 100%)" }}
            >
              {/* inner dot grid */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.09) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

              {/* glow blobs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(249,115,22,.25) 0%,transparent 70%)" }} />
              <div className="absolute -bottom-16 right-0 w-56 h-56 rounded-full pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(234,88,12,.2) 0%,transparent 70%)" }} />

              {/* Logo */}
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white" />
                  </div>
                  <span className="font-black text-white text-lg tracking-tight">GarmentStore</span>
                </div>
                <div className="w-8 h-0.5 bg-orange-500 rounded-full" />
              </div>

              {/* Headline */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
                <p className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-400 mb-3 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-orange-500 rounded-full inline-block" />
                  Welcome Back
                </p>
                <h2
                  className="font-black text-white leading-[.9] tracking-tight mb-4"
                  style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}
                >
                  Your Style,{" "}
                  <span
                    className="italic block"
                    style={{
                      background: "linear-gradient(90deg,#f97316,#fbbf24,#f97316)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "shimmerText 3s linear infinite",
                    }}
                  >
                    Your Cart.
                  </span>
                </h2>
                <p className="text-white/50 text-[13px] leading-relaxed max-w-xs">
                  Sign in to access your wishlist, track orders, and enjoy personalized fashion recommendations.
                </p>

                {/* Feature pills */}
                <div className="flex flex-col gap-2 mt-7">
                  {[
                    { icon:"✨", text:"Exclusive member discounts" },
                    { icon:"📦", text:"Real-time order tracking" },
                    { icon:"❤️",  text:"Save items to wishlist" },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-2.5">
                      <span className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-sm shrink-0">
                        {f.icon}
                      </span>
                      <span className="text-white/60 text-[12px] font-medium">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom badge */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["#f97316","#ea580c","#111"].map((c,i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-[9px] text-white" style={{ background:c }}>
                      {["U","G","A"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-[11px]">
                  <strong className="text-white/80">2,400+</strong> shoppers joined this week
                </p>
              </div>
            </div>

            {/* ── RIGHT PANEL — form ── */}
            <div className="bg-white flex flex-col justify-center px-8 py-10 sm:px-12">

              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={15} className="text-white" />
                </div>
                <span className="font-black text-[#111] text-base">GarmentStore</span>
              </div>

              <div style={fade(0.05)}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-0.5 bg-orange-500 rounded-full" />
                  <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">
                    Welcome Back
                  </span>
                </div>
                <h1
                  className="font-black text-[#111] leading-tight tracking-tight mb-1.5"
                  style={{ fontSize: "clamp(1.6rem,3vw,2.1rem)" }}
                >
                  Sign in to your{" "}
                  <em className="text-orange-500 not-italic" style={{ fontStyle:"italic" }}>
                    account
                  </em>
                </h1>
                <p className="text-[12px] text-gray-400 mb-8">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                  >
                    Sign up free →
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div style={fade(0.14)}>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className={inp}
                      style={{ borderColor: error ? "#ef4444" : undefined }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={fade(0.22)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[11px] text-orange-500 font-semibold hover:text-orange-600 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter your password"
                      className={inp + " pr-11"}
                      style={{ borderColor: error ? "#ef4444" : undefined }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-[11px] text-red-600 font-medium"
                    style={{ animation:"cardIn .3s cubic-bezier(.16,1,.3,1)" }}>
                    <span className="text-red-400 shrink-0 mt-0.5">⚠</span>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div style={fade(0.30)}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 bg-orange-500 text-white font-bold text-[12px] tracking-[.16em] uppercase py-3.5 rounded-2xl cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {!loading && <span className="absolute inset-0 bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />}
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                        style={{ animation:"spin .7s linear infinite" }} />
                    ) : (
                      <>
                        <Zap size={14} className="relative z-10" />
                        <span className="relative z-10">Sign In</span>
                        <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div style={fade(0.36)} className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] text-gray-300 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Social buttons */}
                <div style={fade(0.42)} className="grid grid-cols-2 gap-2">
                  {[
                    { label:"Google",   bg:"#fff", border:"#e5e7eb", icon:"G", iconColor:"#ea4335" },
                    { label:"Facebook", bg:"#fff", border:"#e5e7eb", icon:"f", iconColor:"#1877f2" },
                  ].map(s => (
                    <button
                      key={s.label}
                      type="button"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-[12px] font-semibold text-gray-600 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer"
                      style={{ background:s.bg, borderColor:s.border }}
                    >
                      <span className="font-black text-[14px]" style={{ color:s.iconColor }}>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>

              </form>

              {/* Footer note */}
              <p style={fade(0.50)} className="text-center text-[11px] text-gray-300 mt-6">
                By signing in, you agree to our{" "}
                <span className="text-orange-500 cursor-pointer hover:underline">Terms</span>
                {" & "}
                <span className="text-orange-500 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}