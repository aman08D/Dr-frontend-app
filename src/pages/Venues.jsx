import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';
const API_EVENTS = `${API_BASE_URL}/events`;

const VENUE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D946EF' stroke-width='1.5'%3E%3Cpath d='M3 21h18'/%3E%3Cpath d='M5 21V7l7-4 7 4v14'/%3E%3Cpath d='M9 21v-6h6v6'/%3E%3C/svg%3E";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const serviceTypes = [
    { name: 'All', icon: '🏛️' },
    { name: 'Venue', icon: '🏰' },
    { name: 'Decorations', icon: '🌸' },
    { name: 'Catering', icon: '🍽️' },
    { name: 'DJ', icon: '🎧' },
    { name: 'Photography', icon: '📸' },
  ];

  const eventTypes = [
    { name: 'All', icon: '✨' },
    { name: 'Wedding', icon: '💍' },
    { name: 'Birthday', icon: '🎂' },
    { name: 'Corporate', icon: '💼' },
    { name: 'Reception', icon: '🥂' },
    { name: 'Engagement', icon: '💕' },
  ];

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await axios.get(API_EVENTS);
      // fallback if endpoint is /event-venues
      const data = Array.isArray(res.data) ? res.data : [];
      setVenues(data.filter((v) => v.isAvailable !== false));
    } catch (err) {
      // try alternate endpoint
      try {
        const res2 = await axios.get(API_EVENTS);
        setVenues((res2.data || []).filter((v) => v.isAvailable !== false));
      } catch (e) {
        console.error('Error fetching venues:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const districts = ['All', ...new Set(venues.map((v) => v.district).filter(Boolean))];

  const filtered = venues.filter((v) => {
    const matchService =
      selectedService === 'All' ||
      v.serviceType?.toLowerCase() === selectedService.toLowerCase();
    const matchEvent =
      selectedEvent === 'All' ||
      v.eventType?.toLowerCase() === selectedEvent.toLowerCase();
    const matchDistrict =
      selectedDistrict === 'All' ||
      v.district?.toLowerCase() === selectedDistrict.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      v.name?.toLowerCase().includes(q) ||
      v.address?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q);
    return matchService && matchEvent && matchDistrict && matchSearch;
  });

  // WhatsApp Booking
  const handleBookVenue = (v) => {
    let phone = v.contactNumber || '';
    if (phone && !phone.startsWith('91') && phone.length === 10) phone = '91' + phone;

    const text = encodeURIComponent(
      `Hello, I want to book an event service.\n\n` +
        `🏛️ *Name:* ${v.name}\n` +
        `🎯 *Service:* ${v.serviceType || 'Venue'}\n` +
        `🎉 *Event Type:* ${v.eventType || 'General'}\n` +
        `📍 *Location:* ${v.address || ''}${v.district ? ', ' + v.district : ''}\n` +
        `👥 *Capacity:* ${v.capacity ? v.capacity + ' guests' : 'N/A'}\n` +
        `💰 *Price/Day:* ${v.pricePerDay ? '₹' + v.pricePerDay : 'On Request'}\n\n` +
        `Please share availability and package details.`
    );
    window.open(`https://wa.me/${phone || '919876543210'}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* HERO */}
      <div className="bg-gradient-to-r from-fuchsia-700 via-pink-600 to-rose-500 pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-4 right-6 text-8xl opacity-10">🎊</div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Book Perfect <span className="bg-white text-fuchsia-700 px-3 py-1 rounded-xl">Event Venues</span>
          </h1>
          <p className="text-pink-100 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-8">
            Marriage halls, banquet lawns, décor, catering & DJ — all in one place for your special day.
          </p>
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl flex shadow-xl">
            <span className="pl-4 pr-2 flex items-center text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search hall, décor, catering..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-2 outline-none text-gray-800 font-bold bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 space-y-3">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Service Type</p>
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
            {serviceTypes.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedService(s.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedService === s.name
                    ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Type</p>
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {eventTypes.map((e) => (
                <button
                  key={e.name}
                  onClick={() => setSelectedEvent(e.name)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedEvent === e.name
                      ? 'bg-pink-50 text-pink-700 border-pink-400'
                      : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span>{e.icon}</span> {e.name}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-48">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">District</p>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-fuchsia-500"
            >
              <option value="All">📍 All Districts</option>
              {districts.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-fuchsia-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Loading venues...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl border shadow-sm mt-4">
            <span className="text-5xl mb-3 inline-block">🏛️</span>
            <h3 className="text-xl font-bold text-gray-800">No venues found</h3>
            <p className="text-gray-500 mt-2 text-sm">Try changing filters or search.</p>
            <button
              onClick={() => {
                setSelectedService('All');
                setSelectedEvent('All');
                setSelectedDistrict('All');
                setSearchQuery('');
              }}
              className="mt-4 text-fuchsia-600 font-bold hover:underline text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={v.imageUrl || VENUE_PLACEHOLDER}
                    alt={v.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = VENUE_PLACEHOLDER;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {v.serviceType && (
                      <span className="bg-white/95 text-fuchsia-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                        {v.serviceType}
                      </span>
                    )}
                    {v.eventType && (
                      <span className="bg-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
                        {v.eventType}
                      </span>
                    )}
                  </div>
                  {v.capacity > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      👥 {v.capacity} guests
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-black text-gray-900 leading-tight mb-1 line-clamp-1">
                    {v.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-1">
                    📍 {v.address}{v.district ? `, ${v.district}` : ''}
                  </p>

                  {v.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                      {v.description}
                    </p>
                  )}

                  {/* Attributes highlights */}
                  {v.attributes && Object.keys(v.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Object.entries(v.attributes).slice(0, 3).map(([k, val]) => (
                        <span
                          key={k}
                          className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded"
                        >
                          {k}: {String(val)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Per Day</p>
                      <p className="text-lg font-black text-fuchsia-700 leading-none">
                        {v.pricePerDay ? `₹${Number(v.pricePerDay).toLocaleString('en-IN')}` : 'On Call'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookVenue(v)}
                      className="flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-md flex justify-center items-center gap-2"
                    >
                      <span>💬</span> Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;