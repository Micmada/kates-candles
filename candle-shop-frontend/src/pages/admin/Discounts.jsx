import { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
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
      const response = await fetch('http://localhost:5001/api/discounts');
      const data = await response.json();
      setDiscounts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading discounts:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingDiscount 
      ? `http://localhost:5001/api/discounts/${editingDiscount.id}`
      : 'http://localhost:5001/api/discounts';
    
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
        alert(editingDiscount ? 'Discount updated!' : 'Discount created!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save discount');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Failed to save discount');
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
      const response = await fetch(`http://localhost:5001/api/discounts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadDiscounts();
        alert('Discount deleted!');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      alert('Failed to delete discount');
    }
  };

  const toggleActive = async (discount) => {
    try {
      const response = await fetch(`http://localhost:5001/api/discounts/${discount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...discount,
          is_active: !discount.is_active,
        }),
      });

      if (response.ok) {
        loadDiscounts();
      }
    } catch (error) {
      console.error('Error toggling discount:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Discount Codes</h1>
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create Discount Code'}
          </button>
        </div>

        {/* Discount Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingDiscount ? 'Edit Discount Code' : 'Create New Discount Code'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Discount Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
                  placeholder="SUMMER2024"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Code will be automatically converted to uppercase</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(£)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
              </button>
            </form>
          </div>
        )}

        {/* Discounts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {discounts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No discount codes yet. Create one to get started!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discounts.map(discount => (
                  <tr key={discount.id}>
                    <td className="px-6 py-4 font-mono font-bold">{discount.code}</td>
                    <td className="px-6 py-4 capitalize">{discount.discount_type}</td>
                    <td className="px-6 py-4">
                      {discount.discount_type === 'percentage' 
                        ? `${discount.discount_value}%` 
                        : `£${discount.discount_value}`
                      }
                    </td>
                    <td className="px-6 py-4">
                      {discount.expires_at 
                        ? new Date(discount.expires_at).toLocaleDateString()
                        : 'No expiration'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(discount)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          discount.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {discount.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(discount)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(discount.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discounts;