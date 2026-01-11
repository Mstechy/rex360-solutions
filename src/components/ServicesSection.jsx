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

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) setServices(data);
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
    <section id="services-section" className="py-24 bg-slate-50 px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <span className="text-cac-green font-black uppercase tracking-[0.3em] text-xs">Our Expertise</span>
        <h2 className="text-4xl md:text-5xl font-black text-cac-blue mt-4 mb-6 tracking-tighter uppercase">CAC SERVICES WE OFFER</h2>
        <div className="w-24 h-2 bg-cac-green mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => {
            
          // --- 🔧 THE FIX IS HERE ---
          // We normalize the name so the Registration Page understands it.
          // If DB says "Company Registration", we change link to "Company Name"
          const linkName = service.name === 'Company Registration' ? 'Company Name' : service.name;

          return (
            <div 
                key={service.id} 
                className="service-card-pop group relative bg-white p-10 rounded-[2.5rem] border-b-[12px] border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 ease-out flex flex-col h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="w-20 h-20 bg-slate-50 text-cac-green rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-cac-blue group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500">
                {React.cloneElement(iconMap[service.name] || <Building2 />, { size: 36 })}
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-cac-blue transition-colors">
                {service.name}
                </h3>
                
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium flex-grow">
                {service.name === 'Business Name' && "Perfect for sole proprietors and small businesses."}
                {service.name.includes('Company') && "Full limited liability company registration with CAC."}
                {service.name.includes('NGO') && "Incorporated trustees for foundations and churches."}
                {service.name === 'Trademark' && "Protect your brand name and logo legally."}
                {service.name === 'Export Licence' && "Get your NEPC certificate for international trade."}
                {service.name === 'Copyright' && "Legal protection for your creative works."}
                {service.name === 'Annual Returns' && "Keep your status active and avoid CAC penalties."}
                </p>
                
                <div className="flex flex-col mb-8">
                {service.old_price && (
                    <span className="text-slate-300 line-through text-sm italic font-bold">
                    ₦{parseInt(service.old_price).toLocaleString()}
                    </span>
                )}
                <span className="text-4xl font-black text-cac-green tracking-tighter">
                    ₦{parseInt(service.price).toLocaleString()}
                </span>
                </div>

                {/* We use the fixed 'linkName' here */}
                <Link to={`/register/${linkName}`} className="block">
                <button className="flex items-center justify-between w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black group-hover:bg-cac-green transition-all duration-300 shadow-lg active:scale-95">
                    <span className="uppercase text-sm tracking-widest">Register Now</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
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