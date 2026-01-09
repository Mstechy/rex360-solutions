import React, { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient'; // Connect to Admin Data

const NigeriaSymbol = () => {
  // 1. State for the dynamic image
  const [sealImage, setSealImage] = useState('/oat.png');

  // 2. Fetch the "Real" seal from Supabase
  useEffect(() => {
    const fetchSeal = async () => {
      const { data } = await supabase
        .from('site_assets')
        .select('image_url')
        .eq('key', 'oat_seal') // Matches the key we set in Admin
        .single();

      if (data && data.image_url) {
        setSealImage(data.image_url);
      }
    };

    fetchSeal();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50 px-8 flex flex-col items-center text-center">
      <div className="max-w-4xl mx-auto">
        
        {/* Central Image Container */}
        <div className="flex justify-center items-center space-x-6 md:space-x-12 mb-10">
          {/* Left Decorative Pillar */}
          <div className="w-1.5 h-32 bg-cac-green rounded-full hidden md:block opacity-80"></div>
          
          <div className="relative group">
            {/* Pulse Effect */}
            <div className="absolute -inset-2 bg-green-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity"></div>
            
            {/* Dynamic Image Container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center">
              <img 
                src={sealImage} 
                alt="Strength of Nigeria" 
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { 
                  e.target.src = "/oat.png"; // Fallback if DB link breaks
                }}
              />
            </div>
          </div>

          {/* Right Decorative Pillar */}
          <div className="w-1.5 h-32 bg-cac-green rounded-full hidden md:block opacity-80"></div>
        </div>

        {/* Text Section */}
        <h2 className="text-3xl md:text-4xl font-black text-cac-blue uppercase tracking-tighter mb-6">
          Authored by the Strength of Nigeria
        </h2>
        
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-slate-600 font-semibold leading-relaxed">
            Rex360 Solutions operates under the strict guidelines of the Corporate Affairs Commission 
            to deliver authentic, verified, and federally recognized registration services for all 
            Nigerian entrepreneurs.
          </p>
          
          {/* Small Verification Badge */}
          <div className="inline-flex items-center space-x-2 bg-cac-blue text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
            <span>Official Accredited Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NigeriaSymbol;