import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tshit     from "../../assets/thsirt.png";
import watch1    from "../../assets/shopping.webp";
import mouse     from "../../assets/kids4.png";
import headPhone from "../../assets/kids5.png";
import game      from "../../assets/mensuit.png";
import shoe      from "../../assets/images21.png";

const CATEGORIES = [
  { label: "Ethnic Wear",        discount: "50–80% OFF", image: mouse,     filter: "Ethnic"    },
  { label: "Casual Wear",        discount: "40–80% OFF", image: tshit,     filter: "Men"       },
  { label: "Men's Activewear",   discount: "30–70% OFF", image: game,      filter: "Men"       },
  { label: "Women's Activewear", discount: "30–70% OFF", image: watch1,    filter: "Women"     },
  { label: "Western Wear",       discount: "40–80% OFF", image: headPhone, filter: "Western"   },
  { label: "Sportswear",         discount: "30–80% OFF", image: shoe,      filter: "Sports"    },
  { label: "Night Wear",         discount: "20–60% OFF", image: mouse,     filter: "NightWear" },
  { label: "Kids Wear",          discount: "25–65% OFF", image: headPhone, filter: "Kids"      },
  { label: "Lingerie",           discount: "30–70% OFF", image: watch1,    filter: "Lingerie"  },
  { label: "Watches",            discount: "40–75% OFF", image: shoe,      filter: "Watches"   },
  { label: "Skincare",           discount: "35–70% OFF", image: tshit,     filter: "Beauty"    },
  { label: "Makeup",             discount: "30–65% OFF", image: game,      filter: "Makeup"    },
];

const COLS_PER_PAGE = 6;
const TOTAL_PAGES   = Math.ceil(CATEGORIES.length / COLS_PER_PAGE);
const AUTO_DELAY    = 3000;

const ExploreProducts: React.FC = () => {
  const navigate    = useNavigate();
  const sectionRef  = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [visible, setVisible] = useState(false);
  const [page,    setPage]    = useState(0);
  const [paused,  setPaused]  = useState(false);

  /* ── Scroll-in observer ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Auto-slide ── */
  const next = useCallback(() => setPage(p => (p + 1) % TOTAL_PAGES), []);
  const prev = () => setPage(p => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, AUTO_DELAY);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  /* ── Animation helpers ── */
  const fade = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity .85s ${delay}s cubic-bezier(.16,1,.3,1),
                 transform  .85s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  const cardAnim = (i: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ${0.08 + i * 0.07}s cubic-bezier(.16,1,.3,1),
                 transform .7s ${0.08 + i * 0.07}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap');

        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }

        /* ── Slider ── */
        .ep-slider-viewport { overflow: hidden; width: 100%; }
        .ep-slider-track {
          display: flex;
          transition: transform .6s cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .ep-slide {
          flex: 0 0 100%;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) { .ep-slide { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .ep-slide { grid-template-columns: repeat(2, 1fr); } }

        /* ── Card ── */
        .ep-cat-card { position: relative; overflow: hidden; border-radius: 16px; cursor: pointer; }
        .ep-cat-card img { transition: transform .6s cubic-bezier(.16,1,.3,1); display: block; width: 100%; height: 100%; object-fit: cover; }
        .ep-cat-card:hover img { transform: scale(1.08); }
        .ep-cat-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(249,115,22,.95) 0%, rgba(234,88,12,.85) 55%, transparent 100%);
          padding: 28px 14px 14px;
          transition: background .3s;
        }
        .ep-cat-card:hover .ep-cat-overlay {
          background: linear-gradient(to top, rgba(234,88,12,1) 0%, rgba(249,115,22,.9) 55%, transparent 100%);
        }
        .ep-cat-border {
          position: absolute; inset: 0; border-radius: 16px;
          border: 2px solid #f97316;
          opacity: 0; pointer-events: none;
          transition: opacity .3s;
        }
        .ep-cat-card:hover .ep-cat-border { opacity: 1; }

        .ep-shop-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.8);
          transition: color .2s, gap .2s;
        }
        .ep-cat-card:hover .ep-shop-btn { color: #fff; gap: 8px; }

        /* ── Dot ── */
        .ep-pg-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #e5e7eb; border: none; cursor: pointer; padding: 0;
          transition: background .25s, transform .25s, width .3s;
        }
        .ep-pg-dot.active { background: #f97316; width: 24px; border-radius: 4px; }
        .ep-pg-dot:hover:not(.active) { background: #fdba74; }

        /* ── Nav arrow btn ── */
        .ep-nav-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,.1);
          background: #fff; color: #111;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, border-color .2s, color .2s, transform .2s;
        }
        .ep-nav-btn:hover { background: #f97316; border-color: #f97316; color: #fff; transform: scale(1.08); }

        /* ── Progress bar ── */
        @keyframes epProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .ep-progress-bar {
          height: 2px;
          background: #f97316;
          transform-origin: left;
          border-radius: 2px;
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          padding: "64px 64px 48px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Dot-grid background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(249,115,22,.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          animation: "dotDrift 20s linear infinite",
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto" }}>

          {/* ══ HEADER ══ */}
          <div style={{ ...fade(0.05), display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 36 }}>

            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 2, background: "#f97316", borderRadius: 99 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".24em", textTransform: "uppercase", color: "#f97316" }}>
                Our Products
              </span>
              <div style={{ width: 40, height: 2, background: "#f97316", borderRadius: 99 }} />
            </div>

            {/* Heading */}
            <h2 style={{
              fontWeight: 800, color: "#111", lineHeight: 1, letterSpacing: "-.02em",
              marginBottom: 16, fontSize: "clamp(2rem,4.5vw,3.2rem)",
            }}>
              Shop{" "}
              <span style={{ color: "#f97316", fontStyle: "italic" }}>Our Category</span>
            </h2>

            {/* Shop Now pill */}
            <ShopNowButton onClick={() => navigate("/CATEGORIES")} />
          </div>

          {/* ══ PROGRESS BAR ══ */}
          <div style={{ ...fade(0.15), height: 2, background: "#fed7aa", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
            <div
              key={`${page}-${paused}`}
              className="ep-progress-bar"
              style={{
                animation: paused ? "none" : `epProgress ${AUTO_DELAY}ms linear forwards`,
              }}
            />
          </div>

          {/* ══ SLIDER ══ */}
          <div style={fade(0.2)}>
            <div className="ep-slider-viewport">
              <div
                className="ep-slider-track"
                style={{ transform: `translateX(-${page * 100}%)` }}
              >
                {Array.from({ length: TOTAL_PAGES }, (_, slideIdx) => (
                  <div key={slideIdx} className="ep-slide">
                    {CATEGORIES
                      .slice(slideIdx * COLS_PER_PAGE, (slideIdx + 1) * COLS_PER_PAGE)
                      .map((cat, i) => (
                        <div
                          key={cat.label}
                          className="ep-cat-card"
                          style={cardAnim(i)}
                          onClick={() => navigate("/shop")}
                        >
                          <div style={{ aspectRatio: "3/4", background: "#fff4ee", overflow: "hidden" }}>
                            <img src={cat.image} alt={cat.label} loading="lazy" />
                          </div>

                          <div className="ep-cat-overlay">
                            <p style={{ color: "#fff", fontWeight: 600, fontSize: 12, lineHeight: 1.3, margin: "0 0 3px" }}>
                              {cat.label}
                            </p>
                            <p style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(13px,1.4vw,16px)", lineHeight: 1, margin: "0 0 8px" }}>
                              {cat.discount}
                            </p>
                            <div className="ep-shop-btn">
                              <span>Shop Now</span>
                              <ArrowRight size={11} />
                            </div>
                          </div>

                          <div className="ep-cat-border" />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ PAGINATION ══ */}
          <div style={{ ...fade(0.35), display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 24 }}>

            <button className="ep-nav-btn" onClick={prev} aria-label="Previous">
              <ChevronLeft size={15} />
            </button>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                <button
                  key={i}
                  className={`ep-pg-dot ${i === page ? "active" : ""}`}
                  onClick={() => setPage(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button className="ep-nav-btn" onClick={next} aria-label="Next">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* ══ SLIDE COUNTER ══ */}
          <div style={{ ...fade(0.4), textAlign: "center", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
              {page + 1} / {TOTAL_PAGES}
            </span>
          </div>

          {/* ══ BOTTOM RULE ══ */}
          <div style={{
            marginTop: 40, height: 1, opacity: 0.6,
            background: "linear-gradient(90deg, transparent, #fed7aa 30%, #fed7aa 70%, transparent)",
          }} />
        </div>
      </section>
    </>
  );
};

/* ── Shop Now button ── */
const ShopNowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (spanRef.current) spanRef.current.style.transform = "translateX(0)";
  };
  const handleLeave = () => {
    if (spanRef.current) spanRef.current.style.transform = "translateX(-101%)";
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#111", color: "#fff",
        fontSize: 11, fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase",
        padding: "10px 24px", borderRadius: 99, border: "none", cursor: "pointer",
        position: "relative", overflow: "hidden",
        transition: "transform .3s, box-shadow .3s",
      }}
    >
      <span
        ref={spanRef}
        style={{
          position: "absolute", inset: 0, background: "#f97316",
          transform: "translateX(-101%)",
          transition: "transform .38s cubic-bezier(.16,1,.3,1)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>Shop Now</span>
      <ArrowRight size={13} style={{ position: "relative", zIndex: 1 }} />
    </button>
  );
};

export default ExploreProducts;