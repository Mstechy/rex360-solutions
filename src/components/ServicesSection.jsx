import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2, Landmark, Users, Scale, FileCheck, ShieldCheck, History, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient'; 

const iconMap = {
  'Business Name': <Building2 />,
  'Company Registration': <Landmark />,
  'Company Name': <Landmark />, 
  'NGO Registration': <Users />,
  'Trademark': <ShieldCheck />,
  'Export Licence': <FileCheck />,
  'Copyright': <Scale />,
  'Annual Returns': <History />
};

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Supabase Error:', error.message);
        setError(error.message);
      } else if (data) {
        setServices(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center bg-slate-50">
        <Loader className="animate-spin mx-auto text-cac-green mb-4" size={40}/>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Live Prices...</p>
      </div>
    );
  }

  return (
    <section id="services-section" className="py-16 md:py-20 bg-slate-50 px-4 md:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
        <span className="text-cac-green font-black uppercase tracking-[0.3em] text-xs">Our Expertise</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-cac-blue mt-3 md:mt-4 mb-4 md:mb-6 tracking-tighter uppercase">CAC SERVICES WE OFFER</h2>
        <div className="w-20 md:w-24 h-1.5 md:h-2 bg-cac-green mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => {

          // --- 🔧 THE FIX IS HERE ---
          // We normalize the name so the Registration Page understands it.
          // If DB says "Company Registration", we change link to "Company Name"
          const linkName = service.name === 'Company Registration' ? 'Company Name' : service.name;

          return (
            <div
                key={service.id}
                className="service-card-pop group relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border-b-[8px] md:border-b-[10px] border-slate-200 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl hover:-translate-y-2 md:hover:-translate-y-3 transition-all duration-500 ease-out flex flex-col h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="w-16 h-16 md:w-18 md:h-18 bg-slate-50 text-cac-green rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-cac-blue group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500">
                {React.cloneElement(iconMap[service.name] || <Building2 />, { size: 28 })}
                </div>

                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3 md:mb-4 group-hover:text-cac-blue transition-colors leading-tight">
                {service.name}
                </h3>

                <p className="text-slate-500 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed font-medium flex-grow">
                {service.name === 'Business Name' && "CAC business name registration under CAMA. Processing: 24-48 hours."}
                {service.name.includes('Company') && "Limited liability company incorporation with CAC registration. Processing: 3-5 working days."}
                {service.name.includes('NGO') && "NGO registration as incorporated trustee with CAC certification. Processing: 5-7 working days."}
                {service.name === 'Trademark' && "Brand protection through CAC trademark registration. Processing: 2-4 weeks."}
                {service.name === 'Export Licence' && "NEPC export licence for international trade. Processing: 3-5 working days."}
                {service.name === 'Copyright' && "Intellectual property protection via CAC copyright registration. Processing: 2-4 weeks."}
                {service.name === 'Annual Returns' && "Mandatory CAC annual filings to maintain active status. Processing: 24-48 hours."}
                </p>

                <div className="flex flex-col mb-4 md:mb-6">
                {service.old_price && (
                    <span className="text-slate-300 line-through text-xs md:text-sm italic font-bold">
                    ₦{parseInt(service.old_price).toLocaleString()}
                    </span>
                )}
                <span className="text-xl md:text-2xl font-black text-cac-green tracking-tighter">
                    ₦{parseInt(service.price).toLocaleString()}
                </span>
                </div>

                {/* We use the fixed 'linkName' here */}
                <Link to={`/register/${linkName}`} className="block">
                <button
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cac-blue hover:to-cac-green text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg md:rounded-xl font-bold transition-all duration-500 shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-xs md:text-sm border border-slate-700 hover:border-cac-green/50"
                  aria-label={`Register for ${service.name} service`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="uppercase tracking-wider font-extrabold text-xs">Register Now</span>
                    <ArrowRight className="group-hover:translate-x-0.5 group-hover:scale-105 transition-all duration-300" size={12} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cac-green/20 to-cac-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
                </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;