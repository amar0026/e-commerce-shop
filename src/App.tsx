import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ── Auth ── */
import { AuthProvider } from "./pages/authcontext";
import ProtectedRoute from "./pages/protectroute";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signuppage";

/* ── Pages ── */
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/CheckOut";
import PaymentPage from "./pages/paymentpage";
import UserProfile from "./pages/Profile";

import About from "./pages/aboutpage";
import Shop from "./pages/Shop";
import Contact from "./pages/contact";

/* ── Layout ── */
import Layout from "./components/common/Layout";

/* ── Contexts ── */
import { WishlistProvider } from "./components/products/WishlistContext";
import { CartProvider } from "./components/products/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>

          <Router>

            <Layout>

              <Routes>

                {/* ── Public Pages ── */}

                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* ── Auth Pages ── */}

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* ── Protected Routes ── */}

                {/* Product Detail */}

                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />

                {/* User Profile */}

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Wishlist */}

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                {/* Cart */}

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                {/* Checkout */}

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                {/* Payment Page */}

                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />

              </Routes>

            </Layout>

          </Router>

        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;