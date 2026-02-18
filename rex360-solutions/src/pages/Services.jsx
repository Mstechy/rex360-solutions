import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Briefcase,
  Users,
  Shield,
  FileText,
  Award,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Phone,
  Loader,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '../SupabaseClient';

const iconMap = {
  'Business Name': Briefcase,
  'Company Registration': Building2,
  'Company Name': Building2,
  'NGO Registration': Users,
  'Trademark': Shield,
  'Export Licence': ArrowUpRight,
  'Copyright': FileText,
  'Annual Returns': Award,
};

// Hardcoded service details
const serviceDetails = {
  'Business Name': {
    title: 'Business Name Registration',
    description: 'Register your sole proprietorship or partnership business name with CAC. Perfect for small businesses, freelancers, and entrepreneurs just starting out.',
    features: [
      'Official CAC Certificate',
      'Unique BN Number',
      '1-3 Days Processing',
      'Digital & Physical Certificate',
      'Full Documentation',
    ],
    requirements: [
      'Valid ID Card',
      'Passport Photograph',
      'Signature on white paper',
      'Proposed Business Names (2 options)',
      'Nature of Business',
      'Business Address',
    ],
  },
  'Company Registration': {
    title: 'Company Registration (Ltd)',
    description: 'Full limited liability company registration with complete CAC documentation. Ideal for businesses seeking limited liability protection and corporate identity.',
    features: [
      'Certificate of Incorporation',
      'Unique RC Number',
      'Memorandum & Articles of Association',
      'Share Certificates',
      'CAC Status Report',
      'Company Seal',
    ],
    requirements: [
      'Directors\' Valid ID Cards',
      'Passport Photographs',
      'Signatures',
      'Proposed Company Names (2 options)',
      'Share Capital Details',
      'Registered Office Address',
    ],
  },
  'NGO Registration': {
    title: 'NGO Registration',
    description: 'Register your non-governmental organization, foundation, or charity with CAC. Complete with trustees registration and full legal compliance.',
    features: [
      'NGO Certificate',
      'Trustees Registration',
      'Constitution Document',
      'Full Legal Compliance',
      'Tax Exemption Eligibility',
      'CAC Status Report',
    ],
    requirements: [
      'Trustees\' Valid ID Cards',
      'Passport Photographs',
      'Proposed NGO Names',
      'Objects/Aims of NGO',
      'Registered Address',
      'Board Resolution',
    ],
  },
  'Trademark': {
    title: 'Trademark Registration',
    description: 'Protect your brand name, logo, and business identity. Secure exclusive rights to your intellectual property for 10 years (renewable).',
    features: [
      'Brand Name Protection',
      'Logo Protection',
      '10 Years Validity',
      'Legal Certificate',
      'Nationwide Protection',
      'Renewal Support',
    ],
    requirements: [
      'Trademark Name/Logo',
      'Business/Company Details',
      'Class of Business',
      'Applicant\'s Details',
      'Contact Information',
      'Logo File (if applicable)',
    ],
  },
  'Export Licence': {
    title: 'Export Licence',
    description: 'Obtain your export licence to legally export goods from Nigeria. Required for international trade and export business operations.',
    features: [
      'NEPC Registration',
      'Export Documentation',
      'International Trade Ready',
      'Legal Compliance',
      'Export Certificate',
      'Business Advisory',
    ],
    requirements: [
      'CAC Registration Number',
      'Tax Identification Number',
      'Exporter\'s Certificate',
      'Corporate Bank Account',
      'Product Specific Permit',
      'Valid ID & Application Letter',
    ],
  },
  'Copyright': {
    title: 'Copyright Registration',
    description: 'Protect your creative works, music, software, books, and intellectual property. Secure your rights with official copyright registration.',
    features: [
      'IP Protection',
      'Lifetime Validity',
      'Legal Rights Certificate',
      'Anti-Piracy Protection',
      'Commercial Rights',
      'Transfer Rights',
    ],
    requirements: [
      'Completed Application Form',
      'Two Copies of the Work',
      'Author\'s Details & ID',
      'Proof of Ownership',
      'Payment Receipt',
      'Work Description',
    ],
  },
  'Annual Returns': {
    title: 'Business to Company Upgrade',
    description: 'Upgrade your existing business name to a limited liability company. Keep your business history while gaining corporate benefits.',
    features: [
      'Full Company Status',
      'New RC Number',
      'Preserved Business History',
      'Limited Liability Protection',
      'Corporate Identity',
      'Full Documentation',
    ],
    requirements: [
      'Existing BN Number',
      'Current CAC Certificate',
      'Directors\' Details',
      'Share Capital Structure',
      'New Company Name',
      'Updated Documentation',
    ],
  },
};

const ServiceRow = ({ service, index }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[service.name] || Briefcase;
  const details = serviceDetails[service.name] || serviceDetails['Business Name'];

  const handleApplyNow = () => {
    navigate(`/register/${encodeURIComponent(details.title)}`, {
      state: {
        selectedService: details.title,
        servicePrice: parseInt(service.price),
      },
    });
  };

  return (
    <motion.div
      id={`service-${service.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Content Side */}
      <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1A4D2E20' }}>
            <IconComponent size={32} color="#1A4D2E" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              {details.title}
            </h2>
            <div className="flex items-center gap-2">
              {service.old_price && parseInt(service.old_price) > parseInt(service.price) && (
                <span className="text-lg line-through text-gray-400">₦{parseInt(service.old_price).toLocaleString()}</span>
              )}
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                ₦{parseInt(service.price).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {details.description}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-3">What You Get:</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {details.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-gray-700">
                <CheckCircle size={20} style={{ color: '#D4AF37' }} className="flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleApplyNow}
            className="px-8 py-3 rounded-xl font-bold text-black transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Apply Now
            <ArrowRight size={20} />
          </button>
          <a
            href="tel:09048349548"
            className="px-8 py-3 rounded-xl font-bold transition-all border-2 flex items-center gap-2"
            style={{ borderColor: '#1A4D2E', color: '#1A4D2E' }}
          >
            <Phone size={20} />
            Call to Inquire
          </a>
        </div>
      </div>

      {/* Requirements Side */}
      <div
        className={`rounded-2xl p-6 lg:p-8 border shadow-sm ${
          index % 2 === 1 ? 'lg:order-1' : ''
        }`}
        style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}
      >
        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
          <FileText size={20} color="#1A4D2E" />
          Requirements
        </h3>
        <ul className="space-y-3">
          {details.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span
                className="w-6 h-6 rounded-full text-sm flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-white"
                style={{ backgroundColor: '#1A4D2E' }}
              >
                {i + 1}
              </span>
              <span>{req}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} style={{ color: '#D4AF37' }} />
            <span>Processing Time: 1-5 Business Days</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          setError(error.message);
        } else {
          setServices(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService && !loading) {
      // Find the service ID based on keyword matching
      let serviceId = null;
      
      if (selectedService.toLowerCase().includes('business name')) {
        serviceId = 'business-name';
      } else if (selectedService.toLowerCase().includes('company') || selectedService.toLowerCase().includes('ltd')) {
        serviceId = 'company';
      } else if (selectedService.toLowerCase().includes('ngo')) {
        serviceId = 'ngo';
      } else if (selectedService.toLowerCase().includes('trademark')) {
        serviceId = 'trademark';
      } else if (selectedService.toLowerCase().includes('export')) {
        serviceId = 'export-licence';
      } else if (selectedService.toLowerCase().includes('copyright')) {
        serviceId = 'copyright';
      } else if (selectedService.toLowerCase().includes('annual') || selectedService.toLowerCase().includes('upgrade')) {
        serviceId = 'upgrade';
      }
      
      if (serviceId) {
        // Scroll to the service after a short delay to allow rendering
        setTimeout(() => {
          const element = document.getElementById(`service-${serviceId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add highlight effect
            element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
            }, 3000);
          }
        }, 500);
      }
    }
  }, [selectedService]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
          <p className="text-gray-500 font-semibold">Loading Services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading services: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-16 text-center relative"
        style={{ backgroundColor: '#1A4D2E' }}
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute top-8 left-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
        </motion.div>

        <div className="max-w-3xl mx-auto px-4">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#D4AF3730', color: '#D4AF37' }}>
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Complete CAC Registration Services
          </h1>
          <p className="text-lg text-gray-100">
            We offer comprehensive business registration services to help you start and grow your business legally in Nigeria.
          </p>
        </div>
      </motion.section>

      {/* Services List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 space-y-20">
          {services.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 text-center"
        style={{ backgroundColor: '#1A4D2E' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Contact us today and our team will help you determine the best registration option for your business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:09048349548"
              className="px-8 py-3 rounded-xl font-bold text-black transition-all hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#D4AF37' }}
            >
              <Phone size={20} />
              Call 09048349548
            </a>
            <a
              href="mailto:contact@rex360.com"
              className="px-8 py-3 rounded-xl font-bold transition-all border-2 text-white"
              style={{ borderColor: '#D4AF37' }}
            >
              Email Us
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
