import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/g2vyzd9r/image/upload';
const UPLOAD_PRESET = 'dr_preset';

const NO_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3Cpolyline points='7.5 4.21 12 6.81 16.5 4.21'/%3E%3Cpolyline points='7.5 19.79 7.5 14.6 3 12'/%3E%3Cpolyline points='21 12 16.5 14.6 16.5 19.79'/%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'/%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'/%3E%3C/svg%3E";

const AdminWorkers = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFilter, setListFilter] = useState('All');

  // Form States
  const [formData, setFormData] = useState({
    name: '', skill: '', experienceYears: '', phoneNumber: '',
    district: '', cityOrArea: '', dailyRate: '', hourlyRate: '',
    rating: '', profileImgUrl: '', isAvailable: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/workers`);
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setWorkers(sorted);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, profileImgUrl: '' }));
    }
  };

  const cleanWebImageUrl = (url) => {
    if (!url) return '';
    try {
      let cleanUrl = url.split('?')[0];
      if (cleanUrl.includes('google.com') || cleanUrl.includes('drive.google.com')) return '';
      return cleanUrl;
    } catch {
      return '';
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await axios.post(CLOUDINARY_URL, data);
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('Image upload failed. Please try again or use a Web URL.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = formData.profileImgUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImageToCloudinary(imageFile);
      if (!uploadedUrl) {
        setIsUploading(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (finalImageUrl) {
      finalImageUrl = cleanWebImageUrl(finalImageUrl);
    }

    // Payload safe conversion (Fix 400 Bad Request)
    const payload = {
      name: formData.name.trim(),
      skill: formData.skill.trim(),
      experienceYears: formData.experienceYears ? parseFloat(formData.experienceYears) : null,
      phoneNumber: formData.phoneNumber.trim(),
      district: formData.district.trim(),
      cityOrArea: formData.cityOrArea ? formData.cityOrArea.trim() : "",
      dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      profileImgUrl: finalImageUrl || "",
      isAvailable: formData.isAvailable !== false
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/workers/${editId}`, payload);
        alert('Worker updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/workers`, payload);
        alert('Worker added successfully!');
      }
      resetForm();
      fetchWorkers();
    } catch (error) {
      console.error('Error saving worker:', error);
      alert('Failed to save worker. Check network tab for details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      name: worker.name || '',
      skill: worker.skill || '',
      experienceYears: worker.experienceYears || '',
      phoneNumber: worker.phoneNumber || '',
      district: worker.district || '',
      cityOrArea: worker.cityOrArea || '',
      dailyRate: worker.dailyRate || '',
      hourlyRate: worker.hourlyRate || '',
      rating: worker.rating || '',
      profileImgUrl: worker.profileImgUrl || '',
      isAvailable: worker.isAvailable !== false
    });
    setImageFile(null);
    setIsEditing(true);
    setEditId(worker.id);

    // Switch filter to show the worker being edited
    if (worker.skill) setListFilter(worker.skill);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idOrObject) => {
    const id = typeof idOrObject === 'object' && idOrObject !== null ? idOrObject.id : idOrObject;
    if (!id) return alert("Invalid Worker ID");

    if (window.confirm(`Are you sure you want to delete this worker profile? (ID: ${id})`)) {
      try {
        await axios.delete(`${API_BASE_URL}/workers/${id}`);
        alert('Worker deleted successfully!');
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
        alert('Failed to delete worker.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', skill: '', experienceYears: '', phoneNumber: '',
      district: '', cityOrArea: '', dailyRate: '', hourlyRate: '',
      rating: '', profileImgUrl: '', isAvailable: true
    });
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
  };

  const displayedWorkers = workers.filter(w => {
    if (listFilter === 'All') return true;
    return w.skill === listFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Back to Dashboard Link */}
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin')} 
          className="text-sm font-bold text-gray-500 hover:text-orange-600 transition flex items-center gap-1"
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: FORM SECTION */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-5 rounded-2xl shadow border border-gray-100 sticky top-4">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-black text-gray-800">
                {isEditing ? '✏️ Edit Worker' : '👷 Add New Worker'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:underline">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Skill / Trade *</label>
                  <select name="skill" required value={formData.skill} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none">
                    <option value="">Select...</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Mason">Mason (Mistri)</option>
                    <option value="Labour">Labour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Experience (Yrs)</label>
                  <input type="number" step="0.1" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} placeholder="e.g. 5" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                  <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} placeholder="9876543210" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Rating (Out of 5)</label>
                  <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="4.5" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">District *</label>
                  <select name="district" required value={formData.district} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none">
                    <option value="">Select...</option>
                    <option value="Patna">Patna</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">City / Area</label>
                  <input type="text" name="cityOrArea" value={formData.cityOrArea} onChange={handleInputChange} placeholder="e.g. Boring Road" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Daily Rate (₹)</label>
                  <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleInputChange} placeholder="e.g. 600" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Hourly Rate (₹)</label>
                  <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} placeholder="e.g. 100" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <label className="block text-xs font-bold text-orange-900 mb-2">Worker Photo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-600 mb-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white cursor-pointer"/>
                <div className="text-center text-[10px] font-bold text-gray-400 my-1">OR</div>
                <input type="text" name="profileImgUrl" value={formData.profileImgUrl} onChange={handleInputChange} placeholder="Paste Image URL..." disabled={!!imageFile} className="w-full border rounded text-xs px-2 py-1.5 outline-none focus:border-orange-500 disabled:bg-gray-200"/>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-3.5 h-3.5 text-orange-600 rounded" />
                  <span className="text-xs font-bold text-gray-700">Available to Work</span>
                </label>
              </div>

              <button type="submit" disabled={isUploading} className="w-full py-3 bg-orange-600 text-white font-black rounded-lg text-sm hover:bg-orange-700 disabled:opacity-70 flex justify-center items-center gap-2 shadow-md mt-2">
                {isUploading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                {isUploading ? 'Saving...' : isEditing ? 'Update Worker' : 'Add Worker'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: LIST SECTION */}
        <div className="w-full lg:w-2/3">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">Manage Workers</h2>
              <p className="text-xs font-medium text-gray-500">Showing {displayedWorkers.length} profiles</p>
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <span className="text-xs font-bold text-gray-500 pl-2">Filter Skill:</span>
              <select
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-md px-3 py-1.5 outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="All">🛠️ All Skills</option>
                <option value="Electrician">⚡ Electrician</option>
                <option value="Plumber">🔧 Plumber</option>
                <option value="Carpenter">🪚 Carpenter</option>
                <option value="Painter">🎨 Painter</option>
                <option value="AC Technician">❄️ AC Technician</option>
                <option value="Mason">🧱 Mason</option>
                <option value="Labour">💪 Labour</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading workers...</div>
          ) : displayedWorkers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-bold">No workers found for this skill.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedWorkers.map((worker) => (
                <div key={worker.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-start gap-3 hover:shadow-md transition">
                  
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border">
                    <img src={worker.profileImgUrl || NO_IMAGE_SVG} alt={worker.name} onError={(e) => {e.target.src = NO_IMAGE_SVG;}} className="w-full h-full object-cover"/>
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{worker.name}</h3>
                      {worker.rating && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-1.5 rounded flex items-center gap-0.5">⭐ {worker.rating}</span>}
                    </div>
                    
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider">
                      {worker.skill}
                    </span>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {worker.cityOrArea ? `${worker.cityOrArea}, ` : ''}{worker.district}
                    </p>
                    
                    <div className="flex gap-2 mt-2 items-center justify-between">
                      <span className="text-xs font-black text-gray-800">
                        {worker.dailyRate ? `₹${worker.dailyRate}/d` : worker.hourlyRate ? `₹${worker.hourlyRate}/hr` : 'On Call'}
                      </span>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(worker)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-[11px] font-bold px-3 py-1 rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(worker.id)} className="bg-red-100 text-red-700 hover:bg-red-200 text-[11px] font-bold px-3 py-1 rounded">
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

export default AdminWorkers;