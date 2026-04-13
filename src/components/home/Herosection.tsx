import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  heading: string[];
  accentIdx: number;
  body: string;
  img: string;
  accent: string;
}

interface Category {
  label: string;
  img: string;
  items: string[];
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "New Arrivals — Summer '25",
    heading: ["Discover the", "Latest", "Fashion for", "Everyone"],
    accentIdx: 1,
    body: "Mall Ka Baap brings you stylish, high-quality garments at unbeatable prices — for men, women & kids.",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80",
    accent: "#ea641e",
  },
  {
    id: 2,
    tag: "Men's Exclusive — New In",
    heading: ["Style That", "Defines", "The Modern", "Man"],
    accentIdx: 1,
    body: "Premium menswear crafted for the bold — from sharp formals to relaxed casuals.",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80",
    accent: "#1e6aea",
  },
  {
    id: 3,
    tag: "Women's Collection — Trending",
    heading: ["Elegance", "Redefined", "For Every", "Woman"],
    accentIdx: 1,
    body: "From ethnic elegance to western chic — discover our women's collection.",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775906061/elegant-woman-in-orange-traditional-dress-at-palace-photo_fxvbet.jpg",
    accent: "#ea1e6a",
  },
   {
    id: 4,
    tag: "Sabse Sasta - Sabse Fast ",
    heading: ["Mall Ka Baap", "Top Deals on ", "Latest Fashion ", "& More"],
    accentIdx: 1,
    body: "Flat 50% off + Free Delivery .",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1775920937/WhatsApp_Image_2026-04-11_at_8.49.23_PM_tgxanw.jpg",
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

export default function HeroSection() {
  const [current, setCurrent] = useState<number>(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const prev = (): void =>
    setCurrent((current - 1 + slides.length) % slides.length);

  const next = (): void =>
    setCurrent((current + 1) % slides.length);

  const goTo = (idx: number): void => setCurrent(idx);

  useEffect(() => {
    autoRef.current = setInterval(next, 4500);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [current]);

  return (
    <div className="font-['Plus_Jakarta_Sans']">

      {/* HERO */}
      <div className="relative overflow-hidden h-[70vh] md:h-[80vh] lg:h-auto flex items-center">

        <img
          src={slide.img}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent lg:w-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8">

              <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: slide.accent }}
                />
                <span className="text-xs font-semibold">{slide.tag}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                {slide.heading.map((word: string, i: number) => (
                  <span key={i}>
                    {i === slide.accentIdx ? (
                      <span style={{ color: slide.accent }}>{word}</span>
                    ) : (
                      word
                    )}
                    <br />
                  </span>
                ))}
              </h1>

              <p className="text-gray-700 max-w-md">{slide.body}</p>

              <button className="bg-black text-white px-8 py-3 rounded-2xl font-semibold hover:bg-amber-700 ">
                Shop Now
              </button>

            </div>
          </div>
        </div>

        {/* SLIDER CONTROLS */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-5 z-20">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:bg-black hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {slides.map((_: Slide, i: number) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8" : "w-2 bg-gray-300"
                }`}
                style={{ backgroundColor: i === current ? slide.accent : undefined }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:bg-black hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* CATEGORY STRIP */}
      <div className="bg-white border-y-1 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex h-[130px] sm:h-[160px] lg:h-[200px]">
            {categories.map((cat: Category) => (
              <div
                key={cat.label}
                className="cat-item flex-1 relative overflow-hidden cursor-pointer border-r border-gray-900 last:border-r-0 group"
              >
                {/* bg image — dim by default, vivid on hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />

                {/* dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />

                {/* red top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-orange-500 transition-all duration-500" />

                {/* content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-end pb-4 px-2 gap-1">

                  {/* item count */}
                  <div className="text-[9px] font-semibold tracking-[.2em] uppercase text-transparent group-hover:text-white/60 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {cat.items.length * 120}+ styles
                  </div>

                  {/* label */}
                  <div className="text-[10px] sm:text-xs lg:text-sm font-black uppercase tracking-[.12em] text-gray-800 group-hover:text-white transition-all duration-300 text-center leading-tight">
                    {cat.label}
                  </div>

                  {/* arrow */}
                  <div className="text-transparent group-hover:text-[#e63946] text-xs font-bold transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    →
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 {/* MARQUEE */}
        <div className="overflow-hidden border-t border-gray-100 py-2 bg-white">
          <div className="flex gap-10 w-max animate-marquee">
            {[...Array(2)].map((_: undefined, i: number) =>
              ["Men's Wear", "Women's Collection", "Kids Fashion", "Ethnic Wear", "Western Styles", "Ethnic Wear"].map((item: string) => (
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