import { useState, useEffect } from 'react';
import { getOrders } from '../../utils/api';
import AdminNav from '../../components/AdminNav';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getOrders()
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading orders:', err);
        setLoading(false);
      });
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/orders/${orderId}`);
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        loadOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          viewOrderDetails(orderId);
        }
        showNotification('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Failed to update order status');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'border-yellow-600 text-yellow-700 bg-yellow-50',
      paid: 'border-neutral-900 text-neutral-900 bg-neutral-50',
      processing: 'border-blue-600 text-blue-700 bg-blue-50',
      shipped: 'border-purple-600 text-purple-700 bg-purple-50',
      delivered: 'border-green-600 text-green-700 bg-green-50',
      cancelled: 'border-red-600 text-red-700 bg-red-50',
    };
    return styles[status] || 'border-neutral-300 text-neutral-600 bg-neutral-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-200 w-64"></div>
            <div className="h-96 bg-neutral-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav />

      {/* Notification */}
      {notification && (
        <div className="fixed top-8 right-8 z-50 notification-enter">
          <div className="bg-neutral-900 text-neutral-50 border border-neutral-900 px-6 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm tracking-wide">{notification}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-4xl tracking-tight font-light text-neutral-900 mb-2"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Orders
          </h1>
          <div className="w-16 h-px bg-neutral-900"></div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-neutral-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-neutral-500 tracking-wide">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Order ID</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Customer</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Total</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Date</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-neutral-50 transition-colors duration-200 table-row-enter"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-8 py-5">
                        <span className="font-mono text-sm tracking-wider text-neutral-600">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm text-neutral-900 tracking-wide">{order.customer_name}</div>
                        <div className="text-xs text-neutral-500 tracking-wide mt-0.5">{order.customer_email}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-neutral-900 tracking-wide">
                          £{parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-block px-3 py-1 border text-xs tracking-wider uppercase ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-neutral-600 tracking-wide">
                          {new Date(order.created_at).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50 modal-enter">
            <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto modal-content-enter">
              {/* Modal Header */}
              <div className="border-b border-neutral-200 px-8 py-6 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 
                    className="text-3xl tracking-tight font-light text-neutral-900"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    Order Details
                  </h2>
                  <p className="text-sm text-neutral-500 tracking-wide mt-1 font-mono">
                    #{selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 transition-colors duration-300"
                >
                  <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Customer Information */}
                <div>
                  <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                    Customer Information
                  </h3>
                  <div className="border border-neutral-200 bg-neutral-50 p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500 tracking-wide">Name</span>
                      <span className="text-sm text-neutral-900 tracking-wide">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500 tracking-wide">Email</span>
                      <span className="text-sm text-neutral-900 tracking-wide">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500 tracking-wide">Phone</span>
                      <span className="text-sm text-neutral-900 tracking-wide">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-sm text-neutral-500 tracking-wide block mb-1">Shipping Address</span>
                      <span className="text-sm text-neutral-900 tracking-wide">{selectedOrder.shipping_address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map(item => (
                      <div key={item.id} className="border border-neutral-200 p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-neutral-100 flex-shrink-0">
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex justify-between items-start">
                            <div>
                              <p className="text-sm tracking-wide text-neutral-900 mb-1">{item.name}</p>
                              <p className="text-xs text-neutral-500 tracking-wide">
                                Quantity: {item.quantity} × £{parseFloat(item.price_at_purchase).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm text-neutral-900 tracking-wide font-medium">
                              £{(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm tracking-widest uppercase text-neutral-400">
                      Order Total
                    </span>
                    <span 
                      className="text-3xl tracking-tight font-light text-neutral-900"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      £{parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                    Update Status
                  </h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 tracking-wide focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .notification-enter {
          animation: slideInRight 0.3s ease-out;
        }

        .table-row-enter {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .modal-enter {
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content-enter {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default Orders;