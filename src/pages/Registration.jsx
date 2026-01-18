import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../SupabaseClient'; 

// --- 1. HUGE LIST OF BUSINESS CATEGORIES (100% PRESERVED) ---
const BUSINESS_CATEGORIES = {
  "GENERAL SUPPLIES & SERVICES": [
    "ACCOMODATION AND FOOD SERVIVES ACTIVITIES", "ACCOMMODATION", "BAKERY SERVICES", "BREWERY SERVICES", 
    "DEAL IN HOT DRINKS", "DEAL IN SOFT DRINKS", "DEAL IN WINES, DRINKS AND BEVERAGES", 
    "FOOD AND BEVERAGES SERVICES ACTIVITIES", "FRUITS/FRUIT JUICE PRODUCTION AND SALES", 
    "HOTEL RESERVATION SERVICES", "HOTEL AND HOSPITALITY", "HOTEL/HOSPITALITY SERVICES", 
    "OPERATE CONFECTIONERY SHOP", "OPERATE FAST FOOD OUTLET", "OPERATE RESTAURANT AND CATERING SERVICES", 
    "OPERATE VIEWING CENTRE"
  ],
  "ADMINISTRATIVE & SUPPORT SERVICES": [
    "ABATTOIR AND MEAT SELLING SERVICES", "AUTOMATED CAR WASH SERVICES", "BLACK SMITH SERVICES", 
    "BLOCK INDUSTRY", "BOUTIQUE SERVICES", "CAR WASH SERVICES", "CATERING SERVICES", 
    "CLEARING AND FORWARDING SERVICES", "COBBLER SERVICES", "COLD ROOM SERVICES", "COMMISSION AGENCY", 
    "CYBERCAFÉ AND BUSINESS CENTRE", "DEAL IN JEWELRY AND ACCESSORIES", "DOMESTIC SUPPORT SERVICES", 
    "DRIVING SCHOOL SERVICES", "EVENTS MANAGEMENT, GENERAL MERCHANDISE", "ELECTRICAL SERVICES", 
    "EMPLOYMENT AGENCY", "ERRAND AND HOME DELIVERY SERVICES", "FARMING", "FASHION DESIGNING/ TAILORING", 
    "FIRE AND SAFETY SERVICES", "FROZEN FOODS SERVICES", "GENERAL CONTRACTS", "GENERAL MERCHANDISE", 
    "GOLD SMITING SERVICES", "HAT MAKING SERVICES", "INDUSTRIAL CHEMICAL SERVICES", "INTERIOR/EXTERIOR DECORATION", 
    "INTERNET SERVICES", "LAUNDRY SERVICES", "LUBRICANT/ OIL SERVICES", "MAINTENANCE OF REFRIGERATOR/AC", 
    "MANUFACTURER’S REPRESENTATION", "MARKETING SERVICES", "MEDICAL LABORATORY SERVICES", 
    "MORTUARY AND FUNERAL SERVICES", "OFFICE ADMINISTRATIVE SUPPORT", "PLASTIC MANUFACTURING SERVICES", 
    "PLUMBING SERVICES", "PRINTING PRESS", "PRODUCTION AND SALES OF FOOTWEAR", "PUBLIC RELATION SERVICES", 
    "RENTAL SERVICES", "RESTAURANT", "SAFETY EQUIPMENT SERVICES", "SALE OF PETROLEUM PRODUCTS", 
    "SALES OF BOOKS AND STATIONERIES", "SAWMILLING SERVICES", "SECURITY AND INVESTIGATION ACTIVITIES", 
    "SUPPLY OF UNSKILLED LABOUR", "TECHNICAL SERVICES", "TEXTILE SERVICES", "TRADING", "TRAVEL AGENCY", 
    "UPHOLSTERY AND FURNITURE MAKING", "VULCANIZING SERVICES", "WELDING SERVICES"
  ],
  "ART, ENTERTAINMENT & RECREATION": [
    "ART GALLERIES, MUSEUM AND MONUMENTS", "ARTISTE MANAGEMENT", "ARTS, CRAFT, AND DESIGNING", 
    "BAR SERVICES", "CREATIVE, ART AND ENTERTAINMENT", "ENTERTAINMENT SERVICES", "EVENTS MANAGEMENTS/ PLANNING", 
    "GAMBLING AND BETTING ACTIVITIES", "INSTALLATION OF CCTV", "MODELING SERVICES", "ORGANISE DANCE CLASS", 
    "PAINTING SERVICES", "PARKS AND RECREATION SERVICES", "PHOTOGRAPHY SERVICES", "SALE OF SPORTS EQUIPMENT", 
    "SPORT PROMOTION SERVICES", "VIDEO CD RENTAL SERVICES"
  ],
  "AGRICULTURE, FORESTRY & FISHING": [
    "ANIMAL HUSBANDRY SERVICES", "AQUARIUM SERVICES", "AVIARY SERVICES", "CROP AND ANIMAL PRODUCTION", 
    "FISH FARMING/AQUACULTURE", "FOOD PRODUCTION AND PROCESSING", "FORESTRY & LOGGING", "GARDENING SERVICES", 
    "HONEY PROCESSING", "HORTICULTURAL SERVICES", "KENNEL SERVICES", "LIVESTOCK FEEDS PRODUCTION", 
    "LIVESTOCK MANAGEMENT", "MILLING AND GRINDING SERVICES", "PIGGERY SERVICES", "POULTRY SERVICES", 
    "SALE OF AGRICULTURAL PRODUCE", "SALE OF AGRICULTURAL TOOLS", "SALE OF ANIMALS", "SALE OF DIARY PRODUCTS", 
    "SALE OF GROCERIES"
  ],
  "CONSTRUCTION": [
    "BOAT AND CANOE CONSTRUCTION", "BRICKLAYING/MASONARY SERVICES", "BUILDING WORKS", 
    "CARPENTRY/UPHOLSTERY SERVICES", "CIVIL ENGINEERING", "CONSTRUCTION OF BUILDINGS", "GLASS WORKS", 
    "MECHANICAL WORKS", "METAL WORKS", "SPECIALIZED CONSTRUCTION ACTIVITIES", "STEEL WORKS SERVICES", 
    "SUPPLY, SALE AND DISTRIBUTION OF BUILDING MATERIALS"
  ],
  "EDUCATION": [
    "APPRENTICESHIP AND TRAINING", "BUSINESS SUPPORT/ DEVELOPMENT", "CURRICULUM PLANNING", 
    "EDUCATIONAL SERVICES AND CONSULTANCY", "FEASIBILITY STUDIES", "GUIDANCE AND COUNSELING", 
    "ICT TRAINING AND CONSULTANCY", "LIBRARY SERVICES", "MONTESSORI SUPPLIES", "MONTESSORI TRAINING", 
    "OPERATE BIBLE COLLEGE", "OPERATE COMPUTER TRAINING SCHOOL", "OPERATE CRÈCHE AND DAY CARE", 
    "OPERATE ISLAMIC SCHOOL", "OPERATE NURSERY AND PRIMARY SCHOOL", "OPERATE PRIMARY AND SECONDARY SCHOOL", 
    "ORGANIZING CONFERENCES", "PUBLICATION OF LAW REPORTS", "TEACHERS RECRUITMENT", "VOCATIONAL EDUCATION"
  ],
  "HEALTH & SOCIAL WORK": [
    "AMBULANCE SERVICES", "BEAUTY AND SALON SERVICES", "CHEMIST/NURSING HOME", "DENTAL PRACTICE", 
    "FUMIGATION AND PEST CONTROL", "GYMNASIUM SERVICES", "HUMAN HEALTH ACTIVITIES", "MAKE UP AND MAKEOVER", 
    "OPERATE COMMUNITY HEALTH CENTRE", "OPERATE HOSPITAL/CLINIC", "OPERATE MATERNITY CLINIC", 
    "OPTICAL SERVICES", "PATENT/MEDICINE SERVICES", "PEDICURE AND MANICURE", "PERFUMERY SERVICES", 
    "PHYSIOTHERAPY SERVICES", "RESIDENTIAL CARE ACTIVITIES", "SPA TREATMENT SERVICES", 
    "SALE OF VETERINARY EQUIPMENT", "TRADITIONAL MEDICINE", "VETERINARY SERVICES"
  ],
  "INFORMATION & COMMUNICATION": [
    "ADVERTISING AND MARKETING", "BULK SMS SERVICES", "CINEMATOGRAPHY", "COMPUTER PROGRAMMING/CONSULTANCY", 
    "GRAPHIC DESIGNING", "INFORMATION SERVICE ACTIVITIES", "NETWORKING SERVICES", "PUBLISHING ACTIVITIES", 
    "SOFTWARE DEVELOPMENT", "SUPPLY OF HARDWARE", "TELECOMMUNICATIONS", "WEB DESIGN"
  ],
  "MANUFACTURING": [
    "ALUMINUM MANUFACTURING", "LEATHER WORKS/TANNERY", "MANUFACTURE OF BASIC METALS", 
    "MANUFACTURE OF BEVERAGES", "MANUFACTURE OF CHEMICALS", "MANUFACTURE OF FURNITURE", 
    "MANUFACTURE OF FOOD PRODUCTS", "MANUFACTURE OF TEXTILES", "MANUFACTURE OF WEARING APPAREL", 
    "MANUFACTURE OF WOOD PRODUCTS", "MANUFACTURING OF CANDLES", "MANUFACTURING OF PLASTIC PRODUCTS", 
    "PRODUCTION AND SALE OF BOTTLED WATER", "PRODUCTION AND SALE OF TILES", "PRODUCTION OF EDIBLE OIL", 
    "SALE AND MANUFACTURING COSMETICS"
  ],
  "MINING & QUARRYING": [
    "EXTRACTION OF CRUDE PETROLEUM", "GEOSCIENCES SERVICES", "MINING AND GRINDING", "MINING OF COAL", 
    "MINING OF METAL ORES", "OIL AND GAS SERVICES", "QUARRYING"
  ],
  "REAL ESTATE": [
    "ENVIRONMENTAL AND LANDSCAPING", "ESTATE AGENCY", "ESTATE SURVEYING AND VALUATION", 
    "ESTATE AND FACILITY MANAGEMENT", "PROJECT MANAGEMENT SERVICES", "PROPERTY DEVELOPMENT", 
    "REAL ESTATE ACTIVITIES", "TOWN PLANNING SERVICES"
  ],
  "TRANSPORTATION": [
    "AIR TRANSPORT", "LAND TRANSPORT", "POSTAL AND COURIER", "RAIL SERVICES", 
    "ROAD TRANSPORTATION", "SEA TRANSPORT", "TRUCK AND HAULAGE", "WAREHOUSING", "WATER TRANSPORT"
  ],
  "ASSOCIATIONS (NGO/CLUBS)": [
    "COMMUNITY BASED ASSOCIATION", "CULTURAL BASED ASSOCIATION", "FAITH BASED ASSOCIATION", 
    "FOUNDATION BASED ASSOCIATION", "SOCIAL CLUBS BASED ASSOCIATION", "SPORTING BASED ASSOCIATION"
  ],
  "OTHERS": ["GENERAL MERCHANDISE", "TRADING", "OTHER PERSONAL SERVICES"]
};

const Registration = () => {
  const { selectedService } = useParams();
  
  const [serviceType, setServiceType] = useState(selectedService || 'Business Name');
  const [step, setStep] = useState('form');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  
  // FIXED: Supports arrays of files for multiple uploads
  const [files, setFiles] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  const [previews, setPreviews] = useState({ "ID Card": [], "Signature": [], "Passport": [] });
  
  const [category, setCategory] = useState('');
  const [nature, setNature] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase.from('services').select('name, price');
      if (data) {
        const priceMap = {};
        data.forEach(item => {
          let name = item.name;
          if (name === 'Company Registration') name = 'Company Name';
          priceMap[name] = item.price;
        });
        setPrices(priceMap);
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      let correctedName = selectedService;
      if (selectedService === 'Company Registration') correctedName = 'Company Name';
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
    } catch (err) {
        console.error("PDF Failed", err);
    }
  };

  // UPDATED: Now includes file upload to storage
  const saveToDatabase = async (reference) => {
    const getValue = (id) => document.getElementById(id)?.value || '';
    const allInputs = document.querySelectorAll('input, select, textarea');
    const fullDetails = {};
    
    allInputs.forEach(input => {
        if(input.id && input.type !== 'file') {
            fullDetails[input.id] = input.value;
        }
    });

    fullDetails['business_category'] = category;
    fullDetails['business_nature'] = nature;

    try {
        // Upload documents and get URLs
        const documentUrls = {};
        for (const key of Object.keys(files)) {
            const uploadPromises = files[key].map(async (file, i) => {
                const path = `${key}/${Date.now()}_${i}_${file.name}`;
                const { error: uploadErr } = await supabase.storage.from('documents').upload(path, file);
                if (uploadErr) throw uploadErr;
                const { data } = supabase.storage.from('documents').getPublicUrl(path);
                return data.publicUrl;
            });
            documentUrls[key] = await Promise.all(uploadPromises);
        }

        const { error } = await supabase.from('registrations').insert([
            { 
              service_type: serviceType,
              surname: getValue('surname'),
              firstname: getValue('firstname'),
              phone: getValue('phone'),
              email: getValue('email'),
              amount: currentPrice,
              paystack_ref: reference,
              full_details: { ...fullDetails, uploaded_docs: documentUrls } 
            }
        ]);
        if (error) throw error;
    } catch (err) {
        console.error("Database Error", err);
        throw err;
    }
  };

  const currentPrice = prices[serviceType] || 0; 
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "rex360solutions@gmail.com",
    amount: currentPrice * 100,
    publicKey: 'pk_live_08ddf326f45872fd52bbaafda8e14863b37bd00b',
  };
  const initializePayment = usePaystackPayment(config);

  const handleProcess = (e) => {
    e.preventDefault();
    
    // Check if each of the 3 required categories has at least one file
    const missingDocs = Object.keys(files).filter(doc => files[doc].length === 0);

    if (missingDocs.length > 0) {
        alert(`Missing Documents:\n\nPlease upload your: ${missingDocs.join(', ')}`);
        return; 
    }

    if (currentPrice === 0) return alert("Price loading...");

    initializePayment(
      async (response) => {
        try {
            await saveToDatabase(response.reference);
            generatePDF();
            setStep('success');
        } catch (error) {
            alert("Payment Successful, but error saving data: " + error.message);
        }
      },
      () => alert("Payment Cancelled")
    );
  };

  const NatureOfBusinessSelector = () => (
    <div className="md:col-span-2 space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <label className="text-[10px] font-black uppercase text-slate-400">Nature of Business</label>
        <select 
            className="w-full p-4 rounded-xl font-bold text-slate-700 mb-2 border-2 border-white focus:border-cac-blue transition-colors"
            value={category}
            onChange={(e) => {
                setCategory(e.target.value);
                setNature('');
            }}
        >
            <option value="">-- Select Business Category --</option>
            {Object.keys(BUSINESS_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
        <select 
            className="w-full p-4 rounded-xl font-bold text-slate-700 disabled:opacity-50 border-2 border-white focus:border-cac-blue transition-colors"
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            disabled={!category}
        >
            <option value="">-- Select Specific Activity --</option>
            {category && BUSINESS_CATEGORIES[category].map(item => (
                <option key={item} value={item}>{item}</option>
            ))}
        </select>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-cac-green"/></div>;

  if (step === 'success') {
    return (
      <div className="pt-40 pb-20 px-8 text-center bg-white min-h-screen animate-fadeIn">
        <CheckCircle size={80} className="text-cac-green mx-auto mb-6" />
        <h1 className="text-4xl font-black text-cac-blue mb-4 uppercase">Submission Successful!</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">Registration received. We will contact you shortly.</p>
        <a href="https://wa.me/2349048349548" className="inline-flex items-center bg-[#25D366] text-white px-10 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-transform">
          <MessageCircle className="mr-2" /> CHAT ON WHATSAPP
        </a>
      </div>
    );
  }

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
                <input id="cmp-name1" placeholder="Company Name 1" className="p-4 rounded-xl border-none font-bold" required />
                <input id="cmp-name2" placeholder="Company Name 2" className="p-4 rounded-xl border-none font-bold" required />
                <input id="cmp-email" placeholder="Company Email" className="p-4 rounded-xl border-none font-bold" required />
                <NatureOfBusinessSelector />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Company Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="b-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="b-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="b-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
                </div>
                <div className="md:col-span-2 p-4 bg-white rounded-xl border border-blue-100">
                    <p className="text-xs font-black text-cac-blue mb-3 uppercase">Witness / Director Details</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input id="wit-surname" placeholder="Surname" className="p-3 bg-slate-50 rounded-lg" />
                      <input id="wit-firstname" placeholder="First Name" className="p-3 bg-slate-50 rounded-lg" />
                      <input id="wit-phone" placeholder="Phone" className="p-3 bg-slate-50 rounded-lg" />
                      <input id="wit-nin" placeholder="NIN" className="p-3 bg-slate-50 rounded-lg" />
                      <input id="wit-state" placeholder="State" className="p-3 bg-slate-50 rounded-lg" />
                      <input id="wit-street" placeholder="Street Address" className="p-3 bg-slate-50 rounded-lg" />
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
                <input id="ngo-name1" placeholder="Proposed NGO Name 1" className="p-4 rounded-xl border-none font-bold" />
                <NatureOfBusinessSelector />
                <input id="ngo-tenure" placeholder="Trustees Tenure (e.g. 20 Years)" className="p-4 rounded-xl border-none font-bold" />
                <input id="ngo-address" placeholder="NGO Full Address" className="p-4 rounded-xl border-none font-bold" />
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Aims & Objectives</label>
                   <input id="ngo-aim1" placeholder="1. Aim..." className="w-full p-3 rounded-lg border-none mb-2" />
                   <input id="ngo-aim2" placeholder="2. Aim..." className="w-full p-3 rounded-lg border-none" />
                </div>
             </div>
          </div>
        );
      case 'Export Licence':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <div className="grid gap-4">
                <input id="exp-rc" placeholder="RC Number" className="p-4 rounded-xl border-none font-bold" />
                <input id="exp-tin" placeholder="Tax Identification Number (TIN)" className="p-4 rounded-xl border-none font-bold" />
                <input id="exp-bank" placeholder="Corporate Bank Account Details" className="p-4 rounded-xl border-none font-bold" />
             </div>
          </div>
        );
      case 'Trademark':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Trademark Details</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <input id="tm-name" placeholder="Proposed Trademark Name" className="p-4 rounded-xl border-none font-bold md:col-span-2" required />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Class of Goods/Services</label>
                   <select id="tm-class" className="w-full p-4 rounded-xl border-none font-bold bg-white">
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
      default: return null;
    }
  };

  const getPersonalHeader = () => {
    return serviceType === 'NGO Registration' ? 'Chairman Details' : 'Personal Information';
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-cac-blue p-8 text-white flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-black uppercase italic tracking-tighter">{serviceType}</h1>
             <p className="text-xs text-blue-200 font-bold uppercase">Official CAC Form</p>
          </div>
          <div className="text-right">
             <span className="block text-[10px] opacity-60 font-black">Fee</span>
             <span className="text-2xl font-black text-cac-green">
               {currentPrice ? `₦${currentPrice.toLocaleString()}` : <Loader className="animate-spin inline" size={16}/>}
             </span>
          </div>
        </div>

        <form onSubmit={handleProcess} className="p-8 md:p-12 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">
                {getPersonalHeader()}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
               <input id="surname" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="firstname" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="othername" placeholder="Other Name" className="p-4 bg-slate-50 rounded-xl font-bold" />
               <div className="relative">
                 <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                 <input id="dob" type="date" className="w-full p-4 bg-slate-50 rounded-xl font-bold" required />
               </div>
               <select id="gender" className="p-4 bg-slate-50 rounded-xl font-bold"><option>Male</option><option>Female</option></select>
               <input id="email" type="email" placeholder="Email Address" className="p-4 bg-slate-50 rounded-xl font-bold md:col-span-2" required />
               <input id="phone" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="nin" placeholder="NIN" className="p-4 bg-slate-50 rounded-xl font-bold" required />
            </div>
             <div className="bg-slate-50 p-4 rounded-xl space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Residential Address</label>
               <div className="grid grid-cols-3 gap-2">
                  <input id="h-state" placeholder="State" className="p-3 bg-white rounded-lg" />
                  <input id="h-lga" placeholder="LGA" className="p-3 bg-white rounded-lg" />
                  <input id="h-street" placeholder="Street/No" className="p-3 bg-white rounded-lg" />
               </div>
            </div>
          </div>

          {serviceType === 'NGO Registration' && (
            <div className="space-y-4 pt-4 border-t">
               <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Secretary Details</h3>
               <div className="grid md:grid-cols-3 gap-4">
                  <input id="sec-surname" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold" />
                  <input id="sec-firstname" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold" />
                  <input id="sec-phone" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold" />
                  <input id="sec-nin" placeholder="NIN" className="p-4 bg-slate-50 rounded-xl font-bold" />
               </div>
            </div>
          )}

          {renderFields()}
          
          {/* UPDATED: Multiple File Display logic */}
          <div className="space-y-4 pt-4 border-t">
             <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Required Documents</h3>
             <div className="grid gap-6">
                {Object.keys(files).map(doc => (
                  <div key={doc} className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400">{doc}</label>
                    <div className="flex flex-wrap gap-4">
                      {previews[doc].map((src, index) => (
                        <div key={index} className="relative w-28 h-28 group">
                          <img src={src} className="w-full h-full object-cover rounded-xl border-2 border-cac-green" />
                          <button onClick={(e) => removeFile(e, doc, index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
                        </div>
                      ))}
                      <label className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload className="text-slate-400" size={20} />
                        <span className="text-[8px] font-black mt-1">UPLOAD</span>
                        <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, doc)} />
                      </label>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <button type="submit" className="w-full bg-cac-green text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-cac-blue transition-all flex items-center justify-center gap-4">
             PROCEED TO PAYMENT <ArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;