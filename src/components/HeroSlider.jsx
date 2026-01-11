import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader, ArrowRight } from 'lucide-react';
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

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    // FIX 1: Taller height for "Suite" look (500px mobile, 85% screen desktop)
    <div className="relative h-[500px] md:h-[85vh] w-full overflow-hidden bg-slate-900 group">
      
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
          {/* FIX 2: Image Fitting - object-center keeps the focus in the middle */}
          <img
            src={slide.image_url} 
            alt={slide.title}
            className="h-full w-full object-cover object-center" 
            onError={(e) => { e.target.src = "https://via.placeholder.com/1600x800?text=Rex360+Solutions+Banner" }}
          />

          {/* FIX 3: Professional Gradient Overlay (Better than flat black) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10" />

          {/* Text Content - Perfectly Centered & Moderate Sizes */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 md:px-12">
            <div className={`transition-all duration-700 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                
                {/* 1. COMPANY BADGE (Small & Elegant) */}
                <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-cac-green text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6">
                  REX360 Solutions
                </span>

                {/* 2. MAIN TITLE (Moderate Size - Not too huge) */}
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto drop-shadow-xl">
                  {slide.title}
                </h1>

                {/* 3. SUBTITLE (Readable & Clean) */}
                <p className="text-slate-200 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8 opacity-90">
                  {slide.subtitle}
                </p>

                {/* 4. BUTTON (Professional Pill Shape) */}
                <Link to="/register/Business Name">
                    <button className="bg-cac-green hover:bg-green-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                      GET STARTED <ArrowRight size={18} />
                    </button>
                </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows (Hidden on mobile for cleaner look, Visible on Desktop) */}
      {slides.length > 1 && (
        <>
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:block"
            >
                <ChevronLeft size={28} />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hidden md:block"
            >
                <ChevronRight size={28} />
            </button>
        </>
      )}

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current ? "bg-cac-green w-8" : "bg-white/40 w-2 hover:bg-white"
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;