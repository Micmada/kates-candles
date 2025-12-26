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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-6 border-b last:border-b-0">
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">£{item.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            
            <div className="text-lg font-semibold w-24 text-right">
              £{(parseFloat(item.price) * item.quantity).toFixed(2)}
            </div>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="p-6 bg-gray-50 space-y-4">
          {/* Discount Code Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Have a discount code?</label>
            {discount ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                <div>
                  <span className="font-mono font-bold text-green-700">{discount.code}</span>
                  <span className="text-green-600 ml-2">
                    ({discount.discount_type === 'percentage' 
                      ? `${discount.discount_value}% off` 
                      : `£${discount.discount_value} off`
                    })
                  </span>
                </div>
                <button
                  onClick={removeDiscount}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 uppercase"
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={applyingDiscount || !discountCode.trim()}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
                >
                  {applyingDiscount ? 'Applying...' : 'Apply'}
                </button>
              </div>
            )}
            {discountError && (
              <p className="text-red-600 text-sm mt-1">{discountError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>£{getSubtotal().toFixed(2)}</span>
            </div>
            
            {discount && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount.code}):</span>
                <span>-£{getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xl font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-blue-600">£{getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded hover:bg-gray-400"
            >
              Clear Cart
            </button>
            <Link 
              to="/checkout"
              className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;