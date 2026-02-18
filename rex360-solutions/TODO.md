# TODO: Optimize Image Loading and News Page Sequential Display

## 1. Preload Agency Image in AgentIntro.jsx
- [x] Add preloading logic for agent photo to ensure instant display without delays
- [x] Use Image() constructor to preload the image from Supabase
- [x] Set loading state to prevent showing empty space

## 2. Modify NewsPage.jsx for Sequential Display
- [x] Change from grid layout to single news item display
- [x] Add state for current news index
- [x] Implement next/previous navigation buttons
- [x] Use Framer Motion for smooth slide transitions between news items

## 3. Adjust News Image Layout
- [x] Reduce full-screen height to a more compact, professional layout
- [x] Center the image with proper padding, CAC-official style
- [x] Remove excessive top space

## 4. Customize Framer Motion Animations
- [x] Add slide-in/slide-out animations for news transitions
- [x] Ensure perfect sequential flow with no glitches
- [x] Test animation smoothness

## Followup Steps
- [x] Test image loading speed on homepage
- [x] Verify sequential news navigation and animations
- [x] Ensure no layout issues or performance drops

# TODO: Add Testimonials Section

## 1. Create Testimonials Component
- [x] Create src/components/Testimonials.jsx with 10 sample testimonials
- [x] Each testimonial includes 5 or 4 stars, service-related text, and name
- [x] Implement horizontal sliding animation from right to left using Framer Motion
- [x] Duplicate testimonials array for seamless looping

## 2. Integrate Testimonials into Homepage
- [ ] Import Testimonials component in src/App.jsx
- [ ] Add Testimonials between NewsSection and FAQ in the homepage route

## Followup Steps
- [ ] Test the sliding animation on the homepage
- [ ] Ensure responsive design and professional appearance
