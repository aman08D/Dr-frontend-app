import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';

// Professional Worker Avatar Fallback (Urban Company style)
const WORKER_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F59E0B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3Cpolyline points='7.5 4.21 12 6.81 16.5 4.21'/%3E%3Cpolyline points='7.5 19.79 7.5 14.6 3 12'/%3E%3Cpolyline points='21 12 16.5 14.6 16.5 19.79'/%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'/%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'/%3E%3C/svg%3E";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed Skills for Filter Top-Bar
  const skills = [
    { name: 'All', icon: '👷' },
    { name: 'Electrician', icon: '⚡' },
    { name: 'Plumber', icon: '🔧' },
    { name: 'Carpenter', icon: '🪚' },
    { name: 'Painter', icon: '🎨' },
    { name: 'AC Technician', icon: '❄️' },
    { name: 'Mason', icon: '🧱' },
    { name: 'Labour', icon: '💪' },
  ];

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workers`);
      // Hide unavailable workers by default
      const activeWorkers = response.data.filter(w => w.isAvailable !== false);
      setWorkers(activeWorkers);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const districts = ['All', ...new Set(workers.map(w => w.district))].filter(Boolean);

  const filteredWorkers = workers.filter((w) => {
    const matchSkill = selectedSkill === 'All' || w.skill?.toLowerCase() === selectedSkill.toLowerCase();
    const matchDistrict = selectedDistrict === 'All' || w.district?.toLowerCase() === selectedDistrict.toLowerCase();
    const matchSearch = w.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        w.cityOrArea?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSkill && matchDistrict && matchSearch;
  });

  // =========================================================================
  // WHATSAPP HIRING HANDLER
  // =========================================================================
  const handleHireWorker = (worker) => {
    let phone = worker.phoneNumber;
    if (!phone.startsWith('91') && phone.length === 10) phone = '91' + phone;

    const rateText = worker.dailyRate ? `₹${worker.dailyRate}/day` : worker.hourlyRate ? `₹${worker.hourlyRate}/hour` : 'Negotiable';
    
    const text = encodeURIComponent(
      `Hi ${worker.name}, I found your profile on the DR Services App.\n\n` +
      `🛠️ *Skill:* ${worker.skill}\n` +
      `📍 *Location:* ${worker.cityOrArea ? worker.cityOrArea + ', ' : ''}${worker.district}\n` +
      `💰 *Estimated Rate:* ${rateText}\n\n` +
      `I have some work and would like to hire you. Please let me know your availability.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* =================================================================== */}
      {/* HERO SECTION - Vibrant Amber/Orange Theme                           */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 opacity-10 text-9xl">⚙️</div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Hire Trusted <span className="text-orange-900 bg-white px-3 py-1 rounded-lg">Local Experts</span>
          </h1>
          <p className="text-orange-50 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-8">
            Electricians, Plumbers, Carpenters & more. Verified professionals ready to work in your area.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl flex shadow-xl border-4 border-white/20">
            <span className="pl-4 pr-2 flex items-center text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by worker name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-2 outline-none text-gray-800 font-bold bg-transparent placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FILTER SECTION - Horizontal Scroll & Dropdown                       */}
      {/* =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <div className="flex overflow-x-auto w-full md:w-3/4 gap-2 pb-2 scrollbar-hide">
            {skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => setSelectedSkill(skill.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  selectedSkill === skill.name
                    ? 'bg-orange-50 text-orange-700 border-orange-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{skill.icon}</span> {skill.name}
              </button>
            ))}
          </div>

          <div className="w-full md:w-1/4 min-w-[150px]">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 text-gray-700 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
            >
              <option value="All">📍 All Districts</option>
              {districts.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* WORKERS GRID                                                        */}
      {/* =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Finding best professionals...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl border border-gray-100 shadow-sm mt-8">
            <span className="text-6xl mb-4 inline-block opacity-50">👷‍♂️</span>
            <h3 className="text-xl font-bold text-gray-800">No workers found</h3>
            <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
            <button 
              onClick={() => { setSelectedSkill('All'); setSelectedDistrict('All'); setSearchQuery(''); }}
              className="mt-4 bg-orange-100 text-orange-700 font-bold px-6 py-2 rounded-lg hover:bg-orange-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            
            {filteredWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
                
                {/* Top Banner (Orange strip) */}
                <div className="h-12 bg-gradient-to-r from-orange-100 to-amber-50"></div>

                <div className="px-5 pb-5 flex-1 flex flex-col relative">
                  
                  {/* Floating Avatar & Rating */}
                  <div className="flex justify-between items-end -mt-8 mb-3">
                    <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-md border border-gray-100">
                      <img
                        src={worker.profileImgUrl || WORKER_AVATAR_SVG}
                        alt={worker.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = WORKER_AVATAR_SVG; }}
                        className="w-full h-full object-cover rounded-xl bg-gray-50"
                      />
                    </div>
                    {worker.rating && (
                      <div className="bg-gray-900 text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 mb-2 shadow-md">
                        <span className="text-yellow-400 text-[10px]">⭐</span> {worker.rating}
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-black text-gray-900 line-clamp-1">{worker.name}</h2>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Available"></span>
                    </div>
                    
                    <div className="inline-block bg-orange-100 text-orange-800 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-3">
                      {worker.skill}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🏅</span>
                        <span>{worker.experienceYears ? `${worker.experienceYears}+ Years Exp.` : 'Experienced'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📍</span>
                        <span className="line-clamp-1">{worker.cityOrArea ? `${worker.cityOrArea}, ` : ''}{worker.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Estimated Charge</p>
                      <p className="text-base font-black text-gray-900 leading-none mt-1">
                        {worker.dailyRate ? `₹${worker.dailyRate}` : worker.hourlyRate ? `₹${worker.hourlyRate}` : 'Price on Call'}
                        <span className="text-xs text-gray-500 font-medium ml-1">
                          {worker.dailyRate ? '/ day' : worker.hourlyRate ? '/ hr' : ''}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleHireWorker(worker)}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 group"
                  >
                    <span className="text-green-400 text-lg group-hover:scale-110 transition-transform">💬</span> Hire on WhatsApp
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workers;