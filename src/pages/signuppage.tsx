import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  ShoppingBag, Zap, ChevronRight, Home, Phone, Check
} from "lucide-react";
import { useAuth } from "./authcontext";

export default function SignupPage() {
  const navigate  = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPw,  setShowPw]  = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [errors,  setErrors]  = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  const fade = (d: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .7s ${d}s cubic-bezier(.16,1,.3,1), transform .7s ${d}s cubic-bezier(.16,1,.3,1)`,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6)   e.password = "Min 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      signup(form.firstName, form.lastName, form.email, form.password);
      setLoading(false);
      navigate("/", { replace: true });
    }, 900);
  };

  /* Password strength */
  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#16a34a"][strength];

  const inp = (k: string) =>
    `w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl text-[13px] text-[#111] outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 ${errors[k] ? "border-red-400 bg-red-50/30" : "border-gray-200"}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes shimmerText{ 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes cardIn     { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes particleFloat {
          0%,100% { transform:translateY(0) scale(1);   opacity:.7; }
          50%     { transform:translateY(-22px) scale(1.2); opacity:.4; }
        }
      `}</style>

      <div className="relative min-h-screen bg-white flex flex-col" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* bg dots */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.07) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 18s linear infinite" }}/>

        {/* top stripe */}
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50"
          style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>

        {/* floating particles */}
        {[
          { top:"10%", left:"6%",  animationDelay:"0s",    animationDuration:"4s" },
          { top:"30%", left:"94%", animationDelay:"1s",    animationDuration:"5s" },
          { top:"60%", left:"4%",  animationDelay:"0.5s",  animationDuration:"4.5s" },
          { top:"80%", left:"90%", animationDelay:"1.8s",  animationDuration:"3.8s" },
        ].map((s,i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{ ...s, background:"rgba(249,115,22,.18)", animation:`particleFloat ${s.animationDuration} ${s.animationDelay} ease-in-out infinite` }}/>
        ))}

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
            <div className="text-[12px] text-gray-400 flex items-center gap-1.5">
              <button onClick={()=>navigate("/")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] flex items-center gap-1">
                <Home size={12}/>Home
              </button>
              <ChevronRight size={11} className="text-gray-300"/>
              <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="text-[#111] font-semibold">Sign Up</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-14">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-black/8 shadow-[0_32px_80px_rgba(0,0,0,.1)]"
            style={{ animation:"cardIn .6s cubic-bezier(.16,1,.3,1)" }}>

            {/* ── LEFT brand panel ── */}
            <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden order-last lg:order-first"
              style={{ background:"linear-gradient(135deg,#111 0%,#1c1c1c 50%,#2a1500 100%)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.09) 1px,transparent 1px)", backgroundSize:"22px 22px" }}/>
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(249,115,22,.25) 0%,transparent 70%)" }}/>
              <div className="absolute -bottom-16 left-0 w-56 h-56 rounded-full pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(234,88,12,.2) 0%,transparent 70%)" }}/>

              {/* Logo */}
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={18} className="text-white"/>
                  </div>
                  <span className="font-black text-white text-lg tracking-tight">GarmentStore</span>
                </div>
                <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
              </div>

              {/* Headline */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
                <p className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-400 mb-3 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-orange-500 rounded-full inline-block"/>
                  New Here?
                </p>
                <h2 className="font-black text-white leading-[.9] tracking-tight mb-4" style={{ fontSize:"clamp(2.2rem,4vw,3.2rem)" }}>
                  Join the{" "}
                  <span className="italic block" style={{ background:"linear-gradient(90deg,#f97316,#fbbf24,#f97316)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmerText 3s linear infinite" }}>
                    Fashion Club.
                  </span>
                </h2>
                <p className="text-white/50 text-[13px] leading-relaxed max-w-xs">
                  Create your free account and unlock exclusive deals, faster checkout, and a personalised shopping experience.
                </p>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5 mt-7">
                  {[
                    "Free account, no credit card needed",
                    "Early access to new arrivals",
                    "Members-only sale alerts",
                    "Easy returns & tracking",
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-orange-400"/>
                      </div>
                      <span className="text-white/60 text-[12px] font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="relative z-10">
                <p className="text-white/30 text-[11px]">Already have an account?{" "}
                  <Link to="/login" className="text-orange-400 font-bold hover:text-orange-300 transition-colors">Sign in →</Link>
                </p>
              </div>
            </div>

            {/* ── RIGHT form panel ── */}
            <div className="bg-white flex flex-col justify-center px-8 py-10 sm:px-12">

              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={15} className="text-white"/>
                </div>
                <span className="font-black text-[#111] text-base">GarmentStore</span>
              </div>

              <div style={fade(0.05)}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-0.5 bg-orange-500 rounded-full"/>
                  <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">Create Account</span>
                </div>
                <h1 className="font-black text-[#111] leading-tight tracking-tight mb-1.5" style={{ fontSize:"clamp(1.5rem,2.5vw,2rem)" }}>
                  Start your{" "}
                  <em className="text-orange-500" style={{ fontStyle:"italic" }}>free account</em>
                </h1>
                <p className="text-[12px] text-gray-400 mb-7">
                  Already have one?{" "}
                  <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">Sign in →</Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">

                {/* Name row */}
                <div style={fade(0.12)} className="grid grid-cols-2 gap-3">
                  {(["firstName","lastName"] as const).map((k) => (
                    <div key={k}>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {k==="firstName"?"First Name":"Last Name"}
                      </label>
                      <div className="relative">
                        <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                        <input
                          type="text" value={form[k]} onChange={set(k)}
                          placeholder={k==="firstName"?"Uttam":"Gupta"}
                          className={inp(k)} autoComplete={k==="firstName"?"given-name":"family-name"}/>
                      </div>
                      {errors[k] && <p className="text-[10px] text-red-500 mt-0.5 pl-1">{errors[k]}</p>}
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div style={fade(0.18)}>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input type="email" value={form.email} onChange={set("email")}
                      placeholder="you@email.com" className={inp("email")} autoComplete="email"/>
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 mt-0.5 pl-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div style={fade(0.22)}>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone (optional)</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="+91 XXXXX XXXXX" className={inp("phone")} autoComplete="tel"/>
                  </div>
                </div>

                {/* Password */}
                <div style={fade(0.28)}>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input type={showPw?"text":"password"} value={form.password} onChange={set("password")}
                      placeholder="Min 6 characters" className={inp("password")+" pr-11"} autoComplete="new-password"/>
                    <button type="button" onClick={()=>setShowPw(s=>!s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none">
                      {showPw?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {form.password.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3].map(s=>(
                          <div key={s} className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: s<=strength ? strengthColor : "#e5e7eb" }}/>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold" style={{ color:strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-[10px] text-red-500 mt-0.5 pl-1">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div style={fade(0.34)}>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input type={showCon?"text":"password"} value={form.confirm} onChange={set("confirm")}
                      placeholder="Repeat your password" className={inp("confirm")+" pr-11"} autoComplete="new-password"/>
                    <button type="button" onClick={()=>setShowCon(s=>!s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none">
                      {showCon?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-[10px] text-red-500 mt-0.5 pl-1">{errors.confirm}</p>}
                </div>

                {/* Submit */}
                <div style={fade(0.40)} className="pt-1">
                  <button type="submit" disabled={loading}
                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 bg-orange-500 text-white font-bold text-[12px] tracking-[.16em] uppercase py-3.5 rounded-2xl cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {!loading && <span className="absolute inset-0 bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"/>}
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation:"spin .7s linear infinite" }}/>
                      : <>
                          <Zap size={14} className="relative z-10"/>
                          <span className="relative z-10">Create Account</span>
                          <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"/>
                        </>
                    }
                  </button>
                </div>

              </form>

              <p style={fade(0.46)} className="text-center text-[11px] text-gray-300 mt-5">
                By signing up you agree to our{" "}
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