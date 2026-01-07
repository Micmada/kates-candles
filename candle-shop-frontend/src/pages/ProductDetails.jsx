import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [fragrance, setFragrance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch single fragrance with sizes
    fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances/${id}`)
      .then(res => res.json())
      .then(data => {
        setFragrance(data);
        // Auto-select first available size
        const firstAvailable = data.sizes?.find(s => s.stock_quantity > 0);
        setSelectedSize(firstAvailable || data.sizes?.[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fragrance:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const cartItem = {
      id: selectedSize.id,
      fragrance_id: fragrance.id,
      name: `${fragrance.name} - ${selectedSize.size_name}`,
      price: selectedSize.price,
      size: selectedSize.size_name,
      burnTime: selectedSize.burn_time,
      image_url: fragrance.image_url,
      stock_quantity: selectedSize.stock_quantity
    };
    
    addToCart(cartItem);
    setNotification(`Added to cart`);
    setTimeout(() => setNotification(null), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 animate-pulse">
            <div className="aspect-[3/4] bg-neutral-200"></div>
            <div className="space-y-6">
              <div className="h-12 bg-neutral-200 w-3/4"></div>
              <div className="h-4 bg-neutral-200 w-full"></div>
              <div className="h-4 bg-neutral-200 w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fragrance) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-neutral-900 mb-4">Fragrance not found</h1>
          <Link to="/shop" className="text-neutral-500 hover:text-neutral-900">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 notification-enter">
          <div className="bg-neutral-900 text-neutral-50 px-8 py-4 text-sm tracking-wide">
            {notification}
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-neutral-900">{fragrance.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-16">
        {/* Back to Shop - Top Left */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="text-sm tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Shop</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <div className="product-image-enter">
            <div className="aspect-[3/4] bg-neutral-100 sticky top-8">
              <img 
                src={fragrance.image_url} 
                alt={fragrance.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-enter">
            {/* Title */}
            <div className="mb-8">
              <h1 
                className="text-5xl md:text-6xl tracking-tight font-light text-neutral-900 mb-4"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                {fragrance.name}
              </h1>
              <div className="w-16 h-px bg-neutral-900"></div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 leading-relaxed text-lg mb-12">
              {fragrance.description}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <label className="text-sm tracking-widest uppercase text-neutral-400 block mb-4">
                Select Size
              </label>
              <div className="grid grid-cols-1 gap-3">
                {fragrance.sizes && fragrance.sizes.map((size) => {
                  const isInStock = size.stock_quantity > 0;
                  const isSelected = selectedSize?.id === size.id;
                  
                  return (
                    <button
                      key={size.id}
                      onClick={() => isInStock && setSelectedSize(size)}
                      disabled={!isInStock}
                      className={`border p-4 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-neutral-50'
                          : isInStock
                          ? 'border-neutral-300 hover:border-neutral-900'
                          : 'border-neutral-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base tracking-wide font-medium mb-1">
                            {size.size_name}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {size.burn_time} hour burn time
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg tracking-wide">
                            £{parseFloat(size.price).toFixed(2)}
                          </div>
                          {!isInStock && (
                            <div className="text-xs text-red-600 mt-1">Out of Stock</div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSize.stock_quantity === 0}
              className="w-full bg-neutral-900 text-neutral-50 py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              Add to Cart
            </button>

            {/* Stock Info */}
            {selectedSize && selectedSize.stock_quantity > 0 && selectedSize.stock_quantity <= 5 && (
              <p className="text-xs text-yellow-700 tracking-wide text-center mb-8">
                Only {selectedSize.stock_quantity} left in stock
              </p>
            )}

            {/* Product Details */}
            <div className="border-t border-neutral-200 pt-8 space-y-6">
              <div>
                <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-3">
                  Details
                </h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span>Wax Type</span>
                    <span className="text-neutral-900">100% Natural Soy</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span>Wick</span>
                    <span className="text-neutral-900">Cotton</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span>Vessel</span>
                    <span className="text-neutral-900">Reusable Glass</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Hand Poured</span>
                    <span className="text-neutral-900">Small Batch</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-3">
                  Care Instructions
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Trim wick to ¼" before each lighting</li>
                  <li>• Burn for 2-3 hours on first use</li>
                  <li>• Never leave unattended</li>
                  <li>• Keep away from drafts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-image-enter {
          animation: fadeInLeft 0.8s ease-out;
        }

        .product-info-enter {
          animation: fadeInRight 0.8s ease-out 0.2s backwards;
        }

        .notification-enter {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProductDetail;