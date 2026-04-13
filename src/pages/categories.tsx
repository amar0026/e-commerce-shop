import { useState, useEffect, useRef } from "react";
import {
  Heart, Eye, ShoppingBag, SlidersHorizontal,
  ChevronDown, X, Search, ArrowUpDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/products/CartContext"; // ← REAL CART

interface Product {
  id: string; title: string; brand: string;
  price: number; originalPrice: number;
  image: string; rating: number; reviewCount: string;
  fabric: string; sizes: string[]; badge: string;
  badgeColor: string; discount: number; category: string;
}

const CATEGORIES = [
  { key: "All",      label: "All Items",  emoji: "🛍️", count: 12 },
  { key: "T-Shirts", label: "T-Shirts",   emoji: "👕", count: 3  },
  { key: "Sweater",  label: "Sweater",    emoji: "🧶", count: 2  },
  { key: "Suit",     label: "Suit",       emoji: "🤵", count: 2  },
  { key: "Shirts",   label: "Shirts",     emoji: "👔", count: 2  },
  { key: "Jeans",    label: "Jeans",      emoji: "👖", count: 2  },
  { key: "Jackets",  label: "Jackets",    emoji: "🧥", count: 1  },
];

const PRODUCTS: Product[] = [
  { id:"t1",  title:"Oversized Graphic Tee",      brand:"H&M",      price:599,  originalPrice:999,   image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776082181/images_18_c14q51.jpg", rating:4.4, reviewCount:"213", fabric:"100% Cotton",  sizes:["XS","S","M","L","XL"],    badge:"Trending",    badgeColor:"#ea580c", discount:40, category:"T-Shirts" },
  { id:"t2",  title:"Classic Polo T-Shirt",       brand:"Levis",    price:799,  originalPrice:1299,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776082050/images_17_ysyoqo.jpg",  rating:4.6, reviewCount:"189", fabric:"Pique Cotton", sizes:["S","M","L","XL","XXL"],   badge:"Bestseller",  badgeColor:"#111",    discount:38, category:"T-Shirts" },
  { id:"t3",  title:"Slim Fit Round Neck Tee",    brand:"FabIndia", price:449,  originalPrice:699,   image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776079504/images_7_un80d9.jpg",rating:4.2, reviewCount:"95",  fabric:"Cotton Blend", sizes:["XS","S","M","L"],         badge:"Sale",        badgeColor:"#f97316", discount:36, category:"T-Shirts" },
  { id:"sw1", title:"Cable Knit Crewneck",        brand:"Zara",     price:1899, originalPrice:2999,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081928/images_16_tc3aqm.jpg",rating:4.7, reviewCount:"77",  fabric:"Wool Blend",   sizes:["S","M","L","XL"],         badge:"New Arrival", badgeColor:"#16a34a", discount:37, category:"Sweater" },
  { id:"sw2", title:"Chunky Turtleneck Sweater",  brand:"Aurelia",  price:2299, originalPrice:3499,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081791/images_15_prlhcy.jpg",rating:4.5, reviewCount:"54",  fabric:"Merino Wool",  sizes:["S","M","L"],              badge:"Hot Deal",    badgeColor:"#dc2626", discount:34, category:"Sweater" },
  { id:"su1", title:"Bandhgala Nehru Jacket",     brand:"Manyavar", price:3299, originalPrice:4999,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081727/images_14_y2wrgw.jpg",                                                  rating:4.8, reviewCount:"47",  fabric:"Art Silk",     sizes:["S","M","L","XL","XXL"],   badge:"New Arrival", badgeColor:"#16a34a", discount:34, category:"Suit" },
  { id:"su2", title:"3-Piece Formal Suit",        brand:"Raymond",  price:7999, originalPrice:11999, image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081576/ChatGPTImageJun19_2025_04_04_04PM_anjwdd.webp",                             rating:4.9, reviewCount:"31",  fabric:"Premium Wool", sizes:["38","40","42","44"],       badge:"Premium",     badgeColor:"#7c3aed", discount:33, category:"Suit" },
  { id:"sh1", title:"Tropical Rayon Camp Shirt",  brand:"Manyavar", price:749,  originalPrice:1100,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_5_f8olir.jpg",                                       rating:4.5, reviewCount:"214", fabric:"Rayon",        sizes:["S","M","L","XL"],         badge:"Trending",    badgeColor:"#ea580c", discount:32, category:"Shirts" },
  { id:"sh2", title:"Oxford Button-Down Shirt",   brand:"FabIndia", price:1199, originalPrice:1799,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081417/black-long-sleeve-buttondown-shirt_191095-80589_vny1lw.avif",                                                                       rating:4.3, reviewCount:"128", fabric:"100% Cotton",  sizes:["S","M","L","XL","XXL"],   badge:"Bestseller",  badgeColor:"#111",    discount:33, category:"Shirts" },
  { id:"j1",  title:"Flared Denim Jeans",         brand:"Levis",    price:1499, originalPrice:2299,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776081315/images_13_wywn8t.jpg",                                                                                rating:4.6, reviewCount:"302", fabric:"98% Denim",    sizes:["26","28","30","32"],       badge:"Trending",    badgeColor:"#ea580c", discount:35, category:"Jeans" },
  { id:"j2",  title:"Slim Fit Stretch Chinos",    brand:"FabIndia", price:899,  originalPrice:1299,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_3_prsjj5.jpg",                                                                       rating:4.5, reviewCount:"99",  fabric:"Cotton Blend", sizes:["30","32","34","36","38"], badge:"Bestseller",  badgeColor:"#111",    discount:31, category:"Jeans" },
  { id:"jk1", title:"Quilted Puffer Jacket",      brand:"H&M",      price:2999, originalPrice:4499,  image:"https://res.cloudinary.com/dquki4xol/image/upload/v1776079502/images_10_lqvavf.jpg",                                                  rating:4.7, reviewCount:"88",  fabric:"Polyester",    sizes:["S","M","L","XL"],         badge:"New Arrival", badgeColor:"#16a34a", discount:33, category:"Jackets" },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? "#f97316" : "#e5e7eb", fontSize: 11 }}>★</span>
    ))}
  </div>
);

const SORT_OPTIONS = [
  { value: "default",    label: "Featured"          },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated"         },
  { value: "discount",   label: "Biggest Discount"  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  // ── REAL CART ──
  const { addItem, totalItems } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [sort,           setSort]           = useState("default");
  const [wishlist,       setWishlist]       = useState<string[]>([]);
  const [addedId,        setAddedId]        = useState<string | null>(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [visible,        setVisible]        = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = PRODUCTS
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "discount")   return b.discount - a.discount;
      return 0;
    });

  const toggleWish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  // ── REAL addItem call ──
  const handleCart = (p: Product, size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      {
        id:         parseInt(p.id) || Math.abs(p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)),
        name:       p.title,
        cat:        p.category,
        sub:        p.category,
        price:      p.price,
        orig:       p.originalPrice,
        img:        p.image,
        badge:      p.badge,
        badgeColor: p.badgeColor,
        fabric:     p.fabric,
        colors:     ["#111"],
        sizes:      p.sizes,
        rating:     p.rating,
        reviews:    parseInt(p.reviewCount) || 0,
      },
      size,
      "#111"
    );
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const activeLabel  = CATEGORIES.find(c => c.key === activeCategory)?.label ?? "All Items";
  const currentSort  = SORT_OPTIONS.find(s => s.value === sort)?.label ?? "Featured";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');
        @keyframes dotDrift  { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar{ 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes bagFlash  { 0%,100%{transform:scale(1)} 40%{transform:scale(1.18)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:none} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        .cat-scrollbar::-webkit-scrollbar{width:3px}
        .cat-scrollbar::-webkit-scrollbar-track{background:transparent}
        .cat-scrollbar::-webkit-scrollbar-thumb{background:#fed7aa;border-radius:4px}
      `}</style>

      <div className="relative min-h-screen bg-white" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.06) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 18s linear infinite" }} />

        {/* PAGE HEADER */}
        <div className="relative z-10 border-b border-black/6 bg-white/90 backdrop-blur-sm pt-6 pb-5 px-4 sm:px-8 lg:px-14">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-0.5 bg-orange-500 rounded-full" />
                  <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">Shop by Category</span>
                </div>
                <h1 className="font-extrabold text-[#111] leading-none tracking-tight" style={{ fontSize:"clamp(1.7rem,3.5vw,2.6rem)" }}>
                  Browse <em className="italic font-semibold text-orange-500">{activeLabel}</em>
                </h1>
                <p className="text-[12px] text-gray-400 mt-1">{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* View Cart */}
                {totalItems > 0 && (
                  <button onClick={() => navigate("/cart")}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.14em] uppercase px-5 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]">
                    <ShoppingBag size={14}/>
                    View Bag
                    <span className="w-5 h-5 bg-white text-orange-500 font-black text-[10px] rounded-full flex items-center justify-center">{totalItems}</span>
                  </button>
                )}

                {/* Search */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                    className="pl-9 pr-4 py-2.5 text-[12px] bg-gray-50 border border-gray-200 rounded-2xl outline-none w-52 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-[#111]" />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none">
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                  <button onClick={() => setSortOpen(s => !s)}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#111] bg-white border border-black/10 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all duration-200">
                    <ArrowUpDown size={12} />{currentSort}
                    <ChevronDown size={11} className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-black/8 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,.1)] overflow-hidden z-30"
                      style={{ animation:"fadeUp .25s cubic-bezier(.16,1,.3,1)" }}>
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className={`w-full text-left text-[12px] font-semibold px-4 py-3 cursor-pointer transition-all duration-150 border-none
                            ${sort === opt.value ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 text-[11px] font-semibold text-[#111] bg-white border border-black/10 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all duration-200">
                  <SlidersHorizontal size={13} />Categories
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap mt-4">
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[.08em] uppercase px-4 py-[7px] rounded-2xl border transition-all duration-200 cursor-pointer
                    ${activeCategory === cat.key ? "bg-orange-500 border-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.3)]" : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50"}`}>
                  <span>{cat.emoji}</span><span>{cat.label}</span>
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${activeCategory === cat.key ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 py-8 flex gap-8">

          {/* Sidebar desktop */}
          <aside className="hidden lg:flex flex-col gap-3 shrink-0 w-[210px]">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
                <p className="text-[10px] font-black tracking-[.22em] uppercase text-orange-500">Categories</p>
              </div>
              <nav className="flex flex-col gap-1">
                {CATEGORIES.map((cat, i) => {
                  const isActive = activeCategory === cat.key;
                  const count = cat.key === "All" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.key).length;
                  return (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                      className={`group relative flex items-center justify-between w-full px-4 py-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer
                        ${isActive ? "bg-orange-500 border-orange-500 shadow-[0_6px_18px_rgba(249,115,22,.3)]" : "bg-white border-transparent hover:border-orange-200 hover:bg-orange-50"}`}
                      style={{ animation: visible ? `slideIn .4s cubic-bezier(.16,1,.3,1) ${i * 0.05}s both` : "none" }}>
                      {isActive && <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-white/50 rounded-full" />}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[16px]">{cat.emoji}</span>
                        <span className={`font-bold text-[12px] tracking-[.06em] ${isActive ? "text-white" : "text-[#111] group-hover:text-orange-500"}`}>{cat.label}</span>
                      </div>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}>{count}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="mt-6 h-px" style={{ background:"linear-gradient(90deg,#fed7aa,transparent)" }} />
              <div className="mt-4 p-3.5 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[.16em] mb-1">💡 Tip</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">Click any category to instantly filter your view.</p>
              </div>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" style={{ animation:"overlayIn .2s ease" }} onClick={() => setSidebarOpen(false)}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
                style={{ animation:"slideIn .3s cubic-bezier(.16,1,.3,1)" }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
                    <span className="text-[11px] font-black tracking-[.2em] uppercase text-orange-500">Categories</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 cursor-pointer border-none transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 p-4 overflow-y-auto cat-scrollbar flex-1">
                  {CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.key;
                    const count = cat.key === "All" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.key).length;
                    return (
                      <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setSidebarOpen(false); }}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer
                          ${isActive ? "bg-orange-500 border-orange-500 shadow-[0_4px_14px_rgba(249,115,22,.3)]" : "bg-white border-black/8 hover:border-orange-300 hover:bg-orange-50"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-[18px]">{cat.emoji}</span>
                          <span className={`font-bold text-[13px] ${isActive ? "text-white" : "text-[#111]"}`}>{cat.label}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isActive ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}>{count}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center" style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">🔍</div>
                <p className="font-black text-[#111] text-lg mb-1">No items found</p>
                <p className="text-gray-400 text-[13px] mb-4">Try adjusting your search or pick another category.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-white bg-orange-500 px-6 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-orange-600 transition-all">
                  Clear Filters
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="grid gap-5" style={{ gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))" }}>
                {filtered.map((product, i) => (
                  <div key={product.id}
                    className="group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-[5px] hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)] hover:border-orange-300"
                    style={{ animation: visible ? `fadeUp .55s cubic-bezier(.16,1,.3,1) ${i * 0.06}s both` : "none" }}>

                    <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

                    <div className="relative flex items-center justify-center overflow-hidden" style={{ height:"clamp(180px,22vw,240px)", background:"#fff4ee" }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage:"linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />
                      <img src={product.image} alt={product.title} loading="lazy"
                        className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
                        style={{ width:"clamp(110px,14vw,165px)", height:"clamp(135px,18vw,200px)" }} />

                      <div className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[80px]"
                        style={{ background:product.badgeColor, clipPath:"polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)" }}>
                        {product.badge}
                      </div>
                      <div className="absolute top-3 right-2.5 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2 py-[3px] rounded-2xl shadow-sm">
                        −{product.discount}%
                      </div>
                      <div className="absolute bottom-3 left-2.5 z-20 bg-black/75 text-white text-[8px] font-black tracking-[.1em] uppercase px-2 py-[3px] rounded-lg">
                        {product.category}
                      </div>

                      <div className="absolute bottom-3 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <button onClick={e => toggleWish(product.id, e)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110
                            ${wishlist.includes(product.id) ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white"}`}>
                          <Heart size={13} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button onClick={e => e.stopPropagation()}
                          className="w-8 h-8 rounded-full border border-black/10 bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-110">
                          <Eye size={13} />
                        </button>
                      </div>

                      {/* SIZE STRIP — each chip passes the chosen size */}
                      <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2.5 px-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                        {product.sizes.map(s => (
                          <button key={s} onClick={e => handleCart(product, s, e)}
                            className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded bg-transparent cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5">
                      <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">{product.brand}</p>
                      <p className="font-semibold text-[#111] text-[13px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-2">{product.title}</p>
                      <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2">
                        <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" /> {product.fabric}
                      </span>
                      <div className="h-px mb-2" style={{ background:"repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }} />
                      <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                        <span className="text-orange-500 font-bold leading-none" style={{ fontSize:"clamp(.9rem,1.3vw,1.15rem)" }}>₹{product.price.toLocaleString("en-IN")}</span>
                        <span className="text-[11px] text-gray-300 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Stars rating={product.rating} />
                        <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* ADD TO BAG — default to first size */}
                    <button onClick={e => handleCart(product, product.sizes[0], e)}
                      className="w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer transition-all duration-250 hover:brightness-110 active:scale-[.98]"
                      style={{ background: addedId === product.id ? "#16a34a" : "#f97316", animation: addedId === product.id ? "bagFlash .4s ease" : "none" }}>
                      <ShoppingBag size={13} />
                      <span>{addedId === product.id ? "✓ Added to Bag" : "Add to Bag"}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-12 h-px opacity-70" style={{ background:"linear-gradient(90deg,transparent,#fed7aa 30%,#fed7aa 70%,transparent)" }} />
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`fixed bottom-6 right-6 z-[60] bg-[#111] text-white text-[12px] font-semibold tracking-[.1em] px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-none transition-all duration-300
        ${addedId ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"/>
        Added to your bag!
      </div>
    </>
  );
}