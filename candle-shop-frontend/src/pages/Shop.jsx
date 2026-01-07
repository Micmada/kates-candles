import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Shop() {
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch fragrances with their size variants
    fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances')
      .then(res => res.json())
      .then(data => {
        setFragrances(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fragrances:', err);
        setLoading(false);
      });
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleQuickAdd = (fragrance, sizeVariant) => {
    // Create cart item from fragrance + size variant
    const cartItem = {
      id: sizeVariant.id, // Use the variant ID as the cart item ID
      fragrance_id: fragrance.id,
      name: `${fragrance.name} - ${sizeVariant.size_name}`,
      price: sizeVariant.price,
      size: sizeVariant.size_name,
      burnTime: sizeVariant.burn_time,
      image_url: fragrance.image_url,
      stock_quantity: sizeVariant.stock_quantity
    };
    
    addToCart(cartItem);
    showNotification(`${fragrance.name} (${sizeVariant.size_name}) added to cart`);
  };

  // Get the lowest price from available sizes
  const getStartingPrice = (fragrance) => {
    if (!fragrance.sizes || fragrance.sizes.length === 0) return 0;
    const prices = fragrance.sizes.map(s => parseFloat(s.price));
    return Math.min(...prices);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 w-2/3"></div>
                  <div className="h-3 bg-neutral-200 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <h1 
            className="text-5xl tracking-tight font-light text-neutral-900 mb-2"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Our Collection
          </h1>
          <div className="w-16 h-px bg-neutral-900"></div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        {fragrances.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-neutral-400 tracking-wide">No fragrances available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {fragrances.map((fragrance, index) => (
              <div 
                key={fragrance.id}
                className="group product-card"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredProduct(fragrance.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image - Clickable to product page */}
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-6">
                  <Link to={`/product/${fragrance.id}`} className="block w-full h-full">
                    <img 
                      src={fragrance.image_url} 
                      alt={fragrance.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Quick Add Overlay - appears on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="space-y-2">
                      {fragrance.sizes && fragrance.sizes.length > 0 ? (
                        <>
                          {fragrance.sizes.map((sizeVariant) => {
                            const isInStock = sizeVariant.stock_quantity > 0;
                            
                            return (
                              <button
                                key={sizeVariant.id}
                                onClick={() => isInStock && handleQuickAdd(fragrance, sizeVariant)}
                                disabled={!isInStock}
                                className={`w-full border p-3 transition-all duration-300 group/size ${
                                  isInStock
                                    ? 'bg-white border-neutral-200 hover:bg-neutral-900 hover:text-neutral-50 hover:border-neutral-900 cursor-pointer'
                                    : 'bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between text-sm">
                                  <div className="text-left">
                                    <span className="tracking-wide font-medium">{sizeVariant.size_name}</span>
                                    <span className="text-xs text-neutral-500 group-hover/size:text-neutral-300 ml-2">
                                      {sizeVariant.burn_time}h
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="tracking-wider">£{parseFloat(sizeVariant.price).toFixed(2)}</span>
                                    {!isInStock && (
                                      <span className="text-xs text-red-600 uppercase tracking-wider">Out of Stock</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </>
                      ) : (
                        <div className="bg-neutral-100 border border-neutral-200 p-4 text-center">
                          <span className="text-sm text-neutral-500 tracking-wide">No sizes available</span>
                        </div>
                      )}
                      
                      {/* View Details Link */}
                      <Link
                        to={`/product/${fragrance.id}`}
                        className="block w-full text-center bg-neutral-900 text-neutral-50 p-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <Link to={`/product/${fragrance.id}`}>
                    <h3 className="text-lg tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors duration-300">
                      {fragrance.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                    {fragrance.description}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-sm tracking-wider text-neutral-900">
                      From £{getStartingPrice(fragrance).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-card {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .notification-enter {
          animation: slideDown 0.4s ease-out;
        }

        .modal-enter {
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content-enter {
          animation: slideUp 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Shop;