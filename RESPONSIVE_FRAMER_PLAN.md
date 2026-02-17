# Responsive Framer Motion Implementation Plan

## Information Gathered:

### Existing Files:
1. **useResponsiveMotion.js** - Already has:
   - `useIsMobile`, `useIsTablet`, `useIsDesktop` hooks
   - `premiumEasings` - elegant easing curves
   - `scrollAnimationVariants` - responsive variants like `fadeUpResponsive`, `fadeInLeft`, `fadeInRight`, `scaleUp`
   - `getResponsiveTransition` - responsive duration/easing
   - `pageTransitionVariants` - for route transitions
   - `defaultViewport` - responsive viewport

### Components to Update:
1. **App.jsx** - Route transitions and homepage section animations
2. **Testimonials.jsx** - Horizontal scroll carousel
3. **LegitimacyHub.jsx** - Scroll animations and modal
4. **ProofOfDelivery.jsx** - Grid animations and lightbox

## Implementation Plan:

### Step 1: Enhance useResponsiveMotion.js
- Add `useMediaQuery` from react-responsive (already imported but may need verification)
- Add more responsive viewport configurations
- Add spring physics variants for premium feel

### Step 2: Update App.jsx
- Import and use responsive hooks
- Replace hardcoded values with responsive variants
- Use shorter durations on mobile
- Add stagger children for premium feel

### Step 3: Update Testimonials.jsx
- Make scroll distance responsive (percentage-based)
- Make duration faster on mobile
- Use responsive card widths

### Step 4: Update LegitimacyHub.jsx
- Import responsive hooks
- Make scroll animation y-offset responsive
- Make modal animation responsive

### Step 5: Update ProofOfDelivery.jsx
- Make grid animation delays responsive
- Make lightbox animations responsive

## Dependencies:
- react-responsive (needs to be installed)
- framer-motion (already installed)

## Followup Steps:
1. Verify react-responsive is in package.json
2. Test animations on mobile and desktop
3. Verify no console errors
