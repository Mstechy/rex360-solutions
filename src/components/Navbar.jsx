import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'SERVICES', path: '/#services-section', isHash: true },
    { name: 'NEWS', path: '/news' },
    { name: 'ABOUT', path: '/#about-doris', isHash: true },
    { name: 'CONTACT', path: '/#contact-footer', isHash: true },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-[100] border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* LOGO SECTION - Medium Size */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
              <div className="w-24 md:w-32 h-12 md:h-16 overflow-hidden flex items-center justify-center bg-transparent">
                <img
                  src="/logo.png"
                  alt="Rex360 Logo"
                  className="w-full h-full object-contain scale-100 filter contrast-150 brightness-110 mix-blend-multiply transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x80?text=REX360";
                  }}
                />
              </div>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a key={link.name} href={link.path} className="text-slate-600 hover:text-cac-blue font-bold text-sm tracking-wide transition-colors">
                  {link.name}
                </a>
              ) : link.isHash ? (
                <a key={link.name} href={link.path} className="text-slate-600 hover:text-cac-blue font-bold text-sm tracking-wide transition-colors">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.path} className="text-slate-600 hover:text-cac-blue font-bold text-sm tracking-wide transition-colors">
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* DESKTOP CTA */}
          <div className="hidden md:block">
            <Link to="/register">
              <button className="group relative overflow-hidden bg-gradient-to-r from-cac-green to-emerald-500 hover:from-emerald-400 hover:to-green-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-extrabold text-sm transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/30">
                <span className="relative z-10 tracking-wider">GET STARTED</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2 focus:outline-none hover:bg-slate-50 rounded-lg"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        id="mobile-menu"
        className={`lg:hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-200 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-6 pt-2 pb-6 space-y-4">
          {navLinks.map((link) => (
             link.isExternal ? (
                <a key={link.name} href={link.path} onClick={() => setIsOpen(false)} className="block text-slate-700 font-bold py-3 border-b border-slate-50 hover:text-cac-green">
                  {link.name}
                </a>
             ) : link.isHash ? (
              <a key={link.name} href={link.path} onClick={() => setIsOpen(false)} className="block text-slate-700 font-bold py-3 border-b border-slate-50 hover:text-cac-green">
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block text-slate-700 font-bold py-3 border-b border-slate-50 hover:text-cac-green">
                {link.name}
              </Link>
            )
          ))}
          {/* FIX: Wrapped Mobile Button in Link */}
          <Link to="/register" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-cac-green text-white py-4 rounded-xl font-black mt-4 shadow-lg active:scale-95 transition-transform">
              GET STARTED
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;