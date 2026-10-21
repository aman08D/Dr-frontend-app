import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // =========================================================================
  // HERO SLIDER DATA — Rotating banner messages for top hero section
  // =========================================================================
  const heroSlides = [
    {
      title: 'School Products & Custom Printing',
      subtitle: 'Notebooks, Uniforms, Flex Banners & More',
      emoji: '🏫',
      gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    },
    {
      title: 'Trusted Doctor Directory',
      subtitle: 'Find verified doctors near you instantly',
      emoji: '👨‍⚕️',
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    },
    {
      title: 'Manpower & Skilled Workers',
      subtitle: 'Electrician, Plumber, Labour on demand',
      emoji: '👷',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
    },
    {
      title: 'Event Venues & Marriage Halls',
      subtitle: 'Book the perfect venue for your event',
      emoji: '🎉',
      gradient: 'from-fuchsia-600 via-pink-600 to-rose-600',
    },
  ];

  // =========================================================================
  // AUTO SLIDE CHANGER — Hero slider auto rotates every 4 seconds
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // =========================================================================
  // MAIN SERVICE CARDS — 4 primary modules of the website
  // =========================================================================
  const services = [
    {
      title: 'School Products',
      desc: 'Books, Uniforms, Bags & Stationery',
      icon: '📚',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      link: '/products?type=School',
    },
    {
      title: 'Custom Printing',
      desc: 'Banners, Cards, Mugs & T-Shirts',
      icon: '🖨️',
      color: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
      link: '/products?type=Printing',
    },
    {
      title: 'Doctor Directory',
      desc: 'Verified Doctors & Clinics',
      icon: '🩺',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      link: '/doctors',
    },
    {
      title: 'Manpower Supply',
      desc: 'Workers, Labour & Technicians',
      icon: '👷',
      color: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
      link: '/workers',
    },
    {
      title: 'Event Venues',
      desc: 'Marriage Halls & Function Lawns',
      icon: '🎊',
      color: 'from-fuchsia-500 to-pink-600',
      bgLight: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-700',
      link: '/venues',
    },
    {
      title: 'More Coming Soon',
      desc: 'New services launching soon...',
      icon: '✨',
      color: 'from-gray-500 to-gray-700',
      bgLight: 'bg-gray-50',
      textColor: 'text-gray-700',
      link: '/',
    },
  ];

  // =========================================================================
  // "WHY CHOOSE US" FEATURES — Trust-building section highlights
  // =========================================================================
  const features = [
    { icon: '⚡', title: 'Express Delivery', desc: 'Same day delivery available' },
    { icon: '✅', title: 'Verified Vendors', desc: '100% trusted & genuine' },
    { icon: '💰', title: 'Best Prices', desc: 'Factory direct rates' },
    { icon: '📞', title: '24/7 Support', desc: 'WhatsApp instant chat' },
  ];

  // =========================================================================
  // CATEGORY QUICK ACCESS — Popular shortcut tiles for mobile scroll bar
  // =========================================================================
  const categories = [
    { name: 'Notebook', emoji: '📓', link: '/products?type=School' },
    { name: 'Uniform', emoji: '👕', link: '/products?type=School' },
    { name: 'School Bag', emoji: '🎒', link: '/products?type=School' },
    { name: 'Banner', emoji: '🎌', link: '/products?type=Printing' },
    { name: 'Cards', emoji: '💳', link: '/products?type=Printing' },
    { name: 'Mugs', emoji: '☕', link: '/products?type=Printing' },
    { name: 'Doctor', emoji: '👨‍⚕️', link: '/doctors' },
    { name: 'Worker', emoji: '🔧', link: '/workers' },
    { name: 'Venues', emoji: '🏛️', link: '/venues' },
  ];

  return (
    <div className="bg-white overflow-hidden">
      
      {/* =================================================================== */}
      {/* INJECTED CSS — Custom keyframe animations (wave, float, blob, etc.) */}
      {/* =================================================================== */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-wave { animation: wave 10s linear infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out; }
        .animate-slide-in { animation: slideIn 0.6s ease-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* ======================================================================= */}
      {/* HERO SECTION — Big gradient banner with auto-rotating slides + waves    */}
      {/* ======================================================================= */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-all duration-1000 ease-in-out`}>
        
        {/* Floating blurry blobs for depth effect */}
        <div className="absolute top-0 -left-10 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-10 w-72 h-72 bg-yellow-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24 z-10">
          <div className="text-center text-white">
            
            {/* Animated Floating Emoji */}
            <div className="text-6xl sm:text-8xl mb-4 animate-float inline-block">
              {heroSlides[currentSlide].emoji}
            </div>

            {/* Main Hero Title with Fade Animation (key triggers re-animation on slide change) */}
            <h1 
              key={currentSlide}
              className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight animate-fade-up"
            >
              {heroSlides[currentSlide].title}
            </h1>
            <p 
              key={`sub-${currentSlide}`}
              className="text-base sm:text-xl text-white/90 font-medium mb-8 animate-fade-up"
            >
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                🛒 Explore Products 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi,%20I%20need%20more%20info%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                💬 WhatsApp Us
              </a>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* ANIMATED WAVE DIVIDER AT BOTTOM — SVG with continuous motion */}
        {/* ============================================================= */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-[200%] h-16 sm:h-24 animate-wave"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* QUICK CATEGORIES SCROLL BAR — Horizontal scroll quick access icons     */}
      {/* ======================================================================= */}
      <section className="bg-white border-b border-gray-100 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
          <div className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => navigate(cat.link)}
                className="flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-[90px] group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm group-hover:shadow-md group-hover:-translate-y-1 group-hover:bg-blue-50 transition-all duration-300 border border-gray-100">
                  {cat.emoji}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* OUR SERVICES SECTION — Main grid showing all 6 modules of website      */}
      {/* ======================================================================= */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          
          {/* Section Heading */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Our Services
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Everything You Need, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">One Place</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
              From school products to professional services — explore our complete range of trusted solutions.
            </p>
          </div>

          {/* Service Cards Grid - 2 cols mobile / 3 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                onClick={() => navigate(service.link)}
                className="group relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Hover Gradient Background Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer"></div>

                <div className="relative z-10">
                  {/* Service Icon Box with gradient */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${service.bgLight} group-hover:bg-white/20 flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className={`text-sm sm:text-lg font-black ${service.textColor} group-hover:text-white mb-1 sm:mb-2 transition-colors`}>
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 transition-colors leading-snug">
                    {service.desc}
                  </p>
                  
                  {/* Arrow Icon */}
                  <div className="mt-3 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* WHY CHOOSE US SECTION — Trust badges & feature highlights              */}
      {/* ======================================================================= */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 relative overflow-hidden">
        
        {/* Decorative background floating circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-white/10 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 backdrop-blur-sm border border-white/20">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Trusted by <span className="text-yellow-400">10,000+</span> Customers
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              We deliver quality services with speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl mb-3 animate-bounce-slow inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-black text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* HOW IT WORKS SECTION — 3 Step process for customers                    */}
      {/* ======================================================================= */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Get started in just 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {[
              { step: '01', title: 'Browse & Select', desc: 'Explore our catalog and pick products or services you need', icon: '🔍', color: 'bg-blue-500' },
              { step: '02', title: 'Order on WhatsApp', desc: 'Click "Order Now" and send details directly on WhatsApp', icon: '💬', color: 'bg-green-500' },
              { step: '03', title: 'Fast Delivery', desc: 'Get your products delivered or service booked quickly', icon: '🚚', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center animate-slide-in" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className={`${item.color} text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg relative`}>
                  {item.icon}
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* CTA / CONTACT SECTION — Final call-to-action with gradient box          */}
      {/* ======================================================================= */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl">
            
            {/* Decorative floating blobs */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
              <div className="text-5xl mb-4 animate-bounce-slow inline-block">📞</div>
              <h2 className="text-2xl sm:text-4xl font-black mb-3">
                Need Help? Talk to Us!
              </h2>
              <p className="text-white/90 mb-6 text-sm sm:text-base max-w-xl mx-auto">
                Our team is available on WhatsApp 24/7 for quick orders, custom requirements, or any queries.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                💬 Chat on WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* FOOTER — Simple branding + copyright                                    */}
      {/* ======================================================================= */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm font-semibold text-white mb-1">DR Services</p>
        <p className="text-xs">© {new Date().getFullYear()} All Rights Reserved. Made with ❤️ in India.</p>
      </footer>

    </div>
  );
};

export default Home;