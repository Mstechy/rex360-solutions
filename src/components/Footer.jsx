import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CreditCard, User, Landmark } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cac-blue text-white pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-blue-800 pb-12">
        
        {/* Column 1: Company Info */}
        <div className="space-y-4">
          <img src="/logo.png" alt="Rex360 Logo" className="h-12 w-auto brightness-200" />
          <p className="text-blue-100 text-sm leading-relaxed">
            Rex360 Solutions is a premier digital consultancy and accredited CAC agent 
            dedicated to empowering Nigerian businesses.
          </p>
        </div>

        {/* Column 2: Quick Links - Updated with correct IDs */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-cac-green pl-3">Quick Links</h3>
          <ul className="space-y-3 text-blue-100 text-sm">
            <li>
              <a href="/#about-doris" className="hover:text-cac-green transition-colors flex items-center">
                <span className="mr-2">›</span> About Doris
              </a>
            </li>
            <li>
              <a href="/#services-section" className="hover:text-cac-green transition-colors flex items-center">
                <span className="mr-2">›</span> Our Services
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Payment Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-cac-green pl-3">Official Payments</h3>
          <div className="bg-blue-900/50 p-4 rounded-xl border border-blue-700">
            <ul className="space-y-2 text-sm text-blue-100 font-medium">
              <li className="flex items-center space-x-2">
                <User size={16} /> <span>Doris Yuenva Benson</span>
              </li>
              <li className="flex items-center space-x-2 text-white font-bold">
                <CreditCard size={16} /> <span>1422800582</span>
              </li>
              <li className="flex items-center space-x-2">
                <Landmark size={16} /> <span>Access Bank</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 text-center text-xs text-blue-400">
        <p>© 2026 REX360 SOLUTIONS. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;