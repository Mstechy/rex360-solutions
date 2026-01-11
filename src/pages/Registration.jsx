import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { Upload, CheckCircle, MessageCircle, ArrowRight, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../SupabaseClient'; // <--- CONNECTED TO DB

const Registration = () => {
  const { selectedService } = useParams();
  const [serviceType, setServiceType] = useState('Business Name');
  const [step, setStep] = useState('form');
  
  // 1. STATE: We now store prices in State, not a hardcoded list
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // 2. FETCH PRICES FROM DB (The Fix)
  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('name, price');

      if (data) {
        const priceMap = {};
        data.forEach(item => {
          // Normalize names so they match your form logic
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

  // 3. Update Service Type when URL changes
  useEffect(() => {
    if (selectedService) {
      // Fix "Company Registration" link issue automatically
      let correctedName = selectedService;
      if (selectedService === 'Company Registration') correctedName = 'Company Name';
      
      setServiceType(correctedName);
    }
  }, [selectedService]);

  // --- PDF GENERATION LOGIC ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const getValue = (id) => document.getElementById(id)?.value || 'N/A';

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); 
    doc.text("REX360 SOLUTIONS - INTAKE FORM", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Service: ${serviceType} | Date: ${new Date().toLocaleDateString()}`, 14, 26);
    doc.line(14, 30, 196, 30);

    // Core Personal Data
    let bodyData = [
      ['Surname', getValue('surname')],
      ['First Name', getValue('firstname')],
      ['Other Name', getValue('othername')],
      ['Date of Birth', getValue('dob')],
      ['Gender', getValue('gender')],
      ['Phone', getValue('phone')],
      ['Email', getValue('email')],
      ['NIN', getValue('nin')],
      ['Home Address', `${getValue('h-street')}, ${getValue('h-lga')}, ${getValue('h-state')}`],
    ];

    // Service Specific Data
    if (serviceType === 'Business Name') {
      bodyData.push(
        ['---', '--- BUSINESS DETAILS ---'],
        ['Business Name 1', getValue('bn-name1')],
        ['Business Name 2', getValue('bn-name2')],
        ['Business Address', `${getValue('b-street')}, ${getValue('b-lga')}, ${getValue('b-state')}`],
        ['Nature of Business', getValue('bn-nature')],
        ['Description', getValue('bn-desc')]
      );
    } else if (serviceType === 'Company Name') {
      bodyData.push(
        ['---', '--- COMPANY DETAILS ---'],
        ['Proposed Name 1', getValue('cmp-name1')],
        ['Proposed Name 2', getValue('cmp-name2')],
        ['Company Email', getValue('cmp-email')],
        ['Company Address', `${getValue('b-street')}, ${getValue('b-lga')}, ${getValue('b-state')}`],
        ['Object 1', getValue('cmp-obj1')],
        ['Object 2', getValue('cmp-obj2')],
        ['---', '--- WITNESS DETAILS ---'],
        ['Witness Name', `${getValue('wit-surname')} ${getValue('wit-firstname')}`],
        ['Witness Phone', getValue('wit-phone')],
        ['Witness NIN', getValue('wit-nin')],
        ['Witness Address', `${getValue('wit-street')}, ${getValue('wit-lga')}, ${getValue('wit-state')}`]
      );
    } else if (serviceType === 'NGO Registration') {
      bodyData.push(
        ['---', '--- NGO TRUSTEES ---'],
        ['Chairman', `${getValue('ngo-chair-name')} (NIN: ${getValue('ngo-chair-nin')})`],
        ['Secretary', `${getValue('ngo-sec-name')} (NIN: ${getValue('ngo-sec-nin')})`],
        ['Trustee 1', `${getValue('ngo-tr1-name')} (NIN: ${getValue('ngo-tr1-nin')})`],
        ['Tenure', getValue('ngo-tenure')],
        ['NGO Address', getValue('ngo-address')],
        ['Aims & Obj 1', getValue('ngo-aim1')],
        ['Aims & Obj 2', getValue('ngo-aim2')],
        ['Proposed Name 1', getValue('ngo-name1')]
      );
    } else if (serviceType === 'Export Licence') {
       bodyData.push(
        ['RC Number', getValue('exp-rc')],
        ['Tax ID (TIN)', getValue('exp-tin')],
        ['Bank Details', getValue('exp-bank')]
       );
    } else if (serviceType === 'Trademark') {
       bodyData.push(
        ['---', '--- TRADEMARK DETAILS ---'],
        ['Trademark Name', getValue('tm-name')],
        ['Class', getValue('tm-class')],
        ['Owner Address', `${getValue('tm-street')}, ${getValue('tm-lga')}, ${getValue('tm-state')}`],
        ['Company Owner', getValue('tm-company')]
       );
    }

    doc.autoTable({
      startY: 35,
      head: [['Field', 'Details']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [0, 135, 81] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
    });

    doc.save(`REX360_${serviceType}_${getValue('surname')}.pdf`);
  };

  /// --- DATABASE SAVING LOGIC (COMPLETE VERSION) ---
  const saveToDatabase = async (reference) => {
    const getValue = (id) => document.getElementById(id)?.value || '';

    // 1. Gather ALL data (Common + Service Specific)
    const formData = {
      // --- Personal Info ---
      surname: getValue('surname'),
      firstname: getValue('firstname'),
      othername: getValue('othername'),
      gender: getValue('gender'),
      dob: getValue('dob'),
      phone: getValue('phone'),
      email: getValue('email'),
      nin: getValue('nin'),
      residential_address: `${getValue('h-street')}, ${getValue('h-lga')}, ${getValue('h-state')}`,

      // --- Business Name Fields ---
      business_name_1: getValue('bn-name1'),
      business_name_2: getValue('bn-name2'),
      business_nature: getValue('bn-nature'),
      business_description: getValue('bn-desc'),
      business_address: `${getValue('b-street')}, ${getValue('b-lga')}, ${getValue('b-state')}`,

      // --- Company Fields ---
      company_name_1: getValue('cmp-name1'),
      company_name_2: getValue('cmp-name2'),
      company_email: getValue('cmp-email'),
      company_object_1: getValue('cmp-obj1'),
      company_object_2: getValue('cmp-obj2'),
      
      // --- Witness Info (For Company) ---
      witness_name: `${getValue('wit-surname')} ${getValue('wit-firstname')}`,
      witness_phone: getValue('wit-phone'),
      witness_nin: getValue('wit-nin'),
      witness_address: `${getValue('wit-street')}, ${getValue('wit-lga')}, ${getValue('wit-state')}`,

      // --- NGO Fields ---
      ngo_name: getValue('ngo-name1'),
      ngo_chairman: `${getValue('ngo-chair-name')} (NIN: ${getValue('ngo-chair-nin')})`,
      ngo_secretary: `${getValue('ngo-sec-name')} (NIN: ${getValue('ngo-sec-nin')})`,
      ngo_trustee_1: `${getValue('ngo-tr1-name')} (NIN: ${getValue('ngo-tr1-nin')})`,
      ngo_tenure: getValue('ngo-tenure'),
      ngo_address: getValue('ngo-address'),
      ngo_aims: `${getValue('ngo-aim1')}, ${getValue('ngo-aim2')}`,

      // --- Trademark Fields ---
      trademark_name: getValue('tm-name'),
      trademark_class: getValue('tm-class'),
      trademark_owner_company: getValue('tm-company'),
      trademark_address: `${getValue('tm-street')}, ${getValue('tm-lga')}, ${getValue('tm-state')}`,

      // --- Export Licence Fields ---
      export_rc_number: getValue('exp-rc'),
      export_tin: getValue('exp-tin'),
      export_bank_details: getValue('exp-bank'),
    };

    // Remove empty fields to keep the database clean
    const cleanData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 'N/A, N/A, N/A'));

    // 2. Send to Supabase
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
          full_details: cleanData // <--- Saves ALL the fields above
        }
      ]);

    if (error) console.error('Error saving registration:', error);
  };
  // --- PAYSTACK LOGIC ---
  const currentPrice = prices[serviceType] || 0; 
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "rex360solutions@gmail.com",
    amount: currentPrice * 100, // Converts Naira to Kobo
    // 👇 YOUR LIVE KEY
    publicKey: 'pk_live_08ddf326f45872fd52bbaafda8e14863b37bd00b',
  };

  const initializePayment = usePaystackPayment(config);

  const handleProcess = (e) => {
    e.preventDefault();
    if (currentPrice === 0) {
        alert("Price is loading or invalid. Please refresh.");
        return;
    }
    
    // Trigger Paystack
    initializePayment(
      // 1. Success Callback
      (response) => {
        // A. Save to Database (So you see the order)
        saveToDatabase(response.reference);
        
        // B. Generate PDF (For the customer)
        generatePDF();
        
        // C. Show Success Screen
        setStep('success');
      },
      // 2. Close/Cancel Callback
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
                
                {/* Company Address */}
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Company Address</label>
                   <div className="grid grid-cols-3 gap-2">
                      <input id="b-state" placeholder="State" className="p-3 rounded-lg border-none" />
                      <input id="b-lga" placeholder="LGA" className="p-3 rounded-lg border-none" />
                      <input id="b-street" placeholder="Street/No" className="p-3 rounded-lg border-none" />
                   </div>
                </div>

                {/* Objects */}
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Object of Memorandum</label>
                   <input id="cmp-obj1" placeholder="1. e.g., Sales of Hardware" className="w-full p-3 rounded-lg border-none mb-2" />
                   <input id="cmp-obj2" placeholder="2. e.g., Maintenance" className="w-full p-3 rounded-lg border-none" />
                </div>

                {/* Witness Section */}
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
                
                {/* Trustees Loop Visual */}
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
      default: return null;
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
               <input id="dob" type="date" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <select id="gender" className="p-4 bg-slate-50 rounded-xl font-bold"><option>Male</option><option>Female</option></select>
               <input id="phone" placeholder="Phone" className="p-4 bg-slate-50 rounded-xl font-bold" required />
               <input id="email" type="email" placeholder="Personal Email" className="p-4 bg-slate-50 rounded-xl font-bold md:col-span-2" required />
               <input id="nin" placeholder="NIN" className="p-4 bg-slate-50 rounded-xl font-bold" required />
            </div>
            
            {/* Residential Address */}
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

          {/* 3. DOCUMENT UPLOADS */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
             {['ID Card', 'Signature', 'Passport'].map(doc => (
               <label key={doc} className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-cac-green cursor-pointer">
                  <Upload className="text-slate-300 mb-2" />
                  <span className="text-[10px] font-black text-slate-500">{doc}</span>
                  <input type="file" className="hidden" required />
               </label>
             ))}
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