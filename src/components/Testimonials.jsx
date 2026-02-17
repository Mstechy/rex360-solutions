import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useIsMobile } from '../hooks/useResponsiveMotion';

const testimonials = [
  {
    name: "Chioma Adekunle",
    title: "Business Owner",
    company: "C & K Ventures",
    location: "Lagos, Nigeria",
    stars: 5,
    text: "Rex360 Solutions made my CAC registration so easy! Got my certificate within 3 days. Highly recommended!",
    image: "/testmo1.png"
  },
  {
    name: "Emmanuel Okafor",
    title: "Entrepreneur",
    company: "EmaLink Ltd",
    location: "Abuja, Nigeria",
    stars: 5,
    text: "Professional service from start to finish. They handled everything including tax clearance. Will use again!",
    image: "/testmo2.png"
  },
  {
    name: "Adaeze Okonkwo",
    title: "CEO",
    company: "Grace & Mercy Ltd",
    location: "Port Harcourt, Nigeria",
    stars: 5,
    text: "Excellent team! They registered my NGO and got approval within weeks. Very knowledgeable about Nigerian laws.",
    image: "/testmo3.png"
  },
  {
    name: "Oluwaseun Adeyemi",
    title: "Founder",
    company: "TechStart NG",
    location: "Ibadan, Nigeria",
    stars: 5,
    text: "Fast, reliable, and affordable. They guided me through the entire process. My business is now legal!",
    image: "/testmo4.png"
  },
  {
    name: "Folake Williams",
    title: "Director",
    company: "Williams & Co Ltd",
    location: "Lagos, Nigeria",
    stars: 5,
    text: "Outstanding service! The team is very professional and responsive. They made company registration stress-free.",
    image: "/testmo5.png"
  },
  {
    name: "Michael Ibrahim",
    title: "Managing Partner",
    company: "Ibrahim & Sons",
    location: "Kano, Nigeria",
    stars: 5,
    text: "Best registration service in Nigeria! They handled our incorporation perfectly. Thank you Rex360!",
    image: "/testmo1.png"
  }
];

// Duplicate the array for seamless looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  const isMobile = useIsMobile();

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl font-bold text-center text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Real Results, Real Clients.
        </motion.h2>
        <motion.p 
          className="text-center text-gray-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          See what our clients are saying after receiving their documents. These are real WhatsApp messages from satisfied customers.
        </motion.p>
        <div className="relative">
          <motion.div
            className="flex space-x-4 sm:space-x-8"
            animate={{
              x: [0, -100 * testimonials.length * (isMobile ? 1.2 : 2)], // Responsive scroll distance
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: isMobile ? 25 : 40, // Faster on mobile for better engagement
                ease: "linear",
              },
            }}
            style={{ width: `${duplicatedTestimonials.length * (isMobile ? 240 : 280)}px` }} // Responsive width
            whileHover={{ animationPlayState: "paused" }} // Premium pause on hover
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.article
                key={`${testimonial.name}-${index}`}
                className="bg-white p-4 rounded-lg shadow-md min-w-[240px] sm:min-w-[280px] md:min-w-[320px] flex-shrink-0"
                role="article"
                aria-labelledby={`testimonial-name-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: (index % testimonials.length) * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-start mb-4">
                  <img
                    src={testimonial.image}
                    alt={`Portrait of ${testimonial.name}`}
                    className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex-shrink-0 flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-gray-500 text-sm font-medium">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 id={`testimonial-name-${index}`} className="text-gray-900 font-semibold text-lg">{testimonial.name}</h3>
                    <div className="flex mt-2" role="img" aria-label={`Rating: ${testimonial.stars} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic text-sm leading-relaxed max-w-[240px] md:max-w-[280px] lg:max-w-[320px]">
                  "{testimonial.text}"
                </blockquote>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
