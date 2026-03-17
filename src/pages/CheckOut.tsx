import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../components/products/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // ── FIXED: use the correct names from CartContext ──
  const { items, totalPrice } = useCart();
  // items     = CartItem[]  (was "cartItems"   — does not exist)
  // totalPrice = number     (was "getTotalPrice" — does not exist)

  const [saveInfo, setSaveInfo] = useState(true);
  const [formData, setFormData] = useState({
    firstName:     '',
    companyName:   '',
    streetAddress: '',
    apartment:     '',
    city:          '',
    phoneNumber:   '',
    emailAddress:  '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax      = Math.round(totalPrice * 0.05);
  const total    = totalPrice + shipping + tax;

  const handlePlaceOrder = () => {
    navigate("/payment", {
      state: { formData, cartItems: items, total },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

        {/* Billing Details */}
        <div className="bg-white p-8 rounded-2xl border border-black/8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Billing Details</h2>
          <div className="space-y-4">
            <input type="text"   name="firstName"     placeholder="First Name"     value={formData.firstName}     onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-orange-400 transition-colors"/>
            <input type="text"   name="streetAddress" placeholder="Street Address" value={formData.streetAddress} onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-orange-400 transition-colors"/>
            <input type="text"   name="city"          placeholder="City"           value={formData.city}          onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-orange-400 transition-colors"/>
            <input type="tel"    name="phoneNumber"   placeholder="Phone Number"   value={formData.phoneNumber}   onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-orange-400 transition-colors"/>
            <input type="email"  name="emailAddress"  placeholder="Email Address"  value={formData.emailAddress}  onChange={handleInputChange} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-orange-400 transition-colors"/>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} className="accent-orange-500"/>
              <span className="text-sm text-gray-600">Save this information for next time</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-2xl border border-black/8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          {/* ── FIXED: iterate over "items" not "cartItems" ── */}
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 mb-4">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.img} alt={item.name}  
                      className="w-14 h-14 object-cover rounded-xl border border-black/8 shrink-0"/>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#111] truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">Size: {item.selectedSize} · Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[13px] text-orange-500 shrink-0">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>GST (5%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-black text-[16px] text-[#111] pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-orange-500">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-[13px] tracking-[.14em] uppercase py-3.5 mt-6 rounded-2xl border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,.35)]">
            Place Order
          </button>
        </div>
      </div>

      <div className="text-center pb-10">
        <button onClick={() => navigate('/cart')}
          className="text-orange-500 flex items-center justify-center gap-2 mx-auto font-semibold cursor-pointer bg-transparent border-none hover:text-orange-600 transition-colors">
          <ArrowLeft size={18}/> Back to Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;