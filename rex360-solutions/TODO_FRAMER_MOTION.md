# Framer Motion Responsive - TODO List

## Task: Make Framer Motion responsive for mobile and desktop with premium effects

### Files to Edit:
- [ ] 1. Create responsive hooks/utility for Framer Motion
- [ ] 2. Update App.jsx - Add responsive route transitions
- [ ] 3. Update Testimonials.jsx - Make horizontal scroll responsive
- [ ] 4. Update LegitimacyHub.jsx - Add responsive scroll animations + premium modal
- [ ] 5. Update ProofOfDelivery.jsx - Add responsive grid animations + premium lightbox

### Implementation Plan:

#### 1. Create Responsive Hook (`src/hooks/useResponsiveMotion.js`)
- Create useMediaQuery hook for responsive breakpoints
- Create responsive animation variants
- Add premium easing functions

#### 2. App.jsx Updates
- Responsive initial/animate values for mobile vs desktop
- Shorter durations on mobile
- Better easing curves (easeOut for premium feel)
- Stagger children animations

#### 3. Testimonials.jsx Updates
- Responsive scroll distance (less on mobile)
- Responsive duration (faster on mobile)
- Pause on hover (premium touch)

#### 4. LegitimacyHub.jsx Updates
- Responsive y-offset for scroll animations
- Responsive modal animations
- Add scale + fade for premium feel

#### 5. ProofOfDelivery.jsx Updates
- Responsive grid animation delays
- Responsive lightbox animations
- Add spring physics for premium feel

### Premium Effects to Add:
- Spring animations instead of just easeOut
- Stagger children for sequential reveals
- Scale + fade combinations
- Better viewport detection
- Parallax effects where appropriate
- Smooth lightbox transitions
