import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2, Landmark, Users, ShieldCheck, FileCheck, Scale, History, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../SupabaseClient';

const iconMap = {
  'Business Name': Building2,
  'Company Registration': Landmark,
  'Company Name': Landmark,
  'NGO Registration': Users,
  'Trademark': ShieldCheck,
  'Export Licence': FileCheck,
  'Copyright': Scale,
  'Annual Returns': History,
};

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Supabase Error:', error.message);
        setError(error.message);
      } else if (data) {
        setServices(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center bg-white">
        <Loader className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-semibold text-sm">Loading Services...</p>
      </div>
    );
  }

  return (
    <section className="section-padding bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Complete CAC{' '}
            <span className="text-blue-600">Registration Services</span>
          </h2>
          <p className="text-lg text-gray-600">
            We offer comprehensive business registration services to help you start
            and grow your business legally in Nigeria.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.name] || Building2;
            const linkName = service.name === 'Company Registration' ? 'Company Name' : service.name;

            // Features based on service name
            const features = {
              'Business Name': ['CAC Certificate', 'BN Number', '1-3 Days Processing'],
              'Company Registration': ['Certificate of Incorporation', 'RC Number', 'Memorandum & Articles'],
              'Company Name': ['Certificate of Incorporation', 'RC Number', 'Memorandum & Articles'],
              'NGO Registration': ['NGO Certificate', 'Trustees Registration', 'Full Compliance'],
              'Trademark': ['Brand Protection', '10 Years Validity', 'Legal Certificate'],
              'Export Licence': ['NEPC Registration', 'Export Documentation', 'International Trade'],
              'Copyright': ['IP Protection', 'Legal Rights', 'Lifetime Validity'],
              'Annual Returns': ['Legal Compliance', 'Annual Filing', '24-48 Hours'],
            };

            const serviceFeatures = features[service.name] || [];

            return (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1]
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/services?service=${encodeURIComponent(service.name)}`}
                  className="group bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon with enhanced animation */}
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 relative z-10"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#2563eb",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <IconComponent className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </motion.div>
                  </motion.div>

                  {/* Content with staggered animation */}
                  <motion.div className="relative z-10 flex flex-col flex-grow">
                    <motion.h3
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {service.name}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 mb-4 line-clamp-2 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {service.description || 'Professional CAC registration service with expert guidance.'}
                    </motion.p>

                    {/* Features with staggered animation */}
                    <motion.div
                      className="flex flex-wrap gap-2 mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {serviceFeatures.map((feature, i) => (
                        <motion.span
                          key={i}
                          className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-700"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1), duration: 0.3 }}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#dbeafe",
                            transition: { duration: 0.2 }
                          }}
                          viewport={{ once: true }}
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Price & CTA with enhanced animation */}
                    <motion.div
                      className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto relative z-10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div>
                        <span className="text-sm text-gray-500">Starting from</span>
                        <div className="flex items-center gap-2">
                          {service.old_price && parseInt(service.old_price) > parseInt(service.price) && (
                            <span className="text-lg line-through text-gray-400">₦{parseInt(service.old_price).toLocaleString()}</span>
                          )}
                          <motion.div
                            className="text-2xl font-bold text-blue-600"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            ₦{parseInt(service.price || 0).toLocaleString()}
                          </motion.div>
                        </div>
                      </div>
                      <motion.div
                        className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors"
                        whileHover={{
                          scale: 1.1,
                          rotate: 90,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <motion.span
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                View All Services
              </motion.span>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;