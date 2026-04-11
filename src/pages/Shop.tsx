import { useState, useMemo } from "react";
import { Search, Grid3X3, List, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../components/products/CartContext"; // ← single source of truth

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
   Product data
───────────────────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Slim Fit Oxford Shirt", cat: "Men", sub: "Shirts", price: 899, orig: 1499, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295572/images_22_n6ftjn.jpg", badge: "NEW", badgeColor: "#16a34a", rating: 4.5, reviews: 128, colors: ["#fff", "#6b8cba", "#111"], fabric: "100% Cotton", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "Stretch Chino Trousers", cat: "Men", sub: "Trousers", price: 1299, orig: 2199, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/Untitleddesign_98_r0vlhs.webp", badge: "HOT", badgeColor: "#f97316", rating: 4.3, reviews: 87, colors: ["#8b6f47", "#111", "#3a3a3a"], fabric: "Cotton Blend", sizes: ["30", "32", "34", "36", "38"] },
  { id: 3, name: "Premium Wool Blazer", cat: "Men", sub: "Suits", price: 3499, orig: 5999, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp", badge: "SALE", badgeColor: "#ea580c", rating: 4.7, reviews: 214, colors: ["#111", "#2c3e50", "#555"], fabric: "Wool Blend", sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "Urban Denim Jacket", cat: "Men", sub: "Jackets", price: 1899, orig: 2999, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295770/images_23_s4o5yt.jpg", badge: "SALE", badgeColor: "#ea580c", rating: 4.4, reviews: 156, colors: ["#3b5998", "#111"], fabric: "Denim", sizes: ["S", "M", "L", "XL"] },
  { id: 5, name: "Classic White Tee", cat: "Men", sub: "T-Shirts", price: 399, orig: 699, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg", badge: "SALE", badgeColor: "#ea580c", rating: 4.2, reviews: 301, colors: ["#fff", "#111", "#e63946"], fabric: "100% Cotton", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 6, name: "Slim Straight Jeans", cat: "Men", sub: "Jeans", price: 1199, orig: 1999, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295972/images_24_dv4pnt.jpg", badge: "SALE", badgeColor: "#ea580c", rating: 4.6, reviews: 189, colors: ["#3b5998", "#111", "#1a1a2e"], fabric: "98% Denim", sizes: ["28", "30", "32", "34", "36"] },
  { id: 7, name: "Wedding Lehnga", cat: "Women", sub: "Dresses", price: 1099, orig: 1799, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1771325307/images_11_xlytvq.jpg", badge: "NEW", badgeColor: "#16a34a", rating: 4.8, reviews: 245, colors: ["#e8b4b8", "#6b4c3b", "#fff"], fabric: "Georgette", sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 8, name: "Party Frock Girl", cat: "Women", sub: "Ethnic", price: 2199, orig: 3499, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1771325461/pngtree-trendy-summer-party-dress-model-girl-in-fashionable-attire-png-image_13211648_ys2ype.png", badge: "HOT", badgeColor: "#f97316", rating: 4.6, reviews: 178, colors: ["#c0392b", "#8e44ad", "#f39c12"], fabric: "Pure Silk", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 9, name: "Palazzo Sharara Set", cat: "Women", sub: "Ethnic", price: 1799, orig: 2499, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp", badge: "SALE", badgeColor: "#ea580c", rating: 4.3, reviews: 88, colors: ["#c0392b", "#f39c12"], fabric: "Silk Blend", sizes: ["S", "M", "L", "XL"] },
  { id: 10, name: "Kids Dungaree Playsuit", cat: "Kids", sub: "Casuals", price: 599, orig: 899, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg", badge: "NEW", badgeColor: "#16a34a", rating: 4.8, reviews: 61, colors: ["#3b82f6", "#f97316", "#fff"], fabric: "Denim Cotton", sizes: ["2Y", "4Y", "6Y", "8Y"] },
  { id: 11, name: "Embroidered Anarkali", cat: "Women", sub: "Ethnic", price: 2150, orig: 3200, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp", badge: "HOT", badgeColor: "#f97316", rating: 4.0, reviews: 75, colors: ["#8e44ad", "#c0392b", "#f39c12"], fabric: "Georgette", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 12, name: "Tropical Rayon Shirt", cat: "Men", sub: "Shirts", price: 749, orig: 1100, img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296337/gemini-generated-image-hisdushisdushisd-1-500x500_z8jlod.webp", badge: "SALE", badgeColor: "#ea580c", rating: 4.5, reviews: 214, colors: ["#fff", "#f97316", "#111"], fabric: "Rayon", sizes: ["S", "M", "L", "XL"] },
];

const CATS = ["All", "Men", "Women", "Kids"];
const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Top Rated"];
const pct = (p: number, o: number) => Math.round((1 - p / o) * 100);
const isSale = (b: string) => b === "SALE" || b === "HOT";

const Stars = ({ n }: { n: number }) => (
  <span className="text-orange-500 tracking-wide" style={{ fontSize: 11 }}>
    {"★".repeat(Math.floor(n))}
    <span className="text-gray-200">{"★".repeat(5 - Math.floor(n))}</span>
  </span>
);

const SaleBadge = ({ pctOff }: { pctOff: number }) => (
  <div className="absolute z-20 flex flex-col items-center justify-center rounded-full shadow-lg select-none pointer-events-none"
    style={{
      top: 10, right: 10, width: 58, height: 58,
      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      boxShadow: "0 4px 16px rgba(249,115,22,.5)",
      animation: "salePop 2.8s ease-in-out infinite"
    }}>
    <span className="text-white font-black leading-none" style={{ fontSize: 9, letterSpacing: ".14em" }}>SALE</span>
    <span className="text-white font-black leading-none" style={{ fontSize: 17 }}>{pctOff}%</span>
  </div>
);

/* ─────────────────────────────────────────────
   ShopPage
───────────────────────────────────────────── */
interface ShopPageProps {
  onCartOpen?: () => void;   // parent opens CartDrawer
}

export default function ShopPage({ onCartOpen }: ShopPageProps) {
  /* ── CART CONTEXT ── */
  const { addItem } = useCart();

  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [sort, setSort] = useState("Relevance");

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  /* ─────────────────────────────────────────
     handleAddCart — THE CORE FUNCTION
     Called from:
       1. "Add to Bag" button at bottom of card
       2. Any size chip in the hover size strip
     Steps:
       a. addItem()  → CartContext (shared global state)
       b. Flash button green for 1.4s
       c. After 500ms → open CartDrawer so user sees item
  ───────────────────────────────────────── */
  const handleAddCart = (prod: Product, size?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();   // don't trigger card click

    // Build the cart item matching CartContext's CartItem shape
    addItem(
      {
        id: prod.id,
        name: prod.name,
        cat: prod.cat,
        sub: prod.sub,
        price: prod.price,
        orig: prod.orig,
        img: prod.img,
        badge: prod.badge,
        badgeColor: prod.badgeColor,
        fabric: prod.fabric,
        colors: prod.colors,
        sizes: prod.sizes,
        rating: prod.rating,
        reviews: prod.reviews,
      },
      size ?? prod.sizes[0],
      prod.colors[0]
    );

    // Flash button green
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1400);

    // Open CartDrawer after short delay (lets button flash be seen first)
    setTimeout(() => onCartOpen?.(), 500);
  };

  const filtered = useMemo(() => {
    let p = [...ALL_PRODUCTS];
    if (activeCat !== "All") p = p.filter(x => x.cat === activeCat);
    if (search.trim()) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Price: Low to High") p.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") p.sort((a, b) => b.price - a.price);
    if (sort === "Top Rated") p.sort((a, b) => b.rating - a.rating);
    return p;
  }, [activeCat, search, sort]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes salePop    { 0%,100%{transform:scale(1) rotate(-6deg)} 50%{transform:scale(1.1) rotate(-6deg)} }
        @keyframes cardIn     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes addedPop   { 0%,100%{transform:scale(1)} 40%{transform:scale(1.06)} }
      `}</style>

      <div className="relative min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* dot grid */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(249,115,22,.06) 1px, transparent 1px)", backgroundSize: "28px 28px", animation: "dotDrift 20s linear infinite" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-16">

          {/* ── HEADER ── */}
          <div className="pb-6 border-b border-black/6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-0.5 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">Our Collection</span>
                </div>
                <h1 className="font-black text-[#111] leading-none tracking-tight" style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
                  Big Saving{" "}
                  <em className="text-orange-500" style={{ fontStyle: "italic" }}>All Products</em>
                </h1>
                <p className="text-xs text-gray-400 tracking-wide mt-2">
                  Handpicked garments · Fresh fabrics · Every season
                </p>
              </div>


            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {CATS.map(c => (
                <button key={c} onClick={() => { setActiveCat(c); }}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-[.1em] uppercase px-4 py-[7px] rounded-2xl border transition-all duration-200 cursor-pointer
                    ${activeCat === c ? "bg-orange-500 border-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.3)]" : "bg-white border-black/10 text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"}`}>
                  {c === "Women" && "👗 "}{c === "Men" && "👔 "}{c === "Kids" && "👶 "}{c}
                </button>
              ))}
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-[11px] font-semibold text-[#111] bg-white border border-black/10 rounded-xl px-3 py-[7px] outline-none cursor-pointer focus:border-orange-500 transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="text-[12px] pl-8 pr-4 py-2 w-44 border border-black/10 rounded-2xl bg-white text-[#111] outline-none focus:border-orange-500 focus:w-56 transition-all duration-300"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
              </div>
              <button onClick={() => setViewMode("grid")}
                className={`w-[34px] h-[34px] rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${viewMode === "grid" ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500"}`}>
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setViewMode("list")}
                className={`w-[34px] h-[34px] rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${viewMode === "list" ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500"}`}>
                <List size={14} />
              </button>
              <span className="text-[11px] text-gray-400 px-1">
                <strong className="text-orange-500 font-bold">{filtered.length}</strong> items
              </span>
            </div>
          </div>

          {/* ── PRODUCTS ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🧵</div>
              <p className="font-bold text-xl text-[#111] mb-2">No garments found</p>
              <p className="text-sm text-gray-400">Try a different category or search term</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-5" : "flex flex-col gap-4"}
              style={viewMode === "grid" ? { gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" } : undefined}>

              {filtered.map((prod, i) => (
                <div key={prod.id}
                  className={`group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer
                    transition-all duration-400
                    hover:-translate-y-[5px] hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)] hover:border-orange-300
                    ${viewMode === "list" ? "flex" : ""}`}
                  style={{ animation: `cardIn .55s cubic-bezier(.16,1,.3,1) ${i * 0.06}s both` }}>

                  {/* orange bottom sweep */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

                  {/* ── IMAGE AREA ── */}
                  <div
                    className={`relative overflow-hidden flex items-center justify-center shrink-0 ${viewMode === "list" ? "w-[220px] h-[220px]" : ""}`}
                    style={{ background: "#fff4ee", height: viewMode === "grid" ? "clamp(210px,26vw,270px)" : undefined }}>

                    <div className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage: "linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

                    <img src={prod.img} alt={prod.name} loading="lazy"
                      className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.06] group-hover:-translate-y-1"
                      style={{ width: "75%", height: "90%" }} />

                    {/* SALE circular badge */}
                    {isSale(prod.badge) && <SaleBadge pctOff={pct(prod.price, prod.orig)} />}

                    {/* NEW ribbon badge */}
                    {prod.badge && !isSale(prod.badge) && (
                      <div className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[60px]"
                        style={{ background: prod.badgeColor, clipPath: "polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)" }}>
                        {prod.badge}
                      </div>
                    )}

                    {/* Wishlist btn */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWish(prod.id); }}
                      className={`absolute top-[46px] right-2.5 z-20 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md
                        opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-250
                        ${wishlist.includes(prod.id)
                          ? "bg-red-50 border-red-200 text-red-500 !opacity-100 !scale-100"
                          : "bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white"}`}>
                      <Heart size={13} fill={wishlist.includes(prod.id) ? "currentColor" : "none"} />
                    </button>

                    {/* ── SIZE STRIP (hover) ──
                        Clicking a size chip adds THAT size to cart and opens drawer */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2 px-2 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                      {prod.sizes.map(s => (
                        <button
                          key={s}
                          onClick={e => handleAddCart(prod, s, e)}
                          className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded bg-transparent cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── CARD BODY ── */}
                  <div className="p-3.5 flex-1 flex flex-col">
                    <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">{prod.cat} · {prod.sub}</p>
                    <p className={`font-semibold text-[#111] leading-tight mb-2 ${viewMode === "list" ? "text-lg whitespace-normal" : "text-[13px] whitespace-nowrap overflow-hidden text-ellipsis"}`}>
                      {prod.name}
                    </p>

                    {/* Fabric */}
                    <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2 w-fit">
                      <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" />
                      {prod.fabric}
                    </span>

                    {/* Dashed rule */}
                    <div className="h-px mb-2"
                      style={{ background: "repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }} />

                    {/* Stars */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars n={prod.rating} />
                      <span className="text-[10px] text-gray-400">({prod.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 flex-wrap mb-2">
                      <span className="font-bold text-orange-500 leading-none" style={{ fontSize: "clamp(1rem,1.5vw,1.2rem)" }}>
                        ₹{prod.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-gray-300 line-through">₹{prod.orig.toLocaleString("en-IN")}</span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">
                        Save ₹{(prod.orig - prod.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Color swatches */}
                    <div className="flex gap-1.5 mb-3">
                      {prod.colors.map((c, ci) => (
                        <span key={ci}
                          className="w-[13px] h-[13px] rounded-full border border-black/12 cursor-pointer transition-transform duration-200 hover:scale-125 hover:ring-2 hover:ring-orange-400"
                          style={{ background: c }} />
                      ))}
                    </div>

                    {/* ── ADD TO BAG BUTTON ──
                        Adds default first size, flashes green, opens drawer */}
                    <button
                      onClick={e => handleAddCart(prod, prod.sizes[0], e)}
                      className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer rounded-b-xl transition-all duration-250 hover:brightness-110 active:scale-[.98]"
                      style={{
                        background: addedId === prod.id ? "#16a34a" : "#f97316",
                        animation: addedId === prod.id ? "addedPop .4s ease" : "none",
                      }}>
                      <ShoppingBag size={13} />
                      <span>{addedId === prod.id ? "✓ Added to Bag" : "Add to Bag"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast notification */}
        <div className={`fixed bottom-6 right-6 z-[60] bg-[#111] text-white text-[12px] font-semibold tracking-[.1em] px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-none transition-all duration-300
          ${addedId ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
          Added to your bag!
        </div>
      </div>
    </>
  );
}