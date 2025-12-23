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
    <div className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 border-b-2 ${
                location.pathname === item.path
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminNav;