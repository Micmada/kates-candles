import { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    expires_at: '',
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      const response = await fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts');
      const data = await response.json();
      setDiscounts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading discounts:', error);
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingDiscount 
      ? `https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts/${editingDiscount.id}`
      : 'https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts';
    
    const method = editingDiscount ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_active: true,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingDiscount(null);
        setFormData({
          code: '',
          discount_type: 'percentage',
          discount_value: '',
          expires_at: '',
        });
        loadDiscounts();
        showNotification(editingDiscount ? 'Discount updated successfully' : 'Discount created successfully');
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to save discount', 'error');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      showNotification('Failed to save discount', 'error');
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      expires_at: discount.expires_at ? discount.expires_at.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;

    try {
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadDiscounts();
        showNotification('Discount deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      showNotification('Failed to delete discount', 'error');
    }
  };

  const toggleActive = async (discount) => {
    try {
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/discounts/${discount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...discount,
          is_active: !discount.is_active,
        }),
      });

      if (response.ok) {
        loadDiscounts();
        showNotification(`Discount ${discount.is_active ? 'deactivated' : 'activated'}`);
      }
    } catch (error) {
      console.error('Error toggling discount:', error);
      showNotification('Failed to update discount status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-200 w-64"></div>
            <div className="h-64 bg-neutral-200"></div>
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
          <div className={`px-6 py-4 border ${
            notification.type === 'success' 
              ? 'bg-neutral-900 text-neutral-50 border-neutral-900' 
              : 'bg-red-50 text-red-900 border-red-600'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm tracking-wide">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 
              className="text-4xl tracking-tight font-light text-neutral-900 mb-2"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Discount Codes
            </h1>
            <div className="w-16 h-px bg-neutral-900"></div>
          </div>
          
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingDiscount(null);
              setFormData({
                code: '',
                discount_type: 'percentage',
                discount_value: '',
                expires_at: '',
              });
            }}
            className="border border-neutral-900 bg-neutral-900 text-neutral-50 px-8 py-3 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
          >
            {showForm ? 'Cancel' : 'Create Discount'}
          </button>
        </div>

        {/* Discount Form */}
        {showForm && (
          <div className="bg-white border border-neutral-200 mb-8 form-enter">
            <div className="border-b border-neutral-200 px-8 py-6">
              <h2 className="text-sm tracking-widest uppercase text-neutral-400">
                {editingDiscount ? 'Edit Discount Code' : 'Create New Discount Code'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                  Discount Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 font-mono tracking-wider uppercase focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                  placeholder="SUMMER2024"
                  required
                />
                <p className="text-xs text-neutral-500 mt-2 tracking-wide">
                  Code will be automatically converted to uppercase
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                    Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(£)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                  Expiration Date <span className="text-neutral-400">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                />
                <p className="text-xs text-neutral-500 mt-2 tracking-wide">
                  Leave empty for no expiration
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 text-neutral-50 py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
              >
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
              </button>
            </form>
          </div>
        )}

        {/* Discounts Table */}
        <div className="bg-white border border-neutral-200 overflow-hidden">
          {discounts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-neutral-500 tracking-wide">
                No discount codes yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Code</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Type</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Value</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Expires</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Status</th>
                    <th className="px-8 py-4 text-left text-xs font-normal tracking-widest text-neutral-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {discounts.map((discount, index) => (
                    <tr 
                      key={discount.id} 
                      className="hover:bg-neutral-50 transition-colors duration-200 table-row-enter"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-8 py-5">
                        <span className="font-mono text-sm tracking-wider font-medium text-neutral-900">
                          {discount.code}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-neutral-600 capitalize tracking-wide">
                          {discount.discount_type}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-neutral-900 tracking-wide">
                          {discount.discount_type === 'percentage' 
                            ? `${discount.discount_value}%` 
                            : `£${discount.discount_value}`
                          }
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-neutral-600 tracking-wide">
                          {discount.expires_at 
                            ? new Date(discount.expires_at).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : 'No expiration'
                          }
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => toggleActive(discount)}
                          className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-colors duration-300 ${
                            discount.is_active 
                              ? 'bg-neutral-900 text-neutral-50 hover:bg-neutral-800' 
                              : 'border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                          }`}
                        >
                          {discount.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(discount)}
                            className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(discount.id)}
                            className="text-xs tracking-widest uppercase text-neutral-400 hover:text-red-600 transition-colors duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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

        .notification-enter {
          animation: slideInRight 0.3s ease-out;
        }

        .form-enter {
          animation: slideDown 0.4s ease-out;
        }

        .table-row-enter {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
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

        input::placeholder {
          color: #a3a3a3;
        }
      `}</style>
    </div>
  );
}

export default Discounts;