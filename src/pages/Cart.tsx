import { useState } from "react";
import {
  Minus, Plus, Trash2, ArrowLeft, ShoppingBag,
  ArrowRight, Tag, Truck, Shield, Package,
  Check, X, Heart, ChevronRight, Home, Eye, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart }     from "../components/products/CartContext";
import { useAuth }     from "./authcontext";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const Stars = ({ n }: { n: number }) => (
  <span className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} style={{ color: s <= Math.floor(n) ? "#f97316" : "#e5e7eb", fontSize: 11 }}>★</span>
    ))}
  </span>
);

/* ─────────────────────────────────────────────
   CartPage
───────────────────────────────────────────── */
export default function CartPage() {
  const navigate    = useNavigate();
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { isLoggedIn } = useAuth();

  const [coupon,   setCoupon]   = useState("");
  const [couponOk, setCouponOk] = useState<boolean | null>(null);
  const [discount, setDiscount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const shipping   = totalPrice > 999 ? 0 : 99;
  const tax        = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + shipping + tax - discount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setCouponOk(true);
      setDiscount(Math.round(totalPrice * 0.1));
    } else {
      setCouponOk(false);
      setDiscount(0);
    }
  };

  const toggleWish = (id: number) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  /**
   * CHECKOUT GUARD:
   * Not logged in → go to /login with state.from = "/payment"
   * LoginPage reads state.from and redirects back after successful login.
   */
  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/payment" } });
    } else {
      navigate("/payment");
    }
  };

  /* ─────────────────────────────────────────
     EMPTY STATE
  ───────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
          @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
          @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
          @keyframes popIn      { from{opacity:0;transform:scale(.88) translateY(18px)} to{opacity:1;transform:none} }
        `}</style>

        <div className="relative min-h-screen bg-white flex flex-col"
          style={{ fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
          <div className="fixed inset-0 pointer-events-none z-0"
            style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.06) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 20s linear infinite" }}/>
          <div className="fixed top-0 left-0 right-0 h-[3px] z-50"
            style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>

          {/* Breadcrumb */}
          <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center gap-1.5 text-[12px] text-gray-400">
              <button onClick={()=>navigate("/")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
                <Home size={12}/>Home
              </button>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="text-[#111] font-semibold">Cart</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
            <div className="text-center max-w-xs" style={{ animation:"popIn .6s cubic-bezier(.16,1,.3,1)" }}>
              <div className="w-28 h-28 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-orange-200">
                <ShoppingBag size={40} className="text-orange-300"/>
              </div>
              <div className="flex items-center gap-2 justify-center mb-2">
                <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
                <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">Empty Bag</span>
                <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
              </div>
              <h2 className="font-black text-[#111] text-2xl mb-2">Your bag is empty</h2>
              <p className="text-[13px] text-gray-400 mb-8 leading-relaxed">
                Browse our collection and add items you love!
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={()=>navigate("/shop")}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.16em] uppercase px-8 py-3.5 rounded-2xl cursor-pointer border-none hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,.4)] transition-all">
                  <span className="absolute inset-0 bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"/>
                  <ShoppingBag size={14} className="relative z-10"/>
                  <span className="relative z-10">Browse Shop</span>
                  <ArrowRight size={14} className="relative z-10"/>
                </button>
                <button onClick={()=>navigate("/")}
                  className="inline-flex items-center justify-center gap-2 font-bold text-[11px] tracking-[.16em] uppercase px-8 py-3.5 rounded-2xl cursor-pointer border-2 border-black/10 text-gray-500 bg-white hover:border-orange-400 hover:text-orange-500 transition-all">
                  <Home size={13}/>Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────
     FILLED CART
  ───────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes itemIn     { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:none} }
        @keyframes hintIn     { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:none} }
      `}</style>

      <div className="relative min-h-screen bg-[#f8f8f8]"
        style={{ fontFamily:"'Plus Jakarta Sans', sans-serif" }}>

        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 20s linear infinite" }}/>
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50"
          style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
              <button onClick={()=>navigate("/")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
                <Home size={12}/>Home
              </button>
              <ChevronRight size={11} className="text-gray-300"/>
              <button onClick={()=>navigate("/shop")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0">Shop</button>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="text-[#111] font-semibold">Cart</span>
            </div>
            <button onClick={()=>navigate("/shop")}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 hover:text-orange-600 cursor-pointer bg-transparent border-none transition-colors">
              <ArrowLeft size={13}/>Continue Shopping
            </button>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">

          {/* Page header */}
          <div className="mb-7" style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
              <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">Checkout</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-black text-[#111] leading-tight" style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)" }}>
                Shopping <em className="text-orange-500" style={{ fontStyle:"italic" }}>Cart</em>
              </h1>
              <span className="text-[11px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-full">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ══ LEFT — items ══ */}
            <div className="lg:col-span-2 space-y-3">

              {/* Desktop column heads */}
              <div className="hidden md:grid px-4 pb-1 text-[9px] font-black tracking-[.2em] uppercase text-gray-400"
                style={{ gridTemplateColumns:"1fr 140px 80px 60px" }}>
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
                <span/>
              </div>

              {Array.isArray(items) && items.map((item, i) => (
                <div key={`${item.id}-${item.selectedSize}`}
                  className="relative bg-white border border-black/8 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-[0_8px_28px_rgba(249,115,22,.09)] transition-all duration-300 group"
                  style={{ animation:`itemIn .5s cubic-bezier(.16,1,.3,1) ${i*0.07}s both` }}>

                  {/* bottom sweep */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 z-10"/>

                  <div className="flex gap-4 p-4 items-start">

                    {/* Image — click to view product */}
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-black/5 cursor-pointer bg-transparent p-0"
                      style={{ background:"#fff4ee" }}
                      title="View product"
                    >
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage:"linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize:"14px 14px" }}/>
                      <img src={item.img} alt={item.name}
                        className="relative z-10 w-[82%] h-[82%] object-cover group-hover:scale-105 transition-transform duration-500"/>
                      {/* Eye overlay on hover */}
                      <div className="absolute inset-0 z-20 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-300 flex items-center justify-center">
                        <Eye size={16} className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                      </div>
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">
                        {item.cat} · {item.sub}
                      </p>

                      {/* Title — also navigates to product detail */}
                      <h3
                        className="font-bold text-[13px] text-[#111] leading-tight mb-2 cursor-pointer hover:text-orange-500 transition-colors"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.name}
                      </h3>

                      {/* Chips */}
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        {item.selectedSize && (
                          <span className="text-[9px] font-bold bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        <span className="text-[9px] font-medium bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                          {item.fabric}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Stars n={item.rating}/>
                        <span className="text-[10px] text-gray-400">({item.reviews})</span>
                      </div>

                      {/* Price — mobile */}
                      <div className="flex items-baseline gap-2 md:hidden">
                        <span className="font-black text-orange-500 text-[14px]">{fmt(item.price)}</span>
                        <span className="text-[10px] text-gray-300 line-through">{fmt(item.orig)}</span>
                      </div>
                    </div>

                    {/* Qty — desktop */}
                    <div className="hidden md:flex flex-col items-center gap-1.5 w-[140px] shrink-0">
                      <div className="flex items-center border-2 border-black/10 rounded-2xl overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 cursor-pointer bg-transparent border-none transition-all">
                          <Minus size={13}/>
                        </button>
                        <span className="w-11 h-9 flex items-center justify-center text-[13px] font-black text-[#111] border-x-2 border-black/8">
                          {item.qty}
                        </span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 cursor-pointer bg-transparent border-none transition-all">
                          <Plus size={13}/>
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-400">
                        Subtotal: <strong className="text-orange-500">{fmt(item.price * item.qty)}</strong>
                      </p>
                    </div>

                    {/* Price — desktop */}
                    <div className="hidden md:flex flex-col items-end w-20 shrink-0">
                      <p className="font-black text-[#111] text-[14px]">{fmt(item.price)}</p>
                      <p className="text-[10px] text-gray-300 line-through">{fmt(item.orig)}</p>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mt-1">
                        -{Math.round((1 - item.price / item.orig) * 100)}%
                      </span>
                    </div>

                    {/* Remove + wishlist */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 cursor-pointer bg-transparent transition-all"
                        title="Remove">
                        <Trash2 size={13}/>
                      </button>
                      <button onClick={() => toggleWish(item.id)}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer bg-transparent transition-all
                          ${wishlist.includes(item.id)
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-black/8 text-gray-400 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500"}`}
                        title="Save for later">
                        <Heart size={13} fill={wishlist.includes(item.id) ? "currentColor" : "none"}/>
                      </button>
                    </div>
                  </div>

                  {/* Mobile qty row */}
                  <div className="md:hidden flex items-center justify-between px-4 pb-3.5 border-t border-black/4 pt-3">
                    <div className="flex items-center border-2 border-black/10 rounded-2xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-500 cursor-pointer bg-transparent border-none">
                        <Minus size={12}/>
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-[12px] font-black text-[#111] border-x-2 border-black/8">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-500 cursor-pointer bg-transparent border-none">
                        <Plus size={12}/>
                      </button>
                    </div>
                    <p className="font-black text-orange-500 text-[13px]">{fmt(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                <button onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors">
                  <Trash2 size={12}/>Clear all items
                </button>
                <button onClick={()=>navigate("/shop")}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 hover:text-orange-600 cursor-pointer bg-transparent border-none transition-colors">
                  <ArrowLeft size={12}/>Continue shopping
                </button>
              </div>
            </div>

            {/* ══ RIGHT — Order summary ══ */}
            <div style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .15s both" }}>
              <div className="bg-white border border-black/8 rounded-2xl overflow-hidden sticky top-6">

                <div className="px-5 py-4 border-b border-black/5 bg-orange-50/40">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-orange-500 rounded-full"/>
                    <h3 className="font-black text-[#111] text-[14px]">Order Summary</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">

                  {/* Coupon */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                      <Tag size={11} className="text-orange-400"/>Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input value={coupon}
                        onChange={e=>{ setCoupon(e.target.value.toUpperCase()); setCouponOk(null); }}
                        placeholder="SAVE10"
                        className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all uppercase tracking-wider placeholder:text-gray-400"
                        style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
                      <button onClick={applyCoupon}
                        className="px-4 py-2.5 bg-orange-500 text-white text-[11px] font-bold rounded-2xl hover:bg-orange-600 cursor-pointer border-none transition-all whitespace-nowrap">
                        Apply
                      </button>
                    </div>
                    {couponOk===true  && <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1"><Check size={10}/>10% discount applied!</p>}
                    {couponOk===false && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1"><X size={10}/>Invalid. Try SAVE10</p>}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-2.5">
                    {[
                      { label:`Subtotal (${totalItems} items)`, value: fmt(totalPrice) },
                      { label:"Shipping", value: shipping===0?"FREE 🎉":fmt(shipping), green: shipping===0 },
                      { label:"GST (5%)", value: fmt(tax) },
                      ...(discount>0 ? [{ label:"Coupon discount", value:`−${fmt(discount)}`, green:true }] : []),
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-500">{r.label}</span>
                        <span className={`text-[12px] font-semibold ${(r as any).green ? "text-green-600" : "text-[#111]"}`}>{r.value}</span>
                      </div>
                    ))}

                    <div className="h-px" style={{ background:"repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }}/>

                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#111] text-[15px]">Total</span>
                      <span className="font-black text-orange-500 text-[20px]">{fmt(finalTotal)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right">Incl. all taxes</p>
                  </div>

                  {/* ─────────────────────────────────────────
                      CHECKOUT BUTTON
                      • Logged in  → orange  "Proceed to Checkout" → /payment
                      • Logged out → black   "Login to Checkout"   → /login?from=/payment
                  ───────────────────────────────────────── */}
                  <button
                    onClick={handleCheckout}
                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 text-white font-bold text-[12px] tracking-[.16em] uppercase py-4 rounded-2xl cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,.4)]"
                    style={{ background: isLoggedIn ? "#f97316" : "#111" }}
                  >
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                      style={{ background: isLoggedIn ? "#ea580c" : "#f97316" }}
                    />
                    {isLoggedIn ? (
                      <>
                        <Package size={14} className="relative z-10"/>
                        <span className="relative z-10">Proceed to Checkout</span>
                        <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
                      </>
                    ) : (
                      <>
                        <Lock size={14} className="relative z-10"/>
                        <span className="relative z-10">Login to Checkout</span>
                        <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
                      </>
                    )}
                  </button>

                  {/* Login required hint — shown only when not logged in */}
                  {!isLoggedIn && (
                    <div
                      className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl"
                      style={{ animation:"hintIn .4s cubic-bezier(.16,1,.3,1)" }}
                    >
                      <Lock size={13} className="text-amber-400 shrink-0 mt-0.5"/>
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        <strong>Login required</strong> to place an order.{" "}
                        <button
                          onClick={() => navigate("/login", { state:{ from:"/payment" } })}
                          className="text-orange-500 font-bold underline cursor-pointer bg-transparent border-none hover:text-orange-600 transition-colors"
                        >
                          Sign in
                        </button>
                        {" "}or{" "}
                        <button
                          onClick={() => navigate("/signup")}
                          className="text-orange-500 font-bold underline cursor-pointer bg-transparent border-none hover:text-orange-600 transition-colors"
                        >
                          Create account →
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Wishlist link */}
                  <button onClick={()=>navigate("/profile")}
                    className="w-full py-2.5 text-[11px] font-bold text-gray-400 hover:text-orange-500 cursor-pointer border border-black/8 rounded-2xl hover:border-orange-300 bg-transparent transition-all flex items-center justify-center gap-1.5">
                    <Heart size={12}/>Wishlist / Save for Later
                  </button>
                </div>

                {/* Trust badges */}
                <div className="border-t border-black/5 px-5 py-4 space-y-2.5 bg-gray-50/30">
                  {[
                    { icon:<Truck size={13}/>,   color:"text-orange-400", text:"Free delivery on orders above ₹999" },
                    { icon:<Shield size={13}/>,  color:"text-green-500",  text:"100% secure & encrypted payments"  },
                    { icon:<Package size={13}/>, color:"text-blue-400",   text:"Easy 30-day returns & exchanges"   },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-2">
                      <span className={`shrink-0 ${b.color}`}>{b.icon}</span>
                      <span className="text-[10px] text-gray-500 font-medium">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}