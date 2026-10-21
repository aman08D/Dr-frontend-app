import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';

const NO_IMAGE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const Products = () => {
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type') || '';
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applied Filters State
  const [productType, setProductType] = useState(urlType);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Sort State
  const [sortOption, setSortOption] = useState('');

  // Mobile Modals State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // Flipkart Split Filter Active Tab ('category' | 'subCategory' | 'price' | 'customizable')
  const [activeFilterTab, setActiveFilterTab] = useState('category');

  // Temp Filter States (Apply dabane se pehle store karne ke liye)
  const [tempCategory, setTempCategory] = useState('');
  const [tempSubCategory, setTempSubCategory] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [tempOnlyCustomizable, setTempOnlyCustomizable] = useState(false);

  useEffect(() => {
    setProductType(urlType);
    setCategory('');
    setSubCategory('');
  }, [urlType]);

  useEffect(() => {
    fetchProducts();
  }, [productType, category, subCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/filter`, {
        params: {
          type: productType || null,
          category: category || null,
          subCategory: subCategory || null,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Mobile Filter Popup & Sync Temp State
  const openMobileFilter = () => {
    setTempCategory(category);
    setTempSubCategory(subCategory);
    setTempMaxPrice(maxPrice);
    setTempOnlyCustomizable(onlyCustomizable);
    setIsMobileFilterOpen(true);
  };

  // Apply Mobile Filters
  const handleApplyMobileFilters = () => {
    setCategory(tempCategory);
    setSubCategory(tempSubCategory);
    setMaxPrice(tempMaxPrice);
    setOnlyCustomizable(tempOnlyCustomizable);
    setIsMobileFilterOpen(false);
  };

  // Clear All Filters
  const handleClearAllFilters = () => {
    setTempCategory('');
    setTempSubCategory('');
    setTempMaxPrice('');
    setTempOnlyCustomizable(false);
    setCategory('');
    setSubCategory('');
    setMaxPrice('');
    setOnlyCustomizable(false);
  };

  // Pricing & Discount Calculator
  const getPricingDetails = (price, offerPrice) => {
    if (!price && !offerPrice) return null;
    const regularPrice = price ? Number(price) : null;
    const discountPrice = offerPrice ? Number(offerPrice) : null;

    if (discountPrice && regularPrice && discountPrice < regularPrice) {
      const discountPercent = Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
      return {
        mrp: regularPrice,
        finalPrice: discountPrice,
        discountPercent,
        hasOffer: true
      };
    }

    return {
      mrp: null,
      finalPrice: discountPrice || regularPrice,
      discountPercent: 0,
      hasOffer: false
    };
  };

  // Client-Side Filter & Sort
  const filteredProducts = products.filter((item) => {
    const itemPrice = item.offerPrice || item.price || 0;
    if (maxPrice && itemPrice > Number(maxPrice)) return false;
    if (onlyCustomizable && !item.isCustomizable) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.offerPrice || a.price || 999999;
    const priceB = b.offerPrice || b.price || 999999;
    if (sortOption === 'price_asc') return priceA - priceB;
    if (sortOption === 'price_desc') return priceB - priceA;
    return 0; 
  });

  return (
    <div className="bg-white min-h-screen pb-6">
      
      {/* 📱 MOBILE STICKY SORT & FILTER BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b shadow-sm flex text-sm font-semibold text-gray-700 h-11">
        <button 
          onClick={() => setIsMobileSortOpen(true)}
          className="flex-1 py-2.5 flex items-center justify-center gap-2 border-r active:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
          Sort
        </button>
        <button 
          onClick={openMobileFilter}
          className="flex-1 py-2.5 flex items-center justify-center gap-2 active:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filter {(category || subCategory || maxPrice || onlyCustomizable) && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-8">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 hidden sm:block">
          {productType === 'School' ? 'School Products Catalog' : productType === 'Printing' ? 'Printing Services Catalog' : 'All Products & Services'}
        </h1>

        {/* 💻 DESKTOP FILTER SECTION */}
        <div className="hidden md:grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-sm border mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sort By</label>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:bg-white">
              <option value="">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:bg-white">
              <option value="">All Categories</option>
              {productType === 'School' && (<><option value="Notebook">Notebook</option><option value="Stationery">Stationery</option><option value="Uniform">Uniform</option><option value="Bag">School Bag</option></>)}
              {productType === 'Printing' && (<><option value="Flex Banner">Flex Banner</option><option value="Visiting Card">Visiting Card</option><option value="Brochure">Brochure / Flyer</option><option value="Custom Mug">Custom Mug</option></>)}
              {!productType && (<><option value="Notebook">Notebook</option><option value="Stationery">Stationery</option><option value="Uniform">Uniform</option><option value="Bag">School Bag</option><option value="Flex Banner">Flex Banner</option><option value="Visiting Card">Visiting Card</option><option value="Brochure">Brochure</option><option value="Custom Mug">Custom Mug</option></>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Category</label>
            <input type="text" placeholder="Search sub-category..." value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Price (₹)</label>
            <input type="number" placeholder="e.g. 500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:bg-white outline-none"/>
          </div>
        </div>

        {/* 📦 CATALOG GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading catalog...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded border">
            No items found matching your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-4 sm:gap-6 pt-1">
            {sortedProducts.map((item) => {
              const pricing = getPricingDetails(item.price, item.offerPrice);

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex flex-col cursor-pointer bg-white w-full"
                >
                  {/* Image Box */}
                  <div className="border border-gray-200 rounded-md overflow-hidden relative w-full">
                    <img
                      src={item.imgUrl || item.imageUrl || NO_IMAGE_SVG}
                      alt={item.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = NO_IMAGE_SVG; }}
                      className="w-full h-54 sm:h-60 object-cover bg-gray-50"
                    />
                  </div>

                  {/* Text Details Area */}
                  <div className="pt-1.5 flex flex-col w-full">
                    <h3 className="text-[12px] sm:text-sm font-bold text-gray-900 line-clamp-1 leading-snug w-full">
                      {item.name}
                    </h3>
                    
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 w-full overflow-hidden text-ellipsis">
                      {item.description || `${item.category} ${item.subCategory ? '• ' + item.subCategory : ''}`}
                    </p>

                    {/* Price Line (With Gap & Padding) */}
                    {pricing ? (
                      <div className="flex items-baseline justify-start gap-2 mt-1 w-full whitespace-nowrap overflow-hidden">
                        {pricing.hasOffer ? (
                          <>
                            <span className="pl-1 text-[13px] sm:text-xs font-bold text-green-600 shrink-0">
                              {pricing.discountPercent}% off
                            </span>
                            <span className="text-[13px] sm:text-xs text-gray-400 line-through shrink-0">
                              ₹{pricing.mrp}
                            </span>
                            <span className="text-[14px] sm:text-base font-extrabold text-gray-900 shrink-0 leading-none">
                              ₹{pricing.finalPrice}
                            </span>
                          </>
                        ) : (
                          <span className="pl-1 text-[13px] sm:text-base font-extrabold text-gray-900 shrink-0 leading-none">
                            ₹{pricing.finalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 pl-1 text-[12px] sm:text-base font-extrabold text-gray-900">
                        Price on Call
                      </div>
                    )}

                    {/* Express Badge */}
                    <div className="mt-1 flex items-center">
                      <div className="bg-yellow-400/20 border border-yellow-400 flex items-center gap-1 px-1.5 py-0.5 rounded-sm w-max">
                        <span className="text-yellow-600 text-[9px]">⚡</span>
                        <span className="text-yellow-800 text-[8px] sm:text-[10px] font-extrabold italic tracking-wider">
                          EXPRESS
                        </span>
                      </div>
                    </div>

                    {/* Delivery Text */}
                    <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 font-medium">
                      Delivery today
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📱 MOBILE SORT MODAL */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full rounded-t-2xl p-5 pb-8">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sort By</h3>
              <button onClick={() => setIsMobileSortOpen(false)} className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <ul className="space-y-4 font-medium text-gray-700">
              <li className={`py-2 px-3 rounded-lg ${sortOption === '' ? 'bg-blue-50 text-blue-600 font-bold' : ''}`} onClick={() => { setSortOption(''); setIsMobileSortOpen(false); }}>Relevance (Default)</li>
              <li className={`py-2 px-3 rounded-lg ${sortOption === 'price_asc' ? 'bg-blue-50 text-blue-600 font-bold' : ''}`} onClick={() => { setSortOption('price_asc'); setIsMobileSortOpen(false); }}>Price: Low to High</li>
              <li className={`py-2 px-3 rounded-lg ${sortOption === 'price_desc' ? 'bg-blue-50 text-blue-600 font-bold' : ''}`} onClick={() => { setSortOption('price_desc'); setIsMobileSortOpen(false); }}>Price: High to Low</li>
            </ul>
          </div>
        </div>
      )}

      {/* 🛍️ FLIPKART STYLE FULL-SCREEN SPLIT FILTER POPUP (MOBILE) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          
          {/* 1. Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
            </div>
            <button 
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-blue-600 uppercase tracking-wider"
            >
              Clear All
            </button>
          </div>

          {/* 2. Split Body (Left Keys - Right Values) */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT SIDEBAR (Filter Keys) */}
            <div className="w-1/3 bg-gray-100 border-r overflow-y-auto text-xs font-semibold text-gray-700">
              <button 
                onClick={() => setActiveFilterTab('category')}
                className={`w-full p-3.5 text-left border-b border-gray-200 transition ${
                  activeFilterTab === 'category' 
                    ? 'bg-white text-blue-600 font-extrabold border-l-4 border-l-blue-600 shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                Category {tempCategory && '•'}
              </button>

              <button 
                onClick={() => setActiveFilterTab('subCategory')}
                className={`w-full p-3.5 text-left border-b border-gray-200 transition ${
                  activeFilterTab === 'subCategory' 
                    ? 'bg-white text-blue-600 font-extrabold border-l-4 border-l-blue-600 shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                Sub-Category {tempSubCategory && '•'}
              </button>

              <button 
                onClick={() => setActiveFilterTab('price')}
                className={`w-full p-3.5 text-left border-b border-gray-200 transition ${
                  activeFilterTab === 'price' 
                    ? 'bg-white text-blue-600 font-extrabold border-l-4 border-l-blue-600 shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                Price Range {tempMaxPrice && '•'}
              </button>

              <button 
                onClick={() => setActiveFilterTab('customizable')}
                className={`w-full p-3.5 text-left border-b border-gray-200 transition ${
                  activeFilterTab === 'customizable' 
                    ? 'bg-white text-blue-600 font-extrabold border-l-4 border-l-blue-600 shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                Customizable {tempOnlyCustomizable && '•'}
              </button>
            </div>

            {/* RIGHT CONTENT (Filter Values/Options) */}
            <div className="w-2/3 bg-white p-4 overflow-y-auto text-xs">
              
              {/* Category Tab Options */}
              {activeFilterTab === 'category' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm mb-3">Select Category</h3>
                  
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobileCat"
                      checked={tempCategory === ''} 
                      onChange={() => setTempCategory('')} 
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-800 font-medium">All Categories</span>
                  </label>

                  {/* School Categories */}
                  {(!productType || productType === 'School') && (
                    <>
                      {['Notebook', 'Stationery', 'Uniform', 'Bag'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name="mobileCat"
                            checked={tempCategory === cat} 
                            onChange={() => setTempCategory(cat)} 
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-800 font-medium">{cat}</span>
                        </label>
                      ))}
                    </>
                  )}

                  {/* Printing Categories */}
                  {(!productType || productType === 'Printing') && (
                    <>
                      {['Flex Banner', 'Visiting Card', 'Brochure', 'Custom Mug'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name="mobileCat"
                            checked={tempCategory === cat} 
                            onChange={() => setTempCategory(cat)} 
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-800 font-medium">{cat}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Sub-Category Tab Options */}
              {activeFilterTab === 'subCategory' && (
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-3">Search Sub-Category</h3>
                  <input 
                    type="text"
                    placeholder="Type sub-category (e.g. Ruled, Shirt, Matte)..."
                    value={tempSubCategory}
                    onChange={(e) => setTempSubCategory(e.target.value)}
                    className="w-full border p-2.5 rounded-lg text-xs outline-none focus:border-blue-600 bg-gray-50"
                  />
                  {tempSubCategory && (
                    <button 
                      onClick={() => setTempSubCategory('')} 
                      className="mt-2 text-red-500 font-semibold text-[11px]"
                    >
                      Clear Sub-Category
                    </button>
                  )}
                </div>
              )}

              {/* Price Range Tab Options */}
              {activeFilterTab === 'price' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm mb-3">Max Price Filter</h3>
                  
                  {[
                    { label: 'Under ₹100', value: '100' },
                    { label: 'Under ₹300', value: '300' },
                    { label: 'Under ₹500', value: '500' },
                    { label: 'Under ₹1000', value: '1000' },
                    { label: 'Any Price', value: '' },
                  ].map((p) => (
                    <label key={p.value} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobilePrice"
                        checked={tempMaxPrice === p.value} 
                        onChange={() => setTempMaxPrice(p.value)} 
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-800 font-medium">{p.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Customizable Tab Options */}
              {activeFilterTab === 'customizable' && (
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-3">Customization</h3>
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={tempOnlyCustomizable} 
                      onChange={(e) => setTempOnlyCustomizable(e.target.checked)} 
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-800 font-medium">Logo / Name Printing Available Only</span>
                  </label>
                </div>
              )}

            </div>
          </div>

          {/* 3. Footer Actions */}
          <div className="p-3 border-t bg-white flex gap-3 shadow-lg">
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 active:bg-gray-100"
            >
              Close
            </button>
            <button 
              onClick={handleApplyMobileFilters}
              className="flex-1 py-3 bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition"
            >
              Apply Filters
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Products;