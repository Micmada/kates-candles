import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { getCartCount } = useCart();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Kate's Candles
          </Link>
          
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Shop
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900">
              Cart ({getCartCount()})
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;