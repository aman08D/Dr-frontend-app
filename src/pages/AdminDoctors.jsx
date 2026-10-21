import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/g2vyzd9r/image/upload';
const UPLOAD_PRESET = 'dr_preset';

const NO_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z'/%3E%3Cpath d='M19 21v-2a7 7 0 0 0-14 0v2'/%3E%3Cpath d='M12 14v4'/%3E%3Cpath d='M10 16h4'/%3E%3C/svg%3E";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    clinicName: '',
    address: '',
    district: '',
    phoneNumber: '',
    consultationFee: '',
    availableTiming: '',
    profileImgUrl: '',
    isAvailable: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFormData({ ...formData, profileImgUrl: '' }); // Clear web URL if file selected
    }
  };

  // Helper to clean external Web Image URLs
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

    // 1. Upload file if selected
    if (imageFile) {
      const uploadedUrl = await uploadImageToCloudinary(imageFile);
      if (!uploadedUrl) {
        setIsUploading(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    } 
    // 2. Clean Web URL if provided instead of file
    else if (finalImageUrl) {
      finalImageUrl = cleanWebImageUrl(finalImageUrl);
    }

    const payload = {
      ...formData,
      consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
      profileImgUrl: finalImageUrl
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/doctors/${editId}`, payload);
        alert('Doctor updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/doctors`, payload);
        alert('Doctor added successfully!');
      }
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Failed to save doctor details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (doc) => {
    setFormData({
      name: doc.name || '',
      specialization: doc.specialization || '',
      qualification: doc.qualification || '',
      clinicName: doc.clinicName || '',
      address: doc.address || '',
      district: doc.district || '',
      phoneNumber: doc.phoneNumber || '',
      consultationFee: doc.consultationFee || '',
      availableTiming: doc.availableTiming || '',
      profileImgUrl: doc.profileImgUrl || '',
      isAvailable: doc.isAvailable !== false
    });
    setImageFile(null);
    setIsEditing(true);
    setEditId(doc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idOrObject) => {
    // Robust ID Check (Solves [object Object] issue)
    const id = typeof idOrObject === 'object' && idOrObject !== null ? idOrObject.id : idOrObject;
    if (!id) return alert("Invalid Doctor ID");

    if (window.confirm(`Are you sure you want to delete Doctor ID: ${id}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/doctors/${id}`);
        alert('Doctor deleted successfully!');
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Failed to delete doctor.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', specialization: '', qualification: '', clinicName: '',
      address: '', district: '', phoneNumber: '', consultationFee: '',
      availableTiming: '', profileImgUrl: '', isAvailable: true
    });
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* LEFT: FORM SECTION */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {isEditing ? '✏️ Edit Doctor' : '👨‍⚕️ Add New Doctor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Doctor Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Dr. Rajesh Kumar" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Specialization *</label>
                <select name="specialization" required value={formData.specialization} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white">
                  <option value="">Select...</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Ophthalmologist">Ophthalmologist (Eye)</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Neurologist">Neurologist</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fee (₹)</label>
                <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} placeholder="500" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. MBBS, MD" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Clinic / Hospital Name</label>
              <input type="text" name="clinicName" value={formData.clinicName} onChange={handleInputChange} placeholder="e.g. LifeCare Clinic" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
                <select name="district" required value={formData.district} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white">
                  <option value="">Select...</option>
                  <option value="Patna">Patna</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                  <option value="Bhagalpur">Bhagalpur</option>
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Phone *</label>
                <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} placeholder="e.g. 9876543210" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Address *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Full clinic address..." className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Timing</label>
              <input type="text" name="availableTiming" value={formData.availableTiming} onChange={handleInputChange} placeholder="e.g. Mon-Sat: 10AM - 5PM" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"/>
            </div>

            {/* Image Upload Section */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <label className="block text-xs font-bold text-blue-900 mb-2">Doctor Profile Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-600 mb-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
              <div className="text-center text-xs font-bold text-gray-400 my-1">OR</div>
              <input type="text" name="profileImgUrl" value={formData.profileImgUrl} onChange={handleInputChange} placeholder="Paste direct image URL here..." disabled={!!imageFile} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-200"/>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-bold text-gray-700">Currently Available / Practicing</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm} className="w-1/3 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={isUploading} className="w-2/3 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2">
                {isUploading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                {isUploading ? 'Saving...' : isEditing ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT: LIST SECTION */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Doctors ({doctors.length})</h2>
        
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading doctors data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
                  <img src={doc.profileImgUrl || NO_IMAGE_SVG} alt={doc.name} onError={(e) => {e.target.src = NO_IMAGE_SVG;}} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">{doc.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{doc.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{doc.clinicName} • {doc.district}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(doc)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-bold px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold px-3 py-1 rounded">
                      Delete
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

export default AdminDoctors;