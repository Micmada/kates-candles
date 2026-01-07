import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { getCartCount } = useCart();
  const location = useLocation();
  const cartCount = getCartCount();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl tracking-tight font-light text-neutral-900 hover:text-neutral-600 transition-colors duration-300"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Kate's Candles
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-12">
            <Link 
              to="/shop" 
              className={`text-sm tracking-widest uppercase transition-colors duration-300 relative group ${
                isActive('/shop') ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Shop
              <span className={`absolute -bottom-1 left-0 w-full h-px bg-neutral-900 transition-transform duration-300 ${
                isActive('/shop') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            
            <Link 
              to="/cart" 
              className={`text-sm tracking-widest uppercase transition-colors duration-300 relative group flex items-center gap-2 ${
                isActive('/cart') ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Cart
              {cartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-neutral-50 text-xs">
                  {cartCount}
                </span>
              )}
              <span className={`absolute -bottom-1 left-0 w-full h-px bg-neutral-900 transition-transform duration-300 ${
                isActive('/cart') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            
            <Link 
              to="/admin" 
              className={`text-sm tracking-widest uppercase transition-colors duration-300 relative group ${
                isActive('/admin') ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Admin
              <span className={`absolute -bottom-1 left-0 w-full h-px bg-neutral-900 transition-transform duration-300 ${
                isActive('/admin') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');
      `}</style>
    </nav>
  );
}

export default Navbar;