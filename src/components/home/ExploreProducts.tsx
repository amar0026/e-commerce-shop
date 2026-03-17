import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tshit     from "../../assets/thsirt.png";
import watch1    from "../../assets/shopping.webp";
import mouse     from "../../assets/girldress.png";
import headPhone from "../../assets/kiddress.png";
import game      from "../../assets/mensuit.png";
import shoe      from "../../assets/images21.png";

/* ── Category data matching the image layout ── */
const CATEGORIES = [
  { label: "Ethnic Wear",        discount: "50–80% OFF", image: mouse,     filter: "Ethnic"      },
  { label: "Casual Wear",        discount: "40–80% OFF", image: tshit,     filter: "Men"         },
  { label: "Men's Activewear",   discount: "30–70% OFF", image: game,      filter: "Men"         },
  { label: "Women's Activewear", discount: "30–70% OFF", image: watch1,    filter: "Women"       },
  { label: "Western Wear",       discount: "40–80% OFF", image: headPhone, filter: "Western"     },
  { label: "Sportswear",         discount: "30–80% OFF", image: shoe,      filter: "Sports"      },
  { label: "Night Wear",         discount: "20–60% OFF", image: mouse,     filter: "NightWear"   },
  { label: "Kids Wear",          discount: "25–65% OFF", image: headPhone, filter: "Kids"        },
  { label: "Lingerie",           discount: "30–70% OFF", image: watch1,    filter: "Lingerie"    },
  { label: "Watches",            discount: "40–75% OFF", image: shoe,      filter: "Watches"     },
  { label: "Skincare",           discount: "35–70% OFF", image: tshit,     filter: "Beauty"      },
  { label: "Makeup",             discount: "30–65% OFF", image: game,      filter: "Makeup"      },
];

const COLS_PER_PAGE = 6; // 6 per row like the image

const ExploreProducts: React.FC = () => {
  const navigate = useNavigate();

  const [visible,  setVisible]  = useState(false);
  const [page,     setPage]     = useState(0);
  const [_hoveredI, setHoveredI] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(CATEGORIES.length / COLS_PER_PAGE);
  const pageSlice  = CATEGORIES.slice(page * COLS_PER_PAGE, (page + 1) * COLS_PER_PAGE);

  /* Scroll-in observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity .85s ${delay}s cubic-bezier(.16,1,.3,1), transform .85s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  const cardStyle = (i: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ${0.08 + i * 0.07}s cubic-bezier(.16,1,.3,1), transform .7s ${0.08 + i * 0.07}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap');

        /* Dot grid drift */
        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }
        /* Stripe shimmer */
        @keyframes stripeShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        /* Card label slide up */
        @keyframes labelSlide {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }

        .ep-cat-card { position: relative; overflow: hidden; border-radius: 16px; cursor: pointer; }
        .ep-cat-card img { transition: transform .6s cubic-bezier(.16,1,.3,1); }
        .ep-cat-card:hover img { transform: scale(1.08); }
        .ep-cat-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(249,115,22,.95) 0%, rgba(234,88,12,.85) 60%, transparent 100%);
          padding: 24px 14px 14px;
          transition: background .3s;
        }
        .ep-cat-card:hover .ep-cat-overlay {
          background: linear-gradient(to top, rgba(234,88,12,1) 0%, rgba(249,115,22,.9) 60%, transparent 100%);
        }
        .ep-shop-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.8);
          transition: color .2s, gap .2s;
        }
        .ep-cat-card:hover .ep-shop-btn { color: #fff; gap: 8px; }

        /* Pagination dot */
        .ep-pg-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #e5e7eb; border: none; cursor: pointer;
          transition: background .25s, transform .25s;
        }
        .ep-pg-dot.active { background: #f97316; transform: scale(1.35); }
        .ep-pg-dot:hover:not(.active) { background: #ea580c; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-16"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Animated dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 20s linear infinite",
          }}
        />

        

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ══ HEADER ══ */}
          <div style={fade(0.05)} className="flex flex-col items-center text-center mb-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-0.5 bg-orange-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                Our Products
              </span>
              <div className="w-10 h-0.5 bg-orange-500 rounded-full" />
            </div>

            {/* Heading */}
            <h2
              className="font-extrabold text-[#111] leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              Shop{" "}
              <em className="not-italic text-orange-500" style={{ fontStyle: "italic" }}>
                Our Category
              </em>
            </h2>

            {/* Shop Now pill button */}
            <button
              onClick={() => navigate("/CATEGORIES")}
              className="group inline-flex items-center gap-2 bg-[#111] text-white text-[11px] font-bold tracking-[.15em] uppercase px-6 py-2.5 rounded-2xl border-none cursor-pointer overflow-hidden relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,.3)]"
            >
              <span
                className="absolute inset-0 bg-orange-500"
                style={{ transform: "translateX(-101%)", transition: "transform .38s cubic-bezier(.16,1,.3,1)" }}
                ref={el => {
                  if (!el) return;
                  const btn = el.parentElement as HTMLButtonElement;
                  btn.addEventListener("mouseenter", () => (el.style.transform = "translateX(0)"));
                  btn.addEventListener("mouseleave", () => (el.style.transform = "translateX(-101%)"));
                }}
              />
              <span className="relative z-10">Shop Now</span>
              <ArrowRight size={13} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* ══ CATEGORY GRID ══ */}
          <div style={fade(0.2)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            {pageSlice.map((cat, i) => (
              <div
                key={cat.label}
                className="ep-cat-card group"
                style={cardStyle(i)}
                onClick={() => navigate("/shop")}
                onMouseEnter={() => setHoveredI(i)}
                onMouseLeave={() => setHoveredI(null)}
              >
                {/* Image */}
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "3/4", background: "#fff4ee" }}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Orange gradient overlay */}
                <div className="ep-cat-overlay">
                  {/* Category name */}
                  <p className="text-white font-semibold text-[12px] leading-tight mb-0.5">
                    {cat.label}
                  </p>
                  {/* Discount */}
                  <p className="text-white font-extrabold leading-none mb-2" style={{ fontSize: "clamp(13px,1.4vw,16px)" }}>
                    {cat.discount}
                  </p>
                  {/* Shop Now link */}
                  <div className="ep-shop-btn">
                    <span>Shop Now</span>
                    <ArrowRight size={11} />
                  </div>
                </div>

                {/* Orange border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "inset 0 0 0 2px #f97316" }}
                />
              </div>
            ))}
          </div>

          {/* ══ PAGINATION DOTS ══ */}
          {totalPages > 1 && (
            <div style={fade(0.4)} className="flex items-center justify-center gap-5 mb-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 rounded-full border border-black/10 bg-white text-[#111] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`ep-pg-dot ${i === page ? "active" : ""}`}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-9 h-9 rounded-full border border-black/10 bg-white text-[#111] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* ══ BOTTOM RULE ══ */}
          <div
            className="mt-10 h-px opacity-60"
            style={{
              background: "linear-gradient(90deg, transparent, #fed7aa 30%, #fed7aa 70%, transparent)",
            }}
          />
        </div>
      </section>
    </>
  );
};

export default ExploreProducts;