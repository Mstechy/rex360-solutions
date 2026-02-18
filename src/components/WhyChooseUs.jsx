import { motion } from 'framer-motion';
import { CheckCircle, Award, Clock, Users, Headphones, Shield } from "lucide-react";

const reasons = [
  {
    icon: CheckCircle,
    title: "100% Success Rate",
    description: "We guarantee successful registration of your business with CAC or your money back.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Get your registration completed within 1-5 business days depending on the service.",
  },
  {
    icon: Shield,
    title: "Secure & Legal",
    description: "All registrations are done through official CAC channels with proper documentation.",
  },
  {
    icon: Award,
    title: "Experienced Team",
    description: "Over 7 years of experience helping thousands of businesses register successfully.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to assist you through the process.",
  },
  {
    icon: Users,
    title: "Trusted by 5000+",
    description: "Join thousands of satisfied clients who have trusted us with their business registration.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nigeria's Most Trusted{" "}
              <span className="text-blue-600">CAC Agent</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At REX360 Solutions, we understand the importance of proper business
              registration. Our team of experts ensures your business is registered
              correctly, legally, and as quickly as possible.
            </p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              {[
                { number: "5000+", label: "Clients Served" },
                { number: "7+", label: "Years Experience" },
                { number: "98%", label: "Success Rate" },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Reasons Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, index) => {
              const ReasonIcon = reason.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#2563eb",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ReasonIcon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2">{reason.title}</h3>
                  <p className="text-sm text-gray-600">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
