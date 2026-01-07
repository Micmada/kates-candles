import { useState, useEffect } from 'react';
import { getOrders, getProducts } from '../../utils/api';
import AdminNav from '../../components/AdminNav';

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav />
      
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-baseline gap-4 mb-2">
            <h1 
              className="text-4xl tracking-tight font-light text-neutral-900"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Dashboard
            </h1>
            <span className="text-sm tracking-wide text-neutral-400">
              Overview & Analytics
            </span>
          </div>
          <div className="w-16 h-px bg-neutral-900"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-neutral-200 p-8 animate-pulse">
                <div className="h-4 bg-neutral-200 w-1/2 mb-4"></div>
                <div className="h-8 bg-neutral-200 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Total Orders */}
              <div className="bg-white border border-neutral-200 p-8 group hover:border-neutral-900 transition-colors duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-xs tracking-widest uppercase text-neutral-400">
                    Total Orders
                  </div>
                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                    <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div 
                  className="text-5xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {stats.totalOrders}
                </div>
                <div className="mt-2 text-xs text-neutral-500 tracking-wide">
                  Lifetime orders placed
                </div>
              </div>

              {/* Total Products */}
              <div className="bg-white border border-neutral-200 p-8 group hover:border-neutral-900 transition-colors duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-xs tracking-widest uppercase text-neutral-400">
                    Products
                  </div>
                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                    <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div 
                  className="text-5xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {stats.totalProducts}
                </div>
                <div className="mt-2 text-xs text-neutral-500 tracking-wide">
                  Active in catalog
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white border border-neutral-200 p-8 group hover:border-neutral-900 transition-colors duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-xs tracking-widest uppercase text-neutral-400">
                    Revenue
                  </div>
                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                    <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-50 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div 
                  className="text-5xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  £{stats.totalRevenue.toFixed(0)}
                </div>
                <div className="mt-2 text-xs text-neutral-500 tracking-wide">
                  Total sales generated
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-neutral-200">
              <div className="border-b border-neutral-200 px-8 py-6">
                <h2 className="text-sm tracking-widest uppercase text-neutral-400">
                  Quick Actions
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <a 
                  href="/admin/products" 
                  className="group p-8 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg tracking-wide text-neutral-900 mb-2">
                    Manage Products
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Add new products, update pricing, manage inventory and product details
                  </p>
                </a>

                <a 
                  href="/admin/orders" 
                  className="group p-8 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg tracking-wide text-neutral-900 mb-2">
                    View Orders
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Process customer orders, update fulfillment status and manage shipments
                  </p>
                </a>

                <a 
                  href="/admin/discounts" 
                  className="group p-8 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg tracking-wide text-neutral-900 mb-2">
                    Discount Codes
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Create promotional codes, set discount amounts and manage active campaigns
                  </p>
                </a>

                <a 
                  href="/admin/settings" 
                  className="group p-8 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg tracking-wide text-neutral-900 mb-2">
                    Settings
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Configure store settings, shipping options and payment integrations
                  </p>
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');

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

export default Dashboard;