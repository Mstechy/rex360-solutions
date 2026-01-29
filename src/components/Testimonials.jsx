import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "John Adebayo",
    title: "Business Owner",
    company: "Adebayo Enterprises",
    location: "Lagos, Nigeria",
    stars: 5,
    text: "I registered my business with Rex360 and they were incredibly fast and reliable. Their 24/7 availability made the process seamless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Mary Okafor",
    title: "CEO",
    company: "Okafor Solutions Ltd",
    location: "Abuja, Nigeria",
    stars: 5,
    text: "Rex360 handled my company registration perfectly. They attended to all our needs promptly and professionally.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Emeka Nwosu",
    title: "Entrepreneur",
    company: "Nwosu Tech Hub",
    location: "Port Harcourt, Nigeria",
    stars: 4,
    text: "Great service for business registration. Rex360 is always available when you text them, very responsive team.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Grace Eze",
    title: "Founder",
    company: "Eze Innovations",
    location: "Enugu, Nigeria",
    stars: 5,
    text: "I used Rex360 for my startup registration. They are fast, reliable, and available 24/7. Highly recommend!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "David Okon",
    title: "Managing Director",
    company: "Okon Group",
    location: "Kano, Nigeria",
    stars: 5,
    text: "Rex360 made business registration easy. Their team is professional and always ready to help.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Funmi Adeyemi",
    title: "Business Consultant",
    company: "Adeyemi Advisors",
    location: "Ibadan, Nigeria",
    stars: 4,
    text: "Excellent service from Rex360. They registered my business quickly and were available whenever I needed assistance.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Chike Obi",
    title: "Operations Manager",
    company: "Obi Enterprises",
    location: "Owerri, Nigeria",
    stars: 5,
    text: "Rex360 is the best for business registration. Fast, reliable, and 24/7 support. Couldn't ask for more.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Adaeze Nnamdi",
    title: "Startup Founder",
    company: "Nnamdi Ventures",
    location: "Asaba, Nigeria",
    stars: 5,
    text: "I texted Rex360 for my company registration and they responded immediately. Professional and efficient.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Ikechukwu Uzo",
    title: "Business Developer",
    company: "Uzo Dynamics",
    location: "Benin City, Nigeria",
    stars: 4,
    text: "Good experience with Rex360. They handled my business registration reliably and were always available.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Ngozi Chukwu",
    title: "Corporate Secretary",
    company: "Chukwu Holdings",
    location: "Calabar, Nigeria",
    stars: 5,
    text: "Rex360 provided outstanding service for my business registration. Fast, reliable, and 24/7 support.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
  }
];

// Duplicate the array for seamless looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Clients Say
        </h2>
        <div className="relative">
          <motion.div
            className="flex space-x-4 sm:space-x-8"
            animate={{
              x: [0, -100 * testimonials.length * 2], // Adjust based on card width
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40, // Slower for better readability
                ease: "linear",
              },
            }}
            style={{ width: `${duplicatedTestimonials.length * 280}px` }} // Smaller width for responsiveness
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="bg-white p-4 rounded-lg shadow-md min-w-[280px] sm:min-w-[320px] flex-shrink-0"
                role="article"
                aria-labelledby={`testimonial-name-${index}`}
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
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    <p className="text-gray-600 text-sm font-medium">{testimonial.company}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
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
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
