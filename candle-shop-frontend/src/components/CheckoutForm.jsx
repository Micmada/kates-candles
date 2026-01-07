import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

function CheckoutForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful');
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="payment-element-wrapper">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>
      
      {/* Error/Success Message */}
      {message && (
        <div className={`border px-6 py-4 ${
          message.includes('successful') 
            ? 'border-neutral-900 bg-neutral-50 text-neutral-900' 
            : 'border-red-600 bg-red-50 text-red-900'
        }`}>
          <div className="flex items-start gap-3">
            {message.includes('successful') ? (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm tracking-wide leading-relaxed">
              {message}
            </span>
          </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-neutral-900 text-neutral-50 py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-4 h-4 border-2 border-neutral-50 border-t-transparent rounded-full animate-spin"></span>
            <span>Processing Payment</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Complete Order</span>
            <span className="text-xs">·</span>
            <span 
              className="font-light tracking-tight text-base"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              £{amount.toFixed(2)}
            </span>
          </span>
        )}
        
        {/* Hover effect */}
        <span className="absolute inset-0 bg-neutral-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10"></span>
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 tracking-wide pt-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Payments secured by Stripe</span>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Custom styling for Stripe Payment Element */
        .payment-element-wrapper {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </form>
  );
}

export default CheckoutForm;