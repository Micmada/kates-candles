import { Link, useLocation } from 'react-router-dom';

function AdminNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/discounts', label: 'Discounts' },
  ];
  
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between py-6">
          {/* Admin Logo/Title */}
          <Link 
            to="/admin" 
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div 
                className="text-xl tracking-tight font-light text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Kate's Candles
              </div>
              <div className="text-xs tracking-wider text-neutral-400 uppercase">
                Admin Panel
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-3 text-sm tracking-wide transition-all duration-300 relative group ${
                    isActive
                      ? 'text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {item.label}
                  
                  {/* Active indicator */}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-px bg-neutral-900 transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Back to Store Link */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400&family=Inter:wght@300;400&display=swap');
      `}</style>
    </div>
  );
}

export default AdminNav;