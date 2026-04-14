import React, { useState } from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../products/CartContext";
import { useWishlist } from "../products/WishlistContext";

// ─── shared Product shape ─────────────────────────────────────────────────────
// Both GarmentProduct (ShopCollection) and the ShopPage Product satisfy this.

export interface CardProduct {
  id: string | number;
  name: string;
  /** brand label shown in eyebrow (ShopCollection) */
  brand?: string;
  /** category used in eyebrow when brand is absent (ShopPage) */
  cat?: string;
  sub?: string;
  price: number;
  originalPrice?: number; // GarmentProduct
  orig?: number; // ShopPage — one of these must be set
  image?: string; // GarmentProduct
  img?: string; // ShopPage — one of these must be set
  badge: string;
  badgeColor: string;
  fabric: string;
  colors?: string[];
  sizes: string[];
  rating: number;
  reviewCount?: string | number; // GarmentProduct
  reviews?: number; // ShopPage
  discount?: number; // pre-computed % (GarmentProduct)
}

// ─── props ────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: CardProduct;

  /** 'grid' (default) | 'list' — list renders image left, body right */
  viewMode?: "grid" | "list";

  /** Staggered entrance delay in seconds (default 0) */
  animationDelay?: number;

  /**
   * Whether the parent section is visible (drives entrance animation).
   * When animationDelay > 0 it uses inline transition; otherwise CSS @keyframe.
   * Default true.
   */
  visible?: boolean;

  /**
   * Override wishlist state from outside.
   * When both props are provided the component skips WishlistContext entirely.
   */
  wishlisted?: boolean;
  onToggleWishlist?: (id: string | number) => void;

  /** Called ~500ms after addItem — use to open cart drawer */
  onAfterAdd?: () => void;

  /** Navigate to /product/:id on card click. Default true */
  navigable?: boolean;
}

// ─── sub-components ───────────────────────────────────────────────────────────

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < Math.floor(rating) ? "#f97316" : "#e5e7eb",
          fontSize: 11,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const SaleBadge: React.FC<{ pct: number }> = ({ pct }) => (
  <div
    className="absolute z-20 flex flex-col items-center justify-center rounded-full shadow-lg select-none pointer-events-none"
    style={{
      top: 10,
      right: 10,
      width: 58,
      height: 58,
      background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
      boxShadow: "0 4px 16px rgba(249,115,22,.5)",
      animation: "salePop 2.8s ease-in-out infinite",
    }}
  >
    <span
      className="text-white font-black leading-none"
      style={{ fontSize: 9, letterSpacing: ".14em" }}
    >
      SALE
    </span>
    <span
      className="text-white font-black leading-none"
      style={{ fontSize: 17 }}
    >
      {pct}%
    </span>
  </div>
);

const isSaleBadge = (badge: string) => badge === "SALE" || badge === "HOT";

// ─── component ────────────────────────────────────────────────────────────────

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
  animationDelay = 0,
  visible = true,
  wishlisted: wishlistedProp,
  onToggleWishlist,
  onAfterAdd,
  navigable = true,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const wishlistCtx = useWishlist();

  const [justAdded, setJustAdded] = useState(false);

  // ── normalise fields ──────────────────────────────────────────────────────
  const id = product.id;
  const title = product.name;
  const eyebrow =
    product.brand ??
    (product.cat && product.sub
      ? `${product.cat} · ${product.sub}`
      : (product.cat ?? ""));
  const price = product.price;
  const origPrice = product.originalPrice ?? product.orig ?? price;
  const image = product.image ?? product.img ?? "";
  const colors = product.colors ?? [];
  const savings = origPrice - price;
  const discountPct =
    product.discount ?? Math.round((1 - price / origPrice) * 100);
  const reviewLabel = product.reviewCount ?? product.reviews ?? 0;

  // ── wishlist resolution ───────────────────────────────────────────────────
  const useExternal =
    wishlistedProp !== undefined && onToggleWishlist !== undefined;
  const wishlisted = useExternal
    ? wishlistedProp
    : wishlistCtx.isInWishlist(String(id));

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (useExternal) {
      onToggleWishlist!(id);
    } else {
      wishlisted
        ? wishlistCtx.removeFromWishlist(String(id))
        : wishlistCtx.addToWishlist(product as any);
    }
  };

  // ── cart ──────────────────────────────────────────────────────────────────
  const handleAddToCart = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      {
        id: typeof id === "string" ? parseInt(id) || id.charCodeAt(0) : id,
        name: title,
        cat: product.cat ?? "",
        sub: product.sub ?? product.cat ?? "",
        price,
        orig: origPrice,
        img: image,
        badge: product.badge,
        badgeColor: product.badgeColor,
        fabric: product.fabric,
        colors: colors.length ? colors : ["#111"],
        sizes: product.sizes,
        rating: product.rating,
        reviews:
          typeof reviewLabel === "string"
            ? parseInt(reviewLabel) || 0
            : reviewLabel,
      },
      size,
      colors[0] ?? "#111",
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    if (onAfterAdd) setTimeout(onAfterAdd, 500);
  };

  // ── card click ────────────────────────────────────────────────────────────
  const handleCardClick = (e: React.MouseEvent) => {
    if (!navigable) return;
    if ((e.target as HTMLElement).closest("button")) return;
    navigate(`/product/${id}`);
  };

  const isList = viewMode === "list";

  // ── styles ────────────────────────────────────────────────────────────────
  // Use IntersectionObserver-driven inline transition when animationDelay > 0
  // (ShopCollection), otherwise use CSS @keyframe (ShopPage).
  const entranceStyle: React.CSSProperties =
    animationDelay > 0
      ? {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(22px)",
          transition: `opacity .65s ${animationDelay}s cubic-bezier(.16,1,.3,1),
                     transform .65s ${animationDelay}s cubic-bezier(.16,1,.3,1)`,
        }
      : { animation: "cardIn .55s cubic-bezier(.16,1,.3,1) both" };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white border border-black/8 rounded-2xl overflow-hidden cursor-pointer
        transition-shadow transition-transform duration-400
        hover:-translate-y-[5px]
        hover:shadow-[0_20px_56px_rgba(249,115,22,.13),0_4px_16px_rgba(0,0,0,.05)]
        hover:border-orange-300
        ${isList ? "flex" : ""}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...entranceStyle,
      }}
    >
      {/* bottom accent sweep */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10 bg-gradient-to-r from-orange-500 to-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

      {/* ── IMAGE AREA ──────────────────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden flex items-center justify-center shrink-0 ${isList ? "w-[220px] h-[220px]" : ""}`}
        style={{
          background: "#fff4ee",
          height: isList ? undefined : "clamp(190px,24vw,250px)",
        }}
      >
        {/* grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.05) 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <img
          src={image}
          alt={title}
          loading="lazy"
          className="relative z-10 object-cover transition-transform duration-700 group-hover:scale-[1.07] group-hover:-translate-y-1"
          style={{ width: "75%", height: "90%" }}
        />

        {/* badge */}
        {isSaleBadge(product.badge) ? (
          <SaleBadge pct={discountPct} />
        ) : (
          <>
            <div
              className="absolute top-3 left-0 z-20 text-white text-[9px] font-black tracking-[.12em] uppercase py-1 pr-3 pl-2.5 min-w-[84px]"
              style={{
                background: product.badgeColor,
                clipPath: "polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)",
              }}
            >
              {product.badge}
            </div>
            <div className="absolute top-3 right-2.5 z-20 bg-white border border-orange-200 text-orange-600 text-[10px] font-extrabold px-2.5 py-[3px] rounded-2xl tracking-wide shadow-sm">
              −{discountPct}%
            </div>
          </>
        )}

        {/* wishlist + quick-view */}
        <div
          className={`absolute right-2.5 z-20 flex flex-col gap-1.5 transition-all duration-300
            ${isSaleBadge(product.badge) ? "top-[76px]" : "bottom-3"}
            ${wishlisted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
        >
          <button
            onClick={handleWishlist}
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110
              ${
                wishlisted
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-white border-black/10 text-gray-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white"
              }`}
          >
            <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            title="Quick view"
            className="w-8 h-8 rounded-full border border-black/10 bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:scale-110"
          >
            <Eye size={13} />
          </button>
        </div>

        {/* size chip strip */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(17,17,17,.93)] flex items-center justify-center gap-1.5 flex-wrap py-2.5 px-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={(e) => handleAddToCart(s, e)}
              className="text-[9px] font-bold tracking-[.1em] text-white/55 px-2 py-[3px] border border-white/16 rounded bg-transparent cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── CARD BODY ────────────────────────────────────────────────────────── */}
      <div className="p-3.5 flex-1 flex flex-col">
        <p className="text-[9px] font-bold tracking-[.2em] uppercase text-gray-400 mb-1">
          {eyebrow}
        </p>

        <p
          className={`font-semibold text-[#111] leading-tight mb-2
          ${isList ? "text-base whitespace-normal" : "text-[13px] whitespace-nowrap overflow-hidden text-ellipsis"}`}
        >
          {title}
        </p>

        <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-gray-500 text-[9px] font-medium px-2 py-[3px] rounded mb-2 w-fit">
          <span className="w-[5px] h-[5px] rounded-full bg-orange-500 shrink-0" />
          {product.fabric}
        </span>

        <div
          className="h-px mb-2"
          style={{
            background:
              "repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)",
          }}
        />

        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-gray-400">({reviewLabel})</span>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span
            className="text-orange-500 font-bold leading-none"
            style={{ fontSize: "clamp(1rem,1.5vw,1.2rem)" }}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-gray-300 line-through">
            ₹{origPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-[2px] rounded">
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

        {/* color swatches — only when present */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {colors.map((c, ci) => (
              <span
                key={ci}
                className="w-[13px] h-[13px] rounded-full border border-black/12 cursor-pointer transition-transform duration-200 hover:scale-125 hover:ring-2 hover:ring-orange-400"
                style={{ background: c }}
              />
            ))}
          </div>
        )}

        <button
          onClick={(e) => handleAddToCart(product.sizes[0], e)}
          className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[.16em] uppercase text-white border-none cursor-pointer rounded-xl transition-all duration-250 hover:brightness-110 active:scale-[.98]"
          style={{
            background: justAdded ? "#16a34a" : "#f97316",
            animation: justAdded ? "bagFlash .4s ease" : "none",
          }}
        >
          <ShoppingBag size={13} />
          <span>{justAdded ? "✓ Added to Bag" : "Add to Bag"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
