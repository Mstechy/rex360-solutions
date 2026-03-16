import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end space-y-4">
      
      {/* Email Pop-out (Desktop Only) */}
      <div className="hidden md:flex flex-col items-end space-y-2 mb-2">
        <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-slate-100 flex items-center space-x-2 animate-bounce">
          <Mail size={16} className="text-cac-blue" />
          <span className="text-xs font-bold text-slate-700">info@rex360solutions.com</span>
        </div>
      </div>

      {/* The WhatsApp Button */}
      <a 
        href="https://wa.me/2349048349548" 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative group"
      >
        {/* 1. The Red Notification Badge (Kept) */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse z-20 border-2 border-white shadow-sm">
          1
        </div>

        {/* 2. The Ripple/Heartbeat Animation (NEW) */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-1000"></span>
        
        {/* 3. The Main Icon Button */}
        <div className="relative z-10 bg-[#25D366] p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] text-white transform transition-all duration-300 hover:scale-110 hover:rotate-12 flex items-center justify-center">
          <FaWhatsapp size={32} />
        </div>

        {/* 4. Hover Label (Kept) */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 shadow-xl">
          Chat with Doris
        </span>
      </a>
    </div>
  );
};

export default FloatingContact;