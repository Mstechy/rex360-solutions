import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../SupabaseClient';

const HeroSlider = () => {
  // Start with a default slide so something always renders
  const [slides, setSlides] = useState([
    {
      id: 'default-1',
      title: 'REX360 SOLUTIONS',
      subtitle: 'Your Digital Partner for Success',
      image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop'
    }
  ]);
  
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  // Fetch slides from Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error("Supabase Error:", error.message);
          // Keep default slide if there's an error
        } else if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error("Failed to fetch slides:", err);
        // Keep default slide on any error
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length]);

  return (
    <section className="w-full bg-white py-4 md:py-8 px-4 md:px-12 lg:px-24">
      <h1>Hero Slider Component</h1>
      <div className="max-w-[1200px] mx-auto relative overflow-hidden rounded-[24px] md:rounded-[45px] shadow-2xl aspect-video w-full bg-slate-200">
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image Layer */}
            <img
              src={slide.image_url}
              alt={slide.title || 'Hero Slide'}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", slide.image_url);
                e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop';
              }}
            />
            
            {/* Overlay with Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 flex items-center justify-center text-center p-6 z-20">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-white/95 text-base md:text-xl lg:text-2xl font-semibold drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <Link to="/register">
                  <button className="bg-[#008751] hover:bg-[#006d40] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 md:gap-3 mx-auto text-sm md:text-base">
                    Get Started <ArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === current 
                    ? 'bg-white w-8 md:w-12' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center z-5">
            <div className="animate-pulse text-slate-500 text-lg">Loading...</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSlider;