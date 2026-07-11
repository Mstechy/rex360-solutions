import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ZoomIn, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { useIsMobile } from '../hooks/useResponsiveMotion';

// Import your images
import testmo1 from '/testmo1.png';
import testmo2 from '/testmo2.png';
import testmo3 from '/testmo3.png';
import testmo4 from '/testmo4.png';
import testmo5 from '/testmo5.png';

const deliveryProofs = [
  { id: 1, image: testmo1 },
  { id: 2, image: testmo2 },
  { id: 3, image: testmo3 },
  { id: 4, image: testmo4 },
  { id: 5, image: testmo5 },
  { id: 6, image: testmo1 }
];

const ProofOfDelivery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  
  // Touch state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const isMobile = useIsMobile();

  // 1. DYNAMIC SIZING: Determine how many items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(3);      // Desktop: 3 items (Medium size)
      else if (window.innerWidth >= 768) setItemsPerPage(2);  // iPad: 2 items
      else setItemsPerPage(1);                                // Mobile: 1 item
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. AUTO-SLIDE ENGINE
  useEffect(() => {
    if (!autoSlideEnabled) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // 3 seconds per slide
    return () => clearInterval(interval);
  }, [autoSlideEnabled, currentIndex, itemsPerPage]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = deliveryProofs.length - itemsPerPage;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const maxIndex = deliveryProofs.length - itemsPerPage;
      return prev === 0 ? maxIndex : prev - 1;
    });
  };

  // 3. TOUCH HANDLERS
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setAutoSlideEnabled(false);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    setAutoSlideEnabled(true);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') setSelectedImage(null);
      } else {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <div className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Verified Success
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Real Results, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Real Clients</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. See the actual delivery confirmations from our satisfied partners.
          </p>
        </motion.div>

        {/* CAROUSEL CONTAINER */}
        <div 
          className="relative group px-2"
          onMouseEnter={() => setAutoSlideEnabled(false)}
          onMouseLeave={() => setAutoSlideEnabled(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden py-8 -my-8"> {/* Negative margin to allow shadows to breathe */}
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {deliveryProofs.map((proof) => (
                <motion.div
                  key={proof.id}
                  className="flex-shrink-0 px-4 transition-all duration-500"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  {/* --- CARD START: RESIZED & RE-STYLED --- */}
                  <div
                    onClick={() => { setSelectedImage(proof); setAutoSlideEnabled(false); }}
                    className="
                      relative cursor-pointer mx-auto
                      bg-white rounded-[2rem] shadow-xl hover:shadow-2xl 
                      hover:-translate-y-2 transition-all duration-300 
                      border-[6px] border-white ring-1 ring-gray-200
                      overflow-hidden
                      max-w-[280px] md:max-w-[320px] /* PHONE WIDTH LIMIT */
                      aspect-[9/16] /* PHONE ASPECT RATIO */
                    "
                  >
                    {/* Fake Phone Header */}
                    <div className="bg-gray-100 h-6 w-full absolute top-0 z-10 flex justify-center items-center">
                       <div className="w-16 h-4 bg-black rounded-b-xl"></div>
                    </div>

                    <img
                      src={proof.image}
                      alt="Delivery Proof"
                      className="w-full h-full object-cover"
                    />

                    {/* Premium Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                       <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                          <ZoomIn size={18} />
                          <span className="font-semibold text-sm">View Proof</span>
                       </div>
                    </div>

                    {/* WhatsApp Badge */}
                    <div className="absolute top-8 right-4 bg-[#25D366] text-white p-1.5 rounded-full shadow-lg z-20">
                      <MessageCircle size={16} fill="white" />
                    </div>
                  </div>
                  {/* --- CARD END --- */}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all z-20 border border-gray-100 group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform"/>
          </button>
          <button 
            onClick={handleNext}
            className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all z-20 border border-gray-100 group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform"/>
          </button>
        </div>

        {/* PAGINATION DOTS */}
        <div className="flex justify-center mt-10 gap-3">
          {Array.from({ length: deliveryProofs.length - itemsPerPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* PREMIUM CTA BUTTON */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-blue-100 to-white shadow-lg">
             <div className="bg-white rounded-xl px-6 py-8 md:px-12">
                <p className="text-gray-600 font-medium mb-6">Ready to get your own success story?</p>
                <Link
                  to="/services"
                  className="
                    group relative inline-flex items-center gap-3 
                    bg-gradient-to-r from-blue-700 to-blue-600 
                    hover:from-blue-600 hover:to-blue-500 
                    text-white font-bold py-4 px-10 rounded-xl 
                    shadow-lg hover:shadow-blue-500/30 
                    transition-all duration-300 transform hover:-translate-y-1
                  "
                >
                  <span className="relative z-10 text-lg">Start Your Registration</span>
                  <ChevronRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" size={20} />
                  
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shine" />
                </Link>
             </div>
          </div>
        </motion.div>
      </div>

      {/* --- LIGHTBOX (MODAL) --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setSelectedImage(null); setAutoSlideEnabled(true); }}
          >
            {/* Modal Close */}
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md">
              <X size={24} />
            </button>

            {/* Modal Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-[400px] max-h-[85vh] 
                bg-white rounded-3xl overflow-hidden shadow-2xl 
                flex flex-col border border-white/20
              "
            >
              {/* WhatsApp-style Header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 text-white shrink-0">
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm">Official Delivery</h3>
                    <p className="text-xs text-green-100 opacity-80">Verified Chat</p>
                 </div>
              </div>

              {/* Scrollable Image Area */}
              <div className="flex-1 overflow-y-auto bg-[#ECE5DD] custom-scrollbar p-0">
                <img 
                  src={selectedImage.image} 
                  alt="Full Chat" 
                  className="w-full h-auto block"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProofOfDelivery;