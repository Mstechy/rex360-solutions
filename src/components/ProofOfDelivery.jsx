import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ZoomIn, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useIsMobile, scrollAnimationVariants } from '../hooks/useResponsiveMotion';
import testmo1 from '/testmo1.png';
import testmo2 from '/testmo2.png';
import testmo3 from '/testmo3.png';
import testmo4 from '/testmo4.png';
import testmo5 from '/testmo5.png';

// Placeholder data - user can replace with their actual WhatsApp chat screenshots
const deliveryProofs = [
  {
    id: 1,
    image: testmo1
  },
  {
    id: 2,
    image: testmo2
  },
  {
    id: 3,
    image: testmo3
  },
  {
    id: 4,
    image: testmo4
  },
  {
    id: 5,
    image: testmo5
  },
  {
    id: 6,
    image: testmo1
  }
];

const ProofOfDelivery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();

  const minSwipeDistance = 50;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(deliveryProofs[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = (e) => {
    e?.stopPropagation();
    const nextIndex = (currentIndex + 1) % deliveryProofs.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(deliveryProofs[nextIndex]);
  };

  const goToPrev = (e) => {
    e?.stopPropagation();
    const prevIndex = (currentIndex - 1 + deliveryProofs.length) % deliveryProofs.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(deliveryProofs[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Auto-sliding functionality
  useEffect(() => {
    if (!autoSlideEnabled || deliveryProofs.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % deliveryProofs.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [autoSlideEnabled, deliveryProofs.length]);

  return (
    <div className="py-8 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-cac-blue mb-3 md:mb-4 uppercase tracking-tight px-2">
            Real Results, Real Clients.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 md:px-0">
            See what our clients are saying after receiving their documents. 
            These are real WhatsApp messages from satisfied customers.
          </p>
          <div className="w-16 md:w-24 h-1 bg-cac-green mx-auto mt-4 md:mt-6"></div>
        </motion.div>

        {/* Auto-Sliding Container - Shows one testimonial at a time */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentSlide * 100}%`
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            onHoverStart={() => setAutoSlideEnabled(false)}
            onHoverEnd={() => setAutoSlideEnabled(true)}
          >
            {deliveryProofs.map((proof, index) => (
              <motion.div
                key={proof.id}
                className="w-full flex-shrink-0 px-2"
                initial={scrollAnimationVariants.fadeUpResponsive(isMobile)}
                whileInView={scrollAnimationVariants.fadeUp.visible}
                viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
                transition={{
                  delay: index * (isMobile ? 0.05 : 0.1),
                  duration: isMobile ? 0.4 : 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <motion.div
                  onClick={() => openLightbox(index)}
                  className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-cac-green transform hover:-translate-y-1 max-w-md mx-auto"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* WhatsApp Chat Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={proof.image}
                      alt="WhatsApp chat"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Overlay with zoom icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                        <div className="bg-white/90 p-2 md:p-3 rounded-full">
                          <ZoomIn className="text-cac-blue w-5 h-5 md:w-6 md:h-6" />
                        </div>
                      </div>
                    </div>
                    {/* WhatsApp indicator */}
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-[#25D366] text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WA</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {deliveryProofs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-cac-green scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section - Fully Responsive */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12 px-4"
        >
          <div className="inline-block bg-gradient-to-br from-cac-blue via-[#1e40af] to-[#3730a3] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-8 rounded-2xl shadow-2xl hover:shadow-3xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-3 sm:mb-4 md:mb-5 text-blue-100">
              Want to join our happy clients?
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-cac-green to-emerald-500 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 lg:px-8 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-transparent hover:border-white/30"
            >
              <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide">Get Started Today</span>
              <span className="text-base sm:text-lg md:text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal - Fully Responsive */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 md:p-4"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-cac-green transition-colors z-10 p-2"
            >
              <X size={24} className="md:w-8 md:h-8" />
            </button>

            {/* Navigation Arrows - Hidden on very small screens, shown on mobile and up */}
            <button 
              onClick={goToPrev}
              className="absolute left-1 sm:left-2 md:left-4 lg:left-8 text-white hover:text-cac-green transition-colors p-1 md:p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-1 sm:right-2 md:right-4 lg:right-8 text-white hover:text-cac-green transition-colors p-1 md:p-2"
              aria-label="Next image"
            >
              <ChevronRight size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
            </button>

            {/* Image Display */}
            <motion.div
              initial={scrollAnimationVariants.lightboxImage.hidden}
              animate={scrollAnimationVariants.lightboxImage.visible}
              exit={scrollAnimationVariants.lightboxImage.exit}
              className="max-w-[95%] sm:max-w-4xl w-full mx-8 md:mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedImage.image} 
                  alt="WhatsApp chat"
                  className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] object-contain"
                />
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {deliveryProofs.length}
            </div>

            {/* Mobile swipe hint */}
            <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 text-white/50 text-xs hidden sm:block">
              ← Swipe to navigate →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProofOfDelivery;
