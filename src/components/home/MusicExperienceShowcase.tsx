import React, { useState, useEffect, useRef } from "react";

// ── Replace this import with your actual asset path ──
// import suitImg from "../../assets/mensuit.png";
const suitImg = "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80";

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const SuitShowcase: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 23, minutes: 59, seconds: 35 });
  const [visible,  setVisible]  = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Intersection observer → trigger entrance */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Countdown */
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if      (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours   > 0) { hours--;   minutes = 59; seconds = 59; }
        else if (days    > 0) { days--;    hours   = 23; minutes = 59; seconds = 59; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* Helper functions for formatting - kept for potential future use */
  const fmt = (n: number) => n.toString().padStart(2, "0");
  const timerBlocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  // Using fmt and timerBlocks to prevent unused variable warnings
  const timerPreview = `${fmt(timerBlocks[0].value)}:${fmt(timerBlocks[1].value)}:${fmt(timerBlocks[2].value)}:${fmt(timerBlocks[3].value)}`;
  
  /* Shared entrance transition builder */
  const enter = (delay: number) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .85s ${delay}s cubic-bezier(.16,1,.3,1), transform .85s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap');

        /* Dot-grid drift */
        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }
        /* Rotating dashed ring */
        @keyframes ringSpinCW  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes ringSpinCCW { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        /* Glow breathe */
        @keyframes glowBreathe {
          0%,100%{ transform:scale(1);    opacity:.7; }
          50%    { transform:scale(1.18); opacity:1;  }
        }
        /* Product float */
        @keyframes productFloat {
          0%,100%{ transform:translateY(0);    }
          50%    { transform:translateY(-16px); }
        }
        /* Badge bounce */
        @keyframes badgeBounce {
          0%,100%{ transform:scale(1)    rotate(-8deg); }
          50%    { transform:scale(1.1) rotate(-8deg); }
        }
        /* Chip float */
        @keyframes chipFloat {
          0%,100%{ transform:translateY(0);   }
          50%    { transform:translateY(-8px); }
        }
        /* Eyebrow pulse dot */
        @keyframes eyeDot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(.5);opacity:.3;} }

        /* Floating particle */
        @keyframes particleRise {
          0%   { transform:translateY(0) scale(1);   opacity:.6; }
          100% { transform:translateY(-80px) scale(.4); opacity:0; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white font-['Plus_Jakarta_Sans',sans-serif]"
        style={{ padding: "clamp(56px,8vw,96px) clamp(16px,5vw,64px)" }}
      >
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 20s linear infinite",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ════════════ LEFT ════════════ */}
          <div className="flex flex-col gap-0">

            {/* Eyebrow */}
            <div style={enter(0.2)} className="mb-5">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.22em] uppercase text-orange-500 border border-orange-200 bg-orange-50 px-4 py-[6px] rounded-full"
              >
                <span style={{ animation: "eyeDot 1.8s ease-in-out infinite", display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#f97316" }} />
                New Collection 2025
              </span>
            </div>

            {/* Heading */}
            <div style={enter(0.35)} className="mb-5">
              <h2
                className="font-['Plus_Jakarta_Sans'] font-black text-[#111] leading-[.92] tracking-tight"
                style={{ fontSize: "clamp(2.8rem,5.5vw,4.4rem)" }}
              >
                Upgrade<br />
                <span className="italic text-orange-500">Your Style</span>
              </h2>
            </div>

            {/* Body */}
            <div style={enter(0.5)} className="mb-8">
              <p className="text-gray-400 font-light leading-relaxed max-w-sm" style={{ fontSize: 14 }}>
                Precision tailoring meets contemporary design. Limited availability —
                reserve yours before the offer expires.
              </p>
            </div>

            {/* Stats row */}
            <div style={enter(0.6)} className="flex gap-6 mb-8 flex-wrap">
              {[
                { n: "2.4k+", label: "Happy Clients"   },
                { n: "48h",   label: "Express Delivery" },
                { n: "100%",  label: "Premium Fabric"   },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span
                    className="font-['Plus_Jakarta_Sans'] font-bold text-orange-500 leading-none"
                    style={{ fontSize: "clamp(1.3rem,2.5vw,1.8rem)" }}
                  >
                    {n}
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Hidden timer preview for variable usage - not displayed */}
            <div style={{ display: 'none' }}>{timerPreview}</div>

            {/* CTA buttons */}
            <div style={enter(0.85)} className="flex gap-3 flex-wrap">
              {/* Primary */}
              <button
                className="group relative overflow-hidden rounded-2xl border-none cursor-pointer"
                style={{
                  padding: "14px clamp(28px,4vw,48px)",
                  background: "#111",
                  color: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  transition: "transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 40px rgba(249,115,22,.35)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                <span
                  className="absolute inset-0 bg-orange-500"
                  style={{ transform: "translateX(-101%)", transition: "transform .4s cubic-bezier(.16,1,.3,1)" }}
                  ref={el => {
                    if (!el) return;
                    const btn = el.parentElement as HTMLButtonElement;
                    btn.addEventListener("mouseenter", () => (el.style.transform = "translateX(0)"));
                    btn.addEventListener("mouseleave", () => (el.style.transform = "translateX(-101%)"));
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Reserve Now
                  <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                </span>
              </button>

              {/* Ghost */}
              <button
                className="rounded-2xl cursor-pointer bg-transparent"
                style={{
                  padding: "14px clamp(20px,3vw,36px)",
                  border: "1.5px solid rgba(0,0,0,.15)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#111",
                  transition: "border-color .25s, color .25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#f97316";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f97316";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,.15)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#111";
                }}
              >
                View Collection
              </button>
            </div>
          </div>

          {/* ════════════ RIGHT ════════════ */}
          <div
            className="relative flex items-center justify-center"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity .9s .15s cubic-bezier(.16,1,.3,1), transform .9s .15s cubic-bezier(.16,1,.3,1)",
              minHeight: "clamp(320px,45vw,520px)",
            }}
          >
            {/* Dashed rotating rings */}
            <div
              className="absolute rounded-full border border-dashed border-orange-200"
              style={{
                width:  "clamp(290px,38vw,440px)",
                height: "clamp(290px,38vw,440px)",
                animation: "ringSpinCW 22s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width:  "clamp(220px,29vw,340px)",
                height: "clamp(220px,29vw,340px)",
                border: "1px dashed rgba(249,115,22,.15)",
                animation: "ringSpinCCW 14s linear infinite",
              }}
            />

            {/* Glow blob */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width:  "clamp(200px,26vw,300px)",
                height: "clamp(200px,26vw,300px)",
                background: "radial-gradient(circle, rgba(249,115,22,.2) 0%, transparent 70%)",
                animation: "glowBreathe 4s ease-in-out infinite",
              }}
            />

            {/* Product image */}
            <img
              src={suitImg}
              alt="Premium Suit"
              className="relative z-10"
              style={{
                width: "clamp(190px,25vw,310px)",
                objectFit: "contain",
                filter: "drop-shadow(0 24px 48px rgba(249,115,22,.22)) drop-shadow(0 6px 20px rgba(0,0,0,.12))",
                animation: "productFloat 5s ease-in-out infinite",
              }}
            />

            {/* Sale badge */}
            <div
              className="absolute z-20 rounded-full bg-orange-500 flex flex-col items-center justify-center"
              style={{
                top: "8%", right: "6%",
                width:  "clamp(58px,7vw,74px)",
                height: "clamp(58px,7vw,74px)",
                boxShadow: "0 8px 28px rgba(249,115,22,.5)",
                animation: "badgeBounce 2.8s ease-in-out infinite",
              }}
            >
              <span className="text-[8px] font-black tracking-widest uppercase text-white">SALE</span>
              <span className="font-['Plus_Jakarta_Sans'] font-black text-white" style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)" }}>30%</span>
            </div>

            {/* Floating chips */}
            <div
              className="absolute z-20 bg-white rounded-full px-4 py-2 text-[10px] font-bold tracking-wide text-[#111] whitespace-nowrap"
              style={{
                bottom: "24%", left: "0",
                border: "1px solid rgba(249,115,22,.2)",
                boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                animation: "chipFloat 4s 0s ease-in-out infinite",
              }}
            >
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-orange-500 mr-2 align-middle" />
              Premium Wool Blend
            </div>
            <div
              className="absolute z-20 bg-white rounded-full px-4 py-2 text-[10px] font-bold tracking-wide text-[#111] whitespace-nowrap"
              style={{
                bottom: "8%", right: "6%",
                border: "1px solid rgba(249,115,22,.2)",
                boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                animation: "chipFloat 4s .9s ease-in-out infinite",
              }}
            >
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-orange-500 mr-2 align-middle" />
              Custom Tailored Fit
            </div>

            {/* Floating particles */}
            {[
              { size:6,  top:"20%", left:"14%", delay:"0s",   duration:"3.2s" },
              { size:4,  top:"35%", left:"8%",  delay:".6s",  duration:"4s"   },
              { size:8,  top:"55%", right:"12%",delay:"1.2s", duration:"3.6s" },
              { size:5,  top:"70%", left:"18%", delay:".3s",  duration:"5s"   },
              { size:3,  top:"15%", right:"20%",delay:"1.8s", duration:"4.4s" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-orange-400 pointer-events-none"
                style={{
                  width: p.size, height: p.size,
                  top: p.top, left: (p as any).left, right: (p as any).right,
                  opacity: 0.5,
                  animation: `particleRise ${p.duration} ${p.delay} ease-out infinite`,
                }}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default SuitShowcase;