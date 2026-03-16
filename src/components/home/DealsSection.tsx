import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../products/WishlistContext';
import { useCart } from '../products/CartContext';
import type { Product } from '../types/product';
import watch1    from '../../assets/girldress.png';
import tshirt    from '../../assets/thsirt.png';
import mouse     from '../../assets/images21.png';
import headPhone from '../../assets/kiddress.png';

/* ─── Extended product type ─── */
interface GarmentProduct extends Product {
  fabric:     string;
  sizes:      string[];
  badge:      string;
  badgeColor: string;
  category:   string;
  discount:   number;
}

const FILTERS = ['All', 'Women', 'Men', 'Kids', 'Ethnic', 'Western'];

const PRODUCTS: GarmentProduct[] = [
  { id:'1', title:'Cotton Blend Co-ord Set',    brand:'Aurelia',     price:1299, originalPrice:1899, image:headPhone, rating:4.5, reviewCount:'128', status:'New',        category:'Women',   description:'', fabric:'100% Cotton',  sizes:['XS','S','M','L','XL'],    badge:'New Arrival', badgeColor:'#16a34a', discount:32 },
  { id:'2', title:'Embroidered Anarkali Kurta', brand:'Biba',        price:2150, originalPrice:3200, image:watch1,    rating:4,   reviewCount:'75',  status:'Bestseller',       category:'Ethnic',  description:'', fabric:'Georgette',    sizes:['S','M','L','XL','XXL'],   badge:'Sale',        badgeColor:'#f97316', discount:33 },
  { id:'3', title:'Slim Fit Stretch Chinos',    brand:'FabIndia',    price:899,  originalPrice:1299, image:mouse,     rating:4.5, reviewCount:'99',  status:'Bestseller', category:'Men',     description:'', fabric:'Cotton Blend', sizes:['30','32','34','36','38'], badge:'Bestseller',  badgeColor:'#111111', discount:31 },
  { id:'4', title:'Tropical Rayon Camp Shirt',  brand:'Manyavar',    price:749,  originalPrice:1100, image:tshirt,    rating:4.5, reviewCount:'214', status:'Trending',   category:'Men',     description:'', fabric:'Rayon',        sizes:['S','M','L','XL'],         badge:'Trending',    badgeColor:'#ea580c', discount:32 },
  { id:'5', title:'Kids Dungaree Playsuit',     brand:'H&M Kids',    price:599,  originalPrice:899,  image:headPhone, rating:4.8, reviewCount:'61',  status:'New',        category:'Kids',    description:'', fabric:'Denim Cotton', sizes:['2Y','4Y','6Y','8Y'],      badge:'New Arrival', badgeColor:'#16a34a', discount:33 },
  { id:'6', title:'Palazzo Sharara Set',        brand:'W for Woman', price:1799, originalPrice:2499, image:watch1,    rating:4.3, reviewCount:'88',  status:'Bestseller',       category:'Ethnic',  description:'', fabric:'Silk Blend',   sizes:['S','M','L','XL'],         badge:'Sale',        badgeColor:'#f97316', discount:28 },
  { id:'7', title:'Flared Denim Jeans',         brand:'Levis',       price:1499, originalPrice:2299, image:mouse,     rating:4.6, reviewCount:'302', status:'Trending',   category:'Women',   description:'', fabric:'98% Denim',    sizes:['26','28','30','32'],      badge:'Trending',    badgeColor:'#ea580c', discount:35 },
  { id:'8', title:'Bandhgala Nehru Jacket',     brand:'Manyavar',    price:3299, originalPrice:4999, image:tshirt,    rating:4.7, reviewCount:'47',  status:'New',        category:'Western', description:'', fabric:'Art Silk',     sizes:['S','M','L','XL','XXL'],  badge:'New Arrival', badgeColor:'#16a34a', discount:34 },
];


const FILTER_ICONS: Record<string, string> = {
  Women:'👗', Men:'👔', Kids:'👶', Ethnic:'🪡', Western:'🧥',
};

/* ─── Star renderer ─── */
const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#f97316' : '#e5e7eb', fontSize: 11 }}>★</span>
    ))}
  </div>
);

/* ─── Main component ─── */
const ShopCollection: React.FC = () => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeFilter, setActiveFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible,      setVisible]      = useState(false);
  const [addedId,      setAddedId]      = useState<string | null>(null);
  const [cols,         setCols]         = useState(4);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Responsive cols */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 480 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => { setCurrentIndex(0); }, [activeFilter]);

  /* Scroll-in observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered        = activeFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
  const maxIndex        = Math.max(0, filtered.length - cols);
  const visibleProducts = filtered.slice(currentIndex, currentIndex + cols);

  const nextSlide = () => setCurrentIndex(p => Math.min(p + 1, maxIndex));
  const prevSlide = () => setCurrentIndex(p => Math.max(p - 1, 0));

  const handleProductClick = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${id}`);
  };
  const handleWishlist = (product: GarmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };
  const handleAddToCart = (product: GarmentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  /* Entrance animation helper */
  const fade = (delay: number) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity .85s ${delay}s cubic-bezier(.16,1,.3,1), transform .85s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap');`}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-16"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Orange dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(249,115,22,.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ══ HEADER ══ */}
          <div
            style={fade(0.06)}
            className="flex items-end justify-between gap-4 flex-wrap mb-7"
          >
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-10 h-0.5 bg-orange-500 rounded-full" />
                <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                  Season Collection
                </span>
              </div>
              {/* Heading */}
              <h2
                className="font-extrabold text-[#111] leading-none tracking-tight"
                style={{ fontSize: 'clamp(1.9rem,4vw,3rem)' }}
              >
                Our Latest{' '}
                <em className="italic font-semibold text-orange-500 " style={{ fontStyle: 'italic' }}>
                  Collection
                </em>
              </h2>
              <p className="text-xs text-gray-400 tracking-wide mt-1.5">
                Handpicked garments · Fresh fabrics · Every season
              </p>
            </div>

            {/* Nav arrows */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="w-[38px] h-[38px] rounded-full border border-black/10 bg-white text-[#111] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-black/10 disabled:hover:text-[#111] disabled:hover:scale-100"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="w-[38px] h-[38px] rounded-full border border-black/10 bg-white text-[#111] justify-content-center cursor-pointer transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-black/10 disabled:hover:text-[#111] disabled:hover:scale-100 flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          

          {/* ══ FILTER PILLS ══ */}
          <div style={fade(0.32)} className="flex items-center gap-2 flex-wrap mb-7">
            {FILTERS.map(f => {
              const count = f === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === f).length;
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-[.1em] uppercase px-4 py-[7px] rounded-2xl border transition-all duration-200
                    ${isActive
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-black/10 text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'
                    }`}
                >
                  {FILTER_ICONS[f] && <span>{FILTER_ICONS[f]}</span>}
                  <span>{f}</span>
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]
                    ${isActive ? 'bg-white/25 text-white' : 'bg-black/7 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ══ PRODUCT GRID ══ */}
          <div
            className="grid gap-4 mb-9"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {visibleProducts.map((product, i) => (
              <div
                key={product.id}
                onClick={e => handleProductClick(product.id, e)}
                className="group relative bg-white border border-black/8 rounded-xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-[5px] hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)] hover:border-orange-300"
                style={{
                  opacity:    visible ? 1 : 0,
                  transform:  visible ? 'translateY(0)' : 'translateY(22px)',
                  transition: `opacity .65s ${0.1 + i * 0.1}s cubic-bezier(.16,1,.3,1), transform .65s ${0.1 + i * 0.1}s cubic-bezier(.16,1,.3,1), box-shadow .4s, border-color .3s`,
                }}
              >
                {/* Orange bottom sweep */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

                {/* ── Image area ── */}
                <div
                  className="relative flex items-center justify-center overflow-hidden"
                  style={{ height: 'clamp(190px,24vw,240px)', background: '#fff4ee' }}
                >
                  {/* Subtle grid overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
                    style={{ width: 'clamp(120px,15vw,175px)', height: 'clamp(145px,19vw,205px)' }}
                  />

                  {/* Badge */}
                  <div
                    className="absolute top-3 left-0 z-20 text-white text-[9px] font-bold tracking-[.1em] uppercase py-1 pr-3 pl-2.5 min-w-[84px]"
                    style={{
                      background: product.badgeColor,
                      clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)',
                    }}
                  >
                    {product.badge}
                  </div>

                  {/* Discount chip */}
                  <div className="absolute top-3 right-2.5 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2.5 py-[3px] rounded-2xl tracking-wide">
                    −{product.discount}%
                  </div>

                  {/* Action buttons */}
                  <div className="absolute bottom-3 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={e => handleWishlist(product, e)}
                      aria-label="Wishlist"
                      className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110
                        ${isInWishlist(product.id)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white'
                        }`}
                    >
                      <Heart size={13} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={e => e.stopPropagation()}
                      aria-label="Quick view"
                      className="w-8 h-8 rounded-full border border-black/10 bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-110"
                    >
                      <Eye size={13} />
                    </button>
                  </div>

                  {/* Size strip */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2.5 px-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={e => { e.stopPropagation(); handleAddToCart(product, e); }}
                        className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200 bg-transparent cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Card body ── */}
                <div className="p-3.5">
                  <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">
                    {product.brand}
                  </p>
                  <p className="font-semibold text-[#111] text-[13px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-2">
                    {product.title}
                  </p>

                  {/* Fabric tag */}
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" />
                    {product.fabric}
                  </span>

                  {/* Dashed rule */}
                  <div
                    className="h-px mb-2"
                    style={{ background: 'repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)' }}
                  />

                  {/* Price row */}
                  <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                    <span className="text-orange-500 font-bold leading-none" style={{ fontSize: 'clamp(1rem,1.5vw,1.25rem)' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-gray-300 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">
                      Save ₹{(product.originalPrice! - product.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1.5">
                    <Stars rating={product.rating} />
                    <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                  </div>
                </div>

                {/* ── Add to Bag ── */}
                <button
                  onClick={e => handleAddToCart(product, e)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer transition-all duration-250 hover:brightness-110"
                  style={{ background: addedId === product.id ? '#16a34a' : '#f97316' }}
                >
                  <ShoppingBag size={13} />
                  <span>{addedId === product.id ? '✓ Added to Bag' : 'Add to Bag'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* ══ CTA ROW ══ */}
          <div style={fade(0.46)} className="flex items-center justify-center gap-3 flex-wrap">
            {/* Primary */}
            <button
              onClick={() => navigate('/shop')}
              className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-black text-white text-[12px] font-bold tracking-[.18em] uppercase px-10 py-3.5 rounded-2xl border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,.35)]"
            >
              <span className="absolute inset-0 bg-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
              <span className="relative z-10">View Full Collection</span>
              <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Outline */}
            <button className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[.18em] uppercase px-8 py-3.5 rounded-2xl border border-black/18 bg-transparent text-[#111] cursor-pointer transition-all duration-200 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5">
              Size Guide
            </button>
          </div>

          {/* Bottom rule */}
          <div
            className="mt-12 h-px opacity-70"
            style={{ background: 'linear-gradient(90deg,transparent,#fed7aa 30%,#fed7aa 70%,transparent)' }}
          />
        </div>
      </section>
    </>
  );
};

export default ShopCollection;