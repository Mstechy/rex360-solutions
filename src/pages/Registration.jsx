import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { usePaystackPayment } from 'react-paystack';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X, ArrowLeft, Briefcase, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../SupabaseClient'; 

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
  const { selectedService } = useParams();
  const navigate = useNavigate(); 
  
  const [serviceType, setServiceType] = useState(selectedService || 'Business Name');
  const [step, setStep] = useState('form');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  
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
            { service_type: serviceType, surname: getValue('surname'), firstname: getValue('firstname'), phone: getValue('phone'), email: getValue('email'), amount: currentPrice, paystack_ref: reference, full_details: { ...fullDetails, uploaded_docs: documentUrls } }
        ]);
        if (error) throw error;
    } catch (err) { throw err; }
  };

  const currentPrice = prices[serviceType] || 0; 
  const config = {
    reference: (new Date()).getTime().toString(),
    email: getValue('email') || "test-customer@example.com", // Dynamic email from form
    amount: currentPrice * 100, // Amount in kobo
    publicKey: 'pk_test_1dc8f242ed09075faee33e86dff64ce401918129', // Your Test Key
  };
  const initializePayment = usePaystackPayment(config);

  const handleProcess = (e) => {
    e.preventDefault();
    const missingDocs = Object.keys(files).filter(doc => files[doc].length === 0);
    if (missingDocs.length > 0) {
        alert(`Missing Documents:\n\nPlease upload your: ${missingDocs.join(', ')}`);
        return; 
    }
    if (currentPrice === 0) return alert("Price loading...");
    initializePayment(async (response) => {
        try {
            await saveToDatabase(response.reference);
            generatePDF();
            setStep('success');
        } catch (error) { alert("Payment Successful, but error saving data"); }
      }, () => alert("Payment Cancelled")
    );
  };

  const NatureOfBusinessSelector = () => (
    <div className="md:col-span-2 space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <label className="text-[10px] font-black uppercase text-slate-400">Nature of Business</label>
        <select className="w-full p-4 rounded-xl font-bold text-slate-700 mb-2 border-2 border-white focus:border-cac-blue" value={category} onChange={(e) => { setCategory(e.target.value); setNature(''); }}>
            <option value="">-- Select Business Category --</option>
            {Object.keys(BUSINESS_CATEGORIES).map(cat => ( <option key={cat} value={cat}>{cat}</option> ))}
        </select>
        <select className="w-full p-4 rounded-xl font-bold text-slate-700 disabled:opacity-50 border-2 border-white focus:border-cac-blue" value={nature} onChange={(e) => setNature(e.target.value)} disabled={!category}>
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-cac-green"/></div>;

  if (step === 'success') {
    return (
      <div className="pt-40 pb-20 px-8 text-center bg-white min-h-screen">
        <CheckCircle size={80} className="text-cac-green mx-auto mb-6" />
        <h1 className="text-4xl font-black text-cac-blue mb-4 uppercase">Submission Successful!</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">Registration received. We will contact you shortly.</p>
        <a href="https://wa.me/2349048349548" className="inline-flex items-center bg-[#25D366] text-white px-10 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-transform">
          <MessageCircle className="mr-2" /> CHAT ON WHATSAPP
        </a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto mb-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-cac-blue font-black text-xs uppercase transition-all">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
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

            {/* SIDEBAR SUPPORT & ACCREDITATION - ADDED BELOW LIST */}
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
                   <input id="surname" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold" required />
                   <input id="firstname" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold" required />
                   <input id="othername" placeholder="Other Name" className="p-4 bg-slate-50 rounded-xl font-bold" />
                   <div className="relative">
                     <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                     <input id="dob" type="date" className="w-full p-4 bg-slate-50 rounded-xl font-bold" required />
                   </div>
                   <select id="gender" className="p-4 bg-slate-50 rounded-xl font-bold"><option>Male</option><option>Female</option></select>
                   <input id="email" type="email" placeholder="Email Address" className="p-4 bg-slate-50 rounded-xl font-bold md:col-span-2" required />
                   <input id="phone" placeholder="Phone Number" className="p-4 bg-slate-50 rounded-xl font-bold" required />
                   <input id="nin" placeholder="NIN (11 Digits)" className="p-4 bg-slate-50 rounded-xl font-bold" required />
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
                      <input id="sec-surname" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold" />
                      <input id="sec-firstname" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold" />
                      <input id="sec-phone" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold" />
                      <input id="sec-nin" placeholder="NIN" className="p-4 bg-slate-50 rounded-xl font-bold" />
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

              <button type="submit" className="w-full bg-cac-green text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-cac-blue hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-4 uppercase">
                 PROCEED TO SECURE PAYMENT <ArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;