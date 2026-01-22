import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CreditCard, User, Landmark, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact-footer" className="bg-cac-blue text-white pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-blue-800 pb-12">

        {/* Column 1: Company Info */}
        <div className="space-y-4">
          <img src="/logo.png" alt="Rex360 Logo" className="h-12 w-auto brightness-200" />
          <p className="text-blue-100 text-sm leading-relaxed">
            Rex360 Solutions is a premier digital consultancy and accredited CAC agent
            dedicated to empowering Nigerian businesses.
          </p>
        </div>

        {/* Column 2: Quick Links */}
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

        {/* Column 3: Contact Info & Social Media */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-l-4 border-cac-green pl-3">Contact Us</h3>
          <div className="space-y-3 text-blue-100 text-sm">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-cac-green flex-shrink-0" />
              <a href="tel:09048349548" className="hover:text-cac-green transition-colors">
                09048349548
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-cac-green flex-shrink-0" />
              <a href="mailto:info@rex360solutions.com" className="hover:text-cac-green transition-colors">
                info@rex360solutions.com
              </a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="pt-4 border-t border-blue-700">
            <h4 className="text-lg font-bold text-blue-100 mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/rex360_solution?igsh=MW84MmwzNXF1MnNxOA=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-pink-50 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} className="text-pink-500 hover:text-pink-600" />
              </a>
              <a
                href="https://www.tiktok.com/@rex360solutions?_r=1&_t=ZS-93HemRyiqsn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300"
                aria-label="Follow us on TikTok"
              >
                {/* Custom TikTok SVG Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-black hover:text-gray-800" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
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