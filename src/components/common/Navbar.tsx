import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../products/CartContext";
import { useWishlist } from "../products/WishlistContext";
import logo from "../../assets/logo9 (3).png";

const Navbar: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { getTotalItems } = useCart();
  const { wishlistItems }  = useWishlist();

  const [mobileMenu,     setMobileMenu]     = useState(false);
  const [mobileCatOpen,  setMobileCatOpen]  = useState(false); // ← was missing
  const [showSearch,     setShowSearch]     = useState(false);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [logoError,      setLogoError]      = useState(false);

  // Suppress unused-variable warning for mobileCatOpen if you don't render it yet
  void mobileCatOpen;

  const isActive = (path: string) =>
    `text-sm font-semibold tracking-wide transition-colors duration-150 ${
      location.pathname === path ? "text-orange-500" : "hover:text-orange-500"
    }`;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${searchTerm}`);
      setShowSearch(false);
    }
  };

  return (
    <nav className="w-full bg-white text-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            {!logoError ? (
              <img
                src={logo}
                alt="logo"
                className="h-15 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-xl font-bold text-orange-500">SHOP</span>
            )}
          </div>

          {/* ── DESKTOP MENU ── */}
          <div className="hidden md:flex items-center gap-10">

            <button onClick={() => navigate("/")} className={isActive("/")}>
              HOME
            </button>

            <button onClick={() => navigate("/about")} className={isActive("/about")}>
              ABOUT US
            </button>

            <button onClick={() => navigate("/shop")} className={isActive("/shop")}>
              SHOP
            </button>

            <button onClick={() => navigate("/categories")} className={isActive("/categories")}>
              CATEGORIES
            </button>

            <button onClick={() => navigate("/contact")} className={isActive("/contact")}>
              CONTACT
            </button>
          </div>

          {/* ── RIGHT ICONS ── */}
          <div className="flex items-center gap-6">

            {/* Search */}
            <div className="flex items-center relative">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500 mr-2 w-44 transition-all duration-200"
                />
              )}
              <button onClick={() => setShowSearch(!showSearch)}>
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist */}
            <button onClick={() => navigate("/wishlist")} className="relative">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Profile */}
            <button onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileMenu && (
          <div className="md:hidden pb-4 flex flex-col gap-1 text-sm font-semibold border-t border-gray-100 pt-3">

            <button onClick={() => { navigate("/"); setMobileMenu(false); }}
              className="text-left px-2 py-2.5 hover:text-orange-500 transition-colors">
              HOME
            </button>

            <button onClick={() => { navigate("/about"); setMobileMenu(false); }}
              className="text-left px-2 py-2.5 hover:text-orange-500 transition-colors">
              ABOUT US
            </button>

            <button onClick={() => { navigate("/shop"); setMobileMenu(false); }}
              className="text-left px-2 py-2.5 hover:text-orange-500 transition-colors">
              SHOP
            </button>

            <button
              onClick={() => {
                navigate("/categories");
                setMobileMenu(false);
                setMobileCatOpen(false);
              }}
              className="text-left px-2 py-2.5 hover:text-orange-500 transition-colors">
              CATEGORIES
            </button>

            <button onClick={() => { navigate("/contact"); setMobileMenu(false); }}
              className="text-left px-2 py-2.5 hover:text-orange-500 transition-colors">
              CONTACT
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;