import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        {/* REX360 Logo Construction */}
        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-xl">
            <span className="text-white font-black text-2xl">R</span>
        </div>
        <h1 className="text-slate-900 font-black text-xl tracking-tighter">REX360</h1>
        <p className="text-xs font-bold text-cac-green uppercase tracking-widest mb-8">Solutions</p>
        
        {/* Spinner */}
        <Loader className="animate-spin text-slate-400" size={24} />
      </div>
    </div>
  );
};

export default LoadingScreen;