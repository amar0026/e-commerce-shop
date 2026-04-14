import { useState, useMemo, useEffect } from "react";
import { Search, Grid3X3, List } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  PRODUCTS,
  FILTERS,
  FILTER_ICONS,
  type FilterType,
} from "../constants/products"; // adjust import path as needed
import ProductCard, {
  type CardProduct,
} from "../components/products/ProductCard";

// ─── constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
];

const normaliseCat = (raw: string | null): FilterType => {
  if (!raw) return "All";
  const match = FILTERS.find((c) => c.toLowerCase() === raw.toLowerCase());
  return match ?? "All";
};

// ─── adapter: GarmentProduct → CardProduct ────────────────────────────────────

const toCardProduct = (p: (typeof PRODUCTS)[0]): CardProduct => ({
  id: p.id,
  name: p.title,
  brand: p.brand,
  cat: p.category,
  sub: p.category, // using category for sub as well
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  badge: p.badge,
  badgeColor: p.badgeColor,
  fabric: p.fabric,
  colors: [], // GarmentProduct doesn't have colors array
  sizes: p.sizes,
  rating: p.rating,
  reviewCount: p.reviewCount,
  discount: p.discount,
});

// ─── ShopPage ─────────────────────────────────────────────────────────────────

interface ShopPageProps {
  onCartOpen?: () => void;
}

export default function ShopPage({ onCartOpen }: ShopPageProps) {
  const [searchParams] = useSearchParams();

  const [activeCat, setActiveCat] = useState<FilterType>(() =>
    normaliseCat(searchParams.get("category")),
  );

  useEffect(() => {
    setActiveCat(normaliseCat(searchParams.get("category")));
  }, [searchParams]);

  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Relevance");

  const toggleWish = (id: string | number) =>
    setWishlist((w) =>
      w.includes(String(id))
        ? w.filter((x) => x !== String(id))
        : [...w, String(id)],
    );

  const filtered = useMemo(() => {
    let p = [...PRODUCTS];

    if (activeCat !== "All") {
      p = p.filter((x) => x.category === activeCat);
    }

    if (search.trim()) {
      p = p.filter(
        (x) =>
          x.title.toLowerCase().includes(search.toLowerCase()) ||
          x.brand.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort === "Price: Low to High") p.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") p.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") p.sort((a, b) => b.rating - a.rating);

    return p;
  }, [activeCat, search, sort]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes salePop  { 0%,100%{transform:scale(1) rotate(-6deg)} 50%{transform:scale(1.1) rotate(-6deg)} }
        @keyframes cardIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes dotDrift { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes bagFlash { 0%,100%{transform:scale(1)} 40%{transform:scale(1.06)} }
      `}</style>

      <div
        className="relative min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* dot grid bg */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(249,115,22,.06) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 20s linear infinite",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-16">
          {/* ── HEADER ── */}
          <div className="pb-6 border-b border-black/6 mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-0.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                Our Collection
              </span>
            </div>
            <h1
              className="font-black text-[#111] leading-none tracking-tight"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
            >
              Big Saving{" "}
              <em className="text-orange-500 italic">
                {activeCat === "All"
                  ? "All Products"
                  : `${activeCat}'s Collection`}
              </em>
            </h1>
            <p className="text-xs text-gray-400 tracking-wide mt-2">
              Handpicked garments · Fresh fabrics · Every season
            </p>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {FILTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-[.1em] uppercase px-4 py-[7px] rounded-2xl border transition-all duration-200 cursor-pointer
                    ${
                      activeCat === c
                        ? "bg-orange-500 border-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.3)]"
                        : "bg-white border-black/10 text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                >
                  {FILTER_ICONS[c] && `${FILTER_ICONS[c]} `}
                  {c}
                </button>
              ))}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-[11px] font-semibold text-[#111] bg-white border border-black/10 rounded-xl px-3 py-[7px] outline-none cursor-pointer focus:border-orange-500 transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="text-[12px] pl-8 pr-4 py-2 w-44 border border-black/10 rounded-2xl bg-white text-[#111] outline-none focus:border-orange-500 focus:w-56 transition-all duration-300"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              <button
                onClick={() => setViewMode("grid")}
                className={`w-[34px] h-[34px] rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200
                  ${viewMode === "grid" ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500"}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-[34px] h-[34px] rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200
                  ${viewMode === "list" ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500"}`}
              >
                <List size={14} />
              </button>
              <span className="text-[11px] text-gray-400 px-1">
                <strong className="text-orange-500 font-bold">
                  {filtered.length}
                </strong>{" "}
                items
              </span>
            </div>
          </div>

          {/* ── PRODUCT GRID / LIST ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🧵</div>
              <p className="font-bold text-xl text-[#111] mb-2">
                No garments found
              </p>
              <p className="text-sm text-gray-400">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid" ? "grid gap-5" : "flex flex-col gap-4"
              }
              style={
                viewMode === "grid"
                  ? {
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(240px,1fr))",
                    }
                  : undefined
              }
            >
              {filtered.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={toCardProduct(prod)}
                  viewMode={viewMode}
                  animationDelay={0}
                  visible={true}
                  wishlisted={wishlist.includes(String(prod.id))}
                  onToggleWishlist={toggleWish}
                  onAfterAdd={onCartOpen}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
