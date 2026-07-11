import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

// Hook to detect if we're on mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileQuery = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setIsMobile(isMobileQuery);
  }, [isMobileQuery]);

  return isMobile;
};

// Hook to detect if we're on tablet
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);
  const isTabletQuery = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  useEffect(() => {
    setIsTablet(isTabletQuery);
  }, [isTabletQuery]);

  return isTablet;
};

// Hook to detect if we're on desktop
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopQuery = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setIsDesktop(isDesktopQuery);
  }, [isDesktopQuery]);

  return isDesktop;
};

// Premium easing curves for smooth animations
export const premiumEasings = {
  // Smooth out cubic bezier
  smooth: [0.25, 0.1, 0.25, 1],
  // Bouncy spring-like
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Elegant ease out
  elegant: [0.22, 1, 0.36, 1],
  // Quick snap
  snap: [0.7, -0.3, 0.3, 1.3],
};

// Stagger children delays for premium feel
export const getStaggerDelay = (index, baseDelay = 0.1) => ({
  delayChildren: baseDelay,
  staggerChildren: baseDelay,
});

// Responsive animation variants for scroll animations
export const scrollAnimationVariants = {
  // Fade up animation
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: premiumEasings.elegant,
      }
    }
  },
  // Responsive fade up with smaller values on mobile
  fadeUpResponsive: (isMobile = false) => ({
    hidden: { opacity: 0, y: isMobile ? 20 : 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: premiumEasings.elegant,
      }
    }
  }),
  // Fade in from left
  fadeInLeft: (isMobile = false) => ({
    hidden: { opacity: 0, x: isMobile ? -15 : -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: premiumEasings.elegant,
      }
    }
  }),
  // Fade in from right
  fadeInRight: (isMobile = false) => ({
    hidden: { opacity: 0, x: isMobile ? 15 : 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: premiumEasings.elegant,
      }
    }
  }),
  // Scale up
  scaleUp: (isMobile = false) => ({
    hidden: { opacity: 0, scale: isMobile ? 0.92 : 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: premiumEasings.elegant,
      }
    }
  }),
  // Modal animation
  modal: {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: premiumEasings.snap,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.3,
        ease: premiumEasings.smooth,
      }
    }
  },
  // Lightbox image animation
  lightboxImage: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: premiumEasings.snap,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
      }
    }
  },
};

// Responsive transition settings
export const getResponsiveTransition = (isMobile = false) => ({
  duration: isMobile ? 0.4 : 0.6,
  ease: premiumEasings.elegant,
});

// Page transition variants
export const pageTransitionVariants = {
  // Route transitions
  pageIn: (isMobile = false) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: isMobile ? 0.3 : 0.5,
      ease: premiumEasings.elegant,
    }
  }),
  pageOut: (isMobile = false) => ({
    opacity: 0,
    x: isMobile ? 50 : -20,
    transition: {
      duration: isMobile ? 0.3 : 0.5,
      ease: premiumEasings.elegant,
    }
  }),
  // For routes with scale
  pageScaleIn: (isMobile = false) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: isMobile ? 0.3 : 0.5,
      ease: premiumEasings.elegant,
    }
  }),
  pageScaleOut: (isMobile = false) => ({
    opacity: 0,
    scale: isMobile ? 0.95 : 1.05,
    transition: {
      duration: isMobile ? 0.3 : 0.5,
      ease: premiumEasings.elegant,
    }
  }),
};

// Viewport settings for scroll animations
export const defaultViewport = {
  once: true,
  margin: isMobile => isMobile ? "-50px" : "-100px",
};

export default {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  premiumEasings,
  scrollAnimationVariants,
  getResponsiveTransition,
  pageTransitionVariants,
  defaultViewport,
};
