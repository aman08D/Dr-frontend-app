import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';

// Professional Doctor Avatar Fallback (Agar photo upload na ho)
const DOCTOR_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233B82F6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z'/%3E%3Cpath d='M19 21v-2a7 7 0 0 0-14 0v2'/%3E%3Cpath d='M12 14v4'/%3E%3Cpath d='M10 16h4'/%3E%3C/svg%3E";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed Specialties for Filter Top-Bar
  const specialties = [
    { name: 'All', icon: '🏥' },
    { name: 'General Physician', icon: '🩺' },
    { name: 'Dentist', icon: '🦷' },
    { name: 'Cardiologist', icon: '❤️' },
    { name: 'Pediatrician', icon: '👶' },
    { name: 'Orthopedic', icon: '🦴' },
    { name: 'Dermatologist', icon: '✨' },
    { name: 'Gynecologist', icon: '🤰' },
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      // Agar active/inactive filter backend se nahi hai, toh frontend me filter kar lenge
      const activeDoctors = response.data.filter(doc => doc.isAvailable !== false);
      setDoctors(activeDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Unique Districts for Dropdown Filter
  const districts = ['All', ...new Set(doctors.map(doc => doc.district))].filter(Boolean);

  // Frontend Filtering Logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchSpecialty = selectedSpecialty === 'All' || doc.specialization?.toLowerCase() === selectedSpecialty.toLowerCase();
    const matchDistrict = selectedDistrict === 'All' || doc.district?.toLowerCase() === selectedDistrict.toLowerCase();
    const matchSearch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doc.clinicName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSpecialty && matchDistrict && matchSearch;
  });

  // =========================================================================
  // SMART WHATSAPP BOOKING HANDLER
  // Ye function Doctor ke personal DB number par direct booking bhejega
  // =========================================================================
  const handleBookAppointment = (doc) => {
    // Agar number +91 ke bina hai toh add kar do
    let phone = doc.phoneNumber;
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }

    const text = encodeURIComponent(
      `Hello, I would like to book a consultation appointment.\n\n` +
      `👨‍⚕️ *Doctor:* ${doc.name}\n` +
      `🩺 *Specialty:* ${doc.specialization}\n` +
      `🏥 *Clinic:* ${doc.clinicName}\n` +
      `📍 *Location:* ${doc.district}\n` +
      `💰 *Consultation Fee:* ₹${doc.consultationFee || 'On Request'}\n\n` +
      `Please let me know the available time slots for today/tomorrow.`
    );
    
    // Direct WhatsApp opening link
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* =================================================================== */}
      {/* HERO SECTION - Premium Blue Gradient with Search                    */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Find & Book the <span className="text-yellow-300">Best Doctors</span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-8">
            Verified specialists, trusted clinics, and hassle-free WhatsApp appointment booking in your city.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl flex shadow-xl">
            <span className="pl-4 pr-2 flex items-center text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by doctor name or clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-2 outline-none text-gray-700 font-medium bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FILTER SECTION - Horizontal Specialty Scroll & District Dropdown    */}
      {/* =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Horizontal Scrolling Specialties */}
          <div className="flex overflow-x-auto w-full md:w-3/4 gap-2 pb-2 scrollbar-hide">
            {specialties.map((spec) => (
              <button
                key={spec.name}
                onClick={() => setSelectedSpecialty(spec.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedSpecialty === spec.name
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{spec.icon}</span> {spec.name}
              </button>
            ))}
          </div>

          {/* District Dropdown */}
          <div className="w-full md:w-1/4 min-w-[150px]">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
      {/* DOCTOR LIST GRID                                                    */}
      {/* =================================================================== */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Loading expert doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl border border-gray-100 shadow-sm mt-8">
            <span className="text-5xl mb-4 inline-block">👨‍⚕️</span>
            <h3 className="text-xl font-bold text-gray-800">No doctors found</h3>
            <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
            <button 
              onClick={() => { setSelectedSpecialty('All'); setSelectedDistrict('All'); setSearchQuery(''); }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
            
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                
                {/* Doctor Basic Info (Top Row) */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-blue-50 rounded-full border-2 border-white shadow-md overflow-hidden relative">
                    <img
                      src={doc.profileImgUrl || DOCTOR_AVATAR_SVG}
                      alt={doc.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = DOCTOR_AVATAR_SVG; }}
                      className="w-full h-full object-cover"
                    />
                    {/* Verified Blue Tick */}
                    <div className="absolute bottom-0 right-1 bg-white rounded-full">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    </div>
                  </div>

                  {/* Name & Specialization */}
                  <div className="pt-1">
                    <h2 className="text-lg font-black text-gray-900 leading-tight">
                      {doc.name}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 mt-0.5">
                      {doc.qualification}
                    </p>
                    <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wide border border-blue-100">
                      {doc.specialization}
                    </div>
                  </div>
                </div>

                {/* Clinic Info (Middle Row) */}
                <div className="bg-gray-50 rounded-xl p-3.5 mb-4 flex-1 border border-gray-100">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-gray-400 mt-0.5">🏥</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{doc.clinicName}</h4>
                      <p className="text-xs font-medium text-gray-500">{doc.address}, {doc.district}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">🕒</span>
                    <p className="text-xs font-bold text-gray-700">{doc.availableTiming}</p>
                  </div>
                </div>

                {/* Bottom Row - Fee & Booking Button */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-3 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Consultation Fee</span>
                    <span className="text-lg font-black text-green-700 leading-none">
                      {doc.consultationFee ? `₹${doc.consultationFee}` : 'On Call'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBookAppointment(doc)}
                    className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-md shadow-green-200 transition-all flex justify-center items-center gap-2"
                  >
                    <span>💬</span> Book Now
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

export default Doctors;