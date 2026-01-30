import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../SupabaseClient';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
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

        if (!error && data && data.length > 0) {
          // Show all slides from database, even those without titles
          setSlides(data);
          console.log('✅ Connected to Supabase - Auto-sliding enabled with', data.length, 'slides from database');
        } else {
          console.log('⚠️ No slides found in database - Please add slides manually to hero_slides table');
          setSlides([]);
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
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  return (
    <section className="w-full bg-white py-2 md:py-4 px-4 md:px-12 lg:px-24">
      {/* 1. THE CONTAINER: Increased height for better first impression */}
      <div className="max-w-[1100px] mx-auto relative overflow-hidden rounded-[24px] md:rounded-[40px] shadow-2xl h-[75vh] min-h-[500px] w-full bg-slate-800">

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
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 flex flex-col items-center justify-center text-center p-6 z-20">
              {/* Default content when no slides */}
              <div className="mb-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008751] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008751]"></span>
                </span>
                <p className="text-white text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                  CAC REX360 SOLUTIONS
                </p>
              </div>
              <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 drop-shadow-xl">
                REX360 SOLUTIONS
              </h1>
              <p className="text-white/90 text-[13px] md:text-lg font-medium max-w-[260px] md:max-w-xl mx-auto mb-6 leading-relaxed">
                Your Digital Partner for Success
              </p>
              <Link to="/register">
                <button className="bg-[#008751] hover:bg-white hover:text-[#008751] text-white px-7 py-2.5 md:px-9 md:py-3.5 rounded-xl font-bold uppercase text-[12px] md:text-sm transition-all duration-300 shadow-lg flex items-center gap-2">
                  Start Now <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        )}

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* 2. THE PICTURE: Separated from the text layer for clarity */}
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover scale-105"
              loading="eager"
              crossOrigin="anonymous"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 flex flex-col items-center justify-center text-center p-6 z-20">
              
              {/* 3. THE BADGE: Compact and elegant */}
              <div className="mb-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008751] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008751]"></span>
                </span>
                <p className="text-white text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                  CAC REX360 SOLUTIONS
                </p>
              </div>

              {/* 4. THE TITLE: Reduced size slightly below the badge */}
              <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 drop-shadow-xl">
                {slide.title}
              </h1>

              {/* 5. THE SUBTITLE: Scaled down for professional balance */}
              <p className="text-white/90 text-[13px] md:text-lg font-medium max-w-[260px] md:max-w-xl mx-auto mb-6 leading-relaxed">
                {slide.subtitle}
              </p>

              {/* 6. THE BUTTON: High-contrast call to action */}
              <Link to="/register">
                <button className="bg-[#008751] hover:bg-white hover:text-[#008751] text-white px-7 py-2.5 md:px-9 md:py-3.5 rounded-xl font-bold uppercase text-[12px] md:text-sm transition-all duration-300 shadow-lg flex items-center gap-2">
                  Start Now <ArrowRight size={16} />
                </button>
              </Link>

              {/* 6.5. KEY SERVICES PREVIEW: Show main services without scrolling */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-xs md:text-sm uppercase tracking-wide">Business Name</div>
                  <div className="text-white/80 text-[10px] md:text-xs">From ₦15,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-xs md:text-sm uppercase tracking-wide">Company Reg</div>
                  <div className="text-white/80 text-[10px] md:text-xs">From ₦150,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-xs md:text-sm uppercase tracking-wide">Trademark</div>
                  <div className="text-white/80 text-[10px] md:text-xs">From ₦50,000</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-xs md:text-sm uppercase tracking-wide">NGO Reg</div>
                  <div className="text-white/80 text-[10px] md:text-xs">From ₦200,000</div>
                </div>
              </div>

              {/* 6.6. TRUST INDICATORS: Build credibility at first glance */}
              <div className="mt-6 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">CAC Accredited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Fast Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">100% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
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