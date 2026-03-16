import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, Landmark, Smartphone, ChevronRight, Home,
  Lock, Check, ShoppingBag, Tag, Truck, ChevronDown,
  Plus, ArrowRight, Shield, Zap, X, Package
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type PayMethod = "card" | "upi" | "netbanking" | "cod" | "wallet";

interface CartItem {
  id: string; name: string; brand: string; img: string;
  size: string; color: string; qty: number;
  price: number; orig: number;
}

/* ─────────────────────────────────────────────
   Mock cart
───────────────────────────────────────────── */
const CART: CartItem[] = [
  { id:"1", name:"Premium Wool Blazer",   brand:"Manyavar",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",      size:"L",  color:"Charcoal", qty:1, price:3499, orig:5999 },
  { id:"2", name:"Embroidered Anarkali",  brand:"Biba",        img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp", size:"M",  color:"Pink",     qty:1, price:2150, orig:3200 },
  { id:"3", name:"Kids Dungaree Playsuit",brand:"H&M Kids",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg",                                    size:"6Y", color:"Blue",     qty:2, price:599,  orig:899  },
];

const BANKS = ["State Bank of India","HDFC Bank","ICICI Bank","Axis Bank","Kotak Bank","Punjab National Bank","Bank of Baroda","Canara Bank"];
const WALLETS = [
  { id:"paytm",   label:"Paytm",    color:"#002970" },
  { id:"phonepe", label:"PhonePe",  color:"#5f259f" },
  { id:"amazon",  label:"Amazon Pay",color:"#ff9900" },
  { id:"mobikwik",label:"MobiKwik", color:"#1a73e8" },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const subtotal   = CART.reduce((a, c) => a + c.price * c.qty, 0);
const savings    = CART.reduce((a, c) => a + (c.orig - c.price) * c.qty, 0);
const shipping   = subtotal > 999 ? 0 : 99;
const tax        = Math.round(subtotal * 0.05);
const total      = subtotal + shipping + tax;

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

/* ─────────────────────────────────────────────
   Step indicator
───────────────────────────────────────────── */
const STEPS = ["Cart", "Address", "Payment", "Confirm"];

function Stepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all duration-300
              ${i < active  ? "bg-orange-500 border-orange-500 text-white"
              : i === active ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_0_4px_rgba(249,115,22,.2)]"
              : "bg-white border-gray-200 text-gray-400"}`}>
              {i < active ? <Check size={12}/> : i + 1}
            </div>
            <span className={`text-[9px] font-bold mt-1 tracking-wide ${i <= active ? "text-orange-500" : "text-gray-300"}`}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 rounded-full transition-all duration-500 ${i < active ? "bg-orange-500" : "bg-gray-100"}`}/>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card input with live formatting
───────────────────────────────────────────── */
function CardForm() {
  const [num,  setNum]  = useState("");
  const [name, setName] = useState("");
  const [exp,  setExp]  = useState("");
  const [cvv,  setCvv]  = useState("");
  const [flip, setFlip] = useState(false);

  const fmtNum = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d;
  };

  const inp = "w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-400";

  /* card type detection */
  const raw = num.replace(/\s/g,"");
  const cardType = raw.startsWith("4") ? "VISA" : raw.startsWith("5") ? "MC" : raw.startsWith("37") ? "AMEX" : "";

  return (
    <div className="space-y-4">
      {/* Mini card preview */}
      <div
        className="relative w-full h-40 rounded-2xl overflow-hidden flex flex-col justify-between p-5 text-white select-none cursor-pointer"
        style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#2a1500 100%)", perspective:1000 }}
        onClick={() => setFlip(f=>!f)}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.08) 1px,transparent 1px)", backgroundSize:"18px 18px" }}/>
        {!flip ? (
          <>
            <div className="flex items-center justify-between">
              <div className="w-9 h-7 bg-orange-500/30 rounded-lg border border-orange-500/20 flex items-center justify-center">
                <div className="w-5 h-3.5 rounded-sm bg-orange-400/60"/>
              </div>
              {cardType && <span className="font-black text-[13px] tracking-widest text-orange-400">{cardType}</span>}
            </div>
            <div>
              <p className="font-mono text-[15px] tracking-[.18em] text-white/90 mb-2">
                {num || "•••• •••• •••• ••••"}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] text-white/40 tracking-widest uppercase mb-0.5">Card Holder</p>
                  <p className="font-bold text-[12px] text-white/80 uppercase tracking-wider">{name || "YOUR NAME"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-white/40 tracking-widest uppercase mb-0.5">Expires</p>
                  <p className="font-bold text-[12px] text-white/80">{exp || "MM/YY"}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center h-full">
            <div className="w-full h-8 bg-black/40 rounded mb-4"/>
            <div className="flex items-center justify-end gap-3">
              <div className="flex-1 h-6 bg-white/10 rounded"/>
              <div className="w-14 h-6 bg-orange-500/80 rounded flex items-center justify-center font-mono text-[11px] font-black text-white">
                {cvv || "CVV"}
              </div>
            </div>
            <p className="text-white/30 text-[9px] text-center mt-3">Click to flip back</p>
          </div>
        )}
        {/* shimmer */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,.04) 50%,transparent 60%)" }}/>
      </div>

      {/* Fields */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
        <div className="relative">
          <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
          <input className={inp + " pl-10"} placeholder="1234 5678 9012 3456"
            value={num} onChange={e=>setNum(fmtNum(e.target.value))} maxLength={19}/>
          {cardType && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-500">{cardType}</span>}
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cardholder Name</label>
        <input className={inp} placeholder="As on card" value={name} onChange={e=>setName(e.target.value.toUpperCase())}/>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expiry</label>
          <input className={inp} placeholder="MM/YY" value={exp} onChange={e=>setExp(fmtExp(e.target.value))} maxLength={5}/>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">CVV</label>
          <input className={inp} placeholder="•••" type="password"
            value={cvv} maxLength={4}
            onChange={e=>setCvv(e.target.value.replace(/\D/g,""))}
            onFocus={()=>setFlip(true)} onBlur={()=>setFlip(false)}/>
        </div>
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-4 h-4 rounded border-2 border-orange-400 bg-orange-50 flex items-center justify-center shrink-0">
          <Check size={9} className="text-orange-500"/>
        </div>
        <span className="text-[11px] text-gray-500">Save card for faster checkout</span>
      </label>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main PaymentPage
───────────────────────────────────────────── */
export default function PaymentPage() {
  const navigate  = useNavigate();
  const [method,    setMethod]    = useState<PayMethod>("card");
  const [upiId,     setUpiId]     = useState("");
  const [bank,      setBank]      = useState("");
  const [wallet,    setWallet]    = useState("");
  const [coupon,    setCoupon]    = useState("");
  const [couponOk,  setCouponOk]  = useState<boolean|null>(null);
  const [discount,  setDiscount]  = useState(0);
  const [placing,   setPlacing]   = useState(false);
  const [placed,    setPlaced]    = useState(false);
  const [visible,   setVisible]   = useState(false);

  useEffect(() => { const t = setTimeout(()=>setVisible(true), 60); return ()=>clearTimeout(t); }, []);

  const fade = (d: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .7s ${d}s cubic-bezier(.16,1,.3,1), transform .7s ${d}s cubic-bezier(.16,1,.3,1)`,
  });

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") { setCouponOk(true); setDiscount(Math.round(total * 0.1)); }
    else { setCouponOk(false); setDiscount(0); }
  };

  const finalTotal = total - discount;

  const handlePay = () => {
    setPlacing(true);
    setTimeout(() => { setPlacing(false); setPlaced(true); }, 1800);
  };

  const inp = "w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-400";

  /* method config */
  const METHODS: { key: PayMethod; label: string; sub: string; icon: React.ReactNode }[] = [
    { key:"card",       label:"Credit / Debit Card", sub:"Visa, Mastercard, RuPay, Amex", icon:<CreditCard size={18}/> },
    { key:"upi",        label:"UPI",                 sub:"GPay, PhonePe, Paytm UPI",     icon:<Smartphone size={18}/> },
    { key:"netbanking", label:"Net Banking",         sub:"All major banks supported",    icon:<Landmark size={18}/> },
    { key:"wallet",     label:"Wallets",             sub:"Paytm, Amazon Pay & more",     icon:<ShoppingBag size={18}/> },
    { key:"cod",        label:"Cash on Delivery",    sub:"Pay when your order arrives",  icon:<Package size={18}/> },
  ];

  if (placed) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes popIn      { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes confetti   { 0%{transform:translateY(-10px) rotate(0)} 100%{transform:translateY(60px) rotate(360deg); opacity:0} }
      `}</style>
      <div className="relative min-h-screen bg-white flex items-center justify-center" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.07) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 18s linear infinite" }}/>
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50" style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>
        {/* confetti */}
        {Array.from({length:12},(_, i)=>(
          <div key={i} className="absolute w-2 h-2 rounded-sm pointer-events-none"
            style={{ top:`${10+Math.random()*30}%`, left:`${Math.random()*100}%`, background:["#f97316","#ea580c","#fbbf24","#16a34a","#3b82f6"][i%5], animation:`confetti ${1.5+Math.random()}s ${Math.random()*0.5}s ease-in both` }}/>
        ))}
        <div className="relative z-10 text-center px-6 max-w-md" style={{ animation:"popIn .6s cubic-bezier(.16,1,.3,1)" }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-200">
            <Check size={36} className="text-green-500"/>
          </div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
            <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">Order Placed</span>
            <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
          </div>
          <h2 className="font-black text-[#111] text-2xl mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-400 text-[13px] mb-2">Your order has been placed and is being processed.</p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 mb-6 inline-block">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Order ID</p>
            <p className="font-black text-orange-500 text-[15px] tracking-widest">ORD-{Date.now().toString().slice(-6)}</p>
          </div>
          <p className="text-[12px] text-gray-400 mb-7">
            Total paid: <strong className="text-[#111]">{fmt(finalTotal)}</strong>
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={()=>navigate("/orders")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold text-[11px] tracking-[.16em] uppercase px-7 py-3 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,.35)]">
              <Package size={13}/>Track Order
            </button>
            <button onClick={()=>navigate("/shop")}
              className="inline-flex items-center gap-2 font-bold text-[11px] tracking-[.16em] uppercase px-7 py-3 rounded-2xl cursor-pointer border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-50 transition-all hover:-translate-y-0.5">
              Continue Shopping <ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes dotDrift   { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div className="relative min-h-screen bg-white" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.06) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 18s linear infinite" }}/>
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50"
          style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between flex-wrap gap-2">
            <div className="text-[12px] text-gray-400 flex items-center gap-1.5">
              <button onClick={()=>navigate("/")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] flex items-center gap-1">
                <Home size={12}/>Home
              </button>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="hover:text-orange-500 cursor-pointer transition-colors" onClick={()=>navigate("/shop")}>Shop</span>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="text-[#111] font-semibold">Payment</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <Lock size={11} className="text-green-500"/>
              <span className="text-green-600 font-semibold">Secure Checkout</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">

          {/* Stepper */}
          <div style={fade(0.05)} className="flex justify-center mb-10">
            <Stepper active={2}/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10 items-start">

            {/* ══════════════════════════════════════
                LEFT — Payment methods
            ══════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-4">

              {/* Header */}
              <div style={fade(0.1)}>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-0.5 bg-orange-500 rounded-full"/>
                  <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">Checkout</span>
                </div>
                <h1 className="font-black text-[#111] leading-tight tracking-tight" style={{ fontSize:"clamp(1.5rem,3vw,2rem)" }}>
                  Choose{" "}
                  <em className="text-orange-500" style={{ fontStyle:"italic" }}>Payment</em>
                </h1>
              </div>

              {/* Method selector cards */}
              <div style={fade(0.16)} className="space-y-2.5">
                {METHODS.map(m => (
                  <div key={m.key}
                    className={`border rounded-2xl overflow-hidden transition-all duration-250 cursor-pointer
                      ${method===m.key ? "border-orange-400 shadow-[0_0_0_3px_rgba(249,115,22,.12)]" : "border-black/8 hover:border-orange-200"}`}
                    onClick={()=>setMethod(m.key)}
                  >
                    {/* Row */}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      {/* Radio */}
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200
                        ${method===m.key ? "border-orange-500" : "border-gray-300"}`}
                        style={{ width:18, height:18 }}>
                        {method===m.key && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" style={{ width:10, height:10 }}/>}
                      </div>
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                        ${method===m.key ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-[13px] ${method===m.key ? "text-orange-500" : "text-[#111]"}`}>{m.label}</p>
                        <p className="text-[11px] text-gray-400">{m.sub}</p>
                      </div>
                      {m.key==="cod" && (
                        <span className="text-[9px] font-bold bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">+₹49</span>
                      )}
                    </div>

                    {/* Expanded form */}
                    {method===m.key && (
                      <div className="px-4 pb-4 border-t border-orange-100 pt-4 bg-orange-50/20"
                        style={{ animation:"fadeUp .35s cubic-bezier(.16,1,.3,1)" }}>

                        {/* CARD */}
                        {m.key==="card" && <CardForm/>}

                        {/* UPI */}
                        {m.key==="upi" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">UPI ID</label>
                              <div className="flex gap-2">
                                <input className="flex-1 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-400"
                                  placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)}/>
                                <button className="px-4 py-3 bg-orange-500 text-white text-[11px] font-bold rounded-2xl hover:bg-orange-600 transition-colors cursor-pointer border-none whitespace-nowrap">
                                  Verify
                                </button>
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-400 text-center">— or pay with —</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id:"gpay",    label:"GPay",    color:"#4285f4", icon:"G" },
                                { id:"phonepe", label:"PhonePe", color:"#5f259f", icon:"P" },
                                { id:"paytm",   label:"Paytm",   color:"#002970", icon:"₱" },
                              ].map(u => (
                                <button key={u.id}
                                  className="flex flex-col items-center gap-1.5 py-3 border-2 border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer bg-white"
                                  onClick={e=>e.stopPropagation()}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background:u.color }}>{u.icon}</div>
                                  <span className="text-[10px] font-bold text-gray-500">{u.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NET BANKING */}
                        {m.key==="netbanking" && (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Bank</label>
                            <div className="relative">
                              <select className={inp + " appearance-none cursor-pointer"} value={bank} onChange={e=>setBank(e.target.value)}
                                style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                                <option value="">— Choose your bank —</option>
                                {BANKS.map(b=><option key={b} value={b}>{b}</option>)}
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                            </div>
                            {/* Popular banks grid */}
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {BANKS.slice(0,4).map(b => (
                                <button key={b} onClick={e=>{e.stopPropagation(); setBank(b);}}
                                  className={`py-2.5 text-[9px] font-bold text-center border-2 rounded-xl cursor-pointer transition-all
                                    ${bank===b ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 bg-white hover:border-orange-300"}`}>
                                  {b.split(" ")[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* WALLETS */}
                        {m.key==="wallet" && (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Wallet</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {WALLETS.map(w=>(
                                <button key={w.id} onClick={e=>{e.stopPropagation(); setWallet(w.id);}}
                                  className={`py-3 flex flex-col items-center gap-1.5 border-2 rounded-2xl cursor-pointer transition-all
                                    ${wallet===w.id ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300"}`}>
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-[11px]"
                                    style={{ background:w.color }}>
                                    {w.label[0]}
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-500">{w.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* COD */}
                        {m.key==="cod" && (
                          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                            <Package size={18} className="text-amber-500 shrink-0 mt-0.5"/>
                            <div>
                              <p className="font-bold text-[13px] text-[#111] mb-0.5">Cash on Delivery</p>
                              <p className="text-[12px] text-gray-500">Pay ₹49 extra as handling fee. Amount due at delivery: <strong className="text-[#111]">{fmt(finalTotal + 49)}</strong></p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Security badges */}
              <div style={fade(0.28)} className="flex items-center gap-4 flex-wrap pt-1">
                {[
                  { icon:<Shield size={13}/>, text:"256-bit SSL Encryption" },
                  { icon:<Lock size={13}/>,   text:"PCI DSS Compliant" },
                  { icon:<Check size={13}/>,  text:"100% Secure" },
                ].map(b=>(
                  <div key={b.text} className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <span className="text-green-500">{b.icon}</span>{b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT — Order summary
            ══════════════════════════════════════ */}
            <div className="space-y-4" style={fade(0.22)}>

              {/* Order summary card */}
              <div className="border border-black/8 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5 bg-orange-50/40">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-orange-500 rounded-full"/>
                    <h3 className="font-black text-[#111] text-[14px]">Order Summary</h3>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 space-y-3 border-b border-black/5">
                  {CART.map(item => (
                    <div key={item.id} className="flex gap-3 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-black/5"
                        style={{ background:"#fff4ee" }}>
                        <div className="absolute pointer-events-none"
                          style={{ backgroundImage:"linear-gradient(rgba(249,115,22,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.04) 1px,transparent 1px)", backgroundSize:"10px 10px" }}/>
                        <img src={item.img} alt={item.name} className="w-[80%] h-[80%] object-cover"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[11px] text-[#111] truncate leading-tight">{item.name}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">{item.brand} · {item.size} · {item.color}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-black text-orange-500">{fmt(item.price)}</span>
                            <span className="text-[10px] text-gray-300 line-through">{fmt(item.orig)}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-full">
                            ×{item.qty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="p-4 border-b border-black/5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag size={11} className="text-orange-400"/>Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-400 uppercase tracking-wider"
                      placeholder="SAVE10" value={coupon} onChange={e=>{ setCoupon(e.target.value.toUpperCase()); setCouponOk(null); }}
                      style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
                    <button onClick={applyCoupon}
                      className="px-3.5 py-2 bg-orange-500 text-white text-[11px] font-bold rounded-2xl hover:bg-orange-600 transition-colors cursor-pointer border-none whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                  {couponOk===true  && <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1"><Check size={10}/>10% discount applied!</p>}
                  {couponOk===false && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1"><X size={10}/>Invalid coupon. Try SAVE10</p>}
                </div>

                {/* Price breakdown */}
                <div className="p-4 space-y-2.5">
                  {[
                    { label:"Subtotal",  value:fmt(subtotal),   muted:false },
                    { label:"Savings",   value:`−${fmt(savings)}`, green:true },
                    { label:"Shipping",  value:shipping===0 ? "FREE 🎉" : fmt(shipping), green:shipping===0 },
                    { label:"GST (5%)",  value:fmt(tax),        muted:true },
                    ...(discount>0 ? [{ label:"Coupon discount", value:`−${fmt(discount)}`, green:true }] : []),
                  ].map(r=>(
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-[12px] text-gray-500">{r.label}</span>
                      <span className={`text-[12px] font-semibold ${(r as any).green ? "text-green-600" : "text-[#111]"}`}>{r.value}</span>
                    </div>
                  ))}

                  {/* Dashed rule */}
                  <div className="h-px" style={{ background:"repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }}/>

                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#111] text-[14px]">Total</span>
                    <span className="font-black text-orange-500 text-[18px]">{fmt(finalTotal)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right">Incl. all taxes</p>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={placing}
                className="group relative w-full overflow-hidden flex items-center justify-center gap-2 bg-orange-500 text-white font-bold text-[12px] tracking-[.16em] uppercase py-4 rounded-2xl cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(249,115,22,.45)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {!placing && <span className="absolute inset-0 bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"/>}
                {placing ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation:"spin .7s linear infinite" }}/>
                    Processing…
                  </span>
                ) : (
                  <>
                    <Zap size={15} className="relative z-10"/>
                    <span className="relative z-10">Pay {fmt(finalTotal)}</span>
                    <Lock size={13} className="relative z-10 opacity-70"/>
                  </>
                )}
              </button>

              {/* Delivery info */}
              <div className="flex items-center gap-2.5 px-1">
                <Truck size={14} className="text-orange-400 shrink-0"/>
                <p className="text-[11px] text-gray-400">
                  {shipping===0 ? <><strong className="text-green-600">Free delivery</strong> on this order</> : <><strong className="text-[#111]">₹99</strong> shipping · Free above ₹999</>}
                  {" · "}Delivered in <strong className="text-[#111]">3–5 days</strong>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}