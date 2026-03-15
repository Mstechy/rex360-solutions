import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, CreditCard, Award, ArrowRight } from 'lucide-react';
import { useIsMobile, scrollAnimationVariants } from '../hooks/useResponsiveMotion';

const HowItWorks = () => {
  const isMobile = useIsMobile();

  const steps = [
    {
      id: 1,
      title: "Choose Your Service",
      description: "Select the registration type you need - Business Name, Company, NGO, Trademark, or any other CAC service.",
      icon: FileText,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Provide Information",
      description: "Fill in your business details securely. Our form guides you through every required field with clear instructions.",
      icon: CheckCircle,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Complete Payment",
      description: "Make a secure payment using your preferred method. We accept all major payment channels for your convenience.",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "Receive Certificate",
      description: "Get your CAC certificate delivered directly. Processing typically takes 24-48 hours for business names.",
      icon: Award,
      color: "from-amber-500 to-amber-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Simple, transparent, and hassle-free. Register your business in just 4 easy steps.
          </p>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-cac-blue to-cac-green mx-auto mt-6"></div>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.id} variants={itemVariants} className="relative">
                {/* Step Card */}
                <div className="h-full flex flex-col">
                  <div className="relative mb-6">
                    {/* Gradient Circle Background */}
                    <motion.div
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center transform`}
                      whileHover={{ scale: 1.1, boxShadow: "0 20px 35px rgba(0,0,0,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cac-blue to-cac-green rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-sm">{step.id}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 text-center pb-6">
                    <h3 className="text-xl md:text-lg font-black text-gray-900 mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Connector - Desktop Only */}
                  {index < steps.length - 1 && !isMobile && (
                    <motion.div
                      className="hidden lg:flex absolute top-1/4 -right-2 items-center justify-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-gradient-to-r from-cac-blue to-cac-green p-2 rounded-full shadow-lg"
                        >
                          <ArrowRight className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Arrow Connector - Mobile */}
                  {index < steps.length - 1 && isMobile && (
                    <motion.div
                      className="flex lg:hidden justify-center mt-6"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-cac-blue to-cac-green p-2 rounded-full shadow-lg"
                      >
                        <ArrowRight className="w-5 h-5 text-white transform rotate-90" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-gray-600 text-lg mb-6 font-medium">
            Ready to get started? Begin your registration now!
          </p>
          <motion.a
            href="/services"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-cac-green to-emerald-500 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-transparent hover:border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base md:text-lg font-extrabold tracking-wide">Start Registration</span>
            <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          className="mt-16 md:mt-20 grid grid-cols-3 gap-4 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-cac-green">500+</p>
            <p className="text-gray-600 text-sm md:text-base font-medium mt-2">Companies Registered</p>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <p className="text-3xl md:text-4xl font-black text-cac-blue">24hrs</p>
            <p className="text-gray-600 text-sm md:text-base font-medium mt-2">Average Processing</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-amber-500">100%</p>
            <p className="text-gray-600 text-sm md:text-base font-medium mt-2">Success Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
