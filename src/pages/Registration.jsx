import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X, ArrowLeft, Briefcase, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase, testSupabaseConnection } from '../SupabaseClient';
import { getValue } from '../utils';

// --- 1. HUGE LIST OF BUSINESS CATEGORIES (100% PRESERVED) ---
const BUSINESS_CATEGORIES = {
  "GENERAL SUPPLIES & SERVICES": ["ACCOMODATION AND FOOD SERVIVES ACTIVITIES", "ACCOMMODATION", "BAKERY SERVICES", "BREWERY SERVICES", "DEAL IN HOT DRINKS", "DEAL IN SOFT DRINKS", "DEAL IN WINES, DRINKS AND BEVERAGES", "FOOD AND BEVERAGES SERVICES ACTIVITIES", "FRUITS/FRUIT JUICE PRODUCTION AND SALES", "HOTEL RESERVATION SERVICES", "HOTEL AND HOSPITALITY", "HOTEL/HOSPITALITY SERVICES", "OPERATE CONFECTIONERY SHOP", "OPERATE FAST FOOD OUTLET", "OPERATE RESTAURANT AND CATERING SERVICES", "OPERATE VIEWING CENTRE"],
  "ADMINISTRATIVE & SUPPORT SERVICES": ["ABATTOIR AND MEAT SELLING SERVICES", "AUTOMATED CAR WASH SERVICES", "BLACK SMITH SERVICES", "BLOCK INDUSTRY", "BOUTIQUE SERVICES", "CAR WASH SERVICES", "CATERING SERVICES", "CLEARING AND FORWARDING SERVICES", "COBBLER SERVICES", "COLD ROOM SERVICES", "COMMISSION AGENCY", "CYBERCAFÉ AND BUSINESS CENTRE", "DEAL IN JEWELRY AND ACCESSORIES", "DOMESTIC SUPPORT SERVICES", "DRIVING SCHOOL SERVICES", "EVENTS MANAGEMENT, GENERAL MERCHANDISE", "ELECTRICAL SERVICES", "EMPLOYMENT AGENCY", "ERRAND AND HOME DELIVERY SERVICES", "FARMING", "FASHION DESIGNING/ TAILORING", "FIRE AND SAFETY SERVICES", "FROZEN FOODS SERVICES", "GENERAL CONTRACTS", "GENERAL MERCHANDISE", "GOLD SMITING SERVICES", "HAT MAKING SERVICES", "INDUSTRIAL CHEMICAL SERVICES", "INTERIOR/EXTERIOR DECORATION", "INTERNET SERVICES", "LAUNDRY SERVICES", "LUBRICANT/ OIL SERVICES", "MAINTENANCE OF REFRIGERATOR/AC", "MANUFACTURER’S REPRESENTATION", "MARKETING SERVICES", "MEDICAL LABORATORY SERVICES", "MORTUARY AND FUNERAL SERVICES", "OFFICE ADMINISTRATIVE SUPPORT", "PLASTIC MANUFACTURING SERVICES", "PLUMBING SERVICES", "PRINTING PRESS", "PRODUCTION AND SALES OF FOOTWEAR", "PUBLIC RELATION SERVICES", "RENTAL SERVICES", "RESTAURANT", "SAFETY EQUIPMENT SERVICES", "SALE OF PETROLEUM PRODUCTS", "SALES OF BOOKS AND STATIONERIES", "SAWMILLING SERVICES", "SECURITY AND INVESTIGATION ACTIVITIES", "SUPPLY OF UNSKILLED LABOUR", "TECHNICAL SERVICES", "TEXTILE SERVICES", "TRADING", "TRAVEL AGENCY", "UPHOLSTERY AND FURNITURE MAKING", "VULCANIZING SERVICES", "WELDING SERVICES"],
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

const Registration = () => {
  console.log('🚀 Registration component starting...');

  const { selectedService } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues } = useForm();

  console.log('📋 selectedService:', selectedService);

  const [serviceType, setServiceType] = useState(selectedService || 'Business Name');
  const [step, setStep] = useState('form');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [files, setFiles] = useState({ 
    "ID Card": [], 
    "Signature": [], 
    "Passport": [], 
    "Logo": [],
    // NGO Officer Documents
    "Chairman Signature": [],
    "Chairman Passport": [],
    "Chairman NIN Slip": [],
    "Secretary Signature": [],
    "Secretary Passport": [],
    "Secretary NIN Slip": [],
    "Trustee1 Signature": [],
    "Trustee1 Passport": [],
    "Trustee1 NIN Slip": [],
    "Trustee2 NIN Slip": [],
    // Copyright Documents
    "Copyright Work Copy": [],
    "Copyright Owner ID": []
  });
  
  const [previews, setPreviews] = useState({
    "ID Card": [], 
    "Signature": [], 
    "Passport": [], 
    "Logo": [],
    // NGO Officer Documents
    "Chairman Signature": [],
    "Chairman Passport": [],
    "Chairman NIN Slip": [],
    "Secretary Signature": [],
    "Secretary Passport": [],
    "Secretary NIN Slip": [],
    "Trustee1 Signature": [],
    "Trustee1 Passport": [],
    "Trustee1 NIN Slip": [],
    "Trustee2 Signature": [],
    "Trustee2 Passport": [],
    "Trustee2 NIN Slip": []
  });
  
  const [category, setCategory] = useState('');
  const [nature, setNature] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    surname: '',
    firstname: '',
    email: '',
    phone: ''
  });

  // Connection and status tracking
  const [uploadStatus, setUploadStatus] = useState(null); // null, uploading, success, error
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Countdown timer effect - runs only when step is 'success'
  useEffect(() => {
    if (step !== 'success') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Auto scroll to top when success step is reached
  useEffect(() => {
    if (step === 'success') {
      window.scrollTo(0, 0);
    }
  }, [step]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log('🔄 Fetching service prices...');
        console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

        const { data, error } = await supabase.from('services').select('name, price').order('display_order', { ascending: true });
        if (error) {
          console.error("❌ Error loading service fees:", error);
          console.error("Error details:", error.message, error.code, error.details);
          // Set fallback prices to prevent blank page
          setPrices({
            'Business Name': 3000,
            'Company Name': 5000,
            'NGO Registration': 15000,
            'Export Licence': 25000,
            'Trademark': 20000,
            'Copyright': 25000,
            'Annual Returns': 5000
          });
          setLoading(false);
        } else if (data && data.length > 0) {
          console.log('✅ Service prices loaded:', data);
          const priceMap = {};
          data.forEach(item => {
            let name = item.name;
            if (name === 'Company Registration') name = 'Company Name';
            priceMap[name] = item.price;
          });
          setPrices(priceMap);
          setLoading(false);
        } else {
          console.warn('⚠️ No service data received, using fallback prices');
          // Fallback prices to prevent blank page
          setPrices({
            'Business Name': 3000,
            'Company Name': 5000,
            'NGO Registration': 15000,
            'Export Licence': 25000,
            'Trademark': 20000,
            'Copyright': 25000,
            'Annual Returns': 5000
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('💥 Unexpected error fetching prices:', err);
        console.error('Error stack:', err.stack);
        // Fallback prices to prevent blank page
        setPrices({
          'Business Name': 3000,
          'Company Name': 5000,
          'NGO Registration': 15000,
          'Export Licence': 25000,
          'Trademark': 20000,
          'Copyright': 25000,
          'Annual Returns': 5000
        });
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      let correctedName = selectedService.replace(/-/g, ' ');
      if (correctedName === 'Company Registration') correctedName = 'Company Name';
      setServiceType(correctedName);
    }
  }, [selectedService]);

  const handleFileChange = (e, docName) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) {
      const newPreviews = selected.map(file => URL.createObjectURL(file));
      setFiles(prev => ({ ...prev, [docName]: [...prev[docName], ...selected] }));
      setPreviews(prev => ({ ...prev, [docName]: [...prev[docName], ...newPreviews] }));
    }
  };

  const removeFile = (e, docName, index) => {
    e.preventDefault();
    setFiles(prev => {
        const updated = [...prev[docName]];
        updated.splice(index, 1);
        return { ...prev, [docName]: updated };
    });
    setPreviews(prev => {
        const updated = [...prev[docName]];
        URL.revokeObjectURL(updated[index]);
        updated.splice(index, 1);
        return { ...prev, [docName]: updated };
    });
  };

  const generatePDF = () => {
    try {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("REX360 SOLUTIONS", 20, 20);
        doc.setFontSize(14);
        doc.text(`Service: ${serviceType}`, 20, 30);
        doc.text(`Nature: ${nature}`, 20, 40);
        doc.save(`REX360_${serviceType}.pdf`);
    } catch (err) { console.error("PDF Failed", err); }
  };

  const currentPrice = prices[serviceType] || 0;

  const saveToDatabase = async (reference) => {
    console.log('🔵 Starting saveToDatabase...', { reference, serviceType, currentPrice });

    // Helper to get values from the form inputs
    const getFormValue = (id) => {
      const element = document.getElementById(id);
      return element ? element.value : '';
    };

    const allInputs = document.querySelectorAll('input, select, textarea');
    const fullDetails = {};
    allInputs.forEach(input => {
        if(input.id && input.type !== 'file') {
            fullDetails[input.id] = input.value;
        }
    });

    // Explicitly ensure Annual Returns fields are captured
    fullDetails['business_category'] = category;
    fullDetails['business_nature'] = nature;

    try {
        const documentUrls = {};
        
        // Check if files exist
        const hasFiles = Object.values(files).some(arr => arr.length > 0);
        if (!hasFiles) {
          console.log('📋 No files provided - creating empty document URLs');
          documentUrls['ID Card'] = [];
          documentUrls['Signature'] = [];
          documentUrls['Passport'] = [];
        }
        
        // Upload documents with detailed logging
        console.log('📤 Starting document uploads...');
        
        for (const key of Object.keys(files)) {
            console.log(`📁 Processing ${key}:`, files[key].length, 'files');
            
            if (files[key].length === 0) {
                console.log(`⏭️  Skipping ${key} - no files`);
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
                    
                    console.log(`⬆️  Uploading ${key} (${i+1}):`, fileName);
                    
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from('documents')
                        .upload(path, file, { upsert: false });
                    
                    if (uploadErr) {
                        console.error(`❌ Upload error for ${key}:`, uploadErr.message);
                        throw new Error(`Failed to upload ${key}: ${uploadErr.message}`);
                    }
                    
                    console.log(`✅ ${key} uploaded successfully:`, path);
                    
                    const { data: urlData } = supabase.storage
                        .from('documents')
                        .getPublicUrl(path);
                    
                    if (!urlData || !urlData.publicUrl) {
                      throw new Error(`Could not get public URL for ${path}`);
                    }
                    
                    console.log(`🔗 Public URL generated:`, urlData.publicUrl);
                    return urlData.publicUrl;
                    
                } catch (fileErr) {
                    console.error(`💥 Document upload failed:`, fileErr.message);
                    throw fileErr;
                }
            });
            
            try {
              const uploadedUrls = await Promise.all(uploadPromises);
              documentUrls[key] = uploadedUrls;
              console.log(`✅ ${key} complete:`, uploadedUrls.length, 'files uploaded');
            } catch (uploadErr) {
              console.error(`❌ Failed to upload ${key}:`, uploadErr.message);
              throw new Error(`Document upload failed for ${key}: ${uploadErr.message}`);
            }
        }
        
        console.log('✅ All documents uploaded:', documentUrls);

        // Save registration to database - Handle both bn-prefixed and regular field IDs
        // For Business Name, fields have bn- prefix; for others, they use regular IDs
        const getFieldValue = (fieldName) => {
          // Try bn-prefixed first (for Business Name)
          const bnElement = document.getElementById(`bn-${fieldName}`);
          if (bnElement && bnElement.value) return bnElement.value;
          
          // Try regular field ID
          const regularElement = document.getElementById(fieldName);
          if (regularElement && regularElement.value) return regularElement.value;
          
          return '';
        };
        
        const registrationData = {
            service_type: serviceType,
            surname: getFieldValue('surname'),
            firstname: getFieldValue('firstname'),
            phone: getFieldValue('phone'),
            email: getFieldValue('email'),
            amount: currentPrice || 0,  // USE CURRENT PRICE - FIX FOR DATA SAVING
            paystack_ref: reference,
            payment_status: 'paid',  // Set to paid after successful payment
            full_details: { ...fullDetails, uploaded_docs: documentUrls }
        };
        
        console.log('💾 Saving registration data:', registrationData);
        
        const { data: insertData, error } = await supabase
            .from('registrations')
            .insert([registrationData]);
        
        if (error) {
            console.error('❌ Supabase Error:', error);
            throw new Error(`Registration Error: ${error.message}`);
        }
        
        console.log('✅ Registration saved successfully:', insertData);
        setUploadStatus('success');
        setStatusMessage('');
        return insertData;
        
    } catch (err) {
      setUploadStatus('error');
      setStatusMessage('');
      throw new Error(`Registration save failed: ${err.message}`);
    }
  };

  // Paystack Config - Get public key from environment
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  
  // Debug: Log Paystack key status (only show first few chars for security)
  console.log('🔑 Paystack Public Key:', paystackPublicKey ? `${paystackPublicKey.substring(0, 10)}...` : 'NOT SET');

  // Paystack inline handler using official method
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
          setStatusMessage('');
          alert("Payment not completed. Your registration was not submitted.");
        },
        callback: function(response) {
          console.log('✅ Payment callback called:', response);
          setUploadStatus('uploading');
          setStatusMessage('Processing your registration...');
          
          // Process the successful payment
          const paystackRef = response.reference || config.reference;
          
          saveToDatabase(paystackRef)
            .then(() => {
              // Clear form silently
              setFiles({ "ID Card": [], "Signature": [], "Passport": [], "Logo": [] });
              setPreviews({ "ID Card": [], "Signature": [], "Passport": [], "Logo": [] });
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
              setStatusMessage('');
              setStep('success');
            })
            .catch((err) => {
              console.error('❌ Error in payment callback:', err);
              setUploadStatus('error');
              setStatusMessage('');
              alert(`Registration error: ${err.message}`);
            });
        }
      });
      
      paystack.openIframe();
    } else {
      // Fallback: Load Paystack script dynamically
      console.log('⚠️ Paystack not loaded, loading script...');
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        handlePaystackPayment(config);
      };
      script.onerror = () => {
        alert('Failed to load payment system. Please check your internet connection and try again.');
      };
      document.head.appendChild(script);
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    
    console.log('🔄 Starting handleProcess...');
    console.log('📋 Current price:', currentPrice);
    console.log('🔑 Paystack key exists:', !!paystackPublicKey);
    
    // Validate price
    if (!currentPrice || currentPrice === 0) {
        alert("Service fee information is loading. Please try again.");
        console.error('❌ Price is 0 or undefined');
        return;
    }
    
    // Check for missing documents
    const missingDocs = Object.keys(files).filter(doc => files[doc].length === 0);
    if (missingDocs.length > 0) {
        alert(`Please provide your ${missingDocs.join(', ')}`);
        console.log('⚠️ Missing documents:', missingDocs);
        return; 
    }
    
    // Validate form fields
    const emailVal = document.getElementById('email')?.value;
    const phoneVal = document.getElementById('phone')?.value;
    const surnameVal = document.getElementById('surname')?.value;
    const firstnameVal = document.getElementById('firstname')?.value;
    
    if (!emailVal || !phoneVal || !surnameVal || !firstnameVal) {
        alert("Please complete all required fields: surname, firstname, email, phone");
        console.log('⚠️ Missing required fields');
        return;
    }
    
    // Check if public key is configured
    if (!paystackPublicKey) {
      alert("Payment system is not configured. Please contact support.");
      console.error('❌ Paystack public key is empty!');
      return;
    }
    
    // Build payment config with proper types
    const email = String(emailVal).trim();
    const phone = String(phoneVal).trim();
    
    // Ensure amount is a valid integer in kobo (minimum 100 kobo = ₦1)
    const priceValue = Number(currentPrice) || 0;
    const amountInKobo = Math.max(100, Math.floor(priceValue * 100));
    
    // Generate a simple alphanumeric reference
    const reference = `Rex360${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    console.log('💰 Payment config:', {
      publicKey: paystackPublicKey.substring(0, 15) + '...',
      email,
      amount: amountInKobo,
      currency: "NGN",
      reference
    });
    
    // Use official Paystack inline method
    console.log('🔄 Using Paystack inline...');
    
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
    
    try {
      console.log('🚀 Calling handlePaystackPayment with config:', config);
      
      // Initialize payment using official Paystack inline
      handlePaystackPayment(config);
      
      console.log('✅ handlePaystackPayment called - waiting for Paystack modal');
    } catch (err) {
      console.error('❌ Error initializing payment:', err);
      alert(`Payment initialization error: ${err.message}. Please disable popup blocker or contact support.`);
    }
  };

  const NatureOfBusinessSelector = () => (
    <div className="md:col-span-2 space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <label className="text-[10px] font-black uppercase text-slate-400">Nature of Business</label>
        <select id="business_category" className="w-full p-4 rounded-xl font-bold text-slate-700 mb-2 border-2 border-white focus:border-cac-blue" value={category} onChange={(e) => { setCategory(e.target.value); setNature(''); }}>
            <option value="">-- Select Business Category --</option>
            {Object.keys(BUSINESS_CATEGORIES).map(cat => ( <option key={cat} value={cat}>{cat}</option> ))}
        </select>
        <select id="business_nature" className="w-full p-4 rounded-xl font-bold text-slate-700 disabled:opacity-50 border-2 border-white focus:border-cac-blue" value={nature} onChange={(e) => setNature(e.target.value)} disabled={!category}>
            <option value="">-- Select Specific Activity --</option>
            {category && BUSINESS_CATEGORIES[category].map(item => ( <option key={item} value={item}>{item}</option> ))}
        </select>
    </div>
  );

  const renderFields = () => {
    switch(serviceType) {
      case 'Business Name':
        return (
          <div className="space-y-8">
            {/* PERSONAL DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">1. PERSONAL DETAILS</h3>
               <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bn-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">SURNAME *</label>
                    <input id="bn-surname" autoComplete="family-name" placeholder="SURNAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FIRST NAME *</label>
                    <input id="bn-firstname" autoComplete="given-name" placeholder="FIRST NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-othername" className="text-[9px] font-black text-slate-400 uppercase block mb-1">OTHER NAME</label>
                    <input id="bn-othername" autoComplete="additional-name" placeholder="OTHER NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div>
                    <label htmlFor="bn-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="bn-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="bn-gender" className="text-[9px] font-black text-slate-400 uppercase block mb-1">GENDER *</label>
                    <select id="bn-gender" autoComplete="sex" className="p-4 rounded-xl border-none font-bold w-full uppercase" required>
                      <option value="">SELECT GENDER</option>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bn-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="bn-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL *</label>
                    <input id="bn-email" type="email" autoComplete="email" placeholder="EMAIL" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN *</label>
                    <input id="bn-nin" autoComplete="off" placeholder="NIN (11 DIGITS)" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
               </div>
            </div>

            {/* RESIDENTIAL ADDRESS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">2. YOUR RESIDENTIAL ADDRESS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bn-res-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="bn-res-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-res-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="bn-res-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-res-city" className="text-[9px] font-black text-slate-400 uppercase block mb-1">CITY/TOWN/VILLAGE</label>
                    <input id="bn-res-city" autoComplete="address-level2" placeholder="CITY/TOWN/VILLAGE" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div>
                    <label htmlFor="bn-res-house" className="text-[9px] font-black text-slate-400 uppercase block mb-1">HOUSE NUMBER</label>
                    <input id="bn-res-house" autoComplete="street-address" placeholder="HOUSE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bn-res-street" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STREET NAME</label>
                    <input id="bn-res-street" autoComplete="street-address" placeholder="STREET NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
               </div>
            </div>

            {/* BUSINESS ADDRESS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">3. YOUR BUSINESS ADDRESS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bn-biz-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="bn-biz-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-biz-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="bn-biz-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-biz-city" className="text-[9px] font-black text-slate-400 uppercase block mb-1">CITY/TOWN/VILLAGE</label>
                    <input id="bn-biz-city" autoComplete="address-level2" placeholder="CITY/TOWN/VILLAGE" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div>
                    <label htmlFor="bn-biz-house" className="text-[9px] font-black text-slate-400 uppercase block mb-1">HOUSE NUMBER</label>
                    <input id="bn-biz-house" autoComplete="street-address" placeholder="HOUSE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bn-biz-street" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STREET NAME *</label>
                    <input id="bn-biz-street" autoComplete="street-address" placeholder="STREET NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
               </div>
            </div>

            {/* BUSINESS DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">4. BUSINESS DETAILS</h3>
               <div className="grid gap-4">
                  <div>
                    <label htmlFor="bn-nature" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NATURE OF BUSINESS *</label>
                    <input id="bn-nature" autoComplete="off" placeholder="NATURE OF BUSINESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-description" className="text-[9px] font-black text-slate-400 uppercase block mb-1">BUSINESS DESCRIPTION *</label>
                    <textarea id="bn-description" autoComplete="off" placeholder="IN FULL DETAILS, WHAT THE BUSINESS IS ALL ABOUT, THE PRODUCT THE BUSINESS SELLS OR THE SERVICE IT RENDERS" className="w-full p-4 rounded-xl border-none font-bold h-32 uppercase" required></textarea>
                  </div>
               </div>
            </div>

            {/* PROPOSED BUSINESS NAMES */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">5. PROPOSED BUSINESS NAMES</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bn-name1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">BUSINESS NAME 1 *</label>
                    <input id="bn-name1" autoComplete="off" placeholder="BUSINESS NAME 1" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="bn-name2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">BUSINESS NAME 2</label>
                    <input id="bn-name2" autoComplete="off" placeholder="BUSINESS NAME 2" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
               </div>
            </div>

            {/* BUSINESS EMAIL */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">6. BUSINESS EMAIL ADDRESS</h3>
              <div>
                <label htmlFor="bn-business-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">BUSINESS EMAIL ADDRESS *</label>
                <input id="bn-business-email" type="email" autoComplete="email" placeholder="BUSINESS EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
              </div>
            </div>
          </div>
        );
      case 'Company Name':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Company Info</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cmp-name1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Company Name 1</label>
                  <input id="cmp-name1" autoComplete="off" placeholder="Company Name 1" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="cmp-name2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Company Name 2</label>
                  <input id="cmp-name2" autoComplete="off" placeholder="Company Name 2" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="cmp-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Company Email</label>
                  <input id="cmp-email" autoComplete="email" placeholder="Company Email" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <NatureOfBusinessSelector />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Company Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label htmlFor="b-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">State</label>
                        <input id="b-state" autoComplete="address-level1" placeholder="State" className="p-3 rounded-lg border-none w-full" />
                      </div>
                      <div>
                        <label htmlFor="b-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA</label>
                        <input id="b-lga" autoComplete="address-level2" placeholder="LGA" className="p-3 rounded-lg border-none w-full" />
                      </div>
                      <div>
                        <label htmlFor="b-street" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Street</label>
                        <input id="b-street" autoComplete="street-address" placeholder="Street/No" className="p-3 rounded-lg border-none w-full" />
                      </div>
                   </div>
                </div>
                <div className="md:col-span-2 p-4 bg-white rounded-xl border border-blue-100">
                    <p className="text-xs font-black text-cac-blue mb-3 uppercase">Witness / Director Details</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="wit-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname</label>
                        <input id="wit-surname" autoComplete="family-name" placeholder="Surname" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                      <div>
                        <label htmlFor="wit-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name</label>
                        <input id="wit-firstname" autoComplete="given-name" placeholder="First Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                      <div>
                        <label htmlFor="wit-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone</label>
                        <input id="wit-phone" autoComplete="tel" placeholder="Phone" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                      <div>
                        <label htmlFor="wit-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN</label>
                        <input id="wit-nin" autoComplete="off" placeholder="NIN" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                      <div>
                        <label htmlFor="wit-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">State</label>
                        <input id="wit-state" autoComplete="address-level1" placeholder="State" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                      <div>
                        <label htmlFor="wit-street" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Street Address</label>
                        <input id="wit-street" autoComplete="street-address" placeholder="Street Address" className="p-3 bg-slate-50 rounded-lg w-full" />
                      </div>
                    </div>
                </div>
             </div>
          </div>
        );
      case 'NGO Registration':
        return (
          <div className="space-y-8">
            {/* SECTION 1: CHAIRMAN DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">1. CHAIRMAN DETAILS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="chairman-fullname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FULL NAME *</label>
                    <input id="chairman-fullname" autoComplete="off" placeholder="FULL NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN NUMBER *</label>
                    <input id="chairman-nin" autoComplete="off" placeholder="NIN NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="chairman-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL ADDRESS *</label>
                    <input id="chairman-email" type="email" autoComplete="email" placeholder="EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="chairman-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="chairman-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="chairman-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="chairman-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
               </div>
               {/* Chairman Documents */}
               <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">SUPPORT DOCUMENTS (SIGNATURE, PASSPORT PHOTOGRAPH AND NIN SLIP)</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">SIGNATURE</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Chairman Signature')} />
                         </label>
                         {previews['Chairman Signature']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Chairman Signature', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">PASSPORT PHOTOGRAPH</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Chairman Passport')} />
                         </label>
                         {previews['Chairman Passport']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Chairman Passport', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">NIN SLIP</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Chairman NIN Slip')} />
                         </label>
                         {previews['Chairman NIN Slip']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Chairman NIN Slip', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 2: SECRETARY DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">2. SECRETARY DETAILS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="secretary-fullname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FULL NAME *</label>
                    <input id="secretary-fullname" autoComplete="off" placeholder="FULL NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN NUMBER *</label>
                    <input id="secretary-nin" autoComplete="off" placeholder="NIN NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="secretary-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL ADDRESS *</label>
                    <input id="secretary-email" type="email" autoComplete="email" placeholder="EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="secretary-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="secretary-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="secretary-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="secretary-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
               </div>
               {/* Secretary Documents */}
               <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">SUPPORT DOCUMENTS (SIGNATURE, PASSPORT PHOTOGRAPH AND NIN SLIP)</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">SIGNATURE</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Secretary Signature')} />
                         </label>
                         {previews['Secretary Signature']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Secretary Signature', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">PASSPORT PHOTOGRAPH</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Secretary Passport')} />
                         </label>
                         {previews['Secretary Passport']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Secretary Passport', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">NIN SLIP</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Secretary NIN Slip')} />
                         </label>
                         {previews['Secretary NIN Slip']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Secretary NIN Slip', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 3: TRUSTEE 1 DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">3. TRUSTEE 1 DETAILS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trustee1-fullname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FULL NAME *</label>
                    <input id="trustee1-fullname" autoComplete="off" placeholder="FULL NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN NUMBER *</label>
                    <input id="trustee1-nin" autoComplete="off" placeholder="NIN NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="trustee1-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL ADDRESS *</label>
                    <input id="trustee1-email" type="email" autoComplete="email" placeholder="EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="trustee1-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="trustee1-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee1-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="trustee1-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
               </div>
               {/* Trustee 1 Documents */}
               <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">SUPPORT DOCUMENTS (SIGNATURE, PASSPORT PHOTOGRAPH AND NIN SLIP)</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">SIGNATURE</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee1 Signature')} />
                         </label>
                         {previews['Trustee1 Signature']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee1 Signature', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">PASSPORT PHOTOGRAPH</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee1 Passport')} />
                         </label>
                         {previews['Trustee1 Passport']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee1 Passport', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">NIN SLIP</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee1 NIN Slip')} />
                         </label>
                         {previews['Trustee1 NIN Slip']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee1 NIN Slip', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 4: TRUSTEE 2 DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">4. TRUSTEE 2 DETAILS</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trustee2-fullname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FULL NAME *</label>
                    <input id="trustee2-fullname" autoComplete="off" placeholder="FULL NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN NUMBER *</label>
                    <input id="trustee2-nin" autoComplete="off" placeholder="NIN NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="trustee2-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL ADDRESS *</label>
                    <input id="trustee2-email" type="email" autoComplete="email" placeholder="EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-state" className="text-[9px] font-black text-slate-400 uppercase block mb-1">STATE *</label>
                    <input id="trustee2-state" autoComplete="address-level1" placeholder="STATE" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-lga" className="text-[9px] font-black text-slate-400 uppercase block mb-1">LGA *</label>
                    <input id="trustee2-lga" autoComplete="address-level2" placeholder="LGA" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="trustee2-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="trustee2-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
               </div>
               {/* Trustee 2 Documents */}
               <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">SUPPORT DOCUMENTS (SIGNATURE, PASSPORT PHOTOGRAPH AND NIN SLIP)</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">SIGNATURE</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee2 Signature')} />
                         </label>
                         {previews['Trustee2 Signature']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee2 Signature', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">PASSPORT PHOTOGRAPH</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee2 Passport')} />
                         </label>
                         {previews['Trustee2 Passport']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee2 Passport', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">NIN SLIP</label>
                       <div className="flex flex-wrap gap-2">
                         <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                           <Upload className="text-slate-400" size={20} />
                           <span className="text-[6px] font-black mt-1">UPLOAD</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Trustee2 NIN Slip')} />
                         </label>
                         {previews['Trustee2 NIN Slip']?.map((src, index) => (
                           <div key={index} className="relative w-20 h-20 group">
                             <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                             <button onClick={(e) => removeFile(e, 'Trustee2 NIN Slip', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 5: TRUSTEES TENURE */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">5. TRUSTEES TENURE</h3>
               <div>
                 <label htmlFor="ngo-tenure" className="text-[9px] font-black text-slate-400 uppercase block mb-1">TRUSTEES TENURE *</label>
                 <input id="ngo-tenure" autoComplete="off" placeholder="TRUSTEES TENURE (20 YEARS)" className="p-4 rounded-xl border-none font-bold w-full uppercase" value="20 YEARS" required />
               </div>
            </div>

            {/* SECTION 6: NGO INFORMATION */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">6. NGO INFORMATION</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="ngo-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NGO FULL ADDRESS *</label>
                    <input id="ngo-address" autoComplete="street-address" placeholder="NGO FULL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="ngo-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NGO PHONE NUMBER *</label>
                    <input id="ngo-phone" autoComplete="tel" placeholder="NGO PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="ngo-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NGO EMAIL ADDRESS *</label>
                    <input id="ngo-email" type="email" autoComplete="email" placeholder="NGO EMAIL ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
               </div>
            </div>

            {/* SECTION 7: PROPOSED NGO NAMES */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">7. THREE PROPOSED NGO NAMES</h3>
               <div className="grid gap-4">
                  <div>
                    <label htmlFor="ngo-name1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">1. PROPOSED NGO NAME *</label>
                    <input id="ngo-name1" autoComplete="off" placeholder="PROPOSED NGO NAME 1" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="ngo-name2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">2. PROPOSED NGO NAME</label>
                    <input id="ngo-name2" autoComplete="off" placeholder="PROPOSED NGO NAME 2" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
                  <div>
                    <label htmlFor="ngo-name3" className="text-[9px] font-black text-slate-400 uppercase block mb-1">3. PROPOSED NGO NAME</label>
                    <input id="ngo-name3" autoComplete="off" placeholder="PROPOSED NGO NAME 3" className="p-4 rounded-xl border-none font-bold w-full uppercase" />
                  </div>
               </div>
            </div>

            {/* SECTION 8: AIMS AND OBJECTIVES */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">8. AIM AND OBJECTIVES</h3>
               <div className="space-y-4">
                  <div>
                    <label htmlFor="ngo-aim1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">1. AIM *</label>
                    <textarea id="ngo-aim1" autoComplete="off" placeholder="1. AIM..." className="w-full p-4 rounded-xl border-none font-bold h-24 uppercase" required></textarea>
                  </div>
                  <div>
                    <label htmlFor="ngo-aim2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">2. AIM *</label>
                    <textarea id="ngo-aim2" autoComplete="off" placeholder="2. AIM..." className="w-full p-4 rounded-xl border-none font-bold h-24 uppercase" required></textarea>
                  </div>
                  <div>
                    <label htmlFor="ngo-aim3" className="text-[9px] font-black text-slate-400 uppercase block mb-1">3. AIM</label>
                    <textarea id="ngo-aim3" autoComplete="off" placeholder="3. AIM..." className="w-full p-4 rounded-xl border-none font-bold h-24 uppercase"></textarea>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'Export Licence':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <div className="grid gap-4">
                <div>
                  <label htmlFor="exp-rc" className="text-[9px] font-black text-slate-400 uppercase block mb-1">RC Number</label>
                  <input id="exp-rc" autoComplete="off" placeholder="RC Number" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <div>
                  <label htmlFor="exp-tin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">TIN</label>
                  <input id="exp-tin" autoComplete="off" placeholder="Tax Identification Number (TIN)" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <div>
                  <label htmlFor="exp-bank" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Bank Account</label>
                  <input id="exp-bank" autoComplete="off" placeholder="Corporate Bank Account Details" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
             </div>
          </div>
        );
      case 'Trademark':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Trademark Details</h3>
             <div className="grid md:grid-cols-2 gap-4">
                {/* Proposed Trademark Name */}
                <div className="md:col-span-2">
                  <label htmlFor="tm-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Proposed Trademark Name *</label>
                  <input id="tm-name" autoComplete="off" placeholder="Proposed Trademark Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Surname */}
                <div>
                  <label htmlFor="tm-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname *</label>
                  <input id="tm-surname" autoComplete="family-name" placeholder="Surname" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="tm-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name *</label>
                  <input id="tm-firstname" autoComplete="given-name" placeholder="First Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Middle Name */}
                <div>
                  <label htmlFor="tm-middlename" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Middle Name</label>
                  <input id="tm-middlename" autoComplete="additional-name" placeholder="Middle Name" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>

                {/* Business/Company Name */}
                <div>
                  <label htmlFor="tm-company-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Business/Company Name *</label>
                  <input id="tm-company-name" autoComplete="off" placeholder="Business/Company Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Business/Company Address */}
                <div className="md:col-span-2">
                  <label htmlFor="tm-company-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Business/Company Address *</label>
                  <input id="tm-company-address" autoComplete="street-address" placeholder="Business/Company Address" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="tm-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone Number *</label>
                  <input id="tm-phone" autoComplete="tel" placeholder="Phone Number" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="tm-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Email *</label>
                  <input id="tm-email" type="email" autoComplete="email" placeholder="Email Address" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>

                {/* Class of Business */}
                <div className="md:col-span-2 space-y-2">
                   <label htmlFor="tm-class" className="text-[10px] font-black uppercase text-slate-400">Class of Business/Goods/Services *</label>
                   <select id="tm-class" autoComplete="off" className="w-full p-4 rounded-xl border-none font-bold bg-white" required>
                      <option value="">Select Class...</option>
                      <option value="Class 1 (Chemicals)">Class 1 (Chemicals)</option>
                      <option value="Class 2 (Paints)">Class 2 (Paints)</option>
                      <option value="Class 3 (Cosmetics)">Class 3 (Cosmetics)</option>
                      <option value="Class 4 (Oils/Fuels)">Class 4 (Oils/Fuels)</option>
                      <option value="Class 5 (Pharmaceuticals)">Class 5 (Pharmaceuticals)</option>
                      <option value="Class 6 (Metals)">Class 6 (Metals)</option>
                      <option value="Class 7 (Machinery)">Class 7 (Machinery)</option>
                      <option value="Class 8 (Hand Tools)">Class 8 (Hand Tools)</option>
                      <option value="Class 9 (Electronics)">Class 9 (Electronics)</option>
                      <option value="Class 10 (Medical Devices)">Class 10 (Medical Devices)</option>
                      <option value="Class 11 (Lighting)">Class 11 (Lighting)</option>
                      <option value="Class 12 (Vehicles)">Class 12 (Vehicles)</option>
                      <option value="Class 13 (Firearms)">Class 13 (Firearms)</option>
                      <option value="Class 14 (Jewelry)">Class 14 (Jewelry)</option>
                      <option value="Class 15 (Musical Instruments)">Class 15 (Musical Instruments)</option>
                      <option value="Class 16 (Paper/Books)">Class 16 (Paper/Books)</option>
                      <option value="Class 17 (Rubber/Plastic)">Class 17 (Rubber/Plastic)</option>
                      <option value="Class 18 (Leather)">Class 18 (Leather)</option>
                      <option value="Class 19 (Building Materials)">Class 19 (Building Materials)</option>
                      <option value="Class 20 (Furniture)">Class 20 (Furniture)</option>
                      <option value="Class 21 (Household Goods)">Class 21 (Household Goods)</option>
                      <option value="Class 22 (Textiles)">Class 22 (Textiles)</option>
                      <option value="Class 23 (Yarns/Threads)">Class 23 (Yarns/Threads)</option>
                      <option value="Class 24 (Fabrics)">Class 24 (Fabrics)</option>
                      <option value="Class 25 (Clothing)">Class 25 (Clothing)</option>
                      <option value="Class 26 (Lace/Trimmings)">Class 26 (Lace/Trimmings)</option>
                      <option value="Class 27 (Floor Coverings)">Class 27 (Floor Coverings)</option>
                      <option value="Class 28 (Games/Sports)">Class 28 (Games/Sports)</option>
                      <option value="Class 29 (Food Products)">Class 29 (Food Products)</option>
                      <option value="Class 30 (Coffee/Tea)">Class 30 (Coffee/Tea)</option>
                      <option value="Class 31 (Agriculture)">Class 31 (Agriculture)</option>
                      <option value="Class 32 (Beer/Beverages)">Class 32 (Beer/Beverages)</option>
                      <option value="Class 33 (Alcohol)">Class 33 (Alcohol)</option>
                      <option value="Class 34 (Tobacco)">Class 34 (Tobacco)</option>
                      <option value="Class 35 (Advertising/Business)">Class 35 (Advertising/Business)</option>
                      <option value="Class 36 (Insurance/Finance)">Class 36 (Insurance/Finance)</option>
                      <option value="Class 37 (Construction)">Class 37 (Construction)</option>
                      <option value="Class 38 (Telecommunications)">Class 38 (Telecommunications)</option>
                      <option value="Class 39 (Transport/Logistics)">Class 39 (Transport/Logistics)</option>
                      <option value="Class 40 (Material Treatment)">Class 40 (Material Treatment)</option>
                      <option value="Class 41 (Education/Entertainment)">Class 41 (Education/Entertainment)</option>
                      <option value="Class 42 (Technology Services)">Class 42 (Technology Services)</option>
                      <option value="Class 43 (Hotel/Restaurant)">Class 43 (Hotel/Restaurant)</option>
                      <option value="Class 44 (Medical/Agriculture)">Class 44 (Medical/Agriculture)</option>
                      <option value="Class 45 (Legal Services)">Class 45 (Legal Services)</option>
                      <option value="Other">Other</option>
                   </select>
                </div>

                {/* Logo Upload */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Logo (if available)</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                      <Upload className="text-slate-400" size={24} />
                      <span className="text-[8px] font-black mt-2">UPLOAD LOGO</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Logo')} />
                    </label>
                    {previews['Logo']?.map((src, index) => (
                      <div key={index} className="relative w-28 h-28 group">
                        <img src={src} alt="Logo preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                        <button onClick={(e) => removeFile(e, 'Logo', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        );
      case 'Annual Returns':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Annual Returns Filing</h3>
             
            {/* Section 1: Company Information */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">(1) COMPANY DETAILS</h4>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ann-company-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Registered Company Name *</label>
                    <input id="ann-company-name" autoComplete="off" placeholder="Registered Company Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="ann-rc-number" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Registration No (RC Number) *</label>
                    <input id="ann-rc-number" autoComplete="off" placeholder="RC Number" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="ann-company-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Company Email Address *</label>
                    <input id="ann-company-email" type="email" autoComplete="email" placeholder="Company Email Address" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="ann-share-capital" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Current Share Capital *</label>
                    <input id="ann-share-capital" autoComplete="off" placeholder="Current Share Capital (e.g. 1,000,000)" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="ann-company-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Company Current Business Address *</label>
                    <input id="ann-company-address" autoComplete="street-address" placeholder="Company Current Business Address" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="ann-business-nature" className="text-[9px] font-black text-slate-400 uppercase block mb-1">What is the company into? *</label>
                    <input id="ann-business-nature" autoComplete="off" placeholder="Nature of Business (e.g. Trading, Manufacturing, Services)" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
               </div>
            </div>

            {/* Section 2: Directors Information */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">(2) COMPANY DIRECTORS/SHAREHOLDERS INFORMATION</h4>
               <p className="text-xs text-slate-500 italic">Note: All directors of the company must be listed. Click "Add Director" to add more.</p>
               
               {/* Director 1 */}
               <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-cac-blue uppercase">Director & Shareholder 1</p>
                  <div className="grid md:grid-cols-3 gap-3">
                     <div>
                       <label htmlFor="dir1-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname *</label>
                       <input id="dir1-surname" autoComplete="family-name" placeholder="Surname" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name *</label>
                       <input id="dir1-firstname" autoComplete="given-name" placeholder="First Name" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-othername" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Other Name</label>
                       <input id="dir1-othername" autoComplete="additional-name" placeholder="Other Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir1-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date of Birth *</label>
                       <input id="dir1-dob" type="date" autoComplete="bday" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-gender" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Gender *</label>
                       <select id="dir1-gender" autoComplete="sex" className="p-3 bg-slate-50 rounded-lg w-full" required>
                         <option value="">Select Gender</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir1-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone Number *</label>
                       <input id="dir1-phone" autoComplete="tel" placeholder="Phone Number" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div className="md:col-span-2">
                       <label htmlFor="dir1-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Full Residential Address *</label>
                       <input id="dir1-address" autoComplete="street-address" placeholder="Full Residential Address" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN Number *</label>
                       <input id="dir1-nin" autoComplete="off" placeholder="NIN Number" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Functional Email Address *</label>
                       <input id="dir1-email" type="email" autoComplete="email" placeholder="Email Address" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-shares" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Amount of Share Held *</label>
                       <input id="dir1-shares" autoComplete="off" placeholder="Share Amount" className="p-3 bg-slate-50 rounded-lg w-full" required />
                     </div>
                     <div>
                       <label htmlFor="dir1-shareholder" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Shareholder? *</label>
                       <select id="dir1-shareholder" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full" required>
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir1-director" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Director Too? *</label>
                       <select id="dir1-director" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full" required>
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                  </div>
               </div>

               {/* Director 2 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-cac-blue uppercase">Director & Shareholder 2</p>
                  <div className="grid md:grid-cols-3 gap-3">
                     <div>
                       <label htmlFor="dir2-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname</label>
                       <input id="dir2-surname" autoComplete="family-name" placeholder="Surname" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name</label>
                       <input id="dir2-firstname" autoComplete="given-name" placeholder="First Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-othername" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Other Name</label>
                       <input id="dir2-othername" autoComplete="additional-name" placeholder="Other Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                       <input id="dir2-dob" type="date" autoComplete="bday" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-gender" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Gender</label>
                       <select id="dir2-gender" autoComplete="sex" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select Gender</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir2-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone Number</label>
                       <input id="dir2-phone" autoComplete="tel" placeholder="Phone Number" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div className="md:col-span-2">
                       <label htmlFor="dir2-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Full Residential Address</label>
                       <input id="dir2-address" autoComplete="street-address" placeholder="Full Residential Address" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN Number</label>
                       <input id="dir2-nin" autoComplete="off" placeholder="NIN Number" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Functional Email Address</label>
                       <input id="dir2-email" type="email" autoComplete="email" placeholder="Email Address" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-shares" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Amount of Share Held</label>
                       <input id="dir2-shares" autoComplete="off" placeholder="Share Amount" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir2-shareholder" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Shareholder?</label>
                       <select id="dir2-shareholder" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir2-director" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Director Too?</label>
                       <select id="dir2-director" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                  </div>
               </div>

               {/* Director 3 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-cac-blue uppercase">Director & Shareholder 3</p>
                  <div className="grid md:grid-cols-3 gap-3">
                     <div>
                       <label htmlFor="dir3-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname</label>
                       <input id="dir3-surname" autoComplete="family-name" placeholder="Surname" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name</label>
                       <input id="dir3-firstname" autoComplete="given-name" placeholder="First Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-othername" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Other Name</label>
                       <input id="dir3-othername" autoComplete="additional-name" placeholder="Other Name" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                       <input id="dir3-dob" type="date" autoComplete="bday" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-gender" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Gender</label>
                       <select id="dir3-gender" autoComplete="sex" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select Gender</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir3-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone Number</label>
                       <input id="dir3-phone" autoComplete="tel" placeholder="Phone Number" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div className="md:col-span-2">
                       <label htmlFor="dir3-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Full Residential Address</label>
                       <input id="dir3-address" autoComplete="street-address" placeholder="Full Residential Address" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN Number</label>
                       <input id="dir3-nin" autoComplete="off" placeholder="NIN Number" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Functional Email Address</label>
                       <input id="dir3-email" type="email" autoComplete="email" placeholder="Email Address" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-shares" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Amount of Share Held</label>
                       <input id="dir3-shares" autoComplete="off" placeholder="Share Amount" className="p-3 bg-slate-50 rounded-lg w-full" />
                     </div>
                     <div>
                       <label htmlFor="dir3-shareholder" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Shareholder?</label>
                       <select id="dir3-shareholder" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                     <div>
                       <label htmlFor="dir3-director" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Is Director Too?</label>
                       <select id="dir3-director" autoComplete="off" className="p-3 bg-slate-50 rounded-lg w-full">
                         <option value="">Select</option>
                         <option value="YES">YES</option>
                         <option value="NO">NO</option>
                       </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* Section 3: Turnover & Net Asset */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">(3) TURNOVER & NET ASSET</h4>
               <p className="text-xs text-slate-500 italic">Give the figure of Net Asset & Turnover for each of the year you are filing for.</p>
               
               {/* TURNOVER */}
               <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-xs font-bold text-slate-700 uppercase mb-3">TURNOVER: This is the total money that came into the company for 12 months.</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label htmlFor="turnover-year1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 1</label>
                       <input id="turnover-year1" type="number" autoComplete="off" placeholder="Turnover Year 1" className="p-3 rounded-lg border-none w-full" />
                     </div>
                     <div>
                       <label htmlFor="turnover-year2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 2</label>
                       <input id="turnover-year2" type="number" autoComplete="off" placeholder="Turnover Year 2" className="p-3 rounded-lg border-none w-full" />
                     </div>
                     <div>
                       <label htmlFor="turnover-year3" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 3</label>
                       <input id="turnover-year3" type="number" autoComplete="off" placeholder="Turnover Year 3" className="p-3 rounded-lg border-none w-full" />
                     </div>
                  </div>
               </div>

               {/* NET ASSET */}
              <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-xs font-bold text-slate-700 uppercase mb-3">NET ASSET: This is the total value of company's assets minus liabilities.</p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div>
                       <label htmlFor="netasset-year1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 1</label>
                       <input id="netasset-year1" type="number" autoComplete="off" placeholder="Net Asset Year 1" className="p-3 rounded-lg border-none w-full" />
                     </div>
                     <div>
                       <label htmlFor="netasset-year2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 2</label>
                       <input id="netasset-year2" type="number" autoComplete="off" placeholder="Net Asset Year 2" className="p-3 rounded-lg border-none w-full" />
                     </div>
                     <div>
                       <label htmlFor="netasset-year3" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year 3</label>
                       <input id="netasset-year3" type="number" autoComplete="off" placeholder="Net Asset Year 3" className="p-3 rounded-lg border-none w-full" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'Copyright':
        return (
          <div className="space-y-8">
            {/* OWNER DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">1. DETAILS OF OWNER</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="copy-owner-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">FULL NAME *</label>
                    <input id="copy-owner-name" autoComplete="name" placeholder="FULL NAME" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-owner-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">ADDRESS *</label>
                    <input id="copy-owner-address" autoComplete="street-address" placeholder="ADDRESS" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-owner-email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">EMAIL *</label>
                    <input id="copy-owner-email" type="email" autoComplete="email" placeholder="EMAIL" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-owner-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PHONE NUMBER *</label>
                    <input id="copy-owner-phone" autoComplete="tel" placeholder="PHONE NUMBER" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-owner-dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF BIRTH *</label>
                    <input id="copy-owner-dob" type="date" autoComplete="bday" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="copy-owner-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1"> VALID ID (NIN) *</label>
                    <input id="copy-owner-nin" autoComplete="off" placeholder="VALID ID (NIN)" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
               </div>
            </div>

            {/* INTELLECTUAL PROPERTY DETAILS */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">2. DETAILS OF THE INTELLECTUAL PROPERTY</h3>
               <div className="grid gap-4">
                  <div>
                    <label htmlFor="copy-ip-type" className="text-[9px] font-black text-slate-400 uppercase block mb-1">TYPE *</label>
                    <select id="copy-ip-type" autoComplete="off" className="p-4 rounded-xl border-none font-bold w-full uppercase" required>
                      <option value="">SELECT TYPE</option>
                      <option value="LITERARY WORK">LITERARY WORK</option>
                      <option value="ARTISTIC WORK">ARTISTIC WORK</option>
                      <option value="MUSICAL WORK">MUSICAL WORK</option>
                      <option value="AUDIOVISUAL WORK">AUDIOVISUAL WORK</option>
                      <option value="SOUND RECORDING">SOUND RECORDING</option>
                      <option value="BROADCAST">BROADCAST</option>
                      <option value="COMPUTER PROGRAM">COMPUTER PROGRAM</option>
                      <option value="PHOTOGRAPH">PHOTOGRAPH</option>
                      <option value="DATABASE">DATABASE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="copy-title" className="text-[9px] font-black text-slate-400 uppercase block mb-1">TITLE OF WORK *</label>
                    <input id="copy-title" autoComplete="off" placeholder="TITLE OF WORK" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-date-production" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DATE OF PRODUCTION *</label>
                    <input id="copy-date-production" type="date" autoComplete="off" className="p-4 rounded-xl border-none font-bold w-full" required />
                  </div>
                  <div>
                    <label htmlFor="copy-storage" className="text-[9px] font-black text-slate-400 uppercase block mb-1">WHERE IS IT CURRENTLY STORED? *</label>
                    <input id="copy-storage" autoComplete="off" placeholder="WHERE IS IT CURRENTLY STORED?" className="p-4 rounded-xl border-none font-bold w-full uppercase" required />
                  </div>
                  <div>
                    <label htmlFor="copy-description" className="text-[9px] font-black text-slate-400 uppercase block mb-1">DESCRIPTION OF WORK *</label>
                    <textarea id="copy-description" autoComplete="off" placeholder="PROVIDE A DETAILED DESCRIPTION OF THE INTELLECTUAL PROPERTY" className="w-full p-4 rounded-xl border-none font-bold h-32 uppercase" required></textarea>
                  </div>
               </div>
            </div>

            {/* PROOF OF OWNERSHIP */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">3. PROOF OF OWNERSHIP</h3>
              <div>
                <label htmlFor="copy-ownership-proof" className="text-[9px] font-black text-slate-400 uppercase block mb-1">PROOF OF OWNERSHIP (IF YOU'RE NOT THE CREATOR) *</label>
                <select id="copy-ownership-proof" autoComplete="off" className="p-4 rounded-xl border-none font-bold w-full uppercase" required>
                  <option value="">SELECT PROOF OF OWNERSHIP</option>
                  <option value="I AM THE ORIGINAL CREATOR">I AM THE ORIGINAL CREATOR</option>
                  <option value="ASSIGNMENT DOCUMENT">ASSIGNMENT DOCUMENT</option>
                  <option value="TRANSFER DOCUMENT">TRANSFER DOCUMENT</option>
                  <option value="COMMISSIONED WORK DOCUMENT">COMMISSIONED WORK DOCUMENT</option>
                  <option value="LICENSE AGREEMENT">LICENSE AGREEMENT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>

            {/* REQUIRED DOCUMENTS UPLOAD */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
               <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest border-l-4 border-cac-green pl-3">4. REQUIRED DOCUMENTS</h3>
               <div className="space-y-4">
                 <p className="text-[9px] font-bold text-slate-500 uppercase">PLEASE UPLOAD THE FOLLOWING DOCUMENTS:</p>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 block">TWO COPIES OF THE WORK (DIGITAL OR PHYSICAL) *</label>
                      <div className="flex flex-wrap gap-2">
                        <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                          <Upload className="text-slate-400" size={20} />
                          <span className="text-[6px] font-black mt-1">UPLOAD</span>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'Copyright Work Copy')} />
                        </label>
                        {previews['Copyright Work Copy']?.map((src, index) => (
                          <div key={index} className="relative w-20 h-20 group">
                            <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                            <button onClick={(e) => removeFile(e, 'Copyright Work Copy', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 block">OWNER'S VALID ID (NIN SLIP) *</label>
                      <div className="flex flex-wrap gap-2">
                        <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                          <Upload className="text-slate-400" size={20} />
                          <span className="text-[6px] font-black mt-1">UPLOAD</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'Copyright Owner ID')} />
                        </label>
                        {previews['Copyright Owner ID']?.map((src, index) => (
                          <div key={index} className="relative w-20 h-20 group">
                            <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                            <button onClick={(e) => removeFile(e, 'Copyright Owner ID', index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110"><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-cac-green"/></div>;

  if (step === 'success') {
    return (
      <div className="pt-20 pb-20 px-8 text-center bg-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Celebration Sprinkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-60"></div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl relative z-10">
          <div className="mb-8 animate-bounce">
            <CheckCircle size={120} className="text-green-600 mx-auto drop-shadow-lg" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 uppercase">
            🎉 CONGRATULATIONS! 🎉
          </h1>
          <p className="text-xl text-slate-600 mb-8 font-semibold">Your registration has been successfully completed!</p>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-200 mb-8">
            <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-slate-500 mb-8">
              <p className="text-lg font-black text-slate-800 mb-2">Payment Confirmed</p>
              <p className="text-sm text-slate-700">Your payment and registration have been successfully processed.</p>
            </div>

            <p className="text-base text-slate-700 mb-8 leading-relaxed">
              Thank you for choosing Rex360 Solutions! Your documents and information have been securely recorded in our system.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
              <p className="text-sm font-bold text-slate-700 mb-4">What happens next:</p>
              <ul className="text-sm text-slate-700 space-y-3 text-left">
                <li className="flex items-start gap-3"><span className="text-slate-600 font-bold mt-0.5">⭐</span> Check your email for a confirmation message</li>
                <li className="flex items-start gap-3"><span className="text-slate-600 font-bold mt-0.5">⭐</span> Your application will be reviewed within 48 hours</li>
                <li className="flex items-start gap-3"><span className="text-slate-600 font-bold mt-0.5">⭐</span> You will receive updates via email and phone</li>
                <li className="flex items-start gap-3"><span className="text-slate-600 font-bold mt-0.5">⭐</span> Certificate will be available upon approval</li>
              </ul>
            </div>

            {countdown > 0 ? (
              <div className="text-center mb-6">
                <p className="text-2xl font-black text-slate-600 mb-4">
                  We'll get back to you shortly...
                </p>
                <p className="text-lg font-semibold text-slate-600">
                  Processing in <span className="text-green-600 font-bold">{countdown}</span> seconds...
                </p>
                <div className="mt-4 flex gap-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded-full transition-all ${
                        i < (5 - countdown) ? 'bg-slate-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-xl font-black text-green-600 mb-4">
                  🎊 Ready to connect with our team! 🎊
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://wa.me/2349048349548"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all transform"
            >
              <MessageCircle className="mr-2" size={24} /> REACH OUT TO US HERE
            </a>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center bg-slate-600 text-white px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all transform"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-2 md:px-4 min-h-screen bg-slate-50">
      {/* PROCESSING OVERLAY - Simple and clean */}
      {uploadStatus === 'uploading' && step !== 'success' && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Your Registration</h3>
            <p className="text-sm text-slate-600">Please wait while we process your information...</p>
          </div>
        </div>
      )}

      {/* ERROR OVERLAY - Professional message only */}
      {uploadStatus === 'error' && step !== 'success' && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
            <div className="mb-4 text-4xl">⚠️</div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Registration Failed</h3>
            <p className="text-sm text-slate-600 mb-6">An error occurred while processing your registration. Please try again.</p>
            <button 
              onClick={() => {
                setUploadStatus(null);
                setStatusMessage('');
              }}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-cac-blue font-black text-xs uppercase transition-all">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* MOBILE: Service Selection First */}
        <div className="lg:hidden">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Select Registration Type</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.keys(prices).map((name) => (
                <button
                  key={name}
                  onClick={() => { setServiceType(name); navigate(`/register/${name.replace(/\s+/g, '-')}`); }}
                  className={`group relative overflow-hidden text-left px-3 py-3 rounded-xl font-bold text-xs transition-all duration-300 border-2 ${
                    serviceType === name 
                      ? 'bg-gradient-to-r from-cac-blue to-[#1e40af] text-white shadow-xl border-cac-blue scale-105' 
                      : 'bg-gradient-to-r from-slate-50 to-gray-100 text-slate-600 hover:from-slate-100 hover:to-slate-200 border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <Briefcase size={14} className={`transition-all duration-300 ${serviceType === name ? "text-cac-green scale-110" : "opacity-60 group-hover:opacity-80"}`} />
                    <span className="truncate font-extrabold">{name}</span>
                  </div>
                  {serviceType === name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cac-green/20 to-cac-blue/20 rounded-xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* DESKTOP: Sidebar */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 sticky top-24">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Select Registration Type</h3>
              <div className="space-y-2 mb-6">
                {Object.keys(prices).map((name) => (
                  <button
                    key={name}
                    onClick={() => { setServiceType(name); navigate(`/register/${name.replace(/\s+/g, '-')}`); }}
                    className={`group relative overflow-hidden w-full text-left px-5 py-4 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                      serviceType === name 
                        ? 'bg-gradient-to-r from-cac-blue to-[#1e40af] text-white shadow-xl border-cac-blue scale-105' 
                        : 'bg-gradient-to-r from-slate-50 to-gray-100 text-slate-600 hover:from-slate-100 hover:to-slate-200 border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <Briefcase size={16} className={`transition-all duration-300 ${serviceType === name ? "text-cac-green scale-110" : "opacity-60 group-hover:opacity-80"}`} />
                      <span className="font-extrabold">{name}</span>
                    </div>
                    {serviceType === name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cac-green/20 to-cac-blue/20 rounded-xl"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* SIDEBAR SUPPORT & ACCREDITATION */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                 {/* LEGITIMACY HUB - Enhanced Section */}
                 <div className="p-4 bg-gradient-to-r from-cac-blue to-[#1e40af] rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-3">
                       <ShieldCheck size={24} className="text-cac-green shrink-0" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-blue-200">Verify Our Legitimacy</p>
                         <p className="text-sm font-bold">Are We Registered?</p>
                       </div>
                    </div>
                    <p className="text-xs text-blue-100 mb-3">
                       Click below to view our official CAC accreditation and business certificates.
                    </p>
                    <button 
                      onClick={() => document.getElementById('legitimacy-modal')?.showModal()}
                      className="w-full bg-cac-green hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                       <FileText size={14} />
                       View Certificates
                    </button>
                 </div>

                 <a href="https://wa.me/2349048349548" className="flex items-center gap-3 p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl hover:bg-[#25D366]/20 transition-all">
                    <div className="p-2 bg-[#25D366] text-white rounded-full"><MessageCircle size={16}/></div>
                    <div className="leading-none">
                      <p className="text-[10px] font-black uppercase">Need Help?</p>
                      <p className="text-sm font-bold">Chat with Support</p>
                    </div>
                 </a>
                 <div className="p-4 bg-cac-blue/5 rounded-2xl border border-cac-blue/10 flex items-start gap-3">
                    <ShieldCheck size={24} className="text-cac-blue shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-cac-blue">Accredited Agent</p>
                      <p className="text-[10px] font-bold text-slate-500 leading-tight mt-1">
                        Official CAC Accreditation Filing Service. Secure & Verified.
                      </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-cac-blue p-8 text-white flex justify-between items-center">
              <div>
                 <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{serviceType}</h1>
                 <p className="text-[10px] text-blue-200 font-bold uppercase mt-2">Official CAC Accreditation Filing</p>
              </div>
              <div className="text-right">
                 <span className="block text-[10px] opacity-60 font-black uppercase">Filing Fee</span>
                 <span className="text-2xl font-black text-cac-green">₦{currentPrice.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleProcess} className="p-8 md:p-12 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">
                    {serviceType === 'NGO Registration' ? 'Chairman Details' : 'Personal Information'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                   <div>
                     <label htmlFor="surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname</label>
                     <input id="surname" autoComplete="family-name" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold w-full" required />
                   </div>
                   <div>
                     <label htmlFor="firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name</label>
                     <input id="firstname" autoComplete="given-name" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold w-full" required />
                   </div>
                   <div>
                     <label htmlFor="othername" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Other Name</label>
                     <input id="othername" autoComplete="additional-name" placeholder="Other Name" className="p-4 bg-slate-50 rounded-xl font-bold w-full" />
                   </div>
                   <div className="relative">
                     <label htmlFor="dob" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                     <input id="dob" type="date" autoComplete="bday" className="w-full p-4 bg-slate-50 rounded-xl font-bold" required />
                   </div>
                   <div>
                     <label htmlFor="gender" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Gender</label>
                     <select id="gender" autoComplete="sex" className="p-4 bg-slate-50 rounded-xl font-bold w-full"><option>Male</option><option>Female</option></select>
                   </div>
                   <div className="md:col-span-2">
                     <label htmlFor="email" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Email Address</label>
                     <input id="email" type="email" autoComplete="email" placeholder="Email Address" className="p-4 bg-slate-50 rounded-xl font-bold w-full" required />
                   </div>
                   <div>
                     <label htmlFor="phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone Number</label>
                     <input id="phone" autoComplete="tel" placeholder="Phone Number" className="p-4 bg-slate-50 rounded-xl font-bold w-full" required />
                   </div>
                   <div>
                     <label htmlFor="nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN</label>
                     <input id="nin" autoComplete="off" placeholder="NIN (11 Digits)" className="p-4 bg-slate-50 rounded-xl font-bold w-full" required />
                   </div>
                </div>
                
                {/* 100% PRESERVED RESIDENTIAL FIELDS */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                   <label className="text-[9px] font-black uppercase text-slate-400">Residential Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="h-state" placeholder="State" className="p-3 bg-white rounded-lg" />
                      <input id="h-lga" placeholder="LGA" className="p-3 bg-white rounded-lg" />
                      <input id="h-street" placeholder="Street/No" className="p-3 bg-white rounded-lg" />
                   </div>
                </div>
              </div>

              {/* 100% PRESERVED NGO SECRETARY FIELDS */}
              {serviceType === 'NGO Registration' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                   <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Secretary Details</h3>
                   <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="sec-surname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Surname</label>
                        <input id="sec-surname" autocomplete="family-name" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold w-full" />
                      </div>
                      <div>
                        <label htmlFor="sec-firstname" className="text-[9px] font-black text-slate-400 uppercase block mb-1">First Name</label>
                        <input id="sec-firstname" autocomplete="given-name" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold w-full" />
                      </div>
                      <div>
                        <label htmlFor="sec-phone" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Phone</label>
                        <input id="sec-phone" autocomplete="tel" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold w-full" />
                      </div>
                      <div>
                        <label htmlFor="sec-nin" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NIN</label>
                        <input id="sec-nin" autocomplete="off" placeholder="NIN" className="p-4 bg-slate-50 rounded-xl font-bold w-full" />
                      </div>
                   </div>
                </div>
              )}

              {renderFields()}
              
              <div className="space-y-6 pt-6 border-t border-slate-100">
                 <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Upload Identity Verification</h3>
                 <div className="grid gap-8">
                    {Object.keys(files).map(doc => (
                      <div key={doc} className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400">{doc} Image</label>
                        <div className="flex flex-wrap gap-4">
                          {previews[doc].map((src, index) => (
                            <div key={index} className="relative w-28 h-28 group">
                              <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                              <button onClick={(e) => removeFile(e, doc, index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
                            </div>
                          ))}
                          <label className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                            <Upload className="text-slate-400" size={24} />
                            <span className="text-[8px] font-black mt-2">UPLOAD</span>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, doc)} />
                          </label>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={uploadStatus === 'uploading'}
                className={`w-full py-6 rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-4 uppercase transition-all ${
                  uploadStatus === 'uploading' 
                    ? 'bg-slate-400 text-white cursor-not-allowed opacity-60' 
                    : 'bg-cac-green text-white hover:bg-cac-blue hover:translate-y-[-2px] active:translate-y-[0px]'
                }`}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader className="animate-spin" size={20} /> PROCESSING...
                  </>
                ) : (                  <>
                    PROCEED TO SECURE PAYMENT <ArrowRight />
                  </>
                )}
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
