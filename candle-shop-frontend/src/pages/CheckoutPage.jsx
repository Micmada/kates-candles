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
    fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/orders/create-payment-intent', {
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

      const response = await fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        clearCart();
        navigate('/', { state: { orderSuccess: true } });
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#171717',
      colorBackground: '#fafafa',
      colorText: '#171717',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '0px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (cartItems.length === 0) {
    return null;
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
            Checkout
          </h1>
          <div className="w-16 h-px bg-neutral-900"></div>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Customer Information - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Shipping Information */}
            <div>
              <h2 className="text-sm tracking-widest uppercase text-neutral-400 mb-6">
                Shipping Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                      placeholder="+44"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300 resize-none"
                    rows="4"
                    placeholder="Street address, city, postal code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-sm tracking-widest uppercase text-neutral-400 mb-6">
                Payment Details
              </h2>
              <div className="border border-neutral-200 bg-white p-6">
                {clientSecret ? (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm 
                      amount={getCartTotal()} 
                      onSuccess={handleSuccess}
                    />
                  </Elements>
                ) : (
                  <div className="py-8 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm text-neutral-500 tracking-wide">Loading payment form...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-sm tracking-widest uppercase text-neutral-400 mb-6">
                Order Summary
              </h2>
              
              <div className="border border-neutral-200 bg-white">
                {/* Cart Items */}
                <div className="p-6 space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-neutral-100 last:border-0">
                      <div className="flex-1">
                        <p className="text-neutral-900 tracking-wide">{item.name}</p>
                        <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-neutral-900 tracking-wider">
                        £{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-neutral-200 p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 tracking-wide">Subtotal</span>
                    <span className="text-neutral-900 tracking-wider">£{getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {discount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 tracking-wide">
                        Discount <span className="text-xs">({discount.code})</span>
                      </span>
                      <span className="text-neutral-900 tracking-wider">-£{getDiscountAmount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 tracking-wide">Shipping</span>
                    <span className="text-neutral-900 tracking-wider">Free</span>
                  </div>
                  
                  <div className="pt-3 border-t border-neutral-200 flex justify-between">
                    <span className="text-sm tracking-widest uppercase text-neutral-400">Total</span>
                    <span 
                      className="text-2xl tracking-tight font-light text-neutral-900"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      £{getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-neutral-200 p-6 space-y-3 bg-neutral-50">
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="tracking-wide">Secure checkout powered by Stripe</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="tracking-wide">Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="tracking-wide">30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        input::placeholder,
        textarea::placeholder {
          color: #a3a3a3;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default CheckoutPage;