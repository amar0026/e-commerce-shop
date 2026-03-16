import { useState } from "react";
import {
  Package, RotateCcw, XCircle, ChevronRight, Search,
  Truck, CheckCircle, Clock, AlertCircle, ArrowLeft,
  MapPin, Phone, Star, Download, RefreshCw
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled" | "returned";
type Tab = "orders" | "returns" | "cancellations";

interface Order {
  id: string;
  date: string;
  product: string;
  category: string;
  img: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  status: OrderStatus;
  deliveredOn?: string;
  cancelledOn?: string;
  returnedOn?: string;
  reason?: string;
  refund?: number;
  refundStatus?: string;
  address: string;
  tracking?: string;
}

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const ALL_ORDERS: Order[] = [
  {
    id: "ORD-2025-001",
    date: "12 Jun 2025",
    product: "Premium Wool Blazer",
    category: "Men · Suits",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",
    size: "L", color: "Charcoal", qty: 1, price: 3499,
    status: "delivered", deliveredOn: "15 Jun 2025",
    address: "42, MG Road, Kolkata 700001",
    tracking: "TRK9284756",
  },
  {
    id: "ORD-2025-002",
    date: "18 Jun 2025",
    product: "Embroidered Anarkali",
    category: "Women · Ethnic",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp",
    size: "M", color: "Pink", qty: 1, price: 2150,
    status: "shipped",
    address: "18, Park Street, Kolkata 700016",
    tracking: "TRK8837621",
  },
  {
    id: "ORD-2025-003",
    date: "20 Jun 2025",
    product: "Classic White Tee",
    category: "Men · T-Shirts",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg",
    size: "XL", color: "White", qty: 2, price: 798,
    status: "processing",
    address: "7, Lake Avenue, Kolkata 700026",
  },
  {
    id: "ORD-2025-004",
    date: "5 Jun 2025",
    product: "Palazzo Sharara Set",
    category: "Women · Ethnic",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp",
    size: "S", color: "Red", qty: 1, price: 1799,
    status: "cancelled", cancelledOn: "6 Jun 2025",
    reason: "Changed my mind",
    refund: 1799, refundStatus: "Refunded",
    address: "3, Jodhpur Park, Kolkata 700068",
  },
  {
    id: "ORD-2025-005",
    date: "1 Jun 2025",
    product: "Slim Straight Jeans",
    category: "Men · Jeans",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295972/images_24_dv4pnt.jpg",
    size: "32", color: "Dark Blue", qty: 1, price: 1199,
    status: "cancelled", cancelledOn: "2 Jun 2025",
    reason: "Found a better deal",
    refund: 1199, refundStatus: "Pending",
    address: "15, Salt Lake, Kolkata 700091",
  },
  {
    id: "ORD-2025-006",
    date: "22 May 2025",
    product: "Premium Wool Blazer",
    category: "Men · Suits",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",
    size: "M", color: "Navy", qty: 1, price: 3499,
    status: "returned", returnedOn: "28 May 2025",
    reason: "Size didn't fit",
    refund: 3499, refundStatus: "Refunded",
    address: "9, Ballygunge, Kolkata 700019",
  },
  {
    id: "ORD-2025-007",
    date: "10 May 2025",
    product: "Kids Dungaree Playsuit",
    category: "Kids · Casuals",
    img: "https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg",
    size: "6Y", color: "Blue", qty: 1, price: 599,
    status: "returned", returnedOn: "16 May 2025",
    reason: "Defective product",
    refund: 599, refundStatus: "Refunded",
    address: "22, Gariahat, Kolkata 700029",
  },
];

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  delivered:  { label: "Delivered",  color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={13} /> },
  shipped:    { label: "Shipped",    color: "#2563eb", bg: "#dbeafe", icon: <Truck size={13} /> },
  processing: { label: "Processing", color: "#d97706", bg: "#fef3c7", icon: <Clock size={13} /> },
  cancelled:  { label: "Cancelled",  color: "#dc2626", bg: "#fee2e2", icon: <XCircle size={13} /> },
  returned:   { label: "Returned",   color: "#7c3aed", bg: "#ede9fe", icon: <RotateCcw size={13} /> },
};

/* ─────────────────────────────────────────────
   Tabs config
───────────────────────────────────────────── */
const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "orders",        label: "My Orders",        icon: <Package size={15} /> },
  { key: "returns",       label: "My Returns",       icon: <RotateCcw size={15} /> },
  { key: "cancellations", label: "My Cancellations", icon: <XCircle size={15} /> },
];

/* ─────────────────────────────────────────────
   Order Card
───────────────────────────────────────────── */
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [rated, setRated]       = useState(0);
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div
      className="bg-white border border-black/8 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(249,115,22,.1)] hover:border-orange-200"
      style={{ animation: "cardIn .5s cubic-bezier(.16,1,.3,1) both" }}
    >
      {/* ── Top strip ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/5 bg-gray-50/60">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 tracking-[.12em] uppercase">
            {order.id}
          </span>
          <span className="text-[10px] text-gray-400">·</span>
          <span className="text-[10px] text-gray-400">{order.date}</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* ── Main row ── */}
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div
          className="relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ width: 90, height: 90, background: "#fff4ee" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <img src={order.img} alt={order.product} className="relative z-10 object-cover w-[80%] h-[85%]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold tracking-[.18em] uppercase text-orange-500 mb-0.5">
            {order.category}
          </p>
          <p className="font-bold text-[#111] text-sm leading-tight mb-1.5 truncate">
            {order.product}
          </p>
          <div className="flex gap-2 flex-wrap mb-2">
            <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              Size: {order.size}
            </span>
            <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {order.color}
            </span>
            <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              Qty: {order.qty}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-orange-500" style={{ fontSize: "1rem" }}>
              ₹{order.price.toLocaleString("en-IN")}
            </span>
            {order.refundStatus && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  color:      order.refundStatus === "Refunded" ? "#16a34a" : "#d97706",
                  background: order.refundStatus === "Refunded" ? "#dcfce7" : "#fef3c7",
                }}
              >
                {order.refundStatus === "Refunded" ? "✓ " : "⏳ "}
                Refund {order.refundStatus}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(x => !x)}
          className="self-start p-1.5 rounded-xl border border-black/8 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all duration-200 cursor-pointer bg-transparent"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* ── Expanded detail ── */}
      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: expanded ? 400 : 0 }}
      >
        <div className="px-4 pb-4 border-t border-black/5 pt-3 space-y-3">

          {/* Delivery / cancel / return info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {order.deliveredOn && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <CheckCircle size={12} className="text-green-500 shrink-0" />
                Delivered on <strong className="text-[#111]">{order.deliveredOn}</strong>
              </div>
            )}
            {order.cancelledOn && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <XCircle size={12} className="text-red-500 shrink-0" />
                Cancelled on <strong className="text-[#111]">{order.cancelledOn}</strong>
              </div>
            )}
            {order.returnedOn && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <RotateCcw size={12} className="text-purple-500 shrink-0" />
                Returned on <strong className="text-[#111]">{order.returnedOn}</strong>
              </div>
            )}
            {order.tracking && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <Truck size={12} className="text-blue-500 shrink-0" />
                Tracking: <strong className="text-[#111]">{order.tracking}</strong>
              </div>
            )}
            {order.reason && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <AlertCircle size={12} className="text-orange-400 shrink-0" />
                Reason: <strong className="text-[#111]">{order.reason}</strong>
              </div>
            )}
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <MapPin size={12} className="text-orange-500 shrink-0" />
              {order.address}
            </div>
          </div>

          {/* Rate product (only delivered) */}
          {order.status === "delivered" && (
            <div className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-xl border border-orange-100">
              <span className="text-[11px] font-semibold text-gray-600">Rate this product:</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onClick={() => setRated(s)}
                    className="cursor-pointer bg-transparent border-none p-0 transition-transform duration-150 hover:scale-125"
                  >
                    <Star size={16} fill={s <= rated ? "#f97316" : "none"} stroke={s <= rated ? "#f97316" : "#d1d5db"} />
                  </button>
                ))}
              </div>
              {rated > 0 && (
                <span className="text-[10px] font-bold text-orange-500 ml-1">Thanks! ✓</span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {order.status === "shipped" && (
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-blue-200 text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all duration-200">
                <Truck size={12} /> Track Order
              </button>
            )}
            {order.status === "delivered" && (
              <>
                <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-purple-200 text-purple-600 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-all duration-200">
                  <RotateCcw size={12} /> Return Item
                </button>
                <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-black/10 text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-200">
                  <Download size={12} /> Invoice
                </button>
              </>
            )}
            {order.status === "processing" && (
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-red-200 text-red-600 bg-red-50 cursor-pointer hover:bg-red-100 transition-all duration-200">
                <XCircle size={12} /> Cancel Order
              </button>
            )}
            {(order.status === "cancelled" || order.status === "returned") && order.refundStatus === "Pending" && (
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-orange-200 text-orange-600 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-all duration-200">
                <RefreshCw size={12} /> Check Refund
              </button>
            )}
            <button className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-4 py-2 rounded-2xl border border-black/10 text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-200">
              <Phone size={12} /> Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [search, setSearch]       = useState("");

  const filtered = ALL_ORDERS.filter(o => {
    const matchTab =
      activeTab === "orders"        ? true :
      activeTab === "returns"       ? o.status === "returned" :
      activeTab === "cancellations" ? o.status === "cancelled" : true;
    const matchSearch = o.product.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    orders:        ALL_ORDERS.length,
    returns:       ALL_ORDERS.filter(o => o.status === "returned").length,
    cancellations: ALL_ORDERS.filter(o => o.status === "cancelled").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');

        @keyframes cardIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes dotDrift {
          from { background-position: 0 0; }
          to   { background-position: 28px 28px; }
        }
        @keyframes stripeShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      <div
        className="relative min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* dot grid */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(249,115,22,.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            animation: "dotDrift 20s linear infinite",
          }}
        />

        {/* orange top stripe */}
        <div
          className="fixed top-0 left-0 right-0 h-[3px] z-50"
          style={{
            background: "linear-gradient(90deg,#f97316,#ea580c,#f97316,#ea580c)",
            backgroundSize: "300% 100%",
            animation: "stripeShimmer 3s linear infinite",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-20">

          {/* ── Page header ── */}
          <div className="pb-6 border-b border-black/6 mb-6">
            <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-orange-500 transition-colors duration-200 cursor-pointer bg-transparent border-none mb-4 p-0">
              <ArrowLeft size={13} /> Back to Home
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-0.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold tracking-[.24em] uppercase text-orange-500">
                Account
              </span>
            </div>
            <h1
              className="font-black text-[#111] leading-none tracking-tight"
              style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
            >
              My{" "}
              <em className="text-orange-500" style={{ fontStyle: "italic" }}>
                Orders
              </em>
            </h1>
            <p className="text-xs text-gray-400 tracking-wide mt-1.5">
              Track, return, or cancel your garment orders
            </p>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative inline-flex items-center gap-2 text-[11px] font-bold tracking-[.12em] uppercase px-5 py-2.5 rounded-2xl border cursor-pointer transition-all duration-250
                  ${activeTab === tab.key
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_6px_20px_rgba(249,115,22,.3)]"
                    : "bg-white border-black/10 text-gray-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50"
                  }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                    ${activeTab === tab.key ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}

            {/* Search */}
            <div className="relative ml-auto">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders…"
                className="text-[12px] pl-8 pr-4 py-2.5 w-40 sm:w-48 border border-black/10 rounded-2xl bg-white text-[#111] outline-none focus:border-orange-500 transition-all duration-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* ── Tab summary strip ── */}
          {activeTab === "returns" && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-100 rounded-2xl mb-5 text-[11px] text-purple-700">
              <RotateCcw size={16} className="text-purple-500 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold">Return Policy:</strong> Returns accepted within 7 days of delivery.
                Refund is processed within 5–7 business days after pickup.
              </div>
            </div>
          )}
          {activeTab === "cancellations" && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl mb-5 text-[11px] text-red-700">
              <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold">Cancellation Policy:</strong> Orders can be cancelled before shipment.
                Prepaid orders are refunded within 3–5 business days.
              </div>
            </div>
          )}

          {/* ── Orders list ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">
                {activeTab === "returns" ? "↩️" : activeTab === "cancellations" ? "🚫" : "📦"}
              </div>
              <p className="font-bold text-lg text-[#111] mb-1">
                No {activeTab === "orders" ? "orders" : activeTab === "returns" ? "returns" : "cancellations"} found
              </p>
              <p className="text-sm text-gray-400">
                {search ? "Try a different search term" : `You have no ${activeTab} yet`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((order, i) => (
                <div key={order.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          )}

          {/* ── Stats footer ── */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-black/6">
            {[
              { label: "Total Orders",  value: counts.orders,        color: "#f97316", bg: "#fff7f0" },
              { label: "Returns",       value: counts.returns,       color: "#7c3aed", bg: "#ede9fe" },
              { label: "Cancellations", value: counts.cancellations, color: "#dc2626", bg: "#fee2e2" },
            ].map(stat => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center"
                style={{ background: stat.bg, borderColor: stat.color + "20" }}
              >
                <span className="font-black text-2xl leading-none mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}