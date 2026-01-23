# Lighthouse Optimization TODO

## Image Optimization
- [x] Optimize HeroSlider image: Implement responsive images with srcset for Unsplash image (1920x1080 -> ~1100x619)
- [x] Optimize Footer logo: Add loading="lazy" to /logo.png
- [x] Optimize AgentIntro image: Implement responsive images for Supabase image (800x800 -> 296x370)
- [x] Find and optimize the 368x368 image displayed at 496x248 (not found in current code)

## Accessibility Fixes
- [x] Add aria-label to slider indicator buttons in HeroSlider
- [x] Increase touch target sizes for slider buttons (currently 12px x 4px, need 44px min)
- [x] Improve color contrast ratios in CSS
- [x] Add unique descriptions to identical "REGISTER NOW" links in ServicesSection
- [x] Check and fix headings with no content (h1 has content from slide.title)

## Source Maps
- [x] Enable source maps in vite.config.js for production builds

## Testing
- [ ] Test optimized images load correctly
- [ ] Run Lighthouse audit to verify improvements
- [ ] Ensure no functionality is broken
