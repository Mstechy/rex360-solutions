import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../SupabaseClient';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const observerRef = useRef(null);

  // Optimized image loading with WebP support and lazy loading
  const getOptimizedImageUrl = useCallback((url, width = 1920, height = 1080) => {
    if (!url) return url;
    // Convert to WebP if supported, with responsive sizes
    const webpUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return `${webpUrl}?w=${width}&h=${height}&fit=crop&auto=format`;
  }, []);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase.from('hero_slides').select('*').order('id', { ascending: true });
        console.log('Slides from Admin Dashboard:', data);

        if (error) {
          console.error('❌ Supabase Error:', error.message);
          setError(error.message);
          setSlides([]);
        } else if (data && data.length > 0) {
          // Show all slides from database, even those without titles
          setSlides(data);
          setError(null);
          console.log('✅ Connected to Supabase - Auto-sliding enabled with', data.length, 'slides from database');
        } else {
          console.log('⚠️ No slides found in database - Please add slides manually to hero_slides table');
          setSlides([]);
          setError(null);
        }

        // Preload images for all slides with optimization
        const slidesToUse = data && data.length > 0 ? data : [];
        slidesToUse.forEach(slide => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [slide.id]: true }));
          };
          img.onerror = () => {
            setImageErrors(prev => ({ ...prev, [slide.id]: true }));
            // Fallback to optimized placeholder
            setLoadedImages(prev => ({ ...prev, [slide.id]: 'https://via.placeholder.com/1920x1080?text=REX360+SOLUTIONS' }));
          };
          img.src = getOptimizedImageUrl(slide.image_url);
        });
      } catch (err) {
        console.error('❌ Error connecting to Admin Dashboard:', err);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [getOptimizedImageUrl]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 4000); // Slightly faster for better engagement
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  return (
    <section 
      className="w-full bg-white py-2 md:py-4 px-4 md:px-12 lg:px-24"
      aria-label="Hero slider showcasing REX360 Solutions services"
      role="banner"
    >
      {/* 1. THE CONTAINER: Improved responsive height and sizing */}
      <div className="max-w-[1100px] mx-auto relative overflow-hidden rounded-[24px] md:rounded-[40px] shadow-2xl h-[70vh] sm:h-[75vh] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] w-full bg-slate-800">

        {/* Fallback background when no slides are available */}
        {slides.length === 0 && (
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
              alt="REX360 Solutions Background"
              className="w-full h-full object-cover scale-105"
              loading="eager"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 flex flex-col items-center justify-center text-center p-4 sm:p-6 z-20">
              {/* Default content when no slides */}
              <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008751] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[#008751]"></span>
                </span>
                <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
                  CAC REX360 SOLUTIONS
                </p>
              </div>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-4 drop-shadow-xl leading-tight px-4">
                REX360 SOLUTIONS
              </h1>
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-xs sm:max-w-sm md:max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                Your Digital Partner for Success
              </p>
              <Link to="/services">
                <button className="group relative overflow-hidden bg-gradient-to-r from-[#008751] to-cac-green hover:from-white hover:to-gray-50 hover:text-[#008751] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-xl font-bold uppercase text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 border-2 border-transparent hover:border-[#008751] flex items-center gap-2 sm:gap-3">
                  <span className="relative z-10 tracking-wider">Start Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                </button>
              </Link>
            </div>
          </div>
        )}

        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={false}
            animate={{
              x: index === current ? 0 : index < current ? -100 : 100,
              opacity: index === current ? 1 : 0
            }}
            transition={{
              x: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.4, ease: "easeInOut" }
            }}
            aria-hidden={index !== current}
          >
            {/* 2. THE PICTURE: Separated from the text layer for clarity */}
            <img
              src={slide.image_url}
              alt={slide.title || `Slide ${index + 1}: ${slide.subtitle || 'REX360 Solutions service'}`}
              className="w-full h-full object-cover scale-105"
              loading="eager"
              crossOrigin="anonymous"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 flex flex-col items-center justify-center text-center p-4 sm:p-6 z-20">
              
              {/* 3. THE BADGE: Compact and elegant */}
              <div className="mb-4 sm:mb-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008751] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[#008751]"></span>
                </span>
                <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
                  CAC REX360 SOLUTIONS
                </p>
              </div>

              {/* 4. THE TITLE: Reduced size slightly below the badge */}
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-4 drop-shadow-xl leading-tight px-4">
                {slide.title}
              </h1>

              {/* 5. THE SUBTITLE: Scaled down for professional balance */}
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-xs sm:max-w-sm md:max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                {slide.subtitle}
              </p>

              {/* 6. THE BUTTON: High-contrast call to action */}
              <Link to="/services">
                <button className="group relative overflow-hidden bg-gradient-to-r from-[#008751] to-cac-green hover:from-white hover:to-gray-50 hover:text-[#008751] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-xl font-bold uppercase text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 border-2 border-transparent hover:border-[#008751] flex items-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
                  <span className="relative z-10 tracking-wider">Start Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                </button>
              </Link>

              {/* 6.5. KEY SERVICES PREVIEW: Improved mobile layout */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight">Business Name</div>
                  <div className="text-white/80 text-[10px] sm:text-xs">From ₦15,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight">Company Reg</div>
                  <div className="text-white/80 text-[10px] sm:text-xs">From ₦150,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight">Trademark</div>
                  <div className="text-white/80 text-[10px] sm:text-xs">From ₦50,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight">NGO Reg</div>
                  <div className="text-white/80 text-[10px] sm:text-xs">From ₦200,000</div>
                </div>
              </div>

              {/* 6.6. TRUST INDICATORS: Improved mobile layout */}
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-white/90 px-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">24/7 Support</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">CAC Accredited</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Fast Processing</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">100% Success Rate</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* 7. THE INDICATORS: Placed at the very bottom separately */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30" role="tablist" aria-label="Slide indicators">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 ${
                  index === current ? 'bg-white w-8 h-1' : 'bg-white/30 w-3 h-1 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                aria-selected={index === current}
                role="tab"
                tabIndex={index === current ? 0 : -1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSlider;