import { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';

function Fragrances() {
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFragrance, setEditingFragrance] = useState(null);
  const [notification, setNotification] = useState(null);
  const [expandedFragrance, setExpandedFragrance] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  // Default sizes that get added to new fragrances
  const defaultSizes = [
    { size_name: '6 oz', burn_time: '30-35', price: '18.00', stock_quantity: 0 },
    { size_name: '9 oz', burn_time: '45-50', price: '28.00', stock_quantity: 0 },
    { size_name: '12 oz', burn_time: '60-70', price: '38.00', stock_quantity: 0 }
  ];

  useEffect(() => {
    loadFragrances();
  }, []);

  const loadFragrances = async () => {
    try {
      const response = await fetch('https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances');
      const data = await response.json();
      setFragrances(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading fragrances:', error);
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingFragrance 
      ? `https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances/${editingFragrance.id}`
      : 'https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances';
    
    const method = editingFragrance ? 'PUT' : 'POST';
    
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
        const fragrance = await response.json();
        
        // If creating new fragrance, add default sizes
        if (!editingFragrance) {
          for (const size of defaultSizes) {
            await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances/${fragrance.id}/sizes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...size,
                sku: `${fragrance.name.toUpperCase().replace(/\s+/g, '-')}-${size.size_name.replace(/\s+/g, '')}`
              }),
            });
          }
        }
        
        setShowForm(false);
        setEditingFragrance(null);
        setFormData({
          name: '',
          description: '',
          image_url: '',
        });
        loadFragrances();
        showNotification(editingFragrance ? 'Fragrance updated successfully' : 'Fragrance created successfully');
      } else {
        showNotification('Failed to save fragrance', 'error');
      }
    } catch (error) {
      console.error('Error saving fragrance:', error);
      showNotification('Failed to save fragrance', 'error');
    }
  };

  const handleEdit = (fragrance) => {
    setEditingFragrance(fragrance);
    setFormData({
      name: fragrance.name,
      description: fragrance.description,
      image_url: fragrance.image_url,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this fragrance? This will also delete all size variants.')) return;

    try {
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadFragrances();
        showNotification('Fragrance deleted successfully');
      } else {
        showNotification('Failed to delete fragrance', 'error');
      }
    } catch (error) {
      console.error('Error deleting fragrance:', error);
      showNotification('Failed to delete fragrance', 'error');
    }
  };

  const handleUpdateSize = async (sizeId, field, value) => {
    try {
      const fragrance = fragrances.find(f => f.sizes.some(s => s.id === sizeId));
      const size = fragrance.sizes.find(s => s.id === sizeId);
      
      const response = await fetch(`https://pprhxpttpm.us-east-1.awsapprunner.com/api/fragrances/sizes/${sizeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...size,
          [field]: value,
        }),
      });

      if (response.ok) {
        loadFragrances();
        showNotification(`Size ${field} updated`);
      }
    } catch (error) {
      console.error('Error updating size:', error);
      showNotification('Failed to update size', 'error');
    }
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
              Fragrances
            </h1>
            <div className="w-16 h-px bg-neutral-900"></div>
          </div>
          
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingFragrance(null);
              setFormData({
                name: '',
                description: '',
                image_url: '',
              });
            }}
            className="border border-neutral-900 bg-neutral-900 text-neutral-50 px-8 py-3 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
          >
            {showForm ? 'Cancel' : 'Add Fragrance'}
          </button>
        </div>

        {/* Fragrance Form */}
        {showForm && (
          <div className="bg-white border border-neutral-200 mb-8 form-enter">
            <div className="border-b border-neutral-200 px-8 py-6">
              <h2 className="text-sm tracking-widest uppercase text-neutral-400">
                {editingFragrance ? 'Edit Fragrance' : 'Add New Fragrance'}
              </h2>
              {!editingFragrance && (
                <p className="text-xs text-neutral-500 mt-1">
                  Default sizes (6 oz, 9 oz, 12 oz) will be automatically added
                </p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                  Fragrance Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                  placeholder="Enter fragrance name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300 resize-none"
                  rows="4"
                  placeholder="Enter fragrance description"
                />
              </div>

              <div>
                <label className="block text-sm tracking-wide text-neutral-600 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors duration-300"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-4 border border-neutral-200 p-4">
                    <p className="text-xs tracking-wide text-neutral-500 mb-2">Image Preview</p>
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      className="w-32 h-32 object-cover bg-neutral-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 text-neutral-50 py-4 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-300"
              >
                {editingFragrance ? 'Update Fragrance' : 'Create Fragrance'}
              </button>
            </form>
          </div>
        )}

        {/* Fragrances List */}
        <div className="space-y-6">
          {fragrances.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-16 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-neutral-500 tracking-wide">
                No fragrances yet. Add one to get started.
              </p>
            </div>
          ) : (
            fragrances.map((fragrance, index) => (
              <div 
                key={fragrance.id} 
                className="bg-white border border-neutral-200 overflow-hidden table-row-enter"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Fragrance Header */}
                <div className="p-6 flex items-center justify-between border-b border-neutral-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-20 bg-neutral-100 flex-shrink-0">
                      <img 
                        src={fragrance.image_url} 
                        alt={fragrance.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg tracking-wide text-neutral-900 mb-1">
                        {fragrance.name}
                      </h3>
                      <p className="text-sm text-neutral-500 tracking-wide line-clamp-1">
                        {fragrance.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpandedFragrance(expandedFragrance === fragrance.id ? null : fragrance.id)}
                      className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                    >
                      {expandedFragrance === fragrance.id ? 'Hide Sizes' : 'Manage Sizes'}
                    </button>
                    <button
                      onClick={() => handleEdit(fragrance)}
                      className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fragrance.id)}
                      className="text-xs tracking-widest uppercase text-neutral-400 hover:text-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Size Variants */}
                {expandedFragrance === fragrance.id && (
                  <div className="bg-neutral-50 p-6">
                    <h4 className="text-sm tracking-widest uppercase text-neutral-400 mb-4">
                      Size Variants
                    </h4>
                    <div className="space-y-3">
                      {fragrance.sizes && fragrance.sizes.map(size => (
                        <div key={size.id} className="bg-white border border-neutral-200 p-4 grid grid-cols-5 gap-4 items-center">
                          <div className="text-sm text-neutral-900 tracking-wide font-medium">
                            {size.size_name}
                          </div>
                          
                          <div>
                            <label className="text-xs text-neutral-500 tracking-wide block mb-1">Burn Time</label>
                            <input
                              type="text"
                              value={size.burn_time}
                              onChange={(e) => handleUpdateSize(size.id, 'burn_time', e.target.value)}
                              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-neutral-500 tracking-wide block mb-1">Price (£)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={size.price}
                              onChange={(e) => handleUpdateSize(size.id, 'price', e.target.value)}
                              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-neutral-500 tracking-wide block mb-1">Stock</label>
                            <input
                              type="number"
                              value={size.stock_quantity}
                              onChange={(e) => handleUpdateSize(size.id, 'stock_quantity', e.target.value)}
                              className={`w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900 ${
                                size.stock_quantity === 0 ? 'text-red-600' : size.stock_quantity <= 5 ? 'text-yellow-700' : ''
                              }`}
                            />
                          </div>
                          
                          <div className="text-xs text-neutral-500 tracking-wide">
                            SKU: {size.sku}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
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

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        input::placeholder,
        textarea::placeholder {
          color: #a3a3a3;
        }
      `}</style>
    </div>
  );
}

export default Fragrances;