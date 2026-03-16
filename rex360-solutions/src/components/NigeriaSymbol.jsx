
import React, { useState, useEffect,} from 'react';
import { supabase } from '../SupabaseClient'; // Connect to Admin Data

const NigeriaSymbol = () => {
  // 1. State for the dynamic image
  const [sealImage, setSealImage] = useState('/oat.png');

  // 2. Fetch the "Real" seal from Supabase
  useEffect(() => {
    const fetchSeal = async () => {
      console.log('🔍 Fetching oat_seal from Supabase...');
      
      const { data, error } = await supabase
        .from('site_assets')
        .select('image_url')
        .eq('key', 'oat_seal') // Matches the key we set in Admin
        .single();

      console.log('📥 Supabase response for oat_seal:', { data, error });

      if (error) {
        console.error('❌ Error fetching oat_seal:', error);
        return;
      }

      if (data && data.image_url) {
        console.log('✅ OAT Seal URL fetched:', data.image_url);
        setSealImage(data.image_url);
      } else {
        console.log('⚠️ No image_url in data for oat_seal');
      }
    };

    fetchSeal();
  }, []);

  return (
    <section className="py-8 bg-gradient-to-b from-white to-green-50 px-4 sm:px-8 flex flex-col items-center text-center">
      <div className="max-w-3xl mx-auto">

        {/* Central Image Container */}
        <div className="flex justify-center items-center space-x-4 md:space-x-6 mb-4">
          {/* Left Decorative Pillar */}
          <div className="w-1 h-16 md:w-1.5 md:h-20 bg-cac-green rounded-full hidden md:block opacity-80"></div>

          <div className="relative group">
            {/* Pulse Effect */}
            <div className="absolute -inset-1 md:-inset-1.5 bg-green-400 rounded-full blur-lg md:blur-xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity"></div>

            {/* Dynamic Image Container */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 md:border-3 border-white shadow-lg md:shadow-xl overflow-hidden bg-white flex items-center justify-center">
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
          <div className="w-1 h-16 md:w-1.5 md:h-20 bg-cac-green rounded-full hidden md:block opacity-80"></div>
        </div>

        {/* Text Section */}
        <h2 className="text-xl md:text-2xl font-black text-cac-blue uppercase tracking-tighter mb-3">
          Authored by the Strength of Nigeria
        </h2>

        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-slate-600 font-semibold leading-relaxed text-xs md:text-sm">
            Rex360 Solutions operates under the strict guidelines of the Corporate Affairs Commission
            to deliver authentic, verified, and federally recognized registration services for all
            Nigerian entrepreneurs.
          </p>

          {/* Small Verification Badge */}
          <div className="inline-flex items-center space-x-2 bg-cac-blue text-white px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black tracking-widest uppercase">
            <span>Official Accredited Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NigeriaSymbol;
