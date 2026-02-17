import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const services = [
  {
    id: 'business-name',
    title: 'Business Name Registration',
    description: 'Register your sole proprietorship or partnership business name with CAC. Perfect for small businesses, freelancers, and entrepreneurs just starting out.',
    price: '₦35,000',
    priceNum: 35000,
    icon: Briefcase,
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
  {
    id: 'company',
    title: 'Company Registration (Ltd)',
    description: 'Full limited liability company registration with complete CAC documentation. Ideal for businesses seeking limited liability protection and corporate identity.',
    price: '₦80,000',
    priceNum: 80000,
    icon: Building2,
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
  {
    id: 'ngo',
    title: 'NGO Registration',
    description: 'Register your non-governmental organization, foundation, or charity with CAC. Complete with trustees registration and full legal compliance.',
    price: '₦140,000',
    priceNum: 140000,
    icon: Users,
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
  {
    id: 'trademark',
    title: 'Trademark Registration',
    description: 'Protect your brand name, logo, and business identity. Secure exclusive rights to your intellectual property for 10 years (renewable).',
    price: '₦50,000',
    priceNum: 50000,
    icon: Shield,
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
  {
    id: 'export-licence',
    title: 'Export Licence',
    description: 'Obtain your export licence to legally export goods from Nigeria. Required for international trade and export business operations.',
    price: '₦60,000',
    priceNum: 60000,
    icon: ArrowUpRight,
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
  {
    id: 'copyright',
    title: 'Copyright Registration',
    description: 'Protect your creative works, music, software, books, and intellectual property. Secure your rights with official copyright registration.',
    price: '₦70,000',
    priceNum: 70000,
    icon: FileText,
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
  {
    id: 'upgrade',
    title: 'Business to Company Upgrade',
    description: 'Upgrade your existing business name to a limited liability company. Keep your business history while gaining corporate benefits.',
    price: '₦60,000',
    priceNum: 60000,
    icon: Award,
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
];

const ServiceRow = ({ service, index }) => {
  const navigate = useNavigate();
  const IconComponent = service.icon;

  const handleApplyNow = () => {
    navigate(`/register/${encodeURIComponent(service.title)}`, {
      state: {
        selectedService: service.title,
        servicePrice: service.priceNum,
      },
    });
  };

  return (
    <motion.div
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
              {service.title}
            </h2>
            <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
              {service.price}
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-3">What You Get:</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {service.features.map((feature, i) => (
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
          {service.requirements.map((req, i) => (
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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-16 text-center"
        style={{ backgroundColor: '#1A4D2E' }}
      >
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
