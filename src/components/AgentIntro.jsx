import React, { useEffect, useState } from 'react';

import { supabase } from '../SupabaseClient'; // Connect to Admin Data

const AgentIntro = () => {
  // 1. State starts empty so no static/checkerboard image shows by default
  const [agentImage, setAgentImage] = useState(''); 

  // 2. Fetch the "Real" photo from Supabase
  
  useEffect(() => {
    const fetchAgentPhoto = async () => {
      const { data } = await supabase
        .from('site_assets')
        .select('image_url')
        .eq('key', 'agent_photo') // We look for the key we set in Admin
        .single();

      if (data && data.image_url) {
        setAgentImage(data.image_url);
      }
    };

    fetchAgentPhoto();
  }, []);

  return (
    <section id="about-doris" className="py-24 px-8 bg-white overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Professional Description - EXACTLY AS YOU WROTE IT */}
        <div className="space-y-8 animate-fadeIn">
          <div className="inline-block px-5 py-2 bg-green-50 border-l-8 border-cac-green text-cac-green font-black text-xs tracking-[0.2em] uppercase rounded-r-lg shadow-sm">
            CAC Accredited Agent
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-cac-blue leading-[1.1] tracking-tighter">
            Doris Yuenva <br />
            <span className="text-cac-green">Benson</span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            With years of experience in corporate law and business consultancy, Doris provides 
            expert guidance for entrepreneurs navigating the CAC registration process. Her 
            dedication ensures that your business documentation is well-structured, compliant, 
            and processed with maximum speed.
          </p>
          <div className="flex items-center space-x-6 pt-6">
            <div className="h-2 w-24 bg-cac-green rounded-full"></div>
            <span className="text-cac-blue font-black italic uppercase tracking-widest text-sm">
                Professionalism • Speed • Integrity
            </span>
          </div>
        </div>

        {/* Right Side: Dynamic Image ONLY */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full flex items-center justify-center p-4 blinking-border shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            
            <div className="w-full h-full rounded-full bg-white overflow-hidden border-8 border-white shadow-inner flex items-center justify-center">
              {/* Only show the image if it exists in your database */}
              {agentImage && (
                <img 
                  src={agentImage} 
                  alt="Doris Yuenva Benson" 
                  className="w-full h-full object-cover transform transition-transform duration-1000 hover:scale-110 grayscale-0 hover:grayscale-0"
                />
              )}
            </div>

            <div className="absolute -bottom-4 -right-2 md:right-8 bg-cac-blue text-white px-8 py-3 rounded-full shadow-2xl font-black text-sm animate-bounce tracking-[0.3em] border-2 border-white uppercase">
              VERIFIED
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AgentIntro;