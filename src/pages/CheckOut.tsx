import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../components/products/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {

  const navigate = useNavigate();

  const { cartItems, getTotalPrice } = useCart();

  const [saveInfo, setSaveInfo] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phoneNumber: '',
    emailAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

 

  const subtotal = getTotalPrice();
  const total = subtotal;

  const handlePlaceOrder = () => {

    navigate("/payment", {
      state: {
        formData,
        cartItems,
        total
      }
    });

  };

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

        {/* Billing Details */}

        <div className="bg-white p-8 rounded-lg">

          <h2 className="text-2xl font-bold mb-6">
            Billing Details
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="email"
              name="emailAddress"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />

            <div className="flex items-center">

              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />

              <span className="ml-2 text-sm">
                Save this information for next time
              </span>

            </div>

          </div>

        </div>

        {/* Order Summary */}

        <div className="bg-white p-8 rounded-lg">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          {cartItems.map((item) => (

            <div key={item.id} className="flex justify-between mb-4">

              <div className="flex items-center gap-3">

                <img
                  src={item.image}
                  className="w-12 h-12 object-cover"
                />

                <p>{item.title}</p>

              </div>

              <p>${item.price}</p>

            </div>

          ))}

          <div className="border-t pt-4 mt-4">

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

          </div>

          

          {/* Place Order */}

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-orange-500 text-white py-3 mt-6 rounded"
          >
            Place Order
          </button>

        </div>

      </div>

      {/* Back to Cart */}

      <div className="text-center pb-10">

        <button
          onClick={() => navigate('/cart')}
          className="text-orange-500 flex items-center justify-center gap-2"
        >

          <ArrowLeft size={18} />
          Back to Cart

        </button>

      </div>

    </div>

  );
};

export default Checkout;