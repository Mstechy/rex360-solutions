import { useState, useEffect, useRef } from 'react';

// Hook for auto-scrolling through sections
export const useAutoScrollSections = (sections, enabled = true, interval = 8000) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(enabled);
  const intervalRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer to detect when user manually scrolls
  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sections.findIndex(section => section.id === entry.target.id);
            if (sectionIndex !== -1 && sectionIndex !== currentSection) {
              setCurrentSection(sectionIndex);
              // Pause auto-scroll when user manually navigates
              setIsAutoScrolling(false);
              // Resume after 10 seconds of inactivity
              setTimeout(() => setIsAutoScrolling(true), 10000);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections, currentSection, enabled]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !enabled || sections.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentSection((prev) => {
        const next = (prev + 1) % sections.length;
        const element = document.getElementById(sections[next].id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        return next;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoScrolling, enabled, sections, interval]);

  const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
      setIsAutoScrolling(false);
      const element = document.getElementById(sections[index].id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      // Resume auto-scroll after manual navigation
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  return {
    currentSection,
    isAutoScrolling,
    scrollToSection,
    toggleAutoScroll
  };
};

// Enhanced animation variants for more sophisticated effects
export const enhancedAnimationVariants = {
  // Staggered fade in with bounce
  fadeInUpBounce: {
    initial: { opacity: 0, y: 60, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
  },

  // Slide in from sides with rotation
  slideInRotate: (direction = 'left') => ({
    initial: {
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
      rotate: direction === 'left' ? -15 : 15
    },
    animate: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
  }),

  // Scale and glow effect
  scaleGlow: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    whileHover: {
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0, 135, 81, 0.3)',
      transition: { duration: 0.3 }
    }
  },

  // Text reveal animation
  textReveal: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, staggerChildren: 0.1 }
  },

  // Parallax scroll effect
  parallax: (offset = 50) => ({
    initial: { y: offset },
    animate: { y: 0 },
    transition: { duration: 1, ease: "easeOut" }
  }),

  // Magnetic hover effect
  magnetic: {
    whileHover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    whileTap: { scale: 0.95 }
  }
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};