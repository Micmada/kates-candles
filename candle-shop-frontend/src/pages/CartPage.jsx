import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal,
    getDiscountAmount,
    getCartTotal, 
    clearCart,
    discount,
    applyDiscount,
    removeDiscount 
  } = useCart();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setApplyingDiscount(true);
    setDiscountError('');
    
    try {
      const response = await fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode }),
      });
      
      if (response.ok) {
        const discountData = await response.json();
        applyDiscount(discountData);
        setDiscountCode('');
      } else {
        const error = await response.json();
        setDiscountError(error.error || 'Invalid discount code');
      }
    } catch (error) {
      setDiscountError('Failed to apply discount code');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleRemoveItem = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingItem(null);
    }, 300);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center px-8 py-16 max-w-md">
          <h1 
            className="text-5xl tracking-tight font-light text-neutral-900 mb-6"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Your Cart
          </h1>
          <div className="w-16 h-px bg-neutral-900 mx-auto mb-8"></div>
          <p className="text-neutral-500 tracking-wide mb-8">
            Your shopping cart is empty
          </p>
          <Link 
            to="/" 
            className="inline-block border border-neutral-900 text-neutral-900 px-8 py-3 text-sm tracking-widest uppercase hover:bg-neutral-900 hover:text-neutral-50 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-5xl tracking-tight font-light text-neutral-900 mb-2"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Shopping Cart
          </h1>
          <div className="w-16 h-px bg-neutral-900"></div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`bg-white border border-neutral-200 transition-all duration-300 cart-item-enter ${
                  removingItem === item.id ? 'cart-item-exit' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-6 p-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-neutral-100 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg tracking-wide text-neutral-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-500 tracking-wider">
                        £{parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-xs tracking-widest uppercase text-neutral-400">
                        Quantity
                      </span>
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 transition-colors duration-200 text-neutral-600"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-12 text-center text-sm text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 transition-colors duration-200 text-neutral-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <div 
                      className="text-2xl tracking-tight font-light text-neutral-900"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      £{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Discount Code */}
              <div className="border border-neutral-200 bg-white p-6">
                <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                  Discount Code
                </h3>
                
                {discount ? (
                  <div className="space-y-3">
                    <div className="bg-neutral-900 text-neutral-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-sm tracking-wider">
                            {discount.code}
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">
                            {discount.discount_type === 'percentage' 
                              ? `${discount.discount_value}% discount` 
                              : `£${discount.discount_value} discount`
                            }
                          </div>
                        </div>
                        <button
                          onClick={removeDiscount}
                          className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-50 transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                        placeholder="Enter code"
                        className="flex-1 border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 uppercase tracking-wider focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount || !discountCode.trim()}
                        className="border border-neutral-900 bg-neutral-900 text-neutral-50 px-6 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applyingDiscount ? '...' : 'Apply'}
                      </button>
                    </div>
                    {discountError && (
                      <p className="text-xs text-red-600 tracking-wide">{discountError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="border border-neutral-200 bg-white">
                <div className="p-6 space-y-4">
                  <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 tracking-wide">Subtotal</span>
                      <span className="text-neutral-900 tracking-wider">
                        £{getSubtotal().toFixed(2)}
                      </span>
                    </div>
                    
                    {discount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 tracking-wide">
                          Discount
                        </span>
                        <span className="text-neutral-900 tracking-wider">
                          −£{getDiscountAmount().toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 tracking-wide">Shipping</span>
                      <span className="text-neutral-900 tracking-wider">Free</span>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                      <span className="text-sm tracking-widest uppercase text-neutral-400">
                        Total
                      </span>
                      <span 
                        className="text-3xl tracking-tight font-light text-neutral-900"
                        style={{ fontFamily: "'Cormorant', serif" }}
                      >
                        £{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-neutral-200 p-6 space-y-3">
                  <Link 
                    to="/checkout"
                    className="block w-full bg-neutral-900 text-neutral-50 py-4 text-center text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="w-full border border-neutral-300 text-neutral-600 py-4 text-sm tracking-widest uppercase hover:border-neutral-900 hover:text-neutral-900 transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                  
                  <Link
                    to="/"
                    className="block w-full text-center text-sm tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-300 pt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="text-center text-xs text-neutral-500 tracking-wide space-y-2 pt-4">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

        .cart-item-enter {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        .cart-item-exit {
          animation: fadeOut 0.3s ease-out forwards;
        }

        input::placeholder {
          color: #a3a3a3;
        }

        button:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default CartPage;