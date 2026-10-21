import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://dr-backend-app.onrender.com/api';

const NO_IMAGE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // =========================================================================
  // 1. ADDED: DISCOUNT & PRICING CALCULATOR FUNCTION
  // KYA KRTA HAI: Agar `offerPrice` hai, to Offer Price, MRP (line-through), 
  // aur Discount Percentage (% OFF) calculate karke deta hai.
  // =========================================================================
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
        hasOffer: true,
      };
    }

    return {
      mrp: null,
      finalPrice: discountPrice || regularPrice,
      discountPercent: 0,
      hasOffer: false,
    };
  };

  // =========================================================================
  // 2. ADDED: DYNAMIC WHATSAPP LINK GENERATOR
  // KYA KRTA HAI: Direct `https://wa.me/` Link banata hai jisme Product Title,
  // Offer Price, Product Type, Category aur Page URL auto-fill hokar jata hai.
  // Anchor <a> tag se mobile pop-up blockers bypass ho jate hain.
  // =========================================================================
  const getWhatsAppLink = () => {
    if (!product) return '#';
    const phoneNumber = '919876543210'; // <-- APNA WHATSAPP NUMBER YAHAN REPLACE KAREIN

    const pricing = getPricingDetails(product.price, product.offerPrice);
    const priceText = pricing ? `₹${pricing.finalPrice}` : 'Price on Request';

    const text = encodeURIComponent(
      `Hi, I want to order this product:\n\n` +
      `📌 *Product:* ${product.name}\n` +
      `🏷️ *Type:* ${product.productType || 'General'}\n` +
      `📁 *Category:* ${product.category}${product.subCategory ? ' (' + product.subCategory + ')' : ''}\n` +
      `💰 *Price:* ${priceText}\n` +
      `🔗 *Link:* ${window.location.href}`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <p className="text-gray-500 text-lg mb-4">Product not found or has been removed.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go Back to Catalog
        </button>
      </div>
    );
  }

  // Calculate pricing for rendering
  const pricing = getPricingDetails(product.price, product.offerPrice);

  return (
    <div className="bg-white min-h-screen relative">
      {/* 
        MAIN CONTAINER:
        max-w-6xl (Width standard box size)
        px-4 sm:px-8 py-6 pb-28 (Bottom margin for sticky bar)
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 pb-32">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1.5 text-sm font-semibold transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Catalog
        </button>

        {/* 
          PRODUCT DETAILS GRID
          Left: Product Image
          Right: Full Specifications & Dynamic Offer Badges
        */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Image Box */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 flex justify-center items-center relative overflow-hidden">
              
              {/* ========================================================= */}
              {/* ADDED: DISCOUNT BADGE ON TOP LEFT OF IMAGE               */}
              {/* ========================================================= */}
              {pricing && pricing.hasOffer && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                  {pricing.discountPercent}% OFF
                </div>
              )}

              {/* ========================================================= */}
              {/* ADDED: PRODUCT TYPE BADGE ON TOP RIGHT OF IMAGE           */}
              {/* ========================================================= */}
              {product.productType && (
                <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                  {product.productType === 'School' ? '🏫 School Product' : '🖨️ Printing Service'}
                </div>
              )}

              <img
                src={product.imgUrl || product.imageUrl || NO_IMAGE_SVG}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = NO_IMAGE_SVG;
                }}
                className="w-full max-h-[350px] md:max-h-[480px] object-contain rounded-lg drop-shadow-sm transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Product Information */}
          <div className="w-full md:w-1/2 flex flex-col space-y-4 pt-1">
            
            {/* Category & Sub-Category Breadcrumb */}
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* ========================================================= */}
            {/* ADDED: DYNAMIC PRICING SECTION (MRP vs Offer Price)       */}
            {/* KYA ADD HUA: Real Offer Price, Discount % tag aur MRP     */}
            {/* ========================================================= */}
            <div className="py-2 border-y border-gray-100 flex items-baseline gap-3 flex-wrap">
              {pricing ? (
                pricing.hasOffer ? (
                  <>
                    {/* Final Offer Price */}
                    <span className="text-3xl sm:text-4xl font-black text-gray-900">
                      ₹{pricing.finalPrice}
                    </span>

                    {/* Original MRP with strike-through */}
                    <span className="text-lg text-gray-400 line-through font-medium">
                      MRP ₹{pricing.mrp}
                    </span>

                    {/* Green Save Badge */}
                    <span className="bg-green-100 text-green-700 text-xs font-extrabold px-2.5 py-1 rounded-md">
                      Save {pricing.discountPercent}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-gray-900">
                    ₹{pricing.finalPrice}
                  </span>
                )
              ) : (
                <span className="text-2xl font-extrabold text-gray-800">
                  Price on Call / Request
                </span>
              )}
            </div>

            {/* ========================================================= */}
            {/* ADDED: STOCK & AVAILABILITY STATUS BADGES                  */}
            {/* KYA ADD HUA: Stock quantity aur In-Stock indicator         */}
            {/* ========================================================= */}
            <div className="flex items-center gap-3 text-xs sm:text-sm pt-1">
              {product.isAvailable !== false ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Currently Out of Stock
                </span>
              )}

              {/* Stock Quantity Tag (If specified in Admin) */}
              {product.stockQuantity > 0 && (
                <span className="text-gray-500 font-medium">
                  ({product.stockQuantity} units left)
                </span>
              )}

              {/* Express Delivery Badge */}
              <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
                <span>⚡</span> EXPRESS DELIVERY
              </span>
            </div>

            {/* ========================================================= */}
            {/* ADDED: CUSTOMIZATION AVAILABLE BANNER                     */}
            {/* KYA ADD HUA: Custom Logo/School Name printing badge       */}
            {/* ========================================================= */}
            {product.isCustomizable && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">🎨</span>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase">Customization Available</h4>
                  <p className="text-xs text-blue-700 font-medium">
                    School logo, student name, or custom brand printing can be added to this item.
                  </p>
                </div>
              </div>
            )}

            {/* Description Section */}
            {product.description && (
              <div className="pt-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Description</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* ========================================================= */}
            {/* SPECIFICATIONS & HIGHLIGHTS (Attributes from JSON)        */}
            {/* ========================================================= */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Product Specifications
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-100">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200/60 pb-2 last:border-b-0 last:pb-0">
                      <span className="text-gray-500 font-semibold">{key}</span>
                      <span className="text-gray-900 font-bold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* DESKTOP WHATSAPP ORDER BUTTON                             */}
            {/* Safe <a> tag use kiya hai target="_blank" ke sath         */}
            {/* ========================================================= */}
            <div className="hidden md:block pt-6">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-lg hover:shadow-green-600/20 transition flex items-center justify-center gap-2.5 text-center"
              >
                <span className="text-xl">💬</span> Order via WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM BAR (Mobile Screen Only - Hidden on Laptop)                 */}
      {/* Displays Offer Price + Direct WhatsApp Order Link                         */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3.5 shadow-[0_-4px_10px_rgba(0,0,0,0.08)] md:hidden z-50">
        <div className="max-w-xl mx-auto flex justify-between items-center gap-3">
          
          {/* Left Side: Mobile Pricing */}
          <div className="flex flex-col">
            {pricing ? (
              pricing.hasOffer ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-green-600">{pricing.discountPercent}% OFF</span>
                    <span className="text-xs text-gray-400 line-through">₹{pricing.mrp}</span>
                  </div>
                  <span className="text-xl font-extrabold text-gray-900 leading-none">
                    ₹{pricing.finalPrice}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Price</span>
                  <span className="text-xl font-extrabold text-gray-900 leading-none">
                    ₹{pricing.finalPrice}
                  </span>
                </>
              )
            ) : (
              <span className="text-sm font-bold text-gray-900">Price on Call</span>
            )}
          </div>

          {/* Right Side: Safe Anchor Button for Mobile WhatsApp */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 active:bg-green-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex justify-center items-center gap-2 shadow-md flex-1 text-center"
          >
            <span className="text-lg">💬</span> Order Now
          </a>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;