import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { usePaystackPayment } from 'react-paystack';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X, ArrowLeft, Briefcase, ShieldCheck } from 'lucide-react';
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
  
  const [files, setFiles] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  const [previews, setPreviews] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  
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

        // Save registration to database
        const registrationData = {
            service_type: serviceType,
            surname: getFormValue('surname'),
            firstname: getFormValue('firstname'),
            phone: getFormValue('phone'),
            email: getFormValue('email'),
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

  // Paystack Config - simplified to avoid build issues
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: "customer@example.com",
    amount: currentPrice * 100,
    publicKey: 'pk_test_1dc8f242ed09075faee33e86dff64ce401918129',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleProcess = (e) => {
    e.preventDefault();
    
    // Validate price
    if (currentPrice === 0) {
        alert("Service fee information is loading. Please try again.");
        return;
    }
    
    // Check for missing documents
    const missingDocs = Object.keys(files).filter(doc => files[doc].length === 0);
    if (missingDocs.length > 0) {
        alert(`Please provide your ${missingDocs.join(', ')}`);
        return; 
    }
    
    // Validate form fields
    const requiredFields = ['surname', 'firstname', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => {
      const val = document.getElementById(field)?.value;
      return !val;
    });
    
    if (missingFields.length > 0) {
        alert(`Please complete all required fields`);
        return;
    }
    
    // Clean submission - no technical messages
    initializePayment({
      onSuccess: async (reference) => {
        setUploadStatus('uploading');
        setStatusMessage('Processing your registration...');
        
        try {
          await saveToDatabase(reference.reference);
          
          // Clear form silently
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
          setStatusMessage('');
          setStep('success');
        } catch (err) {
          setUploadStatus('error');
          setStatusMessage('');
          alert(`Registration error. Please contact support if this persists.`);
        }
      },
      onClose: () => {
        setUploadStatus(null);
        setStatusMessage('');
        alert("Payment not completed. Your registration was not submitted.");
      }
    });
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
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Business Details</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <input id="bn-name1" placeholder="Proposed Name 1" className="p-4 rounded-xl border-none font-bold" required />
                <input id="bn-name2" placeholder="Proposed Name 2" className="p-4 rounded-xl border-none font-bold" required />
                <NatureOfBusinessSelector />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Business Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="b-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="b-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="b-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
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
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Trustees & Aims</h3>
             <div className="grid gap-4">
                <div>
                  <label htmlFor="ngo-name1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Proposed NGO Name</label>
                  <input id="ngo-name1" autoComplete="off" placeholder="Proposed NGO Name 1" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <NatureOfBusinessSelector />
                <div>
                  <label htmlFor="ngo-tenure" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Trustees Tenure</label>
                  <input id="ngo-tenure" autoComplete="off" placeholder="Trustees Tenure (e.g. 20 Years)" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <div>
                  <label htmlFor="ngo-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">NGO Full Address</label>
                  <input id="ngo-address" autoComplete="street-address" placeholder="NGO Full Address" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Aims & Objectives</label>
                   <div>
                     <label htmlFor="ngo-aim1" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Aim 1</label>
                     <input id="ngo-aim1" autoComplete="off" placeholder="1. Aim..." className="w-full p-3 rounded-lg border-none mb-2" />
                   </div>
                   <div>
                     <label htmlFor="ngo-aim2" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Aim 2</label>
                     <input id="ngo-aim2" autoComplete="off" placeholder="2. Aim..." className="w-full p-3 rounded-lg border-none" />
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
                <div className="md:col-span-2">
                  <label htmlFor="tm-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Proposed Trademark Name</label>
                  <input id="tm-name" autoComplete="off" placeholder="Proposed Trademark Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label htmlFor="tm-class" className="text-[10px] font-black uppercase text-slate-400">Class of Goods/Services</label>
                   <select id="tm-class" autoComplete="off" className="w-full p-4 rounded-xl border-none font-bold bg-white">
                      <option value="">Select Class...</option>
                      <option value="Class 16 (Paper/Books)">Class 16 (Paper/Books)</option>
                      <option value="Class 25 (Clothing)">Class 25 (Clothing)</option>
                      <option value="Class 35 (Advertising/Business)">Class 35 (Advertising/Business)</option>
                      <option value="Other">Other</option>
                   </select>
                </div>
             </div>
          </div>
        );
      case 'Annual Returns':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Annual Returns Filing</h3>
             <div className="grid gap-4">
                <div>
                  <label htmlFor="ann-rc" className="text-[9px] font-black text-slate-400 uppercase block mb-1">RC or Business Number</label>
                  <input id="ann-rc" autoComplete="off" placeholder="RC Number or Business Number" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="ann-year" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year of Return</label>
                  <input id="ann-year" autoComplete="off" placeholder="Year of Return (e.g. 2024)" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="ann-notes" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Additional Notes</label>
                  <textarea id="ann-notes" autoComplete="off" placeholder="Any changes in Directors or Address?" className="p-4 rounded-xl border-none font-bold h-24 w-full" />
                </div>
             </div>
          </div>
        );
      case 'Copyright':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Copyright Registration</h3>
             <div className="grid gap-4">
                <div>
                  <label htmlFor="copy-title" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Work Title</label>
                  <input id="copy-title" autoComplete="off" placeholder="Title of the Work" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="copy-type" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Type of Work</label>
                  <select id="copy-type" autoComplete="off" className="p-4 rounded-xl border-none font-bold w-full">
                     <option value="">Select Work Type</option>
                     <option value="Literary">Literary Work</option>
                     <option value="Artistic">Artistic Work</option>
                     <option value="Musical">Musical Work</option>
                     <option value="Audiovisual">Audiovisual Work</option>
                     <option value="Sound Recording">Sound Recording</option>
                     <option value="Broadcast">Broadcast</option>
                     <option value="Computer Program">Computer Program</option>
                     <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="copy-author-name" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Author's Full Name</label>
                  <input id="copy-author-name" autoComplete="name" placeholder="Author's Full Name" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
                <div>
                  <label htmlFor="copy-author-address" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Author's Address</label>
                  <textarea id="copy-author-address" autoComplete="address" placeholder="Author's Complete Address" className="p-4 rounded-xl border-none font-bold h-20 w-full" required />
                </div>
                <div>
                  <label htmlFor="copy-ownership-proof" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Proof of Ownership (if not the creator)</label>
                  <input id="copy-ownership-proof" autoComplete="off" placeholder="Assignment/Transfer Document Details" className="p-4 rounded-xl border-none font-bold w-full" />
                </div>
                <div>
                  <label htmlFor="copy-year" className="text-[9px] font-black text-slate-400 uppercase block mb-1">Year of Creation/Publication</label>
                  <input id="copy-year" type="number" autoComplete="off" placeholder="Year (e.g. 2024)" className="p-4 rounded-xl border-none font-bold w-full" required />
                </div>
             </div>
             <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[10px] font-black text-blue-700 uppercase mb-2">Required Documents:</p>
                <ul className="text-[9px] text-blue-600 space-y-1">
                   <li>• Two copies of the work (digital or physical)</li>
                   <li>• Author's details (name, address)</li>
                   <li>• Proof of ownership (if you're not the creator)</li>
                </ul>
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
              <p className="text-lg font-black text-slate-800 mb-2">✅ Payment Confirmed</p>
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
                  className={`text-left px-3 py-3 rounded-xl font-bold text-xs transition-all ${
                    serviceType === name ? 'bg-cac-blue text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className={serviceType === name ? "text-cac-green" : "opacity-20"} />
                    <span className="truncate">{name}</span>
                  </div>
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
                    className={`w-full text-left px-5 py-4 rounded-xl font-bold text-sm transition-all ${
                      serviceType === name ? 'bg-cac-blue text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className={serviceType === name ? "text-cac-green" : "opacity-20"} />
                      {name}
                    </div>
                  </button>
                ))}
              </div>

              {/* SIDEBAR SUPPORT & ACCREDITATION */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
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