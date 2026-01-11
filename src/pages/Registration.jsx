import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader, X, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../SupabaseClient'; 

const Registration = () => {
  const { selectedService } = useParams();
  
  // FIX 1: Handle dynamic URL or default to Business Name
  const [serviceType, setServiceType] = useState(selectedService || 'Business Name');
  const [step, setStep] = useState('form');
  
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // FIX 2: STATE FOR FILE PREVIEWS
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  // 1. FETCH PRICES FROM DB
  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase.from('services').select('name, price');

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

  // 2. Update Service Type when URL changes
  useEffect(() => {
    if (selectedService) {
      let correctedName = selectedService;
      if (selectedService === 'Company Registration') correctedName = 'Company Name';
      setServiceType(correctedName);
    }
  }, [selectedService]);

  // --- FILE HANDLING HANDLERS (New) ---
  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      // Save file for potential DB upload
      setFiles(prev => ({ ...prev, [docName]: file }));
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [docName]: objectUrl }));
    }
  };

  const removeFile = (e, docName) => {
    e.preventDefault();
    const newFiles = { ...files };
    const newPreviews = { ...previews };
    delete newFiles[docName];
    delete newPreviews[docName];
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  // --- PDF GENERATION LOGIC ---
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`REX360 - ${serviceType}`, 10, 10);
    doc.save(`REX360_${serviceType}.pdf`);
  };

  // --- DATABASE SAVING LOGIC ---
  const saveToDatabase = async (reference) => {
    const getValue = (id) => document.getElementById(id)?.value || '';

    // Gather ALL data
    const formData = {
      surname: getValue('surname'),
      firstname: getValue('firstname'),
      othername: getValue('othername'),
      gender: getValue('gender'),
      dob: getValue('dob'),
      phone: getValue('phone'),
      email: getValue('email'),
      nin: getValue('nin'),
      residential_address: `${getValue('h-street')}, ${getValue('h-lga')}, ${getValue('h-state')}`,

      business_name_1: getValue('bn-name1'),
      business_name_2: getValue('bn-name2'),
      business_nature: getValue('bn-nature'),
      business_description: getValue('bn-desc'),
      business_address: `${getValue('b-street')}, ${getValue('b-lga')}, ${getValue('b-state')}`,

      company_name_1: getValue('cmp-name1'),
      company_name_2: getValue('cmp-name2'),
      company_email: getValue('cmp-email'),
      company_object_1: getValue('cmp-obj1'),
      company_object_2: getValue('cmp-obj2'),
      
      witness_name: `${getValue('wit-surname')} ${getValue('wit-firstname')}`,
      witness_phone: getValue('wit-phone'),
      witness_nin: getValue('wit-nin'),
      witness_address: `${getValue('wit-street')}, ${getValue('wit-lga')}, ${getValue('wit-state')}`,

      ngo_name: getValue('ngo-name1'),
      ngo_chairman: `${getValue('ngo-chair-name')} (NIN: ${getValue('ngo-chair-nin')})`,
      ngo_secretary: `${getValue('ngo-sec-name')} (NIN: ${getValue('ngo-sec-nin')})`,
      ngo_trustee_1: `${getValue('ngo-tr1-name')} (NIN: ${getValue('ngo-tr1-nin')})`,
      ngo_tenure: getValue('ngo-tenure'),
      ngo_address: getValue('ngo-address'),
      ngo_aims: `${getValue('ngo-aim1')}, ${getValue('ngo-aim2')}`,

      trademark_name: getValue('tm-name'),
      trademark_class: getValue('tm-class'),
      trademark_owner_company: getValue('tm-company'),
      trademark_address: `${getValue('tm-street')}, ${getValue('tm-lga')}, ${getValue('tm-state')}`,

      export_rc_number: getValue('exp-rc'),
      export_tin: getValue('exp-tin'),
      export_bank_details: getValue('exp-bank'),
    };

    const cleanData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 'N/A, N/A, N/A'));

    const { error } = await supabase
      .from('registrations')
      .insert([
        { 
          service_type: serviceType,
          surname: formData.surname,
          firstname: formData.firstname,
          phone: formData.phone,
          email: formData.email,
          amount: currentPrice,
          paystack_ref: reference,
          full_details: cleanData 
        }
      ]);

    // 👇 UPDATED ERROR HANDLING
    if (error) {
      console.error('Error saving registration:', error);
      alert("PAYMENT RECEIVED BUT DATABASE ERROR: " + error.message + " - Please contact Admin.");
    } else {
      // If success, the handleProcess function will move to the Success Step next
    }
  };

  // --- PAYSTACK LOGIC ---
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
    if (currentPrice === 0) {
        alert("Price is loading or invalid. Please refresh.");
        return;
    }
    
    initializePayment(
      (response) => {
        saveToDatabase(response.reference);
        generatePDF();
        setStep('success');
      },
      () => alert("Payment Cancelled")
    );
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <Loader className="animate-spin text-cac-green mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Prices...</p>
            </div>
        </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="pt-40 pb-20 px-8 text-center bg-white min-h-screen animate-fadeIn">
        <CheckCircle size={80} className="text-cac-green mx-auto mb-6" />
        <h1 className="text-4xl font-black text-cac-blue mb-4 uppercase">Submission Successful!</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">PDF Generated. Chat with Doris to finish.</p>
        <a href="https://wa.me/2349048349548" className="inline-flex items-center bg-[#25D366] text-white px-10 py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-transform">
          <MessageCircle className="mr-2" /> CHAT ON WHATSAPP
        </a>
      </div>
    );
  }

  // --- RENDER FORM FIELDS ---
  const renderFields = () => {
    switch(serviceType) {
      case 'Business Name':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Business Details</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <input id="bn-name1" placeholder="Proposed Name 1" className="p-4 rounded-xl border-none font-bold" required />
                <input id="bn-name2" placeholder="Proposed Name 2" className="p-4 rounded-xl border-none font-bold" required />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Business Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="b-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="b-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="b-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
                </div>
                <input id="bn-nature" placeholder="Nature of Business" className="p-4 rounded-xl border-none font-bold md:col-span-2" required />
                <textarea id="bn-desc" placeholder="Full Description of Services" className="p-4 rounded-xl border-none font-bold md:col-span-2 h-24" required />
             </div>
          </div>
        );
      case 'Company Name':
        return (
          <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
             <h3 className="font-black text-cac-blue uppercase text-xs tracking-widest">Company & Witness Info</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <input id="cmp-name1" placeholder="Company Name 1" className="p-4 rounded-xl border-none font-bold" required />
                <input id="cmp-name2" placeholder="Company Name 2" className="p-4 rounded-xl border-none font-bold" required />
                <input id="cmp-email" placeholder="Company Email" className="p-4 rounded-xl border-none font-bold" required />
                
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Company Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="b-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="b-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="b-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Object of Memorandum</label>
                   <input id="cmp-obj1" placeholder="1. e.g., Sales of Hardware" className="w-full p-3 rounded-lg border-none mb-2" />
                   <input id="cmp-obj2" placeholder="2. e.g., Maintenance" className="w-full p-3 rounded-lg border-none" />
                </div>

                <div className="md:col-span-2 p-4 bg-white rounded-xl border border-blue-100">
                    <p className="text-xs font-black text-cac-blue mb-3 uppercase">Witness Details</p>
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
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl">
                    <p className="text-[10px] font-black mb-2">CHAIRMAN</p>
                    <input id="ngo-chair-name" placeholder="Full Name" className="w-full p-2 mb-2 bg-slate-50 rounded" />
                    <input id="ngo-chair-nin" placeholder="NIN" className="w-full p-2 bg-slate-50 rounded" />
                  </div>
                  <div className="p-4 bg-white rounded-xl">
                    <p className="text-[10px] font-black mb-2">SECRETARY</p>
                    <input id="ngo-sec-name" placeholder="Full Name" className="w-full p-2 mb-2 bg-slate-50 rounded" />
                    <input id="ngo-sec-nin" placeholder="NIN" className="w-full p-2 bg-slate-50 rounded" />
                  </div>
                </div>

                <input id="ngo-tr1-name" placeholder="Trustee 1 Full Name" className="p-4 rounded-xl border-none font-bold" />
                <input id="ngo-tr1-nin" placeholder="Trustee 1 NIN" className="p-4 rounded-xl border-none font-bold" />
                
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
                      <option value="Class 41 (Education/Entertainment)">Class 41 (Education/Entertainment)</option>
                      <option value="Class 43 (Food/Drink)">Class 43 (Food/Drink)</option>
                      <option value="Other">Other (Describe below)</option>
                   </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Business/Owner Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="tm-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="tm-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="tm-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
                </div>

                <input id="tm-company" placeholder="Company Name (If owned by company)" className="p-4 rounded-xl border-none font-bold md:col-span-2" />
             </div>
          </div>
        );
      default: return (
        <div className="p-8 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">
            Please select a valid service from the menu.
        </div>
      );
    }
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
          
          {/* 1. PERSONAL DETAILS (COMMON) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Personal Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
               <input id="surname" placeholder="Surname" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="firstname" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="othername" placeholder="Other Name" className="p-4 bg-slate-50 rounded-xl font-bold" />
               
               {/* FIX 3: Date Field with explicit Label */}
               <div className="relative">
                 <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Date of Birth</label>
                 <input id="dob" type="date" className="w-full p-4 bg-slate-50 rounded-xl font-bold" required />
               </div>

               <select id="gender" className="p-4 bg-slate-50 rounded-xl font-bold"><option>Male</option><option>Female</option></select>
               <input id="phone" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="email" type="email" placeholder="Personal Email" className="p-4 bg-slate-50 rounded-xl font-bold md:col-span-2" required />
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

          {/* 2. DYNAMIC SERVICE FIELDS */}
          {renderFields()}

          {/* 3. DOCUMENT UPLOADS WITH PREVIEWS (FIX 4) */}
          <div className="space-y-4 pt-4 border-t">
             <h3 className="text-xs font-black text-cac-blue uppercase tracking-widest border-l-4 border-cac-green pl-3">Required Documents</h3>
             <div className="grid md:grid-cols-3 gap-6">
                {['ID Card', 'Signature', 'Passport'].map(doc => (
                  <label key={doc} className={`relative flex flex-col items-center justify-center p-1 h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden group ${previews[doc] ? 'border-cac-green bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                      {previews[doc] ? (
                        <>
                          <img src={previews[doc]} alt={doc} className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-white font-bold text-xs mb-2">Click to Change</p>
                             <button onClick={(e) => removeFile(e, doc)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><X size={16}/></button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                              <Upload className="text-slate-400 group-hover:text-cac-blue" size={24} />
                           </div>
                           <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">{doc}</span>
                           <span className="text-[10px] text-slate-400">(Click to Browse)</span>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, doc)} required={!files[doc]} />
                  </label>
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