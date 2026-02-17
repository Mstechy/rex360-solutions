import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X, ArrowLeft, Briefcase, User, MapPin, Building2, FileText, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../SupabaseClient';

// --- BUSINESS CATEGORIES (PRESERVED) ---
const BUSINESS_CATEGORIES = {
  "GENERAL SUPPLIES & SERVICES": ["ACCOMODATION AND FOOD SERVIVES ACTIVITIES", "ACCOMMODATION", "BAKERY SERVICES", "BREWERY SERVICES", "DEAL IN HOT DRINKS", "DEAL IN SOFT DRINKS", "DEAL IN WINES, DRINKS AND BEVERAGES", "FOOD AND BEVERAGES SERVICES ACTIVITIES", "FRUITS/FRUIT JUICE PRODUCTION AND SALES", "HOTEL RESERVATION SERVICES", "HOTEL AND HOSPITALITY", "HOTEL/HOSPITALITY SERVICES", "OPERATE CONFECTIONERY SHOP", "OPERATE FAST FOOD OUTLET", "OPERATE RESTAURANT AND CATERING SERVICES", "OPERATE VIEWING CENTRE"],
  "ADMINISTRATIVE & SUPPORT SERVICES": ["ABATTOIR AND MEAT SELLING SERVICES", "AUTOMATED CAR WASH SERVICES", "BLACK SMITH SERVICES", "BLOCK INDUSTRY", "BOUTIQUE SERVICES", "CAR WASH SERVICES", "CATERING SERVICES", "CLEARING AND FORWARDING SERVICES", "COBBLER SERVICES", "COLD ROOM SERVICES", "COMMISSION AGENCY", "CYBERCAFÉ AND BUSINESS CENTRE", "DEAL IN JEWELRY AND ACCESSORIES", "DOMESTIC SUPPORT SERVICES", "DRIVING SCHOOL SERVICES", "EVENTS MANAGEMENT, GENERAL MERCHANDISE", "ELECTRICAL SERVICES", "EMPLOYMENT AGENCY", "ERRAND AND HOME DELIVERY SERVICES", "FARMING", "FASHION DESIGNING/ TAILORING", "FIRE AND SAFETY SERVICES", "FROZEN FOODS SERVICES", "GENERAL CONTRACTS", "GENERAL MERCHANDISE", "GOLD SMITING SERVICES", "HAT MAKING SERVICES", "INDUSTRIAL CHEMICAL SERVICES", "INTERIOR/EXTERIOR DECORATION", "INTERNET SERVICES", "LAUNDRY SERVICES", "LUBRICANT/ OIL SERVICES", "MAINTENANCE OF REFRIGERATOR/AC", "MANUFACTURER'S REPRESENTATION", "MARKETING SERVICES", "MEDICAL LABORATORY SERVICES", "MORTUARY AND FUNERAL SERVICES", "OFFICE ADMINISTRATIVE SUPPORT", "PLASTIC MANUFACTURING SERVICES", "PLUMBING SERVICES", "PRINTING PRESS", "PRODUCTION AND SALES OF FOOTWEAR", "PUBLIC RELATION SERVICES", "RENTAL SERVICES", "RESTAURANT", "SAFETY EQUIPMENT SERVICES", "SALE OF PETROLEUM PRODUCTS", "SALES OF BOOKS AND STATIONERIES", "SAWMILLING SERVICES", "SECURITY AND INVESTIGATION ACTIVITIES", "SUPPLY OF UNSKILLED LABOUR", "TECHNICAL SERVICES", "TEXTILE SERVICES", "TRADING", "TRAVEL AGENCY", "UPHOLSTERY AND FURNITURE MAKING", "VULCANIZING SERVICES", "WELDING SERVICES"],
  "ART, ENTERTAINMENT & RECREATION": ["ART GALLERIES, MUSEUM AND MONUMENTS", "ARTISTE MANAGEMENT", "ARTS, CRAFT, AND DESIGNING", "BAR SERVICES", "CREATIVE, ART AND ENTERTAINMENT", "ENTERTAINMENT SERVICES", "EVENTS MANAGEMENTS/ PLANNING", "GAMBLING AND BETTING ACTIVITIES", "INSTALLATION OF CCTV", "MODELING SERVICES", "ORGANISE DANCE CLASS", "PAINTING SERVICES", "PARKS AND RECREATION SERVICES", "PHOTOGRAPHY SERVICES", "SALE OF SPORTS EQUIPMENT", "SPORT PROMOTION SERVICES", "VIDEO CD RENTAL SERVICES"],
  "AGRICULTURE, FORESTRY & FISHING": ["ANIMAL HUSBANDRY SERVICES", "AQUARIUM SERVICES", "AVIARY SERVICES", "CROP AND ANIMAL PRODUCTION", "FISH FARMING/AQUACULTURE", "FOOD PRODUCTION AND PROCESSING", "FORESTRY & LOGGING", "GARDENING SERVICES", "HONEY PROCESSING", "HORTICULTURAL SERVICES", "KENNEL SERVICES", "LIVESTOCK FEEDS PRODUCTION", "LIVESTOCK MANAGEMENT", "MILLING AND GRINDING SERVICES", "PIGGERY SERVICES", "POULTRY SERVICES", "SALE OF AGRICULTURAL PRODUCE", "SALE OF AGRICULTURAL TOOLS", "SALE OF ANIMALS", "SALE OF DIARY PRODUCTS", "SALE OF GROCERIES"],
  "CONSTRUCTION": ["BOAT AND CANOE CONSTRUCTION", "BRICKLAYING/MASONARY SERVICES", "BUILDING WORKS", "CARPENTRY/UPHOLSTERY SERVICES", "CIVIL ENGINEERING", "CONSTRUCTION OF BUILDINGS", "GLASS WORKS", "MECHANICAL WORKS", "METAL WORKS", "SPECIALIZED CONSTRUCTION ACTIVITIES", "STEEL WORKS SERVICES", "SUPPLY, SALE AND DISTRIBUTION OF BUILDING MATERIALS"],
  "EDUCATION": ["APPRENTICESHIP AND TRAINING", "BUSINESS SUPPORT/ DEVELOPMENT", "CURRICULUM PLANNING", "EDUCATIONAL SERVICES AND CONSULTANCY", "FEASIBILITY STUDIES", "GUIDANCE AND COUNSELING", "ICT TRAINING AND CONSULTANCY", "LIBRARY SERVICES", "MONTESSORI SUPPLIES", "MONTESSORI TRAINING", "OPERATE BIBLE COLLEGE", "OPERATE COMPUTER TRAINING SCHOOL", "OPERATE CRÈCHE AND DAY CARE", "OPERATE ISLAMIC SCHOOL", "OPERATE NURSERY AND PRIMARY SCHOOL", "OPERATE PRIMARY AND SECONDARY SCHOOL", "ORGANIZING CONFERENCES", "PUBLICATION OF LAW REPORTS", "TEACHERS RECRUITMENT", "VOCATIONAL EDUCATION"],
  "HEALTH & SOCIAL WORK": ["AMBULANCE SERVICES", "BEAUTY AND SALON SERVICES", "CHEMIST/NURSING HOME", "DENTAL PRACTICE", "FUMIGATION AND PEST CONTROL", "GYMNASIUM SERVICES", "HUMAN HEALTH ACTIVITIES", "MAKE UP AND MAKEOVER", "OPERATE COMMUNITY HEALTH CENTRE", "OPERATE HOSPITAL/CLINIC", "OPERATE MATERNITY CLINIC", "OPTICAL SERVICES", "PATENT/MEDICINE SERVICES", "PEDICURE AND MANICURE", "PERFUMERY SERVICES", "PHYSIOTHERAPY SERVICES", "RESIDENTIAL CARE ACTIVITIES", "SPA TREATMENT SERVICES", "SALE OF VETERINARY EQUIPMENT", "TRADITIONAL MEDICINE", "VETERINARY SERVICES"],
  "INFORMATION & COMMUNICATION": ["ADVERTISING AND MARKETING", "BULK SMS SERVICES", "CINEMATOGRAPHY", "COMPUTER PROGRAMMING/CONSULTANCY", "GRAPHIC DESIGNING", "INFORMATION SERVICE ACTIVITIES", "NETWORKING SERVICES", "PUBLISHING ACTIVITIES", "SOFTWARE DEVELOPMENT", "SUPPLY OF HARDWARE", "TELECOMMUNICATIONS", "WEB DESIGN"],
  "MANUFACTURING": ["ALUMINUM MANUFACTURING", "LEATHER WORKS/TANNERY", "MANUFACTURE OF BASIC METALS", "MANUFACTURE OF BEVERAGES", "MANUFACTURE OF CHEMICALS", "MANUFACTURE OF FURNITURE", "MANUFACTURE OF FOOD PRODUCTS", "MANUFACTURE OF TEXTILES", "MANUFACTURE OF WEARING APPAREL", "MANUFACTURE OF WOOD PRODUCTS", "MANUFACTURING OF CANDLES", "MANUFACTURING OF PLASTIC PRODUCTS", "PRODUCTION AND SALE OF BOTTLED WATER", "PRODUCTION AND SALE OF TILES", "PRODUCTION OF EDIBLE OIL", "SALE AND MANUFACTURING COSMETICS"],
  "MINING & QUARRYING": ["EXTRACTION OF CRUDE PETROLEUM", "GEOSCIENCES SERVICES", "MINING AND GRINDING", "MINING OF COAL", "MINING OF METAL ORES", "OIL AND GAS SERVICES", "QUARRYING"],
  "REAL ESTATE": ["ENVIRONMENTAL AND LANDSCAPING", "ESTATE AGENCY", "ESTATE SURVEYING AND VALUATION", "ESTATE AND FACILITY MANAGEMENT", "PROJECT MANAGEMENT SERVICES", "PROPERTY DEVELOPMENT", "REAL ESTATE ACTIVITIES", "TOWN PLANNING SERVICES"],
  "TRANSPORTATION": ["AIR TRANSPORT", "LAND TRANSPORT", "POSTAL AND COURIER", "RAIL SERVICES", "ROAD TRANSPORTATION", "SEA TRANSPORT", "TRUCK AND HAULAGE", "WAREHOUSING", "WATER TRANSPORT"],
  "ASSOCIATIONS (NGO/CLUBS)": ["COMMUNITY BASED ASSOCIATION", "CULTURAL BASED ASSOCIATION", "FAITH BASED ASSOCIATION", "FOUNDATION BASED ASSOCIATION", "SOCIAL CLUBS BASED ASSOCIATION", "SPORTING BASED ASSOCIATION"],
  "OTHERS": ["GENERAL MERCHANDISE", "TRADING", "OTHER PERSONAL SERVICES"]
};

// Step Indicator Component
const StepIndicator = ({ currentStep, totalSteps = 6 }) => {
  const stepIcons = [Briefcase, User, MapPin, Building2, FileText, CreditCard];
  const stepLabels = ['Service', 'Personal', 'Address', 'Business', 'Documents', 'Payment'];

  return (
    <div className="bg-white p-8 rounded-t-3xl border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            const IconComponent = stepIcons[idx];

            return (
              <React.Fragment key={`step-${idx}`}>
                <motion.div
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={24} />
                    ) : (
                      <IconComponent size={20} />
                    )}
                  </div>
                  <span className={`text-xs font-semibold mt-2 text-center truncate ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </motion.div>

                {idx < stepLabels.length - 1 && (
                  <div className={`flex-1 max-w-[80px] h-1 rounded transition-all duration-300 ${
                    isCompleted || isActive ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Wizard Footer Component
const WizardFooter = () => (
  <footer className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 px-4 mt-12">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2 text-blue-100">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Follow Us</h3>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-200 transition">Twitter</a>
            <a href="#" className="hover:text-blue-200 transition">Instagram</a>
            <a href="#" className="hover:text-blue-200 transition">LinkedIn</a>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-3">Support</h3>
          <a href="https://wa.me/2349048349548" className="text-sm hover:text-blue-200 transition flex items-center gap-2">
            <MessageCircle size={16} /> Chat with Support
          </a>
        </div>
      </div>
      <div className="border-t border-blue-600 pt-6 text-center text-sm text-blue-100">
        <p>© 2024 Rex360 Solutions. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Hero Section
const HeroSection = () => (
  <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-16 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Your Application</h1>
      <p className="text-lg text-blue-100">Complete the form below to begin your business registration process.</p>
    </div>
  </div>
);

const RegistrationWizard = ({ preSelectedService = null }) => {
  const { selectedService } = useParams();
  const navigate = useNavigate();

  // Determine service: preSelectedService (from Apply) > selectedService (from URL params) > default
  const initialService = preSelectedService?.title || selectedService || 'Business Name';

  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState(initialService);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [successStep, setSuccessStep] = useState(false);
  const [category, setCategory] = useState('');
  const [nature, setNature] = useState('');
  
  const [files, setFiles] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  const [previews, setPreviews] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  const [formData, setFormData] = useState({
    surname: '',
    firstname: '',
    othername: '',
    email: '',
    phone: '',
    nin: '',
    dob: '',
    gender: 'Male',
    hState: '',
    hLga: '',
    hStreet: '',
    bState: '',
    bLga: '',
    bStreet: '',
    cmpName1: '',
    cmpName2: '',
    cmpEmail: '',
    category: '',
    nature: ''
  });

  const currentPrice = preSelectedService?.price || prices[serviceType] || 0;
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('name, price').order('display_order', { ascending: true });
        if (error || !data) {
          setPrices({
            'Business Name': 35000,
            'Company Name': 80000,
            'NGO Registration': 140000,
            'Export Licence': 60000,
            'Trademark': 50000,
            'Copyright': 70000,
            'Annual Returns': 25000
          });
        } else {
          const priceMap = {};
          data.forEach(item => {
            let name = item.name;
            if (name === 'Company Registration') name = 'Company Name';
            priceMap[name] = item.price;
          });
          setPrices(priceMap);
        }
      } catch (err) {
        console.error('Price fetch error:', err);
        setPrices({
          'Business Name': 35000,
          'Company Name': 80000,
          'NGO Registration': 140000,
          'Export Licence': 60000,
          'Trademark': 50000,
          'Copyright': 70000,
          'Annual Returns': 25000
        });
      }
      setLoading(false);
    };

    fetchPrices();
  }, []);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Skip to step 2 if service is preselected (from Apply page)
  useEffect(() => {
    if (preSelectedService && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [preSelectedService, currentStep]);

  const handlePaystackPayment = (config) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      const paystack = window.PaystackPop.setup({
        key: config.publicKey,
        email: config.email,
        amount: config.amount,
        currency: config.currency || "NGN",
        reference: config.reference,
        metadata: config.metadata,
        onClose: function() {
          console.log('⚠️ Payment onClose called');
          setUploadStatus(null);
          alert("Payment not completed. Your registration was saved but payment is pending.");
        },
        callback: function(response) {
          console.log('✅ Payment callback called:', response);
          setUploadStatus('uploading');
          
          // Process the successful payment
          const paystackRef = response.reference || config.reference;
          
          // Save to database with payment reference
          saveToDatabase(paystackRef)
            .then(() => {
              // Clear form after success
              setFiles({ "ID Card": [], "Signature": [], "Passport": [] });
              setPreviews({ "ID Card": [], "Signature": [], "Passport": [] });
              setCategory('');
              setNature('');
              
              const form = document.querySelector('form');
              if (form) form.reset();
              
              document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
              document.querySelectorAll('input[type="email"]').forEach(input => input.value = '');
              document.querySelectorAll('input[type="date"]').forEach(input => input.value = '');
              document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
              document.querySelectorAll('textarea').forEach(ta => ta.value = '');
              document.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
              
              Object.values(previews).forEach(urls => {
                urls.forEach(url => URL.revokeObjectURL(url));
              });
              
              setUploadStatus('success');
              setSuccessStep(true);
              setTimeout(() => {
                navigate('/');
              }, 5000);
            })
            .catch((err) => {
              console.error('❌ Error in payment callback:', err);
              setUploadStatus('error');
              alert(`Registration error: ${err.message}`);
            });
        }
      });
      
      paystack.openIframe();
    } else {
      console.log('⚠️ Paystack not loaded, loading script...');
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        setTimeout(() => handlePaystackPayment(config), 500);
      };
      document.head.appendChild(script);
    }
  };

  // Save registration to database with payment verification
  const saveToDatabase = async (paystackRef) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Get all form values
        const allInputs = document.querySelectorAll('input, select, textarea');
        const fullDetails = {};
        allInputs.forEach(input => {
          if(input.id && input.type !== 'file') {
            fullDetails[input.id] = input.value;
          }
        });

        fullDetails['business_category'] = category;
        fullDetails['business_nature'] = nature;

        // Initialize document URLs object
        const documentUrls = {};

        try {
          // Prepare registration data with payment reference
          const registrationData = {
            service_type: serviceType,
            surname: fullDetails['surname'],
            firstname: fullDetails['firstname'],
            phone: fullDetails['phone'],
            email: fullDetails['email'],
            amount: currentPrice || 0,
            paystack_ref: paystackRef,
            payment_status: 'paid',
            full_details: {
              ...fullDetails,
              business_category: category,
              business_nature: nature,
              status: 'approved',
              payment_reference: paystackRef,
              documents: documentUrls
            }
          };

          // Upload documents if any exist
          
          for (const key of Object.keys(files)) {
            if (files[key].length === 0) {
              documentUrls[key] = [];
              continue;
            }
            
            const uploadPromises = files[key].map(async (file, i) => {
              try {
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const fileExt = file.name.split('.').pop() || 'unknown';
                const fileName = `${timestamp}_${i}_${randomStr}.${fileExt}`;
                const path = `documents/${key}/${fileName}`;
                
                const { data: uploadData, error: uploadErr } = await supabase.storage
                  .from('documents')
                  .upload(path, file, { upsert: false });
                
                if (uploadErr) throw new Error(`Failed to upload ${key}: ${uploadErr.message}`);
                
                const { data: urlData } = supabase.storage
                  .from('documents')
                  .getPublicUrl(path);
                
                if (!urlData || !urlData.publicUrl) {
                  throw new Error(`Could not get public URL for ${path}`);
                }
                
                return urlData.publicUrl;
              } catch (fileErr) {
                throw fileErr;
              }
            });
            
            try {
              const uploadedUrls = await Promise.all(uploadPromises);
              documentUrls[key] = uploadedUrls;
            } catch (uploadErr) {
              throw new Error(`Document upload failed for ${key}: ${uploadErr.message}`);
            }
          }

          // Update registration data with document URLs
          registrationData.full_details.documents = documentUrls;

          // Add service-specific fields
          if (serviceType === 'NGO Registration') {
            registrationData['ngo_name'] = fullDetails['ngo-name1'];
            registrationData['ngo_tenure'] = fullDetails['ngo-tenure'];
            registrationData['ngo_address'] = fullDetails['ngo-address'];
            registrationData['ngo_aim1'] = fullDetails['ngo-aim1'];
            registrationData['ngo_aim2'] = fullDetails['ngo-aim2'];
          }

          // Save to Supabase
          const { data: rawData, error: dbError } = await supabase
            .from('registrations')
            .insert([registrationData])
            .select();

          if (dbError) {
            console.error('Database error:', dbError);
            throw new Error(`Database error: ${dbError.message}`);
          }

          console.log('✅ Registration saved with payment:', rawData);
          resolve();
        } catch (uploadErr) {
          console.error('Upload/Save error:', uploadErr);
          reject(uploadErr);
        }
      } catch (err) {
        console.error('Database error:', err);
        reject(err);
      }
    });
  };

  const handleFileChange = (e, docType) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => ({ ...prev, [docType]: [...prev[docType], ...newFiles] }));
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({
          ...prev,
          [docType]: [...prev[docType], event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (e, docType, index) => {
    e.preventDefault();
    setFiles(prev => ({
      ...prev,
      [docType]: prev[docType].filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      [docType]: prev[docType].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepNum) => {
    switch(stepNum) {
      case 1:
        return serviceType !== '';
      case 2:
        return formData.surname && formData.firstname && formData.email && formData.phone;
      case 3:
        return formData.hState && formData.hLga;
      case 4:
        return true;
      case 5:
        return Object.values(files).some(arr => arr.length > 0);
      case 6:
        return true;
      default:
        return true;
    }
  };

  const handlePaymentClick = async () => {
    if (uploadStatus === 'uploading') return;

    setUploadStatus('uploading');

    try {
      // Get email and phone for Paystack
      const email = formData.email?.trim() || '';
      const phone = formData.phone?.trim() || '';

      const priceValue = Number(currentPrice) || 0;
      const amountInKobo = Math.max(100, Math.floor(priceValue * 100));

      const reference = `Rex360${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

      console.log('💰 Payment config:', {
        email,
        amount: amountInKobo,
        currency: "NGN",
        reference,
        service: serviceType
      });

      const config = {
        publicKey: paystackPublicKey,
        email: email,
        amount: amountInKobo,
        currency: "NGN",
        reference: reference,
        metadata: {
          phone: phone,
          service_type: serviceType
        }
      };

      handlePaystackPayment(config);
    } catch (err) {
      console.error('Payment error:', err);
      setUploadStatus(null);
      alert(`Error: ${err.message}`);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Please fill all required fields in this step');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (successStep) {
    // Scroll to top when success step is shown
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
      <div className="pt-20 pb-20 px-8 text-center bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <CheckCircle size={120} className="text-green-600 mx-auto drop-shadow-lg" />
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
          >
            🎉 SUCCESS! 🎉
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-xl text-gray-600 mb-8"
          >
            Your registration and payment have been processed successfully!
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-gray-600"
          >
            Redirecting you in a few seconds...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-all duration-300 shadow-sm border border-gray-200"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Services</span>
        </motion.button>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <StepIndicator currentStep={currentStep} />

          <form className="p-8 md:p-12 space-y-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Service Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Service</h2>
                    <p className="text-gray-600">Choose the registration service you need</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(prices).map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setServiceType(name)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          serviceType === name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-2">₦{parseInt(prices[name]).toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Personal Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h2>
                    <p className="text-gray-600">Enter your personal information</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="surname" className="text-xs font-bold text-gray-700 uppercase block mb-2">Surname *</label>
                      <input id="surname" autoComplete="family-name" placeholder="Surname" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.surname} onChange={(e) => handleInputChange('surname', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="firstname" className="text-xs font-bold text-gray-700 uppercase block mb-2">First Name *</label>
                      <input id="firstname" autoComplete="given-name" placeholder="First Name" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.firstname} onChange={(e) => handleInputChange('firstname', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="othername" className="text-xs font-bold text-gray-700 uppercase block mb-2">Other Name</label>
                      <input id="othername" autoComplete="additional-name" placeholder="Other Name" className="p-3 border border-gray-300 rounded-lg w-full" />
                    </div>
                    <div>
                      <label htmlFor="dob" className="text-xs font-bold text-gray-700 uppercase block mb-2">Date of Birth *</label>
                      <input id="dob" type="date" autoComplete="bday" className="p-3 border border-gray-300 rounded-lg w-full" required />
                    </div>
                    <div>
                      <label htmlFor="gender" className="text-xs font-bold text-gray-700 uppercase block mb-2">Gender</label>
                      <select id="gender" autoComplete="sex" className="p-3 border border-gray-300 rounded-lg w-full">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-xs font-bold text-gray-700 uppercase block mb-2">Phone *</label>
                      <input id="phone" autoComplete="tel" placeholder="Phone Number" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase block mb-2">Email *</label>
                      <input id="email" type="email" autoComplete="email" placeholder="Email Address" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="nin" className="text-xs font-bold text-gray-700 uppercase block mb-2">NIN *</label>
                      <input id="nin" autoComplete="off" placeholder="NIN (11 Digits)" className="p-3 border border-gray-300 rounded-lg w-full" required />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Residential Address */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Residential Address</h2>
                    <p className="text-gray-600">Where do you currently reside?</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="h-state" className="text-xs font-bold text-gray-700 uppercase block mb-2">State *</label>
                      <input id="h-state" placeholder="State" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.hState} onChange={(e) => handleInputChange('hState', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="h-lga" className="text-xs font-bold text-gray-700 uppercase block mb-2">LGA *</label>
                      <input id="h-lga" placeholder="LGA" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.hLga} onChange={(e) => handleInputChange('hLga', e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="h-street" className="text-xs font-bold text-gray-700 uppercase block mb-2">Street/House No</label>
                      <input id="h-street" placeholder="Street/House No" className="p-3 border border-gray-300 rounded-lg w-full" value={formData.hStreet} onChange={(e) => handleInputChange('hStreet', e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Business Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
                    <p className="text-gray-600">Tell us about your business</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="biz-name" className="text-xs font-bold text-gray-700 uppercase block mb-2">Proposed Business Name</label>
                      <input id="biz-name" placeholder="Proposed Business Name" className="p-3 border border-gray-300 rounded-lg w-full" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Nature of Business</label>
                      <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 border border-gray-300 rounded-lg w-full mb-3">
                        <option value="">Select Category</option>
                        {Object.keys(BUSINESS_CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {category && (
                        <select id="nature" value={nature} onChange={(e) => setNature(e.target.value)} className="p-3 border border-gray-300 rounded-lg w-full">
                          <option value="">Select Nature</option>
                          {BUSINESS_CATEGORIES[category].map(nat => (
                            <option key={nat} value={nat}>{nat}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Documents Upload */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
                    <p className="text-gray-600">Upload your identity verification documents</p>
                  </div>
                  <div className="space-y-8">
                    {Object.keys(files).map(doc => (
                      <div key={doc} className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase">{doc} Image</label>
                        <div className="flex flex-wrap gap-4">
                          {previews[doc].map((src, index) => (
                            <div key={index} className="relative w-28 h-28">
                              <img src={src} alt="preview" className="w-full h-full object-cover rounded-lg border-2 border-blue-300" />
                              <button
                                type="button"
                                onClick={(e) => removeFile(e, doc, index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          <label className="w-28 h-28 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                            <Upload className="text-blue-600" size={24} />
                            <span className="text-xs font-bold text-blue-600 mt-1">UPLOAD</span>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, doc)} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 6: Payment */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm & Pay</h2>
                    <p className="text-gray-600">Review your information and complete secure payment via Paystack</p>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">📋 Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Service:</span>
                        <span className="font-bold text-gray-900">{serviceType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Email:</span>
                        <span className="font-bold text-gray-900">{formData.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                        <span className="text-lg font-bold text-gray-900">Amount to Pay:</span>
                        <span className="text-2xl font-bold text-blue-600">₦{parseInt(currentPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-3">💳 Secure Payment Method</h3>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CreditCard size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Paystack Payment Gateway</p>
                        <p className="text-sm text-gray-600">Secure & encrypted transaction</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-white p-3 rounded border border-green-200">
                      ✓ 256-bit SSL encrypted<br/>
                      ✓ PCI DSS compliant<br/>
                      ✓ Payment confirmed instantly<br/>
                      ✓ Automatic admin notification
                    </p>
                  </div>

                  {/* Payment Button */}
                  <button
                    type="button"
                    onClick={handlePaymentClick}
                    disabled={uploadStatus === 'uploading'}
                    className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      uploadStatus === 'uploading'
                        ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                        : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <Loader className="animate-spin" size={18} /> PROCESSING PAYMENT...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} /> PROCEED TO SECURE PAYMENT
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    By clicking "Proceed to Secure Payment", you agree to our Terms of Service and will be redirected to Paystack to complete your payment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  <ArrowLeft size={18} /> Previous
                </button>
              )}
              {currentStep < 6 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Next <ArrowRight size={18} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <WizardFooter />
    </div>
  );
};

export default RegistrationWizard;
