import React from 'react';

/**
 * SkipLink component for keyboard navigation accessibility
 * Allows users to skip navigation and jump to main content
 */
const SkipLink = () => {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: try to find main content by common patterns
      const content = document.querySelector('main') || document.querySelector('[role="main"]');
      if (content) {
        content.focus();
        content.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="skip-link"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
