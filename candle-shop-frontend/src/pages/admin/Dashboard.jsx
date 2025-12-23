import { useState, useEffect } from 'react';
import { getOrders, getProducts } from '../../utils/api';
import AdminNav from '../../components/AdminNav';

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch orders and products to calculate stats
    Promise.all([getOrders(), getProducts()])
      .then(([orders, products]) => {
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + parseFloat(order.total_amount);
        }, 0);

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue: totalRevenue,
        });
      })
      .catch(err => console.error('Error loading stats:', err));
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Products</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">£{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/admin/products" 
              className="block p-4 border-2 border-gray-200 rounded hover:border-blue-600 hover:bg-blue-50"
            >
              <h3 className="font-semibold text-lg">Manage Products</h3>
              <p className="text-gray-600">Add, edit, or remove products</p>
            </a>
            <a 
              href="/admin/orders" 
              className="block p-4 border-2 border-gray-200 rounded hover:border-blue-600 hover:bg-blue-50"
            >
              <h3 className="font-semibold text-lg">View Orders</h3>
              <p className="text-gray-600">Process and manage orders</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;