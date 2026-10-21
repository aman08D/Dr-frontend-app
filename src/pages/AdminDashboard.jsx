import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Products & Printing',
      description: 'Manage School Products, Stationery, and Custom Printing Services.',
      icon: '🛍️',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      path: '/admin/products'
    },
    {
      title: 'Doctor Directory',
      description: 'Add, Edit or Delete Verified Doctors, Clinics, and Consultation Fees.',
      icon: '👨‍⚕️',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      path: '/admin/doctors'
    },
    {
      title: 'Manpower Supply',
      description: 'Manage Electricians, Plumbers, and Labourers. (Coming Soon)',
      icon: '👷',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      path: '/admin/workers'
    },
    {
      title: 'Event Venues',
      description: 'Manage Marriage Halls, Banquet Halls, and Lawns. (Coming Soon)',
      icon: '🏛️',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      path: '/admin/venues'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Admin Control Panel ⚙️
          </h1>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Select a module below to manage its data, entries, and settings.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-start gap-5"
            >
              {/* Icon Box */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border ${module.color}`}>
                {module.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {module.description}
                </p>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                  <span>Manage Data</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;