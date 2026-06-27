import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "How long does Business Name registration take?", a: "Typically, it takes 3-5 working days after payment and document submission." },
    { q: "What IDs are accepted for CAC registration?", a: "We accept National ID (NIN Slip), International Passport, Driver's License, or Voter's Card." },
    { q: "Is the payment secure?", a: "Yes, all payments are processed through Paystack, Nigeria's most secure payment gateway." },
    { q: "Will I get a certificate?", a: "Yes, once registration is complete, your official CAC certificate will be sent to your email and WhatsApp." },
    { q: "Can I register my business from any state in Nigeria?", a: "Yes. We register businesses for clients across all 36 states and FCT Abuja. Everything is done online — no physical visit needed." },
    { q: "What is the difference between Business Name and Limited Company?", a: "A Business Name (sole proprietorship) is cheaper and faster but has no separate legal identity. A Limited Company (LTD) is a separate legal entity, better for investors and contracts." },
    { q: "Do you offer post-registration services?", a: "Yes. We offer Annual Returns filing, Trademark registration, Copyright registration, and Export Licence processing after your initial registration." },
    { q: "How do I pay for the service?", a: "We accept bank transfers, online payments, and all major payment channels. You will receive payment details after submitting your order." },
    { q: "Will I get a physical certificate?", a: "CAC certificates are issued digitally as official PDF documents. These are legally valid and accepted by all banks and institutions." }
  ];

  return (
    <section className="py-20 bg-white px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-cac-blue text-center mb-12 uppercase tracking-tighter">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-bold text-slate-700 text-left">{faq.q}</span>
                {openIndex === index ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </button>
              {openIndex === index && (
                <div className="p-6 bg-white text-slate-600 leading-relaxed animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;