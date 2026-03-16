import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, MapPin, CreditCard, Package, RotateCcw, XCircle,
  Heart, ChevronRight, Eye, EyeOff, Camera, Home, Check,
  Truck, Clock, AlertCircle, RefreshCw, Phone, Download,
  Shield, LogOut, Search, Grid3X3, List, ShoppingBag, Star,
  Plus, Pencil, Trash2, X, Building2, Landmark
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Section     = "profile" | "address" | "payment" | "orders" | "returns" | "cancellations" | "wishlist";
type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled" | "returned";
type OrderTab    = "all" | OrderStatus;

interface Order {
  id: string; date: string; product: string; category: string;
  img: string; size: string; color: string; qty: number; price: number;
  status: OrderStatus;
  deliveredOn?: string; cancelledOn?: string; returnedOn?: string;
  reason?: string; refund?: number; refundStatus?: string; tracking?: string;
}
interface Address {
  id: string; label: string; line1: string; line2: string;
  city: string; state: string; pin: string; phone: string; isDefault: boolean;
}
interface PayCard {
  id: string; type: "visa" | "mastercard" | "upi" | "netbanking";
  label: string; last4?: string; expiry?: string; upiId?: string; isDefault: boolean;
}

/* ─────────────────────────────────────────────
   Mock data
───────────────────────────────────────────── */
const ORDERS: Order[] = [
  { id:"ORD-001", date:"12 Jun 2025", product:"Premium Wool Blazer",    category:"Men · Suits",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",                                                                size:"L",  color:"Charcoal",  qty:1, price:3499, status:"delivered",  deliveredOn:"15 Jun 2025", tracking:"TRK9284756" },
  { id:"ORD-002", date:"18 Jun 2025", product:"Embroidered Anarkali",   category:"Women · Ethnic", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp",                                          size:"M",  color:"Pink",       qty:1, price:2150, status:"shipped",    tracking:"TRK8837621" },
  { id:"ORD-003", date:"20 Jun 2025", product:"Classic White Tee",      category:"Men · T-Shirts", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg",                                                                                              size:"XL", color:"White",      qty:2, price:798,  status:"processing" },
  { id:"ORD-004", date:"5 Jun 2025",  product:"Palazzo Sharara Set",    category:"Women · Ethnic", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp",                                                        size:"S",  color:"Red",        qty:1, price:1799, status:"cancelled",  cancelledOn:"6 Jun 2025",  reason:"Changed my mind",     refund:1799, refundStatus:"Refunded" },
  { id:"ORD-005", date:"1 Jun 2025",  product:"Slim Straight Jeans",    category:"Men · Jeans",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295972/images_24_dv4pnt.jpg",                                                                                              size:"32", color:"Dark Blue",  qty:1, price:1199, status:"cancelled",  cancelledOn:"2 Jun 2025",  reason:"Found a better deal", refund:1199, refundStatus:"Pending" },
  { id:"ORD-006", date:"22 May 2025", product:"Premium Wool Blazer",    category:"Men · Suits",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",                                                                size:"M",  color:"Navy",       qty:1, price:3499, status:"returned",   returnedOn:"28 May 2025",  reason:"Size didn't fit",     refund:3499, refundStatus:"Refunded" },
  { id:"ORD-007", date:"10 May 2025", product:"Kids Dungaree Playsuit", category:"Kids · Casuals", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg",                                                                                              size:"6Y", color:"Blue",       qty:1, price:599,  status:"returned",   returnedOn:"16 May 2025",  reason:"Defective product",   refund:599,  refundStatus:"Refunded" },
];

const WISHLIST = [
  { id:1, name:"Classic White Tee",    price:399, orig:699,  img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg" },
  { id:2, name:"Tropical Rayon Shirt", price:749, orig:1100, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296337/gemini-generated-image-hisdushisdushisd-1-500x500_z8jlod.webp" },
];

const INIT_ADDRESSES: Address[] = [
  { id:"a1", label:"Home",   line1:"42, MG Road",   line2:"Near Park Street", city:"Kolkata", state:"West Bengal", pin:"700001", phone:"+91 98765 43210", isDefault:true },
  { id:"a2", label:"Office", line1:"10, Salt Lake", line2:"Sector V",         city:"Kolkata", state:"West Bengal", pin:"700091", phone:"+91 91234 56789", isDefault:false },
];

const INIT_CARDS: PayCard[] = [
  { id:"c1", type:"visa",       label:"Visa Card",    last4:"4242", expiry:"08/27", isDefault:true },
  { id:"c2", type:"mastercard", label:"Mastercard",   last4:"5353", expiry:"11/26", isDefault:false },
  { id:"c3", type:"upi",        label:"GPay UPI",     upiId:"uttam@oksbi", isDefault:false },
];

const EMPTY_ADDR: Omit<Address,"id"|"isDefault"> = { label:"", line1:"", line2:"", city:"", state:"", pin:"", phone:"" };
const EMPTY_CARD: Omit<PayCard,"id"|"isDefault"> = { type:"visa", label:"", last4:"", expiry:"", upiId:"" };

/* ─────────────────────────────────────────────
   Status config / order tabs
───────────────────────────────────────────── */
const S: Record<OrderStatus, { label:string; color:string; bg:string; icon:React.ReactNode }> = {
  delivered:  { label:"Delivered",  color:"#16a34a", bg:"#dcfce7", icon:<Check size={10}/> },
  shipped:    { label:"Shipped",    color:"#2563eb", bg:"#dbeafe", icon:<Truck size={10}/> },
  processing: { label:"Processing", color:"#d97706", bg:"#fef3c7", icon:<Clock size={10}/> },
  cancelled:  { label:"Cancelled",  color:"#dc2626", bg:"#fee2e2", icon:<XCircle size={10}/> },
  returned:   { label:"Returned",   color:"#7c3aed", bg:"#ede9fe", icon:<RotateCcw size={10}/> },
};
const ORDER_TABS: { key:OrderTab; label:string }[] = [
  { key:"all", label:"All" },{ key:"processing", label:"Processing" },
  { key:"shipped", label:"Shipped" },{ key:"delivered", label:"Delivered" },
  { key:"returned", label:"Returned" },{ key:"cancelled", label:"Cancelled" },
];
const SIDEBAR = [
  { title:"Manage My Account", items:[
    { label:"My Profile",         key:"profile"       as Section, icon:<User size={14}/> },
    { label:"Address Book",       key:"address"       as Section, icon:<MapPin size={14}/> },
    { label:"My Payment Options", key:"payment"       as Section, icon:<CreditCard size={14}/> },
  ]},
  { title:"My Orders", items:[
    { label:"My Orders",          key:"orders"        as Section, icon:<Package size={14}/> },
    { label:"My Returns",         key:"returns"       as Section, icon:<RotateCcw size={14}/> },
    { label:"My Cancellations",   key:"cancellations" as Section, icon:<XCircle size={14}/> },
  ]},
  { title:"My Wishlist", items:[
    { label:"Saved Items",        key:"wishlist"      as Section, icon:<Heart size={14}/> },
  ]},
];

/* ─────────────────────────────────────────────
   Shared modal wrapper
───────────────────────────────────────────── */
function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,.45)", backdropFilter:"blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation:"fadeUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/6 bg-orange-50/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 bg-orange-500 rounded-full"/>
            <h3 className="font-black text-[#111] text-[15px]">{title}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-100 hover:text-orange-500 transition-all cursor-pointer bg-transparent border-none">
            <X size={14}/>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Address Book Panel
───────────────────────────────────────────── */
function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>(INIT_ADDRESSES);
  const [modal, setModal]         = useState<"add"|"edit"|null>(null);
  const [editId, setEditId]       = useState<string|null>(null);
  const [form, setForm]           = useState<Omit<Address,"id"|"isDefault">>(EMPTY_ADDR);

  const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder:text-gray-400";

  const openAdd  = () => { setForm(EMPTY_ADDR); setModal("add"); };
  const openEdit = (a: Address) => { setForm({ label:a.label, line1:a.line1, line2:a.line2, city:a.city, state:a.state, pin:a.pin, phone:a.phone }); setEditId(a.id); setModal("edit"); };
  const close    = () => { setModal(null); setEditId(null); };

  const save = () => {
    if (!form.line1.trim() || !form.city.trim()) return;
    if (modal === "add") {
      setAddresses(prev => [...prev, { ...form, id:`a${Date.now()}`, isDefault: prev.length === 0 }]);
    } else {
      setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
    }
    close();
  };

  const remove     = (id: string) => setAddresses(prev => { const n = prev.filter(a=>a.id!==id); return n.map((a,i)=>({...a,isDefault:i===0&&!n.some(x=>x.isDefault&&x.id!==id)?true:a.isDefault})); });
  const setDefault = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id===id })));

  const ADDR_ICONS: Record<string, React.ReactNode> = {
    Home:   <Home size={14} className="text-white"/>,
    Office: <Building2 size={14} className="text-white"/>,
  };

  return (
    <div className="space-y-3">
      {addresses.map(a => (
        <div key={a.id}
          className={`border rounded-2xl p-4 flex items-start gap-3 transition-all duration-200 ${a.isDefault ? "border-orange-300 bg-orange-50/60" : "border-black/8 hover:border-orange-200"}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.isDefault ? "bg-orange-500" : "bg-gray-200"}`}>
            {ADDR_ICONS[a.label] || <MapPin size={14} className="text-white"/>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-[13px] text-[#111]">{a.label}</p>
              {a.isDefault && <span className="text-[9px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">Default</span>}
            </div>
            <p className="text-[12px] text-gray-600">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
            <p className="text-[12px] text-gray-500">{a.city}, {a.state} – {a.pin}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{a.phone}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <button onClick={() => openEdit(a)}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:text-orange-600 cursor-pointer bg-transparent border-none transition-colors">
                <Pencil size={10}/>Edit
              </button>
              {!a.isDefault && (
                <button onClick={() => setDefault(a.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-orange-500 cursor-pointer bg-transparent border-none transition-colors">
                  <Check size={10}/>Set Default
                </button>
              )}
              {addresses.length > 1 && (
                <button onClick={() => remove(a.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-300 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors">
                  <Trash2 size={10}/>Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <button onClick={openAdd}
        className="w-full py-3 border-2 border-dashed border-orange-200 rounded-2xl text-[12px] font-bold text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer bg-transparent flex items-center justify-center gap-2">
        <Plus size={14}/>Add New Address
      </button>

      {modal && (
        <Modal title={modal === "add" ? "Add New Address" : "Edit Address"} onClose={close}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Label</label>
                <input className={inp} placeholder="Home / Office / Other" value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}/>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Address Line 1 *</label>
                <input className={inp} placeholder="Street, building name" value={form.line1} onChange={e=>setForm(f=>({...f,line1:e.target.value}))}/>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Address Line 2</label>
                <input className={inp} placeholder="Area, landmark (optional)" value={form.line2} onChange={e=>setForm(f=>({...f,line2:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">City *</label>
                <input className={inp} placeholder="City" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">State</label>
                <input className={inp} placeholder="State" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PIN Code</label>
                <input className={inp} placeholder="000000" value={form.pin} onChange={e=>setForm(f=>({...f,pin:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                <input className={inp} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={close}
                className="px-5 py-2 text-[12px] font-bold text-gray-500 border border-black/10 rounded-2xl hover:border-gray-300 cursor-pointer bg-transparent transition-colors">
                Cancel
              </button>
              <button onClick={save}
                className="px-6 py-2 text-[12px] font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)] flex items-center gap-1.5">
                <Check size={13}/>{modal === "add" ? "Save Address" : "Update Address"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Payment Options Panel
───────────────────────────────────────────── */
function PaymentOptions() {
  const [cards, setCards]   = useState<PayCard[]>(INIT_CARDS);
  const [modal, setModal]   = useState<"add"|"edit"|null>(null);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm]     = useState<Omit<PayCard,"id"|"isDefault">>(EMPTY_CARD);

  const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder:text-gray-400";

  const openAdd  = () => { setForm(EMPTY_CARD); setModal("add"); };
  const openEdit = (c: PayCard) => { setForm({ type:c.type, label:c.label, last4:c.last4, expiry:c.expiry, upiId:c.upiId }); setEditId(c.id); setModal("edit"); };
  const close    = () => { setModal(null); setEditId(null); };

  const save = () => {
    if (!form.label.trim()) return;
    if (modal === "add") {
      setCards(prev => [...prev, { ...form, id:`c${Date.now()}`, isDefault: prev.length===0 }]);
    } else {
      setCards(prev => prev.map(c => c.id===editId ? { ...c, ...form } : c));
    }
    close();
  };

  const remove     = (id: string) => setCards(prev => prev.filter(c => c.id!==id));
  const setDefault = (id: string) => setCards(prev => prev.map(c => ({ ...c, isDefault: c.id===id })));

  const CARD_STYLES: Record<string, { bg:string; label:string; icon:React.ReactNode }> = {
    visa:       { bg:"linear-gradient(135deg,#1a56db,#1e3a8a)", label:"VISA",       icon:<CreditCard size={16} className="text-white/80"/> },
    mastercard: { bg:"linear-gradient(135deg,#ef4444,#b91c1c)", label:"MC",         icon:<CreditCard size={16} className="text-white/80"/> },
    upi:        { bg:"linear-gradient(135deg,#7c3aed,#5b21b6)", label:"UPI",        icon:<Landmark size={16} className="text-white/80"/> },
    netbanking: { bg:"linear-gradient(135deg,#059669,#047857)", label:"NET",        icon:<Building2 size={16} className="text-white/80"/> },
  };

  return (
    <div className="space-y-3">
      {cards.map(c => {
        const st = CARD_STYLES[c.type];
        return (
          <div key={c.id}
            className={`border rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 ${c.isDefault ? "border-orange-300 bg-orange-50/50" : "border-black/8 hover:border-orange-200"}`}>
            {/* Card type icon */}
            <div className="w-12 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-[11px] text-white"
              style={{ background: st.bg }}>
              {st.label}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-[13px] text-[#111] truncate">{c.label}</p>
                {c.isDefault && <span className="text-[9px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full shrink-0">Default</span>}
              </div>
              {c.last4  && <p className="text-[11px] text-gray-400">•••• •••• •••• {c.last4}{c.expiry ? ` · Exp ${c.expiry}` : ""}</p>}
              {c.upiId  && <p className="text-[11px] text-gray-400">{c.upiId}</p>}
            </div>

            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => openEdit(c)}
                className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 cursor-pointer bg-transparent transition-all">
                <Pencil size={11}/>
              </button>
              {!c.isDefault && (
                <button onClick={() => setDefault(c.id)}
                  className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 cursor-pointer bg-transparent transition-all" title="Set as default">
                  <Check size={11}/>
                </button>
              )}
              {cards.length > 1 && (
                <button onClick={() => remove(c.id)}
                  className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 cursor-pointer bg-transparent transition-all">
                  <Trash2 size={11}/>
                </button>
              )}
            </div>
          </div>
        );
      })}

      <button onClick={openAdd}
        className="w-full py-3 border-2 border-dashed border-orange-200 rounded-2xl text-[12px] font-bold text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer bg-transparent flex items-center justify-center gap-2">
        <Plus size={14}/>Add Payment Method
      </button>

      {modal && (
        <Modal title={modal==="add" ? "Add Payment Method" : "Edit Payment Method"} onClose={close}>
          <div className="space-y-3">
            {/* Type selector */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(["visa","mastercard","upi","netbanking"] as const).map(t => {
                  const st = CARD_STYLES[t];
                  return (
                    <button key={t} onClick={() => setForm(f=>({...f,type:t}))}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer border-2
                        ${form.type===t ? "border-orange-500 text-orange-600 bg-orange-50" : "border-black/8 text-gray-500 bg-white hover:border-orange-300"}`}>
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Label *</label>
              <input className={inp} placeholder="e.g. My Visa / GPay" value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}/>
            </div>

            {(form.type === "visa" || form.type === "mastercard") && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Last 4 Digits</label>
                  <input className={inp} placeholder="4242" maxLength={4} value={form.last4} onChange={e=>setForm(f=>({...f,last4:e.target.value}))}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry (MM/YY)</label>
                  <input className={inp} placeholder="08/27" value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}/>
                </div>
              </div>
            )}

            {form.type === "upi" && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">UPI ID</label>
                <input className={inp} placeholder="yourname@upi" value={form.upiId} onChange={e=>setForm(f=>({...f,upiId:e.target.value}))}/>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={close}
                className="px-5 py-2 text-[12px] font-bold text-gray-500 border border-black/10 rounded-2xl hover:border-gray-300 cursor-pointer bg-transparent transition-colors">
                Cancel
              </button>
              <button onClick={save}
                className="px-6 py-2 text-[12px] font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)] flex items-center gap-1.5">
                <Check size={13}/>{modal==="add" ? "Save Method" : "Update Method"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Full Order Card
───────────────────────────────────────────── */
function FullOrderCard({ o, viewMode }: { o:Order; viewMode:"grid"|"list" }) {
  const [exp, setExp]     = useState(false);
  const [rated, setRated] = useState(0);
  const cfg = S[o.status];
  return (
    <div className={`group bg-white border border-black/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-orange-200 hover:shadow-[0_8px_32px_rgba(249,115,22,.1)] ${viewMode==="list"?"flex":"flex flex-col"}`}
      style={{ animation:"fadeUp .45s cubic-bezier(.16,1,.3,1) both" }}>
      <div className={`relative flex items-center justify-center shrink-0 overflow-hidden ${viewMode==="list"?"w-[100px] h-[100px]":"h-[130px] w-full"}`} style={{ background:"#fff4ee" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize:"18px 18px" }}/>
        <img src={o.img} alt={o.product} className="relative z-10 object-cover w-[70%] h-[83%] group-hover:scale-105 transition-transform duration-500"/>
        <span className="absolute top-2 left-2 z-20 inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full" style={{ color:cfg.color, background:cfg.bg }}>{cfg.icon}{cfg.label}</span>
      </div>
      <div className="flex-1 p-3 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500">{o.category}</p>
            <p className="font-bold text-[#111] text-[12px] leading-tight truncate">{o.product}</p>
          </div>
          <button onClick={()=>setExp(x=>!x)} className="shrink-0 p-1 rounded-lg border border-black/8 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer bg-transparent">
            <ChevronRight size={12} className={`transition-transform duration-300 ${exp?"rotate-90":""}`}/>
          </button>
        </div>
        <div className="flex gap-1 flex-wrap mb-1.5">
          {[`Size: ${o.size}`, o.color, `Qty: ${o.qty}`].map(t=>(
            <span key={t} className="text-[9px] bg-gray-50 border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-orange-500 text-[13px]">₹{o.price.toLocaleString("en-IN")}</span>
          {o.refundStatus && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color:o.refundStatus==="Refunded"?"#16a34a":"#d97706", background:o.refundStatus==="Refunded"?"#dcfce7":"#fef3c7" }}>
              {o.refundStatus==="Refunded"?"✓ Refunded":"⏳ Pending"}
            </span>
          )}
        </div>
        <p className="text-[9px] text-gray-300 font-semibold tracking-widest">{o.id} · {o.date}</p>
        {exp && (
          <div className="mt-2 pt-2 border-t border-dashed border-orange-100 space-y-1.5">
            {o.deliveredOn && <p className="text-[10px] text-gray-500 flex items-center gap-1"><Check size={10} className="text-green-500"/>Delivered: <strong>{o.deliveredOn}</strong></p>}
            {o.cancelledOn && <p className="text-[10px] text-gray-500 flex items-center gap-1"><XCircle size={10} className="text-red-400"/>Cancelled: <strong>{o.cancelledOn}</strong></p>}
            {o.returnedOn  && <p className="text-[10px] text-gray-500 flex items-center gap-1"><RotateCcw size={10} className="text-purple-400"/>Returned: <strong>{o.returnedOn}</strong></p>}
            {o.tracking    && <p className="text-[10px] text-gray-500 flex items-center gap-1"><Truck size={10} className="text-blue-400"/>Tracking: <strong>{o.tracking}</strong></p>}
            {o.reason      && <p className="text-[10px] text-gray-500 flex items-center gap-1"><AlertCircle size={10} className="text-orange-400"/>Reason: <strong>{o.reason}</strong></p>}
            {o.status==="delivered" && (
              <div className="flex items-center gap-1.5 p-2 bg-orange-50 rounded-xl border border-orange-100">
                <span className="text-[10px] font-semibold text-gray-500">Rate:</span>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setRated(s)} className="cursor-pointer bg-transparent border-none p-0 hover:scale-125 transition-transform">
                    <Star size={13} fill={s<=rated?"#f97316":"none"} stroke={s<=rated?"#f97316":"#d1d5db"}/>
                  </button>
                ))}
                {rated>0 && <span className="text-[9px] text-orange-500 font-bold ml-1">Thanks!</span>}
              </div>
            )}
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {o.status==="shipped"    && <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"><Truck size={9}/>Track</span>}
              {o.status==="delivered"  && <><span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-600 inline-flex items-center gap-1 cursor-pointer hover:bg-purple-100 transition-colors"><RotateCcw size={9}/>Return</span>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 inline-flex items-center gap-1 cursor-pointer hover:bg-gray-100 transition-colors"><Download size={9}/>Invoice</span></>}
              {o.status==="processing" && <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 inline-flex items-center gap-1 cursor-pointer hover:bg-red-100 transition-colors"><XCircle size={9}/>Cancel</span>}
              {o.refundStatus==="Pending" && <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 inline-flex items-center gap-1 cursor-pointer hover:bg-orange-100 transition-colors"><RefreshCw size={9}/>Refund</span>}
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 inline-flex items-center gap-1 cursor-pointer hover:bg-gray-100 transition-colors"><Phone size={9}/>Help</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniOrderCard({ o }: { o:Order }) {
  const [exp, setExp] = useState(false);
  const cfg = S[o.status];
  return (
    <div className="border border-black/8 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-[0_4px_20px_rgba(249,115,22,.07)] transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/60 border-b border-black/5">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest">{o.id} · {o.date}</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color:cfg.color, background:cfg.bg }}>{cfg.icon}{cfg.label}</span>
      </div>
      <div className="flex gap-3 p-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background:"#fff4ee" }}>
          <img src={o.img} alt={o.product} className="w-[75%] h-[85%] object-cover"/>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">{o.category}</p>
          <p className="font-bold text-[#111] text-[12px] truncate">{o.product}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Size: {o.size} · {o.color}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-black text-orange-500 text-[12px]">₹{o.price.toLocaleString("en-IN")}</span>
            {o.refundStatus && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color:o.refundStatus==="Refunded"?"#16a34a":"#d97706", background:o.refundStatus==="Refunded"?"#dcfce7":"#fef3c7" }}>
                {o.refundStatus==="Refunded"?"✓ Refunded":"⏳ Pending"}
              </span>
            )}
          </div>
        </div>
        <button onClick={()=>setExp(x=>!x)} className="self-start p-1 rounded-lg border border-black/8 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer bg-transparent">
          <ChevronRight size={12} className={`transition-transform duration-300 ${exp?"rotate-90":""}`}/>
        </button>
      </div>
      {exp && (
        <div className="px-4 pb-3 pt-1.5 border-t border-black/5 space-y-1.5 bg-orange-50/30">
          {o.cancelledOn && <p className="text-[10px] text-gray-500 flex items-center gap-1.5"><XCircle size={10} className="text-red-400"/>Cancelled: <strong>{o.cancelledOn}</strong></p>}
          {o.returnedOn  && <p className="text-[10px] text-gray-500 flex items-center gap-1.5"><RotateCcw size={10} className="text-purple-400"/>Returned: <strong>{o.returnedOn}</strong></p>}
          {o.reason      && <p className="text-[10px] text-gray-500 flex items-center gap-1.5"><AlertCircle size={10} className="text-orange-400"/>Reason: <strong>{o.reason}</strong></p>}
          <div className="flex gap-1.5 flex-wrap pt-0.5">
            {o.refundStatus==="Pending" && <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 inline-flex items-center gap-1 cursor-pointer"><RefreshCw size={9}/>Check Refund</span>}
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 inline-flex items-center gap-1 cursor-pointer"><Phone size={9}/>Help</span>
          </div>
        </div>
      )}
    </div>
  );
}

function MyOrdersPanel() {
  const [tab, setTab]           = useState<OrderTab>("all");
  const [search, setSearch]     = useState("");
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const filtered = ORDERS.filter(o=>(tab==="all"||o.status===tab) && (o.product.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase())));
  const cnt = (k:OrderTab) => k==="all"?ORDERS.length:ORDERS.filter(o=>o.status===k).length;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 flex-wrap">
        {ORDER_TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase px-3 py-2 rounded-2xl border cursor-pointer transition-all duration-200 ${tab===t.key?"bg-orange-500 border-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,.3)]":"bg-white border-black/10 text-gray-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"}`}>
            {t.label}
            {cnt(t.key)>0 && <span className={`text-[9px] font-black px-1 py-0.5 rounded-full min-w-[16px] text-center ${tab===t.key?"bg-white/25 text-white":"bg-orange-100 text-orange-600"}`}>{cnt(t.key)}</span>}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders…"
            className="w-full text-[12px] pl-8 pr-4 py-2 border border-black/10 rounded-2xl bg-white text-[#111] outline-none focus:border-orange-400 transition-all"
            style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={()=>setViewMode("grid")} className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${viewMode==="grid"?"bg-orange-500 border-orange-500 text-white":"bg-white border-black/10 text-gray-400 hover:border-orange-300 hover:text-orange-500"}`}><Grid3X3 size={13}/></button>
          <button onClick={()=>setViewMode("list")} className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${viewMode==="list"?"bg-orange-500 border-orange-500 text-white":"bg-white border-black/10 text-gray-400 hover:border-orange-300 hover:text-orange-500"}`}><List size={13}/></button>
          <span className="text-[11px] text-gray-400 pl-1"><strong className="text-orange-500">{filtered.length}</strong> orders</span>
        </div>
      </div>
      {filtered.length===0
        ?<div className="text-center py-14"><div className="text-4xl mb-3">📦</div><p className="font-bold text-[#111] mb-1">No orders found</p></div>
        :<div className={viewMode==="grid"?"grid grid-cols-1 sm:grid-cols-2 gap-3":"flex flex-col gap-3"}>
          {filtered.map(o=><FullOrderCard key={o.id} o={o} viewMode={viewMode}/>)}
        </div>
      }
      <div className="border-t border-black/5 pt-4 mt-2">
        <p className="text-[9px] font-black tracking-[.2em] uppercase text-gray-400 mb-3">Order Summary</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label:"Total Orders", value:ORDERS.length,                                    color:"#f97316", bg:"#fff7f0" },
            { label:"Delivered",    value:ORDERS.filter(o=>o.status==="delivered").length,  color:"#16a34a", bg:"#dcfce7" },
            { label:"Returns",      value:ORDERS.filter(o=>o.status==="returned").length,   color:"#7c3aed", bg:"#ede9fe" },
            { label:"Cancelled",    value:ORDERS.filter(o=>o.status==="cancelled").length,  color:"#dc2626", bg:"#fee2e2" },
          ].map(s=>(
            <div key={s.label} className="rounded-2xl border text-center py-3 px-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default" style={{ background:s.bg, borderColor:s.color+"22" }}>
              <p className="font-black text-xl leading-none mb-0.5" style={{ color:s.color }}>{s.value}</p>
              <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function UserProfile() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [showPw, setShowPw] = useState({ cur:false, new:false, con:false });
  const [saved,  setSaved]  = useState(false);
  const [profileData, setProfileData] = useState({
    firstName:"Uttam", lastName:"Gupta",
    email:"uttamgupta628@gmail.com", phone:"+91 98765 43210",
    address:"42, MG Road, Kolkata 700001",
    currentPassword:"", newPassword:"", confirmPassword:"",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(p => ({ ...p, [name]:value }));
  };
  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  const returns       = ORDERS.filter(o=>o.status==="returned");
  const cancellations = ORDERS.filter(o=>o.status==="cancelled");

  const LABELS: Record<Section,string> = {
    profile:"Edit Your Profile", address:"Address Book", payment:"My Payment Options",
    orders:"My Orders", returns:"My Returns", cancellations:"My Cancellations", wishlist:"Saved Items",
  };

  const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-400";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes dotDrift   { from{background-position:0 0}   to{background-position:28px 28px} }
        @keyframes shimmerBar { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes toastIn    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="relative min-h-screen bg-white" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.05) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 20s linear infinite" }}/>
        <div className="fixed top-0 left-0 right-0 h-[3px] z-50" style={{ background:"linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)", backgroundSize:"300% 100%", animation:"shimmerBar 3s linear infinite" }}/>

        {/* Breadcrumb */}
        <div className="relative z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="text-[12px] text-gray-400 flex items-center gap-1.5">
              <button onClick={()=>navigate("/")} className="hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-[12px] flex items-center gap-1"><Home size={12}/>Home</button>
              <ChevronRight size={11} className="text-gray-300"/>
              <span className="text-[#111] font-semibold">My Account</span>
            </div>
            <div className="text-[12px] text-gray-500">Welcome, <span className="text-orange-500 font-bold">{profileData.firstName}</span></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ══ SIDEBAR ══ */}
            <div className="lg:col-span-1">
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 mb-6 overflow-hidden text-white">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10"/>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10"/>
                <div className="relative">
                  <div className="relative w-14 h-14 mb-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-black">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer border-none p-0">
                      <Camera size={10} className="text-orange-500"/>
                    </button>
                  </div>
                  <p className="font-bold text-sm leading-tight">{profileData.firstName} {profileData.lastName}</p>
                  <p className="text-white/70 text-[11px] truncate">{profileData.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                {SIDEBAR.map(sec=>(
                  <div key={sec.title}>
                    <p className="text-[10px] font-black tracking-[.2em] uppercase text-gray-400 mb-2 px-2">{sec.title}</p>
                    <div className="space-y-0.5">
                      {sec.items.map(item=>{
                        const isActive = activeSection===item.key;
                        return (
                          <button key={item.key} onClick={()=>setActiveSection(item.key)}
                            className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-[12px] font-semibold transition-all duration-200 cursor-pointer border-none text-left ${isActive?"bg-orange-500 text-white shadow-[0_4px_16px_rgba(249,115,22,.3)]":"text-gray-500 hover:bg-orange-50 hover:text-orange-500 bg-transparent"}`}>
                            <span className={isActive?"text-white":"text-gray-400 group-hover:text-orange-400"}>{item.icon}</span>
                            {item.label}
                            {item.key==="orders" && <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive?"bg-white/25 text-white":"bg-orange-100 text-orange-600"}`}>{ORDERS.length}</span>}
                            {item.key==="returns" && returns.length>0 && <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive?"bg-white/25 text-white":"bg-purple-100 text-purple-600"}`}>{returns.length}</span>}
                            {item.key==="cancellations" && cancellations.length>0 && <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive?"bg-white/25 text-white":"bg-red-100 text-red-600"}`}>{cancellations.length}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="border-t border-black/6 pt-3">
                  <button className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-[12px] font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none">
                    <LogOut size={14} className="group-hover:text-red-400"/>Logout
                  </button>
                </div>
              </div>
            </div>

            {/* ══ MAIN CONTENT ══ */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-black/6 rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,.04)]"
                style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1)" }} key={activeSection}>

                <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-orange-50/40">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-6 h-0.5 bg-orange-500 rounded-full"/>
                      <span className="text-[9px] font-bold tracking-[.22em] uppercase text-orange-500">Account</span>
                    </div>
                    <h2 className="font-black text-[#111] text-lg leading-tight">{LABELS[activeSection]}</h2>
                  </div>
                </div>

                <div className="p-5">

                  {/* ── PROFILE ── */}
                  {activeSection==="profile" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label:"First Name", name:"firstName", type:"text" },
                          { label:"Last Name",  name:"lastName",  type:"text" },
                          { label:"Email",      name:"email",     type:"email" },
                          { label:"Phone",      name:"phone",     type:"tel" },
                        ].map(f=>(
                          <div key={f.name}>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                            <input type={f.type} name={f.name} value={(profileData as any)[f.name]} onChange={handleChange} className={inp}/>
                          </div>
                        ))}
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
                          <input type="text" name="address" value={profileData.address} onChange={handleChange} className={inp}/>
                        </div>
                      </div>
                      <div className="border-t border-dashed border-orange-200 pt-5">
                        <p className="text-[11px] font-black tracking-[.18em] uppercase text-gray-500 mb-3 flex items-center gap-2">
                          <Shield size={13} className="text-orange-400"/> Password Changes
                        </p>
                        <div className="space-y-3">
                          {[
                            { key:"cur" as const, name:"currentPassword", placeholder:"Current Password" },
                            { key:"new" as const, name:"newPassword",     placeholder:"New Password" },
                            { key:"con" as const, name:"confirmPassword", placeholder:"Confirm New Password" },
                          ].map(f=>(
                            <div key={f.key} className="relative">
                              <input type={showPw[f.key]?"text":"password"} name={f.name} placeholder={f.placeholder}
                                value={(profileData as any)[f.name]} onChange={handleChange} className={inp+" pr-11"}/>
                              <button type="button" onClick={()=>setShowPw(p=>({...p,[f.key]:!p[f.key]}))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none">
                                {showPw[f.key]?<EyeOff size={15}/>:<Eye size={15}/>}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={()=>setProfileData(p=>({...p,currentPassword:"",newPassword:"",confirmPassword:""}))}
                          className="px-6 py-2.5 text-[12px] font-bold text-gray-500 hover:text-gray-700 cursor-pointer bg-transparent border border-black/10 rounded-2xl hover:border-gray-300 transition-colors">
                          Cancel
                        </button>
                        <button type="button" onClick={handleSave}
                          className="px-8 py-2.5 text-[12px] font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-2xl transition-all cursor-pointer border-none hover:shadow-[0_6px_20px_rgba(249,115,22,.35)] hover:-translate-y-0.5 flex items-center gap-2">
                          {saved?<><Check size={13}/>Saved!</>:"Save Changes"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── ADDRESS BOOK (fully editable) ── */}
                  {activeSection==="address" && <AddressBook/>}

                  {/* ── PAYMENT OPTIONS (fully editable) ── */}
                  {activeSection==="payment" && <PaymentOptions/>}

                  {/* ── MY ORDERS ── */}
                  {activeSection==="orders" && <MyOrdersPanel/>}

                  {/* ── RETURNS ── */}
                  {activeSection==="returns" && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3.5 bg-purple-50 border border-purple-100 rounded-2xl text-[11px] text-purple-700">
                        <RotateCcw size={14} className="text-purple-400 mt-0.5 shrink-0"/>
                        <span><strong>Return Policy:</strong> Returns accepted within 7 days of delivery. Refunds in 5–7 business days.</span>
                      </div>
                      {returns.length===0
                        ?<div className="text-center py-14"><div className="text-4xl mb-3">↩️</div><p className="font-bold text-[#111]">No Returns Yet</p></div>
                        :returns.map(o=><MiniOrderCard key={o.id} o={o}/>)
                      }
                    </div>
                  )}

                  {/* ── CANCELLATIONS ── */}
                  {activeSection==="cancellations" && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-700">
                        <XCircle size={14} className="text-red-400 mt-0.5 shrink-0"/>
                        <span><strong>Cancellation Policy:</strong> Orders cancelled before shipment. Refunds in 3–5 business days.</span>
                      </div>
                      {cancellations.length===0
                        ?<div className="text-center py-14"><div className="text-4xl mb-3">🚫</div><p className="font-bold text-[#111]">No Cancellations</p></div>
                        :cancellations.map(o=><MiniOrderCard key={o.id} o={o}/>)
                      }
                    </div>
                  )}

                  {/* ── WISHLIST ── */}
                  {activeSection==="wishlist" && (
                    <div className="grid grid-cols-2 gap-3">
                      {WISHLIST.map(w=>(
                        <div key={w.id} className="border border-black/8 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-[0_6px_20px_rgba(249,115,22,.1)] transition-all duration-300 group cursor-pointer">
                          <div className="h-32 flex items-center justify-center" style={{ background:"#fff4ee" }}>
                            <img src={w.img} alt={w.name} className="h-[85%] w-[70%] object-cover group-hover:scale-105 transition-transform duration-500"/>
                          </div>
                          <div className="p-3">
                            <p className="font-bold text-[12px] text-[#111] truncate">{w.name}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-black text-orange-500 text-[13px]">₹{w.price}</span>
                              <span className="text-[10px] text-gray-300 line-through">₹{w.orig}</span>
                            </div>
                            <button className="mt-2 w-full py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer border-none flex items-center justify-center gap-1">
                              <ShoppingBag size={10}/>Add to Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111] text-white text-[12px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ animation:"toastIn .35s cubic-bezier(.16,1,.3,1)" }}>
          <Check size={13} className="text-orange-400"/>Profile saved successfully!
        </div>
      )}
    </>
  );
}