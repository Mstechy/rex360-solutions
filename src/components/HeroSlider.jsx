import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { supabase } from '../SupabaseClient';

const defaultSlides = [
  {
    image_url: "/banner1.jpg",
    title: "Fast & Reliable CAC Registration",
    subtitle: "Get your Business Name or Company registered in record time."
  },
  {
    image_url: "/banner2.jpg",
    title: "Expert Trademark Protection",
    subtitle: "Secure your brand identity with our professional legal filing."
  },
  {
    image_url: "/banner3.jpg",
    title: "NGO & Foundation Setup",
    subtitle: "We handle the complex trusteeship paperwork for you."
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Slides from Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await supabase
          .from('hero_slides')
          .select('*')
          .order('id', { ascending: true });

        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error("Error loading slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // 2. Auto-display logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  return (
    // FIX 1: Adjusted Height (400px on mobile, 600px on laptop)
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-slate-900 group">
      
      {loading && (
        <div className="absolute inset-0 z-50 bg-slate-900 flex items-center justify-center">
          <Loader className="animate-spin text-cac-green" size={40} />
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          
          <img
            src={slide.image_url} 
            alt={slide.title}
            // FIX 2: Added 'object-top' so it doesn't cut off heads. Removed 'hover:scale' to stop zooming.
            className="h-full w-full object-cover object-top" 
            onError={(e) => { e.target.src = "https://via.placeholder.com/1600x800?text=Rex360+Solutions+Banner" }}
          />

          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <div className="animate-slideIn">
                <h1 className="text-white text-4xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight">
                <span className="text-cac-green">REX360</span> SOLUTIONS
                </h1>
                <h2 className="text-white text-2xl md:text-4xl font-bold max-w-3xl drop-shadow-md leading-tight">
                {slide.title}
                </h2>
                <p className="text-blue-100 mt-4 text-lg md:text-xl max-w-2xl font-medium">
                {slide.subtitle}
                </p>
                {/* FIX 3: Updated Link to match new structure */}
                <Link to="/register/Business Name">
                    <button className="mt-8 bg-cac-green hover:bg-cac-blue text-white px-10 py-4 rounded-full font-black transition-all transform hover:scale-105 shadow-2xl border-2 border-transparent hover:border-white">
                    REGISTER NOW
                    </button>
                </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Navigation Arrows */}
      {slides.length > 1 && (
        <>
            <button 
                onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-cac-green text-white backdrop-blur-sm transition-all"
            >
                <ChevronLeft size={30} />
            </button>
            <button 
                onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-cac-green text-white backdrop-blur-sm transition-all"
            >
                <ChevronRight size={30} />
            </button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                    idx === current ? "bg-cac-green w-8" : "bg-white/50 hover:bg-white"
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;