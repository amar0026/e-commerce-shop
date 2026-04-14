import { useState, useEffect, useRef } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/products/CartContext";
import ProductCard from "../components/products/ProductCard";
import type { CardProduct } from "../components/products/ProductCard";
import {
  PRODUCTS,
  FILTERS,
  FILTER_ICONS,
  type FilterType,
} from "../constants/products"; // adjust import path

// ─── categories config (derived from FILTERS) ──────────────────────────────────

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

// ─── adapter: GarmentProduct → CardProduct ────────────────────────────────────

const toCardProduct = (p: (typeof PRODUCTS)[0]): CardProduct => ({
  id: p.id,
  name: p.title,
  brand: p.brand,
  cat: p.category,
  sub: p.category,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  badge: p.badge,
  badgeColor: p.badgeColor,
  fabric: p.fabric,
  colors: [],
  sizes: p.sizes,
  rating: p.rating,
  reviewCount: p.reviewCount,
  discount: p.discount,
});

// ─── CategoriesPage ───────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const [activeCategory, setActiveCategory] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, [activeCategory]);

  useEffect(() => {
    setGridKey((k) => k + 1);
  }, [activeCategory]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const toggleWish = (id: string | number) => {
    setWishlist((w) =>
      w.includes(String(id))
        ? w.filter((x) => x !== String(id))
        : [...w, String(id)],
    );
  };

  const filtered = PRODUCTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory,
  )
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return b.discount - a.discount;
      return 0;
    });

  const activeLabel = activeCategory;
  const currentSort =
    SORT_OPTIONS.find((s) => s.value === sort)?.label ?? "Featured";

  // Update category counts dynamically
  const categoriesWithCounts = FILTERS.map((key) => ({
    key,
    label: key,
    emoji: FILTER_ICONS[key] || "🛍️",
    count:
      key === "All"
        ? PRODUCTS.length
        : PRODUCTS.filter((p) => p.category === key).length,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');

        @keyframes dotDrift    { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes slideIn     { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:none} }
        @keyframes slideInRight{ from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:none} }
        @keyframes slideDown   { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }
        @keyframes overlayIn   { from{opacity:0} to{opacity:1} }
        @keyframes pulse-ring  { 0%{transform:scale(1);opacity:.6} 70%{transform:scale(1.35);opacity:0} 100%{transform:scale(1.35);opacity:0} }
        @keyframes bounceIn    { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        .cat-scrollbar::-webkit-scrollbar{width:3px}
        .cat-scrollbar::-webkit-scrollbar-track{background:transparent}
        .cat-scrollbar::-webkit-scrollbar-thumb{background:#fed7aa;border-radius:4px}

        .search-glow:focus { box-shadow: 0 0 0 3px rgba(249,115,22,.18); }

        .sidebar-active-pulse::after {
          content:'';
          position:absolute;
          inset:0;
          border-radius:1rem;
          border:2px solid #f97316;
          animation: pulse-ring 1.6s cubic-bezier(.4,0,.6,1) infinite;
          pointer-events:none;
        }

        @media (max-width: 480px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; }
        }

        @media (max-width: 639px) {
          .header-controls { flex-direction: column; align-items: stretch !important; }
          .header-controls > * { width: 100% !important; }
          .header-controls input { width: 100% !important; }
        }

        .sidebar-link-hover::before {
          content:'';
          position:absolute;
          left:0; top:0; bottom:0;
          width:3px;
          background:#f97316;
          border-radius:0 3px 3px 0;
          transform:scaleY(0);
          transition:transform .2s ease;
        }
        .sidebar-link-hover:hover::before { transform:scaleY(1); }
      `}</style>

      <div
        className="relative min-h-screen bg-white"
        style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
      >
        {/* Animated dot background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(249,115,22,.06) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 18s linear infinite",
          }}
        />

        {/* PAGE HEADER */}
        <div
          className="relative z-10 border-b border-black/6 bg-white/90 backdrop-blur-sm pt-6 pb-5 px-4 sm:px-8 lg:px-14"
          style={{ animation: "slideDown .5s cubic-bezier(.16,1,.3,1)" }}
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              {/* Title */}
              <div
                style={{
                  animation: "fadeUp .5s cubic-bezier(.16,1,.3,1) .1s both",
                }}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-0.5 bg-orange-500 rounded-full" />
                  <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                    Shop by Category
                  </span>
                </div>
                <h1
                  className="font-extrabold text-[#111] leading-none tracking-tight"
                  style={{ fontSize: "clamp(1.7rem,3.5vw,2.6rem)" }}
                >
                  Browse{" "}
                  <em
                    className="italic font-semibold text-orange-500"
                    style={{ animation: "fadeIn .4s ease .3s both" }}
                  >
                    {activeLabel}
                  </em>
                </h1>
                <p
                  className="text-[12px] text-gray-400 mt-1"
                  style={{ animation: "fadeIn .4s ease .4s both" }}
                >
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Controls */}
              <div
                className="flex items-center gap-2.5 flex-wrap header-controls"
                style={{
                  animation:
                    "slideInRight .5s cubic-bezier(.16,1,.3,1) .15s both",
                }}
              >
                {/* View Cart */}
                {totalItems > 0 && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.14em] uppercase px-5 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]"
                    style={{
                      animation: "bounceIn .4s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    <ShoppingBag size={14} />
                    View Bag
                    <span className="w-5 h-5 bg-white text-orange-500 font-black text-[10px] rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  </button>
                )}

                {/* Search */}
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="search-glow pl-9 pr-4 py-2.5 text-[12px] bg-gray-50 border border-gray-200 rounded-2xl outline-none w-52 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-[#111]"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 hover:rotate-90 transition-all duration-200 cursor-pointer bg-transparent border-none"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                  <button
                    onClick={() => setSortOpen((s) => !s)}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#111] bg-white border border-black/10 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all duration-200 hover:shadow-[0_2px_12px_rgba(249,115,22,.15)]"
                  >
                    <ArrowUpDown size={12} />
                    {currentSort}
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sortOpen && (
                    <div
                      className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-black/8 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,.1)] overflow-hidden z-30"
                      style={{
                        animation: "fadeUp .25s cubic-bezier(.16,1,.3,1)",
                      }}
                    >
                      {SORT_OPTIONS.map((opt, idx) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left text-[12px] font-semibold px-4 py-3 cursor-pointer transition-all duration-150 border-none
                            ${sort === opt.value ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 hover:pl-5"}`}
                          style={{
                            animation: `fadeUp .2s ease ${idx * 0.04}s both`,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile categories button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 text-[11px] font-semibold text-[#111] bg-white border border-black/10 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all duration-200 active:scale-95"
                >
                  <SlidersHorizontal size={13} />
                  Categories
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 py-8 flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-3 shrink-0 w-[210px]">
            <div
              className="sticky top-6"
              style={{
                animation: "slideIn .5s cubic-bezier(.16,1,.3,1) .2s both",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
                <p className="text-[10px] font-black tracking-[.22em] uppercase text-orange-500">
                  Categories
                </p>
              </div>
              <nav className="flex flex-col gap-1">
                {categoriesWithCounts.map((cat, i) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`sidebar-link-hover group relative flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left border transition-all duration-250 cursor-pointer
                        ${
                          isActive
                            ? "bg-orange-500 border-orange-500 shadow-[0_6px_18px_rgba(249,115,22,.3)] sidebar-active-pulse"
                            : "bg-white border-transparent hover:border-orange-200 hover:bg-orange-50 hover:translate-x-1"
                        }`}
                      style={{
                        animation: visible
                          ? `slideIn .4s cubic-bezier(.16,1,.3,1) ${i * 0.06}s both`
                          : "none",
                      }}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-white/50 rounded-full" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <span
                          className="text-[16px] transition-transform duration-200 group-hover:scale-125"
                          style={{ display: "inline-block" }}
                        >
                          {cat.emoji}
                        </span>
                        <span
                          className={`font-bold text-[12px] tracking-[.06em] transition-colors duration-200 ${isActive ? "text-white" : "text-[#111] group-hover:text-orange-500"}`}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg transition-all duration-200 ${isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div
                className="mt-6 h-px"
                style={{
                  background: "linear-gradient(90deg,#fed7aa,transparent)",
                }}
              />
              <div
                className="mt-4 p-3.5 bg-orange-50 border border-orange-100 rounded-2xl"
                style={{ animation: "fadeUp .5s ease .6s both" }}
              >
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[.16em] mb-1">
                  💡 Tip
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Click any category to instantly filter your view.
                </p>
              </div>
            </div>
          </aside>

          {/* ── Mobile Sidebar Overlay ── */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              style={{ animation: "overlayIn .2s ease" }}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div
                className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
                style={{ animation: "slideIn .3s cubic-bezier(.16,1,.3,1)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
                    <span className="text-[11px] font-black tracking-[.2em] uppercase text-orange-500">
                      Categories
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:rotate-90 cursor-pointer border-none transition-all duration-200"
                  >
                    <X size={15} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 p-4 overflow-y-auto cat-scrollbar flex-1">
                  {categoriesWithCounts.map((cat, i) => {
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setActiveCategory(cat.key);
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer active:scale-95
                          ${isActive ? "bg-orange-500 border-orange-500 shadow-[0_4px_14px_rgba(249,115,22,.3)]" : "bg-white border-black/8 hover:border-orange-300 hover:bg-orange-50"}`}
                        style={{
                          animation: `slideIn .3s cubic-bezier(.16,1,.3,1) ${i * 0.05}s both`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[18px]">{cat.emoji}</span>
                          <span
                            className={`font-bold text-[13px] ${isActive ? "text-white" : "text-[#111]"}`}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isActive ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* ── PRODUCT GRID ── */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-24 text-center"
                style={{ animation: "bounceIn .5s cubic-bezier(.16,1,.3,1)" }}
              >
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                  🔍
                </div>
                <p className="font-black text-[#111] text-lg mb-1">
                  No items found
                </p>
                <p className="text-gray-400 text-[13px] mb-4">
                  Try adjusting your search or pick another category.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-white bg-orange-500 px-6 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div key={gridKey} className="product-grid grid gap-5">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={toCardProduct(product)}
                    viewMode="grid"
                    animationDelay={visible ? i * 0.05 : 0}
                    visible={visible}
                    wishlisted={wishlist.includes(String(product.id))}
                    onToggleWishlist={toggleWish}
                  />
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div
                className="mt-12 h-px opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,#fed7aa 30%,#fed7aa 70%,transparent)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
