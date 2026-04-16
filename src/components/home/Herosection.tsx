import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Slide {
  id: number;
  tag: string;
  heading: string[];
  accentIdx: number;
  body: string;
  img: string;
  accent: string;
  isDealSlide?: boolean;
  videoUrl?: string;
}

interface Category {
  label: string;
  img: string;
  items: string[];
}

const slides: Slide[] = [
  // ── VIDEO SLIDE FIRST ────────────────────────────────────────────────────────
  {
    id: 1,
    tag: "New Collection — In Motion",
    heading: ["Fashion", "That", "Moves", "You"],
    accentIdx: 3,
    body: "Watch our latest collection come alive — because style is meant to be felt.",
    img: "",
    accent: "#f5a623",
    videoUrl: "https://res.cloudinary.com/dquki4xol/video/upload/v1776320433/WhatsApp_Video_2026-04-16_at_11.16.18_AM_oltkhv.mp4",
  },
  {
    id: 2,
    tag: "New Arrivals — Summer '25",
    heading: ["Discover the", "Latest", "Fashion for", "Everyone"],
    accentIdx: 1,
    body: "Mall Ka Baap brings you stylish, high-quality garments at unbeatable prices — for men, women & kids.",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80",
    accent: "#ea641e",
  },
  {
    id: 3,
    tag: "Men's Exclusive — New In",
    heading: ["Style That", "Defines", "The Modern", "Man"],
    accentIdx: 1,
    body: "Premium menswear crafted for the bold — from sharp formals to relaxed casuals.",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80",
    accent: "#1e6aea",
  },
  {
    id: 4,
    tag: "Women's Collection — Trending",
    heading: ["Elegance", "Redefined", "For Every", "Woman"],
    accentIdx: 1,
    body: "From ethnic elegance to western chic — discover our women's collection.",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775906061/elegant-woman-in-orange-traditional-dress-at-palace-photo_fxvbet.jpg",
    accent: "#ea1e6a",
  },
];

const categories: Category[] = [
  { label: "Men's Wear",         img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775907723/71ETqr_bAVL._AC_UY350__e4quat.jpg", items: ["Shirts", "Trousers", "Suits", "Jackets"] },
  { label: "Women's Collection", img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775907429/e9c77f23-bfc0-4af2-bab8-38bff47ff182_uxy0w9.jpg", items: ["Dresses", "Sarees", "Kurtas", "Tops"] },
  { label: "Boys Fashion",       img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80", items: ["T-Shirts", "Jeans", "Shorts"] },
  { label: "Girls Fashion",      img: "https://res.cloudinary.com/dquki4xol/image/upload/v1776063661/WhatsApp_Image_2026-04-13_at_10.24.38_AM_sulp3m.jpg", items: ["Frocks", "Lehengas", "Skirts"] },
  { label: "Ethnic Wear",        img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775907066/24AUD10663-E607484_tvplld.webp", items: ["Kurtas", "Sherwanis", "Sarees"] },
  { label: "Western Styles",     img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775906958/approval_06_09_2024O1CN01zcnDuS26pEdhlNmrX__21_212823427710-0-cib_aa2c2d5f-20c3-4cc9-b48e-ff5ec3f7358f_km3tuv.jpg", items: ["Jeans", "Blazers", "Denim"] },
];

const tickerItems = [
  "Men's Wear", "Women's Collection", "Ethnic Wear", "Kids Fashion",
  "Western Styles", "Free Delivery · Every Order", "Flat 50% Off Today",
];

/* ─── Video Slide — autoplay silent loop, no controls ─── */
function VideoSlide({ slide, onShopNow }: { slide: Slide; onShopNow: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    return () => { v.pause(); };
  }, []);

  return (
    <div className="relative overflow-hidden flex items-center" style={{ minHeight: "70vh" }}>
      <video
        ref={videoRef}
        src={slide.videoUrl}
        loop
        muted
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
        <div className="py-20 max-w-xl space-y-8">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
            <span className="text-xs font-semibold text-white">{slide.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            {slide.heading.map((word, i) => (
              <span key={i}>
                {i === slide.accentIdx
                  ? <span style={{ color: slide.accent }}>{word}</span>
                  : word}
                <br />
              </span>
            ))}
          </h1>

          <p className="text-white/80 max-w-md text-sm leading-relaxed">{slide.body}</p>

          <button
            onClick={onShopNow}
            className="px-8 py-3 rounded-2xl font-bold text-sm transition-opacity duration-200 hover:opacity-85"
            style={{ background: slide.accent, color: "#fff" }}
          >
            Shop Now →
          </button>

        </div>
      </div>
    </div>
  );
}

/* ─── Deal Slide ───────────────────────────────────────── */
function DealSlide({ slide, onShopNow }: { slide: Slide; onShopNow: () => void }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#fff8f0] flex" style={{ minHeight: "70vh" }}>
      <div className="absolute right-0 top-0 bottom-0 w-[58%]">
        <img src={slide.img} alt="Mall Ka Baap Shop" className="w-full h-full object-cover object-center" />
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#fff8f0] to-transparent" />
      </div>
      <div
        className="absolute z-20 flex flex-col items-center justify-center text-white rounded-full border-[3px] border-white"
        style={{ top: 28, right: 28, width: 100, height: 100, background: "#ea1e6a", boxShadow: "0 6px 28px rgba(234,30,106,0.4)", animation: "stampPop 0.45s cubic-bezier(.16,1,.3,1) both" }}
      >
        <span style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>50%</span>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>OFF</span>
        <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.72, letterSpacing: "0.05em" }}>Today Only</span>
      </div>
      <div className="relative z-10 flex flex-col justify-center gap-5 px-8 sm:px-12 lg:px-16 py-16" style={{ width: "52%", background: "linear-gradient(105deg, #fff8f0 62%, transparent 100%)" }}>
        <div className="inline-flex items-center gap-2 border border-[#ea1e6a] bg-white rounded-full px-4 py-[5px] w-fit">
          <span className="w-[7px] h-[7px] rounded-full bg-[#ea1e6a] animate-pulse" />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ea1e6a" }}>Sabse Sasta · Sabse Fast</span>
        </div>
        <h1 className="font-extrabold text-gray-900 leading-[1.05]" style={{ fontSize: "clamp(36px,5vw,54px)" }}>
          Mall Ka<br />
          <span style={{ color: "#ea1e6a" }}>Baap</span><br />
          <span style={{ color: "#fff", background: "#ea1e6a", padding: "0 12px", borderRadius: 8, display: "inline-block", lineHeight: 1.18 }}>Top Deals</span>
          <br />Are Live!
        </h1>
        <p className="text-gray-500" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>{slide.body}</p>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 text-white font-bold rounded-xl" style={{ background: "#ea1e6a", fontSize: 13, padding: "9px 20px" }}>🔥 Flat 50% Off</div>
          <div className="inline-flex items-center gap-2 font-bold rounded-xl border" style={{ background: "#fff3e0", color: "#b85c00", borderColor: "#f59500", fontSize: 12, padding: "9px 16px" }}>🚚 Free Delivery</div>
        </div>
        <button
          onClick={onShopNow}
          className="inline-flex items-center gap-3 font-extrabold rounded-xl w-fit transition-all duration-200"
          style={{ background: "#111", color: "#fff", fontSize: 13, padding: "13px 28px" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#ea1e6a")}
          onMouseLeave={e => (e.currentTarget.style.background = "#111")}
        >
          Shop Now
          <span className="inline-flex items-center justify-center rounded-full text-white" style={{ background: "#ea1e6a", width: 22, height: 22, fontSize: 12 }}>→</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Regular Slide ────────────────────────────────────── */
function RegularSlide({ slide, onShopNow }: { slide: Slide; onShopNow: () => void }) {
  return (
    <div className="relative overflow-hidden flex items-center" style={{ minHeight: "70vh" }}>
      <img src={slide.img} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent lg:w-1/2" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
              <span className="text-xs font-semibold">{slide.tag}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              {slide.heading.map((word, i) => (
                <span key={i}>
                  {i === slide.accentIdx ? <span style={{ color: slide.accent }}>{word}</span> : word}
                  <br />
                </span>
              ))}
            </h1>
            <p className="text-gray-700 max-w-md">{slide.body}</p>
            <button
              onClick={onShopNow}
              className="bg-black text-white px-8 py-3 rounded-2xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────── */
export default function HeroSection() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<number>(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const prev = (): void => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = (): void => setCurrent(c => (c + 1) % slides.length);
  const goTo = (idx: number): void => setCurrent(idx);

  const handleShopNow = (): void => { navigate("/shop"); };

  // ── Smart timing: 10s for video slides, 4.5s for image slides ──────────────
  useEffect(() => {
    const delay = slides[current].videoUrl ? 10000 : 4500;
    autoRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, delay);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [current]); // re-runs every time slide changes → always correct delay

  return (
    <div className="font-['Plus_Jakarta_Sans']">

      {/* ── HERO ── */}
      <div className="relative">
        {slide.videoUrl
          ? <VideoSlide slide={slide} onShopNow={handleShopNow} />
          : slide.isDealSlide
            ? <DealSlide slide={slide} onShopNow={handleShopNow} />
            : <RegularSlide slide={slide} onShopNow={handleShopNow} />
        }

        {/* Slider controls */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-5 z-20">
          <button onClick={prev} className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {slides.map((_: Slide, i: number) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-8" : "w-2 bg-gray-300"}`}
                style={{ backgroundColor: i === current ? slide.accent : undefined }}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── CATEGORY STRIP ── */}
      <div className="bg-white border-y border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex h-[130px] sm:h-[160px] lg:h-[200px]">
            {categories.map((cat: Category) => (
              <div
                key={cat.label}
                onClick={handleShopNow}
                className="cat-item flex-1 relative overflow-hidden cursor-pointer border-r border-gray-900 last:border-r-0 group"
              >
                <div className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" style={{ backgroundImage: `url(${cat.img})` }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-orange-500 transition-all duration-500" />
                <div className="relative z-10 h-full flex flex-col items-center justify-end pb-4 px-2 gap-1">
                  <div className="text-[9px] font-semibold tracking-[.2em] uppercase text-transparent group-hover:text-white/60 transition-all duration-300 translate-y-2 group-hover:translate-y-0">{cat.items.length * 120}+ styles</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm font-black uppercase tracking-[.12em] text-gray-800 group-hover:text-white transition-all duration-300 text-center leading-tight">{cat.label}</div>
                  <div className="text-transparent group-hover:text-[#e63946] text-xs font-bold transition-all duration-300 translate-y-2 group-hover:translate-y-0">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden border-t border-gray-100 py-2 bg-white">
        <div className="flex gap-10 w-max animate-marquee">
          {[...Array(2)].map((_: undefined, i: number) =>
            tickerItems.map((item: string) => (
              <div key={i + item} className="flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-gray-400">
                <span style={{ color: "#e63946" }}>✦</span>
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 22s linear infinite; }

        @keyframes stampPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .cat-item {
          flex: 1;
          transition: flex 0.55s cubic-bezier(.16,1,.3,1);
        }
        .cat-item:hover {
          flex: 2.2;
        }
      `}</style>

    </div>
  );
}