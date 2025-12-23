import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51ShF4hFGhKJm1axGpeeWJLBk4OnAxDKtlAruLOlMrbQpDKf71i950E18apetqMUPbbSxWVJdTz4T66HEZRysKzit00UydT55FV');

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, discount, getSubtotal, getDiscountAmount } = useCart();

  const [clientSecret, setClientSecret] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch('http://localhost:5001/api/orders/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: getCartTotal(),
        customer_email: customerInfo.email || 'customer@example.com',
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error('Error creating payment intent:', err));
  }, [cartItems, navigate]);

  const handleSuccess = async (paymentIntentId) => {
    try {
      // Create order in database
      const orderData = {
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        total_amount: getCartTotal(),
        stripe_payment_intent_id: paymentIntentId,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <textarea
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
  {cartItems.map(item => (
    <div key={item.id} className="flex justify-between mb-2">
      <span>{item.name} x {item.quantity}</span>
      <span>£{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
    </div>
  ))}
  
  <div className="border-t pt-2 mt-2 space-y-1">
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
    
    <div className="flex justify-between font-bold text-lg pt-2 border-t">
      <span>Total:</span>
      <span>£{getCartTotal().toFixed(2)}</span>
    </div>
  </div>
</div>
        </div>

        {/* Payment Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm 
                  amount={getCartTotal()} 
                  onSuccess={handleSuccess}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;