import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';
const API_VENUES = `${API_BASE_URL}/events`; // change to /event-venues if needed
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/g2vyzd9r/image/upload';
const UPLOAD_PRESET = 'dr_preset';

const NO_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const AdminVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFilter, setListFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    eventType: '',
    district: '',
    address: '',
    capacity: '',
    pricePerDay: '',
    contactNumber: '',
    description: '',
    imageUrl: '',
    isAvailable: true,
    attributes: {},
  });

  const [attrKey, setAttrKey] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.get(API_VENUES);
      } catch {
        res = await axios.get(`${API_BASE_URL}/events`);
      }
      const sorted = (res.data || []).sort((a, b) => b.id - a.id);
      setVenues(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setFormData((p) => ({ ...p, imageUrl: '' }));
    }
  };

  const cleanWebImageUrl = (url) => {
    if (!url) return '';
    try {
      const u = url.split('?')[0];
      if (u.includes('google.com') || u.includes('drive.google.com')) return '';
      return u;
    } catch {
      return '';
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await axios.post(CLOUDINARY_URL, data);
      return res.data.secure_url;
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
      return null;
    }
  };

  const addAttribute = () => {
    if (!attrKey || !attrValue) return;
    setFormData((p) => ({
      ...p,
      attributes: { ...p.attributes, [attrKey]: attrValue },
    }));
    setAttrKey('');
    setAttrValue('');
  };

  const removeAttribute = (key) => {
    const next = { ...formData.attributes };
    delete next[key];
    setFormData((p) => ({ ...p, attributes: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalUrl = formData.imageUrl;
    if (imageFile) {
      const up = await uploadToCloudinary(imageFile);
      if (!up) {
        setIsUploading(false);
        return;
      }
      finalUrl = up;
    } else if (finalUrl) {
      finalUrl = cleanWebImageUrl(finalUrl);
    }

    const payload = {
      name: formData.name.trim(),
      serviceType: formData.serviceType.trim(),
      eventType: formData.eventType.trim() || null,
      district: formData.district.trim(),
      address: formData.address.trim(),
      capacity: formData.capacity !== '' ? parseInt(formData.capacity, 10) : 0,
      pricePerDay: formData.pricePerDay !== '' ? parseFloat(formData.pricePerDay) : 0,
      contactNumber: formData.contactNumber.trim(),
      description: formData.description.trim() || '',
      imageUrl: finalUrl || '',
      isAvailable: formData.isAvailable !== false,
      attributes: formData.attributes || {},
    };

    try {
      const base = API_VENUES;
      if (isEditing) {
        await axios.put(`${base}/${editId}`, payload);
        alert('Venue updated!');
      } else {
        await axios.post(base, payload);
        alert('Venue added!');
      }
      resetForm();
      fetchVenues();
    } catch (err) {
      // try alternate base path
      try {
        const alt = `${API_BASE_URL}/events`;
        if (isEditing) await axios.put(`${alt}/${editId}`, payload);
        else await axios.post(alt, payload);
        alert(isEditing ? 'Venue updated!' : 'Venue added!');
        resetForm();
        fetchVenues();
      } catch (e2) {
        console.error(e2);
        alert('Failed to save venue. Check Network tab / backend endpoint.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (v) => {
    setFormData({
      name: v.name || '',
      serviceType: v.serviceType || '',
      eventType: v.eventType || '',
      district: v.district || '',
      address: v.address || '',
      capacity: v.capacity ?? '',
      pricePerDay: v.pricePerDay ?? '',
      contactNumber: v.contactNumber || '',
      description: v.description || '',
      imageUrl: v.imageUrl || '',
      isAvailable: v.isAvailable !== false,
      attributes: v.attributes || {},
    });
    setImageFile(null);
    setIsEditing(true);
    setEditId(v.id);
    if (v.serviceType) setListFilter(v.serviceType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idOrObj) => {
    const id = typeof idOrObj === 'object' && idOrObj ? idOrObj.id : idOrObj;
    if (!id) return alert('Invalid ID');
    if (!window.confirm(`Delete venue ID ${id}?`)) return;
    try {
      await axios.delete(`${API_VENUES}/${id}`);
      alert('Deleted!');
      fetchVenues();
    } catch {
      try {
        await axios.delete(`${API_BASE_URL}/events/${id}`);
        alert('Deleted!');
        fetchVenues();
      } catch (e) {
        console.error(e);
        alert('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serviceType: '',
      eventType: '',
      district: '',
      address: '',
      capacity: '',
      pricePerDay: '',
      contactNumber: '',
      description: '',
      imageUrl: '',
      isAvailable: true,
      attributes: {},
    });
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
  };

  const displayed = venues.filter((v) => {
    if (listFilter === 'All') return true;
    return v.serviceType === listFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin')}
          className="text-sm font-bold text-gray-500 hover:text-fuchsia-600 transition"
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-5 rounded-2xl shadow border sticky top-4">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-black text-gray-800">
                {isEditing ? '✏️ Edit Venue' : '🏛️ Add Venue / Service'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-xs font-bold text-red-500">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Name *</label>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Grand Banquet Hall"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Service *</label>
                  <select
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Venue">Venue</option>
                    <option value="Decorations">Decorations</option>
                    <option value="Catering">Catering</option>
                    <option value="DJ">DJ</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">District *</label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Patna">Patna</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact *</label>
                  <input
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address *</label>
                <input
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-fuchsia-700 uppercase mb-1">Price / Day (₹)</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    placeholder="25000"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-fuchsia-50 border-fuchsia-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                />
              </div>

              {/* Attributes */}
              <div className="bg-gray-50 p-3 rounded-lg border">
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2">
                  Extra Specs (AC, Parking...)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={attrKey}
                    onChange={(e) => setAttrKey(e.target.value)}
                    placeholder="Key"
                    className="flex-1 border rounded px-2 py-1.5 text-xs"
                  />
                  <input
                    value={attrValue}
                    onChange={(e) => setAttrValue(e.target.value)}
                    placeholder="Value"
                    className="flex-1 border rounded px-2 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="bg-gray-800 text-white text-xs font-bold px-3 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(formData.attributes || {}).map(([k, val]) => (
                    <span
                      key={k}
                      className="text-[10px] bg-white border px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      {k}: {String(val)}
                      <button type="button" onClick={() => removeAttribute(k)} className="text-red-500 font-bold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-fuchsia-50 p-3 rounded-lg border border-fuchsia-100">
                <label className="block text-xs font-bold text-fuchsia-900 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs mb-2 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-fuchsia-600 file:text-white file:text-xs file:font-bold"
                />
                <div className="text-center text-[10px] font-bold text-gray-400 my-1">OR</div>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  disabled={!!imageFile}
                  placeholder="Paste image URL..."
                  className="w-full border rounded text-xs px-2 py-1.5 outline-none disabled:bg-gray-200"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 text-fuchsia-600 rounded"
                />
                <span className="text-xs font-bold text-gray-700">Available for Booking</span>
              </label>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-fuchsia-600 text-white font-black rounded-lg text-sm hover:bg-fuchsia-700 disabled:opacity-70 flex justify-center items-center gap-2 shadow-md"
              >
                {isUploading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isUploading ? 'Saving...' : isEditing ? 'Update Venue' : 'Add Venue'}
              </button>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm mb-4 gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">Manage Venues</h2>
              <p className="text-xs text-gray-500 font-medium">Showing {displayed.length} items</p>
            </div>
            <select
              value={listFilter}
              onChange={(e) => setListFilter(e.target.value)}
              className="bg-white border text-xs font-bold rounded-md px-3 py-1.5 outline-none"
            >
              <option value="All">All Services</option>
              <option value="Venue">Venue</option>
              <option value="Decorations">Decorations</option>
              <option value="Catering">Catering</option>
              <option value="DJ">DJ</option>
              <option value="Photography">Photography</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading...</div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed">
              <p className="text-gray-500 font-bold">No venues found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayed.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-3 border shadow-sm flex gap-3 hover:shadow-md transition"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border flex-shrink-0">
                    <img
                      src={v.imageUrl || NO_IMG}
                      alt={v.name}
                      onError={(e) => {
                        e.target.src = NO_IMG;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-fuchsia-600">
                      {v.serviceType} {v.eventType ? `• ${v.eventType}` : ''}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{v.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {v.district} • {v.capacity ? `${v.capacity} guests` : ''}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-black text-gray-800">
                        {v.pricePerDay ? `₹${v.pricePerDay}/day` : 'On Call'}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(v)}
                          className="bg-yellow-100 text-yellow-700 text-[11px] font-bold px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="bg-red-100 text-red-700 text-[11px] font-bold px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVenues;