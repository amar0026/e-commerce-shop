import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Exclusive Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Exclusive</h3>
            <div className="space-y-3">
              <p className="text-lg">Subscribe</p>
              <p className="text-sm text-gray-300">Get 10% off your first order</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border border-gray-600 px-3 py-2 flex-1 text-sm placeholder-gray-400 rounded-l focus:outline-none focus:border-gray-400"
                />
                <button className="bg-transparent border border-gray-600 border-l-0 px-3 py-2 rounded-r hover:bg-gray-800 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.</p>
              <p>exclusive@gmail.com</p>
              <p>+88015-88888-9999</p>
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><a href="#" className="hover:text-white transition-colors">My Account</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Login / Register</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Cart</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Wishlist</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Shop</a></p>
            </div>
          </div>

          {/* Quick Link Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Link</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Terms Of Use</a></p>
              <p><a href="#" className="hover:text-white transition-colors">FAQ</a></p>
              <p><a href="#" className="hover:text-white transition-colors">Contact</a></p>
            </div>
          </div>

          {/* Download App Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Download App</h3>
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Save $3 with App New User Only</p>
              
              {/* QR Code and App Store buttons */}
              <div className="flex gap-3">
                {/* QR Code placeholder */}
                <div className="w-20 h-20 bg-white flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-900 flex items-center justify-center">
                    <div className="text-white text-xs font-mono">QR</div>
                  </div>
                </div>
                
                {/* App Store buttons */}
                <div className="space-y-2">
                  <div className="bg-gray-800 border border-gray-600 rounded px-3 py-1 flex items-center gap-2 hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-black text-xs font-bold">G</span>
                    </div>
                    <div className="text-xs">
                      <p className="text-gray-400 text-[10px]">GET IT ON</p>
                      <p className="font-semibold">Google Play</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-600 rounded px-3 py-1 flex items-center gap-2 hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-black text-xs font-bold">🍎</span>
                    </div>
                    <div className="text-xs">
                      <p className="text-gray-400 text-[10px]">Download on the</p>
                      <p className="font-semibold">App Store</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-sm text-gray-500">
            <p>© Copyright Rimel 2022. All right reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;