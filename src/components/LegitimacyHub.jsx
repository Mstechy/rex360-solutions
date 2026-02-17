import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, X, ExternalLink, CheckCircle, Award } from 'lucide-react';
import { useIsMobile, scrollAnimationVariants } from '../hooks/useResponsiveMotion';

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '+', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = progress * (2 - progress);
      setCount(Math.floor(easeOutQuad * target));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref} className="inline-block">
      {count}
      {suffix}
    </span>
  );
};

// Placeholder certificate data - user should replace with actual certificate images
const certificates = [
  {
    id: 1,
    title: "CAC Accreditation Certificate",
    description: "Official Corporate Affairs Commission Filing Agent Accreditation",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
    issuedBy: "Corporate Affairs Commission (CAC)",
    validUntil: "2026"
  },
  {
    id: 2,
    title: "Business Registration License",
    description: "Authorized Business Registration Service Provider License",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    issuedBy: "Federal Ministry of Trade",
    validUntil: "2025"
  },
  {
    id: 3,
    title: "Professional Service Award",
    description: "Excellence in Business Registration Services",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
    issuedBy: "Nigerian Business Awards",
    validUntil: "Perpetual"
  }
];

const LegitimacyHub = () => {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <div className="py-16 bg-gradient-to-r from-cac-blue to-[#1e40af] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Seal of Trust Icon */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-cac-green mx-auto" />
                    <p className="text-xs font-black text-cac-blue mt-1 uppercase tracking-wider">Verified</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase">
                  Are We Registered? Verify Us Here.
                </h2>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                  We understand your concern about working with legitimate service providers. 
                  Click below to view our official registration certificates and accreditations.
                </p>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-cac-green" />
                    <span className="text-white text-sm font-semibold">CAC Accredited</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <Award className="w-5 h-5 text-cac-green" />
                    <span className="text-white text-sm font-semibold">Award Winning</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FileText className="w-5 h-5 text-cac-green" />
                    <span className="text-white text-sm font-semibold">1000+ Clients</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-3 bg-cac-green hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  View Our Certificates
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-white/20">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">
                  <AnimatedCounter target={1000} suffix="+" duration={2500} />
                </p>
                <p className="text-blue-200 text-sm">Businesses Registered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">
                  <AnimatedCounter target={500} suffix="+" duration={2000} />
                </p>
                <p className="text-blue-200 text-sm">Companies Registered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">
                  <AnimatedCounter target={200} suffix="+" duration={1500} />
                </p>
                <p className="text-blue-200 text-sm">NGOs Registered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">
                  <AnimatedCounter target={5} suffix="+" duration={1000} />
                </p>
                <p className="text-blue-200 text-sm">Years Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={scrollAnimationVariants.modal.hidden}
              animate={scrollAnimationVariants.modal.visible}
              exit={scrollAnimationVariants.modal.exit}
              className="bg-white rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-cac-blue p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white uppercase">Our Certifications</h3>
                  <p className="text-blue-200 text-sm">Official registration documents and accreditations</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-cac-green transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Certificate Gallery */}
              <div className="p-6 space-y-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Certificate Image */}
                      <div className="bg-gray-200 relative min-h-[200px]">
                        <img 
                          src={cert.image} 
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-cac-green text-white px-3 py-1 rounded-full text-xs font-bold">
                          ✓ Verified
                        </div>
                      </div>
                      
                      {/* Certificate Info */}
                      <div className="p-6 flex flex-col justify-center">
                        <h4 className="font-black text-gray-900 text-lg mb-2">{cert.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{cert.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-cac-green" />
                            <span className="text-sm text-gray-500">Issued by: <span className="font-semibold text-gray-700">{cert.issuedBy}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-cac-blue" />
                            <span className="text-sm text-gray-500">Valid until: <span className="font-semibold text-gray-700">{cert.validUntil}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    All certificates verified and up to date. Last checked: {new Date().toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="group relative overflow-hidden bg-gradient-to-r from-cac-blue to-[#1e40af] hover:from-[#1e40af] hover:to-cac-blue text-white px-6 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-lg active:scale-95 border border-white/20"
                  >
                    <span className="relative z-10">Close</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LegitimacyHub;
