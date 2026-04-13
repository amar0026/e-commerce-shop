import { useState, useEffect, useRef } from "react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Product {
  id: number;
  name: string;
  cat: string;
  sub: string;
  price: number;
  orig: number;
  img: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: number;
  colors: string[];
  fabric: string;
  sizes: string[];
}

/* ─────────────────────────────────────────────
   Data — one hero product per section
───────────────────────────────────────────── */
const SECTIONS: {
  key: string;
  label: string;
  emoji: string;
  tagline: string;
  accent: string;
  accentDark: string;
  product: Product;
}[] = [
  {
    key: "men",
    label: "Men",
    emoji: "👔",
    tagline: "Sharp fits for every occasion",
    accent: "#f97316",
    accentDark: "#ea580c",
    product: {
      id: 3, name: "Premium Wool Blazer", cat: "Men", sub: "Suits",
      price: 3499, orig: 5999,
      img: "https://res.cloudinary.com/dquki4xol/image/upload/v1776079502/images_10_lqvavf.jpg",
      badge: "SALE", badgeColor: "#ea580c", rating: 4.7, reviews: 214,
      colors: ["#111","#2c3e50","#555"], fabric: "Wool Blend", sizes: ["S","M","L","XL"],
    },
  },
  {
    key: "women",
    label: "Women",
    emoji: "👗",
    tagline: "Elegance in every stitch",
    accent: "#ec4899",
    accentDark: "#db2777",
    product: {
      id: 11, name: "Embroidered Lehnga", cat: "Women", sub: "Ethnic",
      price: 2150, orig: 3200,
      img: "https://res.cloudinary.com/dquki4xol/image/upload/v1776079514/PCCGH1466A_1_n4btwb.webp",
      badge: "HOT", badgeColor: "#f97316", rating: 4.0, reviews: 75,
      colors: ["#8e44ad","#c0392b","#f39c12"], fabric: "Georgette", sizes: ["S","M","L","XL","XXL"],
    },
  },
  {
    key: "kids",
    label: "Kids",
    emoji: "👶",
    tagline: "Playful styles, comfy fits",
    accent: "#3b82f6",
    accentDark: "#2563eb",
    product: {
      id: 10, name: "Kids Dungaree Playsuit", cat: "Kids", sub: "Casuals",
      price: 599, orig: 899,
      img: "https://res.cloudinary.com/dquki4xol/image/upload/v1776079512/images_12_lsjley.jpg",
      badge: "NEW", badgeColor: "#16a34a", rating: 4.8, reviews: 61,
      colors: ["#3b82f6","#f97316","#fff"], fabric: "Denim Cotton", sizes: ["2Y","4Y","6Y","8Y"],
    },
  },
  {
    key: "boy",
    label: "Boy",
    emoji: "🧒",
    tagline: "Cool looks for little champs",
    accent: "#10b981",
    accentDark: "#059669",
    product: {
      id: 101, name: "Slim Fit Oxford Shirt", cat: "Boy", sub: "Shirts",
      price: 449, orig: 799,
      img: "https://res.cloudinary.com/dquki4xol/image/upload/v1776079504/images_8_u4lvty.jpg",
      badge: "NEW", badgeColor: "#16a34a", rating: 4.5, reviews: 88,
      colors: ["#fff","#6b8cba","#3b82f6"], fabric: "100% Cotton", sizes: ["4Y","6Y","8Y","10Y","12Y"],
    },
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const pct = (p: number, o: number) => Math.round((1 - p / o) * 100);
const isSale = (b: string) => b === "SALE" || b === "HOT";

const Stars = ({ n, color }: { n: number; color: string }) => (
  <span style={{ color, fontSize: 11, letterSpacing: 1 }}>
    {"★".repeat(Math.floor(n))}
    <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - Math.floor(n))}</span>
  </span>
);

/* Circular SALE badge — same as ShopPage */
const SaleBadge = ({ pctOff, accent, accentDark }: { pctOff: number; accent: string; accentDark: string }) => (
  <div
    className="absolute z-20 flex flex-col items-center justify-center rounded-full select-none"
    style={{
      top: 10, right: 10, width: 58, height: 58,
      background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
      boxShadow: `0 4px 16px ${accent}88`,
      animation: "salePop 2.8s ease-in-out infinite",
    }}
  >
    <span className="text-white font-black leading-none" style={{ fontSize: 9, letterSpacing: ".14em" }}>SALE</span>
    <span className="text-white font-black leading-none" style={{ fontSize: 17 }}>{pctOff}%</span>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function FeaturedCategories() {
  const navigate = useNavigate();
  const [visible, setVisible]   = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedId, setAddedId]   = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const addCart = (id: number) => {
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const goShop = (cat?: string) =>
    navigate(cat ? `/shop?category=${cat.toLowerCase()}` : "/shop");

  /* stagger helper */
  const fade = (i: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ${0.1 + i * 0.12}s cubic-bezier(.16,1,.3,1),
                 transform .7s ${0.1 + i * 0.12}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');

        @keyframes salePop {
          0%,100% { transform: scale(1)    rotate(-6deg); }
          50%      { transform: scale(1.1)  rotate(-6deg); }
        }
        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }
        @keyframes ribbonSlide {
          from { transform: translateX(-8px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      <section
        ref={ref}
        className="relative bg-white overflow-hidden py-12 sm:py-16"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* dot-grid bg */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 20s linear infinite",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

          {/* ── Section header ── */}
          <div style={fade(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-0.5 rounded-full bg-orange-500" />
                <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                  Shop by Gender
                </span>
              </div>
              <h2
                className="font-black text-[#111] leading-none tracking-tight"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
              >
                Big Saving {" "}
                <em className="text-orange-500" style={{ fontStyle: "italic" }}>
                All Products
                </em>
              </h2>
              <p className="text-xs text-gray-400 tracking-wide mt-1.5">
                Curated collections for every member of the family
              </p>
            </div>

            {/* View All → shop */}
            <button
              onClick={() => goShop()}
              className="group self-start sm:self-auto inline-flex items-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.18em] uppercase px-6 py-3 rounded-2xl cursor-pointer border-none transition-all duration-300 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,.35)]"
            >
              View All Collections
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* ── 4 Category Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECTIONS.map((sec, i) => {
              const prod = sec.product;
              const discount = pct(prod.price, prod.orig);

              return (
                <div
                  key={sec.key}
                  style={fade(i + 1)}
                  className="group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-[6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.1)] flex flex-col"
                  onClick={() => goShop(sec.key)}
                >
                  {/* colored bottom sweep */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px] z-10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                    style={{ background: `linear-gradient(90deg, ${sec.accent}, ${sec.accentDark})` }}
                  />

                  {/* ── Category label header ── */}
                  <div
                    className="flex items-center gap-2 px-4 py-3 border-b border-black/5"
                    style={{ background: `${sec.accent}10` }}
                  >
                    <span className="text-xl leading-none">{sec.emoji}</span>
                    <div>
                      <p className="font-black text-[#111] text-sm leading-tight">{sec.label}</p>
                      <p className="text-[9px] text-gray-400 tracking-wide leading-tight">{sec.tagline}</p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className="text-[9px] font-bold tracking-[.14em] uppercase px-2.5 py-1 rounded-full text-white"
                        style={{ background: sec.accent }}
                      >
                        Shop
                      </span>
                    </div>
                  </div>

                  {/* ── Image ── */}
                  <div
                    className="relative overflow-hidden flex items-center justify-center"
                    style={{
                      height: "clamp(200px,24vw,260px)",
                      background: `linear-gradient(135deg, ${sec.accent}10 0%, #fff4ee 100%)`,
                    }}
                  >
                    {/* inner grid lines */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(${sec.accent}08 1px,transparent 1px),linear-gradient(90deg,${sec.accent}08 1px,transparent 1px)`,
                        backgroundSize: "24px 24px",
                      }}
                    />

                    <img
                      src={prod.img}
                      alt={prod.name}
                      loading="lazy"
                      className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
                      style={{ width: "75%", height: "90%" }}
                    />

                    {/* Circular SALE badge */}
                    {isSale(prod.badge) && (
                      <SaleBadge pctOff={discount} accent={sec.accent} accentDark={sec.accentDark} />
                    )}

                    {/* NEW ribbon */}
                    {prod.badge && !isSale(prod.badge) && (
                      <div
                        className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[56px]"
                        style={{
                          background: prod.badgeColor,
                          clipPath: "polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)",
                        }}
                      >
                        {prod.badge}
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWish(prod.id); }}
                      className={`absolute top-[46px] right-2.5 z-20 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md
                        opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-250
                        ${wishlist.includes(prod.id) ? "bg-red-50 border-red-200 text-red-500 !opacity-100 !scale-100" : "bg-white border-black/10 text-gray-500 hover:text-white"}`}
                      style={wishlist.includes(prod.id) ? {} : { "--tw-hover-bg": sec.accent } as React.CSSProperties}
                    >
                      <Heart size={13} fill={wishlist.includes(prod.id) ? "currentColor" : "none"} />
                    </button>

                    {/* Size strip */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2 px-2 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                      {prod.sizes.map(s => (
                        <button
                          key={s}
                          onClick={e => { e.stopPropagation(); addCart(prod.id); }}
                          className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded bg-transparent cursor-pointer transition-all duration-200 hover:text-white"
                          style={{ ['--hover-bg' as string]: sec.accent }}
                          onMouseEnter={e => {
                            (e.target as HTMLElement).style.background = sec.accent;
                            (e.target as HTMLElement).style.borderColor = sec.accent;
                            (e.target as HTMLElement).style.color = "#fff";
                          }}
                          onMouseLeave={e => {
                            (e.target as HTMLElement).style.background = "";
                            (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,.16)";
                            (e.target as HTMLElement).style.color = "rgba(255,255,255,.55)";
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Product body ── */}
                  <div className="p-3.5 flex-1 flex flex-col">
                    <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">
                      {prod.sub}
                    </p>
                    <p className="font-semibold text-[#111] text-[13px] leading-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {prod.name}
                    </p>

                    {/* Fabric tag */}
                    <span
                      className="inline-flex items-center gap-1.5 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2 w-fit border"
                      style={{ background: `${sec.accent}10`, borderColor: `${sec.accent}30` }}
                    >
                      <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: sec.accent }} />
                      {prod.fabric}
                    </span>

                    {/* Dashed rule */}
                    <div
                      className="h-px mb-2"
                      style={{ background: "repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }}
                    />

                    {/* Stars + reviews */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars n={prod.rating} color={sec.accent} />
                      <span className="text-[10px] text-gray-400">({prod.reviews})</span>
                    </div>

                    {/* Price row */}
                    <div className="flex items-baseline gap-2 flex-wrap mb-2">
                      <span className="font-bold leading-none" style={{ fontSize: "clamp(1rem,1.4vw,1.15rem)", color: sec.accent }}>
                        ₹{prod.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-gray-300 line-through">
                        ₹{prod.orig.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">
                        Save ₹{(prod.orig - prod.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Color swatches */}
                    <div className="flex gap-1.5 mb-3">
                      {prod.colors.map((c, ci) => (
                        <span
                          key={ci}
                          className="w-[13px] h-[13px] rounded-full border border-black/12 cursor-pointer transition-transform duration-200 hover:scale-125"
                          style={{ background: c }}
                        />
                      ))}
                    </div>

                    {/* ── Add to Bag ── */}
                    <button
                      onClick={e => { e.stopPropagation(); addCart(prod.id); }}
                      className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer rounded-b-xl transition-all duration-250 hover:brightness-110 active:scale-[.98]"
                      style={{ background: addedId === prod.id ? "#16a34a" : sec.accent }}
                    >
                      <ShoppingBag size={13} />
                      <span>{addedId === prod.id ? "✓ Added to Bag" : "Add to Bag"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 4 individual "View More" buttons ── */}
          <div style={fade(6)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {SECTIONS.map(sec => (
              <button
                key={sec.key}
                onClick={() => goShop(sec.key)}
                className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border font-bold text-[11px] tracking-[.14em] uppercase cursor-pointer transition-all duration-250 hover:-translate-y-0.5"
                style={{
                  background: "white",
                  borderColor: `${sec.accent}40`,
                  color: sec.accent,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = sec.accent;
                  el.style.borderColor = sec.accent;
                  el.style.color = "#fff";
                  el.style.boxShadow = `0 8px 24px ${sec.accent}44`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = "white";
                  el.style.borderColor = `${sec.accent}40`;
                  el.style.color = sec.accent;
                  el.style.boxShadow = "";
                }}
              >
                <span className="text-base leading-none">{sec.emoji}</span>
                View More {sec.label}
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ══ TOAST ══ */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-[#111] text-white text-[12px] font-semibold tracking-[.1em] px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-none transition-all duration-300 ${addedId ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        Added to your bag
      </div>
    </>
  );
}