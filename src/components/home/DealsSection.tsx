import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye, ShoppingBag, ArrowRight, X, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../products/CartContext";
import { useWishlist } from "../products/WishlistContext"; // ← REAL WISHLIST

// ─── NO MORE fake useWishlist / useCart defined here ───

interface GarmentProduct {
  id: string; title: string; brand: string;
  price: number; originalPrice: number; image: string;
  rating: number; reviewCount: string; status: string; description: string;
  fabric: string; sizes: string[]; badge: string; badgeColor: string;
  category: string; discount: number;
}

/* ── Size Guide ── */
const SIZE_TABS = ['Men', 'Women', 'Kids'] as const;
type SizeTab = typeof SIZE_TABS[number];
const SIZE_DATA: Record<SizeTab, { cols: string[]; rows: { size:string; chest:string; waist:string; hip:string; length:string }[] }> = {
  Men:   { cols:['Size','Chest (in)','Waist (in)','Hip (in)','Length (in)'], rows:[{size:'XS',chest:'34–35',waist:'27–28',hip:'34–35',length:'28'},{size:'S',chest:'36–37',waist:'29–30',hip:'36–37',length:'29'},{size:'M',chest:'38–39',waist:'31–32',hip:'38–39',length:'30'},{size:'L',chest:'40–41',waist:'33–34',hip:'40–41',length:'31'},{size:'XL',chest:'42–43',waist:'35–36',hip:'42–43',length:'32'},{size:'XXL',chest:'44–46',waist:'37–39',hip:'44–46',length:'33'}] },
  Women: { cols:['Size','Bust (in)','Waist (in)','Hip (in)','Length (in)'], rows:[{size:'XS',chest:'32–33',waist:'25–26',hip:'34–35',length:'37'},{size:'S',chest:'34–35',waist:'27–28',hip:'36–37',length:'38'},{size:'M',chest:'36–37',waist:'29–30',hip:'38–39',length:'39'},{size:'L',chest:'38–40',waist:'31–33',hip:'40–42',length:'40'},{size:'XL',chest:'41–43',waist:'34–36',hip:'43–45',length:'41'},{size:'XXL',chest:'44–46',waist:'37–39',hip:'46–48',length:'42'}] },
  Kids:  { cols:['Size','Chest (in)','Waist (in)','Hip (in)','Height (cm)'], rows:[{size:'2Y',chest:'21',waist:'20',hip:'22',length:'92'},{size:'4Y',chest:'23',waist:'21.5',hip:'24',length:'104'},{size:'6Y',chest:'25',waist:'23',hip:'26',length:'116'},{size:'8Y',chest:'27',waist:'24.5',hip:'28',length:'128'},{size:'10Y',chest:'28.5',waist:'25.5',hip:'30',length:'140'},{size:'12Y',chest:'30',waist:'27',hip:'32',length:'152'}] },
};
const HOW_TO_MEASURE = [
  { label:'Chest / Bust', desc:'Measure around the fullest part of your chest, keeping the tape parallel to the ground.' },
  { label:'Waist',        desc:'Measure around your natural waistline, the narrowest part of your torso.' },
  { label:'Hip',          desc:'Stand with feet together and measure around the fullest part of your hips.' },
  { label:'Length',       desc:'Measure from the top of the shoulder down to where you want the garment to end.' },
];

const SizeGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SizeTab>('Women');
  const data = SIZE_DATA[activeTab];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,.5)', backdropFilter:'blur(6px)' }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
        style={{ animation:'sizeGuideIn .4s cubic-bezier(.16,1,.3,1)', maxHeight:'90vh' }}
        onClick={e => e.stopPropagation()}>
        <div className="relative px-6 py-5 border-b border-black/6 bg-gradient-to-r from-orange-50 to-white overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-orange-100 opacity-60 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,.4)]">
                <Ruler size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
                  <span className="text-[9px] font-bold tracking-[.22em] uppercase text-orange-500">Reference Chart</span>
                </div>
                <h3 className="font-black text-[#111] text-[16px] leading-tight">Size Guide</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer bg-transparent border-none transition-all">
              <X size={15} />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {SIZE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-bold tracking-[.12em] uppercase px-5 py-2 rounded-2xl cursor-pointer border-none transition-all duration-200
                  ${activeTab === tab ? 'bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.35)]' : 'bg-white border border-black/8 text-gray-500 hover:border-orange-300 hover:text-orange-500'}`}>
                {tab === 'Men' ? '👔' : tab === 'Women' ? '👗' : '👶'} {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight:'calc(90vh - 160px)' }}>
          <div className="p-5">
            <div className="overflow-x-auto rounded-2xl border border-black/8">
              <table className="w-full text-left text-[12px]" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100">
                    {data.cols.map((col, i) => (
                      <th key={col} className={`px-4 py-3 font-black text-[10px] tracking-[.16em] uppercase whitespace-nowrap ${i === 0 ? 'text-orange-500' : 'text-gray-500'}`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr key={row.size} className="border-b border-black/4 last:border-0 hover:bg-orange-50/50 transition-colors"
                      style={{ animation:`rowFadeIn .35s cubic-bezier(.16,1,.3,1) ${i * 0.04}s both` }}>
                      <td className="px-4 py-3"><span className="inline-flex items-center justify-center w-9 h-8 bg-orange-500 text-white font-black text-[11px] rounded-xl">{row.size}</span></td>
                      <td className="px-4 py-3 font-semibold text-[#111]">{row.chest}</td>
                      <td className="px-4 py-3 font-semibold text-[#111]">{row.waist}</td>
                      <td className="px-4 py-3 font-semibold text-[#111]">{row.hip}</td>
                      <td className="px-4 py-3 font-semibold text-[#111]">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">All measurements are in inches unless stated otherwise. Sizes may vary slightly by style.</p>
          </div>
          <div className="px-5 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 bg-orange-500 rounded-full" />
              <p className="text-[10px] font-black tracking-[.2em] uppercase text-orange-500">How to Measure</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOW_TO_MEASURE.map((tip, i) => (
                <div key={tip.label} className="flex items-start gap-3 p-3.5 bg-orange-50/60 border border-orange-100 rounded-2xl"
                  style={{ animation:`rowFadeIn .4s cubic-bezier(.16,1,.3,1) ${i * 0.06 + 0.2}s both` }}>
                  <div className="w-7 h-7 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-[10px]">{i + 1}</div>
                  <div>
                    <p className="font-black text-[#111] text-[12px] mb-0.5">{tip.label}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-black/5 bg-gray-50/40 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-gray-400">💡 <strong className="text-[#111]">Tip:</strong> When between sizes, size up for a relaxed fit.</p>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-orange-500 px-5 py-2.5 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]">Got it!</button>
        </div>
      </div>
    </div>
  );
};

/* ── Product data ── */
const FILTERS = ['All', 'Women', 'Men', 'Kids', 'Ethnic', 'Western'];
const FILTER_ICONS: Record<string, string> = { Women:'👗', Men:'👔', Kids:'👶', Ethnic:'🪡', Western:'🧥' };

const PRODUCTS: GarmentProduct[] = [
  { id:'1', title:'Cotton Blend Co-ord Set',    brand:'Aurelia',     price:1299, originalPrice:1899, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776077841/Square_Neck_Textured_Waist-Cinching_Maroon_Dress_vheg55.webp', rating:4.5, reviewCount:'128', status:'New',        category:'Women',   description:'', fabric:'100% Cotton',  sizes:['XS','S','M','L','XL'],    badge:'New Arrival', badgeColor:'#16a34a', discount:32 },
  { id:'2', title:'Embroidered frok', brand:'Biba',        price:2150, originalPrice:3200, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776078520/images_6_vfn6rc.jpg', rating:4,   reviewCount:'75',  status:'Bestseller', category:'Ethnic',  description:'', fabric:'Georgette',    sizes:['S','M','L','XL','XXL'],   badge:'Sale',        badgeColor:'#f97316', discount:33 },
  { id:'3', title:'Slim Fit Stretch Jeans',    brand:'FabIndia',    price:899,  originalPrice:1299, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_4_rs50b4.jpg',                                                                       rating:4.5, reviewCount:'99',  status:'Bestseller', category:'Men',     description:'', fabric:'Cotton Blend', sizes:['30','32','34','36','38'], badge:'Bestseller',  badgeColor:'#111111', discount:31 },
  { id:'4', title:'Tropical Rayon Camp Shirt',  brand:'Manyavar',    price:749,  originalPrice:1100, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_5_f8olir.jpg',                                       rating:4.5, reviewCount:'214', status:'Trending',   category:'Men',     description:'', fabric:'Rayon',        sizes:['S','M','L','XL'],         badge:'Trending',    badgeColor:'#ea580c', discount:32 },
  { id:'5', title:'Kids Dungaree Playsuit',     brand:'H&M Kids',    price:599,  originalPrice:899,  image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/24b45cb459f9280c57c33ce0c6242000_jtwo4f.jpg',                                                                                rating:4.8, reviewCount:'61',  status:'New',        category:'Kids',    description:'', fabric:'Denim Cotton', sizes:['2Y','4Y','6Y','8Y'],      badge:'New Arrival', badgeColor:'#16a34a', discount:33 },
  { id:'6', title:'Palazzo Sharara Set',        brand:'W for Woman', price:1799, originalPrice:2499, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776078520/k2ujc_512_yf0fzu.webp',rating:4.3, reviewCount:'88',  status:'Bestseller', category:'Ethnic',  description:'', fabric:'Silk Blend',   sizes:['S','M','L','XL'],         badge:'Sale',        badgeColor:'#f97316', discount:28 },
  { id:'7', title:'Flared Denim Jeans',         brand:'Levis',       price:1499, originalPrice:2299, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_3_prsjj5.jpg',                                                                                rating:4.6, reviewCount:'302', status:'Trending',   category:'Women',   description:'', fabric:'98% Denim',    sizes:['26','28','30','32'],       badge:'Trending',    badgeColor:'#ea580c', discount:35 },
  { id:'8', title:'Bandhgala Nehru Jacket',     brand:'Manyavar',    price:3299, originalPrice:4999, image:'https://res.cloudinary.com/dquki4xol/image/upload/v1776078689/three-elegant-mens-suits-different-colors-perfect-business-formal-events-highquality-fabrics-tailoring_191095-85761_ilaw9v.avif',                                                  rating:4.7, reviewCount:'47',  status:'New',        category:'Western', description:'', fabric:'Art Silk',     sizes:['S','M','L','XL','XXL'],   badge:'New Arrival', badgeColor:'#16a34a', discount:34 },
];

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f97316' : '#e5e7eb', fontSize: 11 }}>★</span>
    ))}
  </div>
);

const ShopCollection: React.FC = () => {
  const navigate = useNavigate();

  // ── REAL hooks — no more local stubs ──
  const { addItem, totalItems }                              = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [activeFilter,  setActiveFilter]  = useState('All');
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [visible,       setVisible]       = useState(false);
  const [addedId,       setAddedId]       = useState<string | null>(null);
  const [cols,          setCols]          = useState(4);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => { const w = window.innerWidth; setCols(w < 480 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => { setCurrentIndex(0); }, [activeFilter]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.06 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered        = activeFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
  const maxIndex        = Math.max(0, filtered.length - cols);
  const visibleProducts = filtered.slice(currentIndex, currentIndex + cols);

  const handleProductClick = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${id}`);
  };

  const handleWishlist = (product: GarmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  // ── THE FIX: call real addItem() with correct field mapping ──
  const handleAddToCart = (product: GarmentProduct, size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      {
        id:         parseInt(product.id) || product.id.charCodeAt(0),
        name:       product.title,       // title  → name
        cat:        product.category,
        sub:        product.category,
        price:      product.price,
        orig:       product.originalPrice, // originalPrice → orig
        img:        product.image,         // image  → img
        badge:      product.badge,
        badgeColor: product.badgeColor,
        fabric:     product.fabric,
        colors:     ['#111'],
        sizes:      product.sizes,
        rating:     product.rating,
        reviews:    parseInt(product.reviewCount) || 0, // reviewCount → reviews
      },
      size,   // ← the chosen size chip or default first size
      '#111'
    );
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const fade = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity .85s ${delay}s cubic-bezier(.16,1,.3,1), transform .85s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes bagFlash   { 0%,100%{transform:scale(1)} 40%{transform:scale(1.18)} }
        @keyframes sizeGuideIn{ from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes rowFadeIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
      `}</style>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      <section ref={sectionRef} className="relative overflow-hidden bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-16"
        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ backgroundImage:'radial-gradient(circle,rgba(249,115,22,.07) 1px,transparent 1px)', backgroundSize:'28px 28px', animation:'dotDrift 18s linear infinite' }}/>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* HEADER */}
          <div style={fade(0.06)} className="flex items-end justify-between gap-4 flex-wrap mb-7">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-10 h-0.5 bg-orange-500 rounded-full" />
                <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">Season Collection</span>
              </div>
              <h2 className="font-extrabold text-[#111] leading-none tracking-tight" style={{ fontSize:'clamp(1.9rem,4vw,3rem)' }}>
                Our Latest <em className="italic font-semibold text-orange-500">Collection</em>
              </h2>
              <p className="text-xs text-gray-400 tracking-wide mt-1.5">Handpicked garments · Fresh fabrics · Every season</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View Bag — shows only when cart has items */}
              {totalItems > 0 && (
                <button onClick={() => navigate('/cart')}
                  className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.14em] uppercase px-5 py-2.5 rounded-2xl border-none cursor-pointer hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]">
                  <ShoppingBag size={14}/>
                  View Bag
                  <span className="w-5 h-5 bg-white text-orange-500 font-black text-[10px] rounded-full flex items-center justify-center">{totalItems}</span>
                </button>
              )}
              <button onClick={() => setCurrentIndex(p => Math.max(p - 1, 0))} disabled={currentIndex === 0}
                className="w-[38px] h-[38px] rounded-full border border-black/10 bg-white text-[#111] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setCurrentIndex(p => Math.min(p + 1, maxIndex))} disabled={currentIndex >= maxIndex}
                className="w-[38px] h-[38px] rounded-full border border-black/10 bg-white text-[#111] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* FILTER PILLS */}
          <div style={fade(0.18)} className="flex items-center gap-2 flex-wrap mb-7">
            {FILTERS.map(f => {
              const count    = f === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === f).length;
              const isActive = activeFilter === f;
              return (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[.1em] uppercase px-4 py-[7px] rounded-2xl border transition-all duration-200 cursor-pointer
                    ${isActive ? 'bg-orange-500 border-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.3)]' : 'bg-white border-black/10 text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'}`}>
                  {FILTER_ICONS[f] && <span>{FILTER_ICONS[f]}</span>}
                  <span>{f}</span>
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-600'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* PRODUCT GRID */}
          <div className="grid gap-5 mb-8" style={{ gridTemplateColumns:`repeat(${cols}, minmax(0, 1fr))` }}>
            {visibleProducts.map((product, i) => (
              <div key={product.id} onClick={e => handleProductClick(product.id, e)}
                className="group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-[5px] hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)] hover:border-orange-300"
                style={{ opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(22px)', transition:`opacity .65s ${0.1+i*0.1}s cubic-bezier(.16,1,.3,1), transform .65s ${0.1+i*0.1}s cubic-bezier(.16,1,.3,1)` }}>

                <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"/>

                <div className="relative flex items-center justify-center overflow-hidden" style={{ height:'clamp(190px,24vw,250px)', background:'#fff4ee' }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ backgroundImage:'linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)', backgroundSize:'24px 24px' }}/>
                  <img src={product.image} alt={product.title} loading="lazy"
                    className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
                    style={{ width:'clamp(120px,15vw,175px)', height:'clamp(145px,19vw,210px)' }}/>

                  <div className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[84px]"
                    style={{ background:product.badgeColor, clipPath:'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)' }}>
                    {product.badge}
                  </div>
                  <div className="absolute top-3 right-2.5 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2.5 py-[3px] rounded-2xl tracking-wide shadow-sm">
                    −{product.discount}%
                  </div>

                  <div className="absolute bottom-3 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button onClick={e => handleWishlist(product, e)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110
                        ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white'}`}>
                      <Heart size={13} fill={isInWishlist(product.id) ? 'currentColor' : 'none'}/>
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      className="w-8 h-8 rounded-full border border-black/10 bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-110">
                      <Eye size={13}/>
                    </button>
                  </div>

                  {/* SIZE STRIP — each chip passes its own size to cart */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2.5 px-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                    {product.sizes.map(s => (
                      <button key={s}
                        onClick={e => handleAddToCart(product, s, e)}
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
                    <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0"/> {product.fabric}
                  </span>
                  <div className="h-px mb-2" style={{ background:'repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)' }}/>
                  <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                    <span className="text-orange-500 font-bold leading-none" style={{ fontSize:'clamp(1rem,1.5vw,1.25rem)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-gray-300 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={product.rating}/>
                    <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                  </div>
                </div>

                {/* ADD TO BAG — default to first size */}
                <button onClick={e => handleAddToCart(product, product.sizes[0], e)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer transition-all duration-250 hover:brightness-110 active:scale-[.98]"
                  style={{ background:addedId===product.id ? '#16a34a' : '#f97316', animation:addedId===product.id ? 'bagFlash .4s ease' : 'none' }}>
                  <ShoppingBag size={13}/>
                  <span>{addedId===product.id ? '✓ Added to Bag' : 'Add to Bag'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION DOTS */}
          {maxIndex > 0 && (
            <div style={fade(0.38)} className="flex items-center justify-center gap-1.5 mb-8">
              {Array.from({ length: maxIndex + 1 }, (_, k) => (
                <button key={k} onClick={() => setCurrentIndex(k)}
                  className={`rounded-full border-none cursor-pointer transition-all duration-250 ${currentIndex===k ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-gray-200 hover:bg-orange-300'}`}/>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={fade(0.46)} className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => navigate('/shop')}
              className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-black text-white text-[12px] font-bold tracking-[.18em] uppercase px-10 py-3.5 rounded-2xl border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,.35)]">
              <span className="absolute inset-0 bg-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-400"/>
              <span className="relative z-10">View Full Collection</span>
              <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"/>
            </button>
            <button onClick={() => setShowSizeGuide(true)}
              className="group inline-flex items-center gap-2 text-[12px] font-bold tracking-[.18em] uppercase px-8 py-3.5 rounded-2xl border-2 border-black/15 bg-transparent text-[#111] cursor-pointer transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5 hover:bg-orange-50">
              <Ruler size={14} className="group-hover:text-orange-500 transition-colors"/>
              Size Guide
            </button>
          </div>

          <div className="mt-12 h-px opacity-70" style={{ background:'linear-gradient(90deg,transparent,#fed7aa 30%,#fed7aa 70%,transparent)' }}/>
        </div>
      </section>

      {/* TOAST */}
      <div className={`fixed bottom-6 right-6 z-[60] bg-[#111] text-white text-[12px] font-semibold tracking-[.1em] px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-none transition-all duration-300 ${addedId ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"/>
        Added to your bag!
      </div>
    </>
  );
};

export default ShopCollection;