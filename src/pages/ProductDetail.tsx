import React, { useState } from 'react';
import {
  Heart, Star, Truck, RotateCcw, Plus, Minus,
  ShoppingBag, ChevronRight, Home, Shield, Zap,
  Share2, Package, Eye
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Product Data — same Cloudinary images as ShopCollection
───────────────────────────────────────────── */
const productData = {
  id: '1',
  title: 'Cotton Blend Co-ord Set',
  brand: 'Aurelia',
  price: 1299,
  originalPrice: 1899,
  rating: 4.5,
  reviewCount: 128,
  description:
    'Comfortable everyday co-ord set crafted from breathable 100% cotton fabric. Perfect for casual outings, brunches, or relaxed days at home.',
  images: [
    'https://res.cloudinary.com/dquki4xol/image/upload/v1771325461/pngtree-trendy-summer-party-dress-model-girl-in-fashionable-attire-png-image_13211648_ys2ype.png',
    'https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp',
    'https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp',
    'https://res.cloudinary.com/dquki4xol/image/upload/v1771325307/images_11_xlytvq.jpg',
    'https://res.cloudinary.com/dquki4xol/image/upload/v1773295572/images_22_n6ftjn.jpg',
  ],
  colors: [
    { name: 'Brown', hex: '#92400e' },
    { name: 'Red',   hex: '#dc2626' },
    { name: 'Navy',  hex: '#1e3a5f' },
    { name: 'Black', hex: '#111111' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  fabric: '100% Cotton',
  category: 'Women',
  badge: 'New Arrival',
  badgeColor: '#16a34a',
  discount: 32,
  inStock: true,
};

const relatedProducts = [
  { id:'2', title:'Embroidered Anarkali Kurta', brand:'Biba',        price:2150, originalPrice:3200,
    image:'https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp',
    rating:4, reviewCount:'75', badge:'Sale', badgeColor:'#f97316', discount:33, fabric:'Georgette', sizes:['S','M','L','XL','XXL'] },
  { id:'3', title:'Slim Fit Stretch Chinos',    brand:'FabIndia',    price:899,  originalPrice:1299,
    image:'https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/Untitleddesign_98_r0vlhs.webp',
    rating:4.5, reviewCount:'99', badge:'Bestseller', badgeColor:'#111111', discount:31, fabric:'Cotton Blend', sizes:['30','32','34','36'] },
  { id:'4', title:'Tropical Rayon Camp Shirt',  brand:'Manyavar',    price:749,  originalPrice:1100,
    image:'https://res.cloudinary.com/dquki4xol/image/upload/v1773296337/gemini-generated-image-hisdushisdushisd-1-500x500_z8jlod.webp',
    rating:4.5, reviewCount:'214', badge:'Trending', badgeColor:'#ea580c', discount:32, fabric:'Rayon', sizes:['S','M','L','XL'] },
  { id:'5', title:'Palazzo Sharara Set',        brand:'W for Woman', price:1799, originalPrice:2499,
    image:'https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp',
    rating:4.3, reviewCount:'88', badge:'Sale', badgeColor:'#f97316', discount:28, fabric:'Silk Blend', sizes:['S','M','L','XL'] },
];

/* ─────────────────────────────────────────────
   Star renderer — same as ShopCollection
───────────────────────────────────────────── */
const Stars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-200'}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
const ProductDetails: React.FC = () => {
  const navigate = useNavigate();

  const [activeImg,   setActiveImg]   = useState(0);
  const [selColor,    setSelColor]    = useState(productData.colors[0].name);
  const [selSize,     setSelSize]     = useState('M');
  const [qty,         setQty]         = useState(2);
  const [wishlisted,  setWishlisted]  = useState(false);
  const [added,       setAdded]       = useState(false);
  const [relWish,     setRelWish]     = useState<string[]>([]);
  const [relAdded,    setRelAdded]    = useState<string | null>(null);

  const disc = productData.discount;

  const handleAddCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleRelCart = (id: string) => {
    setRelAdded(id);
    setTimeout(() => setRelAdded(null), 1600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');

        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }
        @keyframes shimmerBar {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes bagFlash {
          0%,100% { transform:scale(1); }
          40%     { transform:scale(1.14); }
        }
        @keyframes salePop {
          0%,100% { transform:scale(1) rotate(-6deg); }
          50%     { transform:scale(1.1) rotate(-6deg); }
        }
        @keyframes imgIn {
          from { opacity:0; transform:scale(.97); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>

      <div
        className="relative min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* dot-grid bg — same as ShopCollection */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(249,115,22,.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            animation: 'dotDrift 18s linear infinite',
          }}
        />

        {/* orange top stripe */}
        <div
          className="fixed top-0 left-0 right-0 h-[3px] z-50"
          style={{
            background: 'linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)',
            backgroundSize: '300% 100%',
            animation: 'shimmerBar 3s linear infinite',
          }}
        />

        {/* ── Breadcrumb ── */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3.5">
            <div className="text-[12px] text-gray-400 flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => navigate('/')}
                className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] flex items-center gap-1"
              >
                <Home size={12} />Home
              </button>
              <ChevronRight size={11} className="text-gray-300" />
              <span
                className="hover:text-orange-500 cursor-pointer transition-colors"
                onClick={() => navigate('/shop')}
              >
                {productData.category}
              </span>
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-[#111] font-semibold">{productData.title}</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            MAIN PRODUCT — same layout language
            as ShopCollection cards
        ══════════════════════════════════════ */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10"
          style={{ animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* ── IMAGE COLUMN ── */}
            <div className="flex gap-3">

              {/* Thumbnails — styled like ShopCollection image bg */}
              <div className="flex flex-col gap-2.5">
                {productData.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0
                      ${activeImg === i
                        ? 'border-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,.15)]'
                        : 'border-black/8 hover:border-orange-300'
                      }`}
                    style={{ background: '#fff4ee' }}
                  >
                    {/* grid overlay — same as ShopCollection card */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="relative z-10 w-[80%] h-[80%] object-cover"
                    />
                    {/* active underline */}
                    {activeImg === i && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main image — ShopCollection card image bg */}
              <div
                className="flex-1 relative rounded-2xl overflow-hidden border border-black/8"
                style={{ background: '#fff4ee', minHeight: 440 }}
              >
                {/* grid overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />

                {/* Ribbon badge — same clipPath as ShopCollection */}
                <div
                  className="absolute top-4 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-4 pl-3 min-w-[100px]"
                  style={{
                    background: productData.badgeColor,
                    clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)',
                  }}
                >
                  {productData.badge}
                </div>

                {/* Discount chip — same as ShopCollection */}
                <div className="absolute top-4 right-3 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2.5 py-[3px] rounded-2xl tracking-wide shadow-sm">
                  −{disc}%
                </div>

                {/* Wishlist btn */}
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={`absolute top-14 right-3 z-20 w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-250
                    ${wishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-black/10 text-gray-400 hover:bg-orange-500 hover:border-orange-500 hover:text-white'
                    }`}
                >
                  <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                <img
                  src={productData.images[activeImg]}
                  alt={productData.title}
                  key={activeImg}
                  className="relative z-10 w-full object-cover"
                  style={{ height: 440, animation: 'imgIn .35s cubic-bezier(.16,1,.3,1)' }}
                />

                {/* orange bottom sweep — same as card hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600" />
              </div>
            </div>

            {/* ── INFO COLUMN ── */}
            <div className="space-y-5">

              {/* Eyebrow — same as ShopCollection header */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-0.5 bg-orange-500 rounded-full" />
                <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                  {productData.category} · {productData.brand}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-extrabold text-[#111] leading-none tracking-tight"
                style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}
              >
                {productData.title}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Stars rating={productData.rating} />
                <span className="text-[12px] text-gray-400">({productData.reviewCount} Reviews)</span>
                <span className="text-gray-200">|</span>
                <span className="text-[12px] font-bold text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  In Stock
                </span>
              </div>

              {/* Price — same orange as ShopCollection card */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="text-orange-500 font-bold leading-none"
                  style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)' }}
                >
                  ₹{productData.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[14px] text-gray-300 line-through">
                  ₹{productData.originalPrice.toLocaleString('en-IN')}
                </span>
                {/* Same "Save" green pill as ShopCollection card body */}
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-[3px] rounded">
                  Save ₹{(productData.originalPrice - productData.price).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Description — with left orange border accent */}
              <p
                className="text-[13px] text-gray-500 leading-relaxed border-l-2 border-orange-200 pl-3"
              >
                {productData.description}
              </p>

              {/* Fabric tag — same as ShopCollection card */}
              <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[10px] font-medium px-2.5 py-[4px] rounded">
                <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" />
                {productData.fabric}
              </span>

              {/* Dashed rule — same as card body */}
              <div
                className="h-px"
                style={{ background: 'repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 6px,transparent 6px,transparent 12px)' }}
              />

              {/* Colors */}
              <div>
                <p className="text-[11px] font-black tracking-[.18em] uppercase text-gray-400 mb-2.5">
                  Colour
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {productData.colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelColor(c.name)}
                      title={c.name}
                      className="w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
                      style={{
                        background: c.hex,
                        border: selColor === c.name
                          ? `3px solid white`
                          : '2px solid rgba(0,0,0,.1)',
                        boxShadow: selColor === c.name
                          ? `0 0 0 2px ${c.hex}`
                          : 'none',
                        transform: selColor === c.name ? 'scale(1.15)' : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes — same rounded-2xl style as ShopCollection */}
              <div>
                <p className="text-[11px] font-black tracking-[.18em] uppercase text-gray-400 mb-2.5">
                  Size
                </p>
                {/* Same size strip pill style */}
                <div className="flex gap-2 flex-wrap">
                  {productData.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelSize(s)}
                      className={`px-4 py-2 text-[11px] font-bold tracking-[.1em] border rounded-2xl cursor-pointer transition-all duration-200
                        ${selSize === s
                          ? 'bg-orange-500 border-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,.35)]'
                          : 'bg-white border-black/12 text-gray-600 hover:border-orange-400 hover:text-orange-500'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + CTAs */}
              <div className="flex items-center gap-3 flex-wrap">

                {/* Qty — same border style */}
                <div className="flex items-center border-2 border-black/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2.5 text-[13px] font-black text-[#111] border-x-2 border-black/8 min-w-[44px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-3 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Buy Now — same CTA style as ShopCollection "View Full Collection" */}
                <button
                  onClick={handleAddCart}
                  className="group relative overflow-hidden inline-flex items-center gap-2 bg-black text-white font-bold text-[11px] tracking-[.16em] uppercase px-7 py-[11px] rounded-2xl cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,.35)]"
                >
                  <span className="absolute inset-0 bg-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
                  <Zap size={13} className="relative z-10" />
                  <span className="relative z-10">Buy Now</span>
                </button>

                {/* Add to Bag — same orange button as card bottom */}
                <button
                  onClick={handleAddCart}
                  className="inline-flex items-center gap-2 font-bold text-[11px] tracking-[.16em] uppercase px-7 py-[11px] rounded-2xl cursor-pointer border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-500 hover:text-white transition-all duration-250 hover:-translate-y-0.5"
                  style={{ animation: added ? 'bagFlash .4s ease' : 'none' }}
                >
                  <ShoppingBag size={13} />
                  {added ? '✓ Added!' : 'Add to Bag'}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-250
                    ${wishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-black/10 text-gray-400 hover:border-orange-400 hover:text-orange-500'
                    }`}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Share */}
                <button className="w-11 h-11 rounded-2xl border-2 border-black/10 bg-white text-gray-400 flex items-center justify-center cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all duration-250">
                  <Share2 size={15} />
                </button>
              </div>

              {/* Delivery info — same card border style */}
              <div className="border border-black/8 rounded-2xl overflow-hidden">
                {[
                  { icon:<Truck size={16}/>,      color:'bg-orange-100 text-orange-500',  title:'Free Delivery',    sub:'Enter your postal code for Delivery Availability' },
                  { icon:<RotateCcw size={16}/>,  color:'bg-purple-100 text-purple-500',  title:'Return Delivery',  sub:'Free 30 Days Delivery Returns. Details' },
                  { icon:<Shield size={16}/>,     color:'bg-green-100 text-green-600',    title:'Secure Payment',   sub:'100% secure & encrypted transactions' },
                ].map((row, i, arr) => (
                  <div
                    key={row.title}
                    className={`flex items-start gap-3 px-4 py-3.5 hover:bg-orange-50/50 transition-colors ${i < arr.length - 1 ? 'border-b border-black/5' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${row.color}`}>
                      {row.icon}
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-[#111]">{row.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{row.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RELATED ITEMS
            — exact same card design as ShopCollection
        ══════════════════════════════════════ */}
        <section
          className="relative z-10 border-t border-black/5 py-14 px-4 sm:px-8 lg:px-16"
          style={{ background: '#fff7f0' }}
        >
          {/* section dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(249,115,22,.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto">

            {/* Header — same eyebrow style */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-12 bg-orange-500 rounded-full" />
                <div>
                  <p className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500 mb-0.5">
                    More Like This
                  </p>
                  <h2
                    className="font-extrabold text-[#111] leading-none tracking-tight"
                    style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}
                  >
                    Related Items
                  </h2>
                </div>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                View All <ChevronRight size={13} />
              </button>
            </div>

            {/* Grid — ShopCollection card design exactly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-[5px] hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)] hover:border-orange-300"
                  style={{ animation: `fadeUp .55s cubic-bezier(.16,1,.3,1) ${i * 0.08}s both` }}
                >
                  {/* orange bottom sweep */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

                  {/* Image area — same as ShopCollection */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{ height: 'clamp(190px,24vw,240px)', background: '#fff4ee' }}
                  >
                    {/* grid overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />

                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
                      style={{ width: 'clamp(120px,15vw,175px)', height: 'clamp(145px,19vw,205px)' }}
                    />

                    {/* Ribbon badge */}
                    <div
                      className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[84px]"
                      style={{ background: p.badgeColor, clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)' }}
                    >
                      {p.badge}
                    </div>

                    {/* Discount chip */}
                    <div className="absolute top-3 right-2.5 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2.5 py-[3px] rounded-2xl tracking-wide shadow-sm">
                      −{p.discount}%
                    </div>

                    {/* Wishlist + eye */}
                    <div className="absolute bottom-3 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <button
                        onClick={e => { e.stopPropagation(); setRelWish(w => w.includes(p.id) ? w.filter(x => x !== p.id) : [...w, p.id]); }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110
                          ${relWish.includes(p.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white'}`}
                      >
                        <Heart size={13} fill={relWish.includes(p.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={e => e.stopPropagation()}
                        className="w-8 h-8 rounded-full border border-black/10 bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-110"
                      >
                        <Eye size={13} />
                      </button>
                    </div>

                    {/* Size strip — same as ShopCollection */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2.5 px-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                      {p.sizes.map(s => (
                        <button
                          key={s}
                          onClick={e => { e.stopPropagation(); handleRelCart(p.id); }}
                          className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded bg-transparent cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card body — same as ShopCollection */}
                  <div className="p-3.5">
                    <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">
                      {p.brand}
                    </p>
                    <p className="font-semibold text-[#111] text-[13px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                      {p.title}
                    </p>

                    {/* Fabric tag */}
                    <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2">
                      <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" />
                      {p.fabric}
                    </span>

                    {/* Dashed rule */}
                    <div
                      className="h-px mb-2"
                      style={{ background: 'repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)' }}
                    />

                    {/* Price row */}
                    <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                      <span className="text-orange-500 font-bold leading-none" style={{ fontSize: 'clamp(1rem,1.5vw,1.2rem)' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-gray-300 line-through">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">
                        Save ₹{(p.originalPrice - p.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                      <Stars rating={p.rating} size={11} />
                      <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
                    </div>
                  </div>

                  {/* Add to Bag — same orange button */}
                  <button
                    onClick={e => { e.stopPropagation(); handleRelCart(p.id); }}
                    className="w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer transition-all duration-250 hover:brightness-110 active:scale-[.98]"
                    style={{
                      background: relAdded === p.id ? '#16a34a' : '#f97316',
                      animation: relAdded === p.id ? 'bagFlash .4s ease' : 'none',
                    }}
                  >
                    <ShoppingBag size={13} />
                    <span>{relAdded === p.id ? '✓ Added to Bag' : 'Add to Bag'}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom gradient rule — same as ShopCollection */}
            <div
              className="mt-12 h-px opacity-70"
              style={{ background: 'linear-gradient(90deg,transparent,#fed7aa 30%,#fed7aa 70%,transparent)' }}
            />
          </div>
        </section>

      </div>

      {/* Toast — same as ShopCollection */}
      {added && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-[#111] text-white text-[12px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ animation: 'fadeUp .35s cubic-bezier(.16,1,.3,1)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Package size={13} className="text-orange-400" />
          Added to your bag!
        </div>
      )}
    </>
  );
};

export default ProductDetails;