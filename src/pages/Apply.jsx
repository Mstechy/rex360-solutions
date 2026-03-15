import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import RegistrationWizard from './RegistrationWizard';

// Service mapping - same as in Services.jsx
const SERVICE_MAP = {
  'business-name': { title: 'Business Name Registration', price: 35000 },
  'company': { title: 'Company Registration (Ltd)', price: 80000 },
  'ngo': { title: 'NGO Registration', price: 140000 },
  'trademark': { title: 'Trademark Registration', price: 50000 },
  'export-licence': { title: 'Export Licence', price: 60000 },
  'copyright': { title: 'Copyright Registration', price: 70000 },
  'upgrade': { title: 'Business to Company Upgrade', price: 60000 },
};

const Apply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    
    if (!serviceId || !SERVICE_MAP[serviceId]) {
      // Invalid service, redirect to services page
      navigate('/services', { replace: true });
      return;
    }

    const service = SERVICE_MAP[serviceId];
    setSelectedService({
      ...service,
      id: serviceId,
    });
    setIsLoading(false);
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-all duration-300 shadow-sm border border-gray-200"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Services</span>
          </button>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 rounded-full"
          style={{ borderColor: '#D4AF37', borderTopColor: '#1A4D2E' }}
        />
      </div>
    );
  }

  // Show the registration wizard with pre-selected service
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <RegistrationWizard preSelectedService={selectedService} />
    </motion.div>
  );
};

export default Apply;
