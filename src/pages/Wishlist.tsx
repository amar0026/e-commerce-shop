import React from 'react';
import { Heart, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../components/products/WishlistContext';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xs ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Wishlist ({wishlistItems.length})
          </h1>
          <button className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
            Move All To Bag
          </button>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500">Start adding products you love!</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 group relative">
                
                <div className="relative mb-4 cursor-pointer" onClick={() => handleProductClick(item.id)}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {item.status}
                  </div>

                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button 
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="w-full bg-black text-white py-2 rounded-b-lg hover:bg-gray-800 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>

                <div className="space-y-2" onClick={() => handleProductClick(item.id)}>
                  <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-orange-500">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">${item.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-gray-500 text-xs">({item.reviewCount})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;