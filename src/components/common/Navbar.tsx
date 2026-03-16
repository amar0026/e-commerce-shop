import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Grid2x2,
  Heart
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../products/CartContext";
import { useWishlist } from "../products/WishlistContext";

const Navbar: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { getTotalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isActive = (path: string) =>
    `text-sm font-semibold tracking-wide ${
      location.pathname === path
        ? "text-orange-500"
        : "hover:text-orange-500"
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

          {/* CATEGORIES */}
          <div className="relative group">

            <div className="flex items-center hover:text-orange-500 gap-3 cursor-pointer">
              <Grid2x2 className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wide">
                CATEGORIES
              </span>
            </div>

            <div className="absolute left-0 top-full w-72 bg-gray-100 text-black shadow-2xl 
            p-8 space-y-6 opacity-0 invisible 
            group-hover:opacity-100 group-hover:visible 
            transition-all duration-300 z-50">

              <button onClick={() => navigate("/tshirts")} className="block font-semibold hover:text-orange-500">T-SHIRTS</button>
              <button onClick={() => navigate("/sweater")} className="block font-semibold hover:text-orange-500">SWEATER</button>
              <button onClick={() => navigate("/suit")} className="block font-semibold hover:text-orange-500">SUIT</button>
              <button onClick={() => navigate("/shirts")} className="block font-semibold hover:text-orange-500">SHIRTS</button>
              <button onClick={() => navigate("/jeans")} className="block font-semibold hover:text-orange-500">JEANS</button>
              <button onClick={() => navigate("/jackets")} className="block font-semibold hover:text-orange-500">JACKETS</button>

            </div>
          </div>

          {/* CENTER MENU */}
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

            <button onClick={() => navigate("/contact")} className={isActive("/contact")}>
              CONTACT
            </button>

          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-6">

            {/* SEARCH */}
            <div className="flex items-center relative">

              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-orange-500 mr-2"
                />
              )}

              <button onClick={() => setShowSearch(!showSearch)}>
                <Search className="w-5 h-5" />
              </button>

            </div>

            {/* WISHLIST */}
            <button onClick={() => navigate("/wishlist")} className="relative">
              <Heart className="w-5 h-5" />

              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* PROFILE */}
            <button onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </button>

            {/* CART */}
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingCart className="w-5 h-5" />

              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden pb-4 flex flex-col gap-4 text-sm font-semibold">

            <button onClick={() => navigate("/")}>HOME</button>
            <button onClick={() => navigate("/about")}>ABOUT US</button>
            <button onClick={() => navigate("/shop")}>SHOP</button>
            <button onClick={() => navigate("/contact")}>CONTACT</button>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;