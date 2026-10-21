import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/g2vyzd9r/image/upload';
const UPLOAD_PRESET = 'dr_preset';

const NO_IMAGE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // NEW STATE: For Filtering the List on Right Side
  // ==========================================
  const [listFilter, setListFilter] = useState('All');

  // Form States
  const [formData, setFormData] = useState({
    name: '', productType: '', category: '', subCategory: '',
    description: '', price: '', offerPrice: '', isAvailable: true,
    isCustomizable: false, stockQuantity: '', imgUrl: '',
    attributes: {}
  });

  const [attrKey, setAttrKey] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      // Sort newest first
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setProducts(sorted);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      setFormData(prev => ({ ...prev, imgUrl: '' })); 
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

  const addAttribute = () => {
    if (attrKey && attrValue) {
      setFormData(prev => ({
        ...prev,
        attributes: { ...prev.attributes, [attrKey]: attrValue }
      }));
      setAttrKey(''); setAttrValue('');
    }
  };

  const removeAttribute = (keyToRemove) => {
    const newAttrs = { ...formData.attributes };
    delete newAttrs[keyToRemove];
    setFormData(prev => ({ ...prev, attributes: newAttrs }));
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

    let finalImageUrl = formData.imgUrl;
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

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
      imgUrl: finalImageUrl
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/products/${editId}`, payload);
        alert('Product updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/products`, payload);
        alert('Product added successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      productType: item.productType || '',
      category: item.category || '',
      subCategory: item.subCategory || '',
      description: item.description || '',
      price: item.price || '',
      offerPrice: item.offerPrice || '',
      isAvailable: item.isAvailable !== false,
      isCustomizable: item.isCustomizable || false,
      stockQuantity: item.stockQuantity || '',
      imgUrl: item.imgUrl || item.imageUrl || '',
      attributes: item.attributes || {}
    });
    setImageFile(null);
    setIsEditing(true);
    setEditId(item.id);
    
    // Switch filter to match the item being edited so it remains visible
    if (item.productType) setListFilter(item.productType);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (idOrObject) => {
    const id = typeof idOrObject === 'object' && idOrObject !== null ? idOrObject.id : idOrObject;
    if (!id) return alert("Invalid Product ID");

    if (window.confirm(`Are you sure you want to delete this product? (ID: ${id})`)) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', productType: '', category: '', subCategory: '', description: '',
      price: '', offerPrice: '', isAvailable: true, isCustomizable: false,
      stockQuantity: '', imgUrl: '', attributes: {}
    });
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
  };

  // ==========================================
  // FILTERING LOGIC FOR THE LIST
  // ==========================================
  const displayedProducts = products.filter(p => {
    if (listFilter === 'All') return true;
    return p.productType === listFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Back to Dashboard Link */}
      <div className="mb-4">
        <button 
          onClick={() => navigate('/admin')} 
          className="text-sm font-bold text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
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
                {isEditing ? '✏️ Edit Product' : '📦 Add New Product'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:underline">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Form fields here (unchanged logic) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Product Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Type *</label>
                  <select name="productType" required value={formData.productType} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none">
                    <option value="">Select...</option>
                    <option value="School">School</option>
                    <option value="Printing">Printing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Category *</label>
                  <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none">
                    <option value="">Select...</option>
                    {formData.productType === 'School' && (<><option value="Notebook">Notebook</option><option value="Uniform">Uniform</option><option value="Bag">Bag</option><option value="Stationery">Stationery</option></>)}
                    {formData.productType === 'Printing' && (<><option value="Flex Banner">Flex Banner</option><option value="Visiting Card">Visiting Card</option><option value="Brochure">Brochure</option><option value="Custom Mug">Custom Mug</option></>)}
                    {!formData.productType && <option value="" disabled>Select Type First</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Sub-Category</label>
                <input type="text" name="subCategory" value={formData.subCategory} onChange={handleInputChange} placeholder="e.g. Ruled, Shirt, Matte" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">MRP Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="500" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-green-700 uppercase mb-1">Offer Price (₹)</label>
                  <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} placeholder="350 (Optional)" className="w-full border rounded-lg px-3 py-2 text-sm bg-green-50 focus:bg-white border-green-200 focus:border-green-500 outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="2" className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"></textarea>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <label className="block text-xs font-bold text-blue-900 mb-2">Product Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-600 mb-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer"/>
                <div className="text-center text-[10px] font-bold text-gray-400 my-1">OR</div>
                <input type="text" name="imgUrl" value={formData.imgUrl} onChange={handleInputChange} placeholder="Paste Image URL..." disabled={!!imageFile} className="w-full border rounded text-xs px-2 py-1.5 outline-none focus:border-blue-500 disabled:bg-gray-200"/>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600 rounded" />
                  <span className="text-xs font-bold text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isCustomizable" checked={formData.isCustomizable} onChange={handleInputChange} className="w-3.5 h-3.5 text-blue-600 rounded" />
                  <span className="text-xs font-bold text-gray-700">Customizable</span>
                </label>
              </div>

              <button type="submit" disabled={isUploading} className="w-full py-3 bg-blue-600 text-white font-black rounded-lg text-sm hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2 shadow-md mt-2">
                {isUploading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                {isUploading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: LIST SECTION */}
        <div className="w-full lg:w-2/3">
          
          {/* ========================================================= */}
          {/* NEW FILTER HEADER UI FOR LIST                             */}
          {/* ========================================================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">Manage Catalog</h2>
              <p className="text-xs font-medium text-gray-500">Showing {displayedProducts.length} items</p>
            </div>
            
            {/* The Dropdown Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <span className="text-xs font-bold text-gray-500 pl-2">Filter:</span>
              <select
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-md px-3 py-1.5 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">📦 All Products & Printing</option>
                <option value="School">🏫 School Products Only</option>
                <option value="Printing">🖨️ Printing Services Only</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 font-bold text-gray-500 animate-pulse">Loading catalog...</div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-bold">No items found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedProducts.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-start gap-3 hover:shadow-md transition">
                  
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border">
                    <img src={item.imgUrl || item.imageUrl || NO_IMAGE_SVG} alt={item.name} onError={(e) => {e.target.src = NO_IMAGE_SVG;}} className="w-full h-full object-cover"/>
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                      {item.productType}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.category} • {item.subCategory}</p>
                    
                    <div className="flex gap-2 mt-2 items-center justify-between">
                      <span className="text-sm font-black text-green-700">
                        ₹{item.offerPrice || item.price || 'Call'}
                      </span>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(item)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-[11px] font-bold px-3 py-1 rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-100 text-red-700 hover:bg-red-200 text-[11px] font-bold px-3 py-1 rounded">
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

export default AdminProducts;