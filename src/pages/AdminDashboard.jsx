import React, { useState, useEffect } from 'react';
import { 
  Edit3, Trash2, Camera, DollarSign, Newspaper, Layout, 
  Check, Loader, Image as ImageIcon, X, FileText, Eye, Menu 
} from 'lucide-react';
import { supabase } from '../SupabaseClient';

// — HELPER: FAST IMAGE COMPRESSOR —
const compressImage = (file, maxWidth = 1600) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.75); 
      };
    };
  });
};

//  1. CLIENT ORDERS MANAGER
const OrdersManager = ({ registrations }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] md:text-xs uppercase font-black text-slate-400">
            <tr>
              <th className="p-2 md:p-4">Date</th>
              <th className="p-2 md:p-4">Client</th>
              <th className="p-4 hidden md:table-cell">Service</th>
              <th className="p-2 md:p-4">Amount</th>
              <th className="p-2 md:p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2 md:p-4 text-xs md:text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-2 md:p-4 font-bold text-xs md:text-base text-slate-800">{order.surname}</td>
                <td className="p-4 hidden md:table-cell"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{order.service_type}</span></td>
                <td className="p-2 md:p-4 font-black text-xs md:text-base text-green-600">₦{parseInt(order.amount).toLocaleString()}</td>
                <td className="p-2 md:p-4">
                  <button onClick={() => setSelectedOrder(order)} className="bg-slate-900 text-white px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold hover:bg-green-600 flex items-center gap-1">
                    <Eye size={12} /> <span className="hidden md:inline">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 md:p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-sm md:text-lg font-black uppercase">Registration Data</h3>
              <button onClick={() => setSelectedOrder(null)} className="hover:text-red-400"><X size={20} /></button>
            </div>
            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4 bg-slate-50 p-3 md:p-4 rounded-lg md:rounded-xl border">
                <div><p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Service</p><p className="font-black text-sm md:text-lg">{selectedOrder.service_type}</p></div>
                <div className="text-right"><p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Paid</p><p className="font-black text-sm md:text-lg text-green-600">₦{parseInt(selectedOrder.amount).toLocaleString()}</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {Object.entries(selectedOrder.full_details || {}).map(([key, value]) => (
                  <div key={key} className="p-2.5 md:p-3 border rounded-lg bg-white">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                    <p className="text-xs md:text-sm font-bold text-slate-700 break-words">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//  2. SERVICES MANAGER
const ServicesManager = ({ services, fetchData }) => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const save = async () => {
    await supabase.from('services').update({ name: formData.name, price: formData.price, old_price: formData.old_price }).eq('id', editId);
    setEditId(null); fetchData(); alert("Service Updated!");
  };
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] md:text-xs uppercase font-black text-slate-400">
            <tr><th className="p-2 md:p-4">Name</th><th className="p-2 md:p-4">Old Price</th><th className="p-2 md:p-4">New Price</th><th className="p-2 md:p-4">Edit</th></tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                {editId === s.id ? (
                  <>
                    <td className="p-2 md:p-4"><input className="border p-1.5 md:p-2 rounded w-full text-xs md:text-base font-bold bg-yellow-50" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/></td>
                    <td className="p-2 md:p-4"><input className="border p-1.5 md:p-2 rounded w-16 md:w-20 text-xs md:text-base bg-yellow-50" value={formData.old_price} onChange={e=>setFormData({...formData, old_price: e.target.value})}/></td>
                    <td className="p-2 md:p-4"><input className="border p-1.5 md:p-2 rounded w-16 md:w-20 text-xs md:text-base font-bold text-green-600 bg-yellow-50" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})}/></td>
                    <td className="p-2 md:p-4 flex gap-1 md:gap-2">
                      <button onClick={save} className="bg-green-100 text-green-600 p-1.5 md:p-2 rounded"><Check size={14} /></button>
                      <button onClick={()=>setEditId(null)} className="bg-red-100 text-red-600 p-1.5 md:p-2 rounded"><X size={14} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 md:p-4 font-bold text-xs md:text-base">{s.name}</td>
                    <td className="p-2 md:p-4 line-through text-xs md:text-base text-slate-400">₦{parseInt(s.old_price).toLocaleString()}</td>
                    <td className="p-2 md:p-4 font-black text-xs md:text-base text-green-600">₦{parseInt(s.price).toLocaleString()}</td>
                    <td className="p-2 md:p-4"><button onClick={()=>{setEditId(s.id); setFormData(s)}} className="text-blue-500 hover:bg-blue-50 p-1.5 md:p-2 rounded"><Edit3 size={14} /></button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

//  3. NEWS MANAGER
const NewsManager = ({ news, fetchData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('news').insert([{title, content, date: new Date().toISOString().split('T')[0]}]);
    setTitle(''); setContent(''); fetchData(); alert("News Posted!");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm h-fit">
        <h3 className="font-bold text-xs md:text-sm uppercase mb-3 md:mb-4 text-slate-400">Post Update</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline" className="w-full border p-2 md:p-3 mb-3 md:mb-4 text-sm md:text-base rounded font-bold" required/>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Details..." className="w-full border p-2 md:p-3 mb-3 md:mb-4 text-sm md:text-base rounded h-24 md:h-32" required/>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded text-sm md:text-base font-bold hover:bg-green-600 transition-all">PUBLISH NOW</button>
      </div>
      <div className="space-y-3 md:space-y-4">
        {news.map(p=>(
          <div key={p.id} className="bg-white p-4 md:p-5 rounded-xl border shadow-sm flex justify-between group hover:border-blue-600">
            <div><span className="text-[9px] md:text-[10px] font-black text-green-600">{p.date}</span><h4 className="font-bold text-sm md:text-base text-slate-800">{p.title}</h4></div>
            <button onClick={async()=>{if(window.confirm("Delete?")){await supabase.from('news').delete().eq('id', p.id); fetchData();}}} className="text-red-300 hover:text-red-600 p-1.5 md:p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

//  4. HERO SLIDES MANAGER
const SlidesManager = ({ slides, fetchData, handleUpload, uploadingId }) => {
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', image_url: '' });
  const addSlide = async () => {
    if(!newSlide.image_url) return alert("Please upload an image first!");
    const { error } = await supabase.from('hero_slides').insert([newSlide]);
    if(!error) { setNewSlide({ title: '', subtitle: '', image_url: '' }); fetchData(); alert("Slide Published!"); }
  };
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-xs md:text-sm uppercase mb-4 md:mb-6 text-slate-400 tracking-wider">New Banner Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <input className="border p-2 rounded-lg text-xs md:text-sm font-bold bg-slate-50" value={newSlide.title} onChange={e=>setNewSlide({...newSlide, title: e.target.value})} placeholder="Heading"/>
          <input className="border p-2 rounded-lg text-xs md:text-sm bg-slate-50" value={newSlide.subtitle} onChange={e=>setNewSlide({...newSlide, subtitle: e.target.value})} placeholder="Subtitle"/>
        </div>
        <div className="mb-4">
          {newSlide.image_url ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
              <img src={newSlide.image_url} className="w-full h-full object-contain" alt="preview"/>
              <button onClick={()=>setNewSlide({...newSlide, image_url: ''})} className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full"><X size={16}/></button>
            </div>
          ) : (
            <label className="border-2 border-dashed aspect-video flex flex-col items-center justify-center cursor-pointer rounded-xl">
              <ImageIcon size={24} className="text-slate-400 mb-2"/>
              <span className="text-xs font-bold text-slate-500">{uploadingId === 'slide-upload' ? 'Uploading...' : 'Click to upload banner'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={async(e)=>{
                const url = await handleUpload(e.target.files[0], 'slide-upload');
                if(url) setNewSlide({...newSlide, image_url: url});
              }}/>
            </label>
          )}
        </div>
        <button onClick={addSlide} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-black text-xs uppercase">Publish</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slides.map(s => (
          <div key={s.id} className="relative aspect-video border rounded-xl overflow-hidden">
            <img src={s.image_url} className="w-full h-full object-cover" alt="slide"/>
            <button onClick={async()=>{if(window.confirm("Delete?")){await supabase.from('hero_slides').delete().eq('id', s.id); fetchData();}}} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

//  5. ASSETS MANAGER (FIXED)
const AssetsManager = ({ assets, fetchData, handleUpload, uploadingId }) => {
  // STRICT KEYS: Matches AgentIntro.jsx and NigeriaSymbol.jsx
  const assetSettings = [
    { key: 'agent_photo', label: 'Doris Profile Photo' },
    { key: 'oat_seal', label: 'Nigeria Accreditation Seal' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {assetSettings.map((item) => {
        const assetData = assets.find(a => a.key === item.key) || {};
        
        return (
          <div key={item.key} className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm text-center flex flex-col items-center">
            <h4 className="font-bold text-[10px] uppercase text-slate-400 mb-6 tracking-widest">{item.label}</h4>
            
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 bg-slate-50">
              <img 
                src={assetData.image_url || 'https://placehold.co/400x400?text=Upload+Asset'} 
                className={`w-full h-full object-cover ${uploadingId === item.key ? 'opacity-30 animate-pulse' : ''}`} 
                alt={item.label}
              />
            </div>

            <label className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[10px] md:text-xs cursor-pointer block hover:bg-green-600 transition-all shadow-lg uppercase">
              {uploadingId === item.key ? 'CONNECTING...' : 'REPLACE PHOTO'}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // 1. Upload to storage bucket
                  const newUrl = await handleUpload(file, item.key);

                  if (newUrl) {
                    // 2. Update the exact key and image_url column
                    const { error } = await supabase
                      .from('site_assets')
                      .update({ image_url: newUrl }) 
                      .eq('key', item.key);

                    if (error) {
                      alert("Backend Error: " + error.message);
                    } else {
                      await fetchData();
                      alert(`✅ ${item.label} connected to backend!`);
                    }
                  }
                }}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
};

//  MAIN ADMIN DASHBOARD
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [data, setData] = useState({ registrations: [], services: [], news: [], slides: [], assets: [] });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [r, s, n, sl, a] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('id'),
      supabase.from('news').select('*').order('id', { ascending: false }),
      supabase.from('hero_slides').select('*').order('id'),
      supabase.from('site_assets').select('*')
    ]);
    setData({ registrations: r.data||[], services: s.data||[], news: n.data||[], slides: sl.data||[], assets: a.data||[] });
    setLoading(false);
  };

  const handleUpload = async (file, contextId) => {
    if (!file) return null;
    setUploadingId(contextId);
    try {
      const optimizedFile = await compressImage(file, contextId === 'slide-upload' ? 1600 : 800);
      const fileName = `${Date.now()}_${contextId}.jpg`;
      const { error } = await supabase.storage.from('images').upload(fileName, optimizedFile);
      if (error) throw error;
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setUploadingId(null);
      return data.publicUrl;
    } catch (error) {
      alert("Upload Failed: " + error.message);
      setUploadingId(null);
      return null;
    }
  };

  const tabs = [
    { id: 'orders', icon: <FileText size={18}/>, label: 'Orders' },
    { id: 'slides', icon: <Layout size={18}/>, label: 'Slides' },
    { id: 'services', icon: <DollarSign size={18}/>, label: 'Prices' },
    { id: 'news', icon: <Newspaper size={18}/>, label: 'News' },
    { id: 'assets', icon: <Camera size={18}/>, label: 'Assets' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <h2 className="font-black text-base uppercase text-white">REX360 Admin</h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white"><Menu size={24} /></button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-blue-600 text-white w-64 h-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-4 mt-10">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => {setActiveTab(tab.id); setMobileMenuOpen(false);}} className={`w-full p-3 rounded-xl text-left font-bold flex gap-3 ${activeTab===tab.id?'bg-white text-blue-600':'hover:bg-white/10'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        <div className="hidden md:flex w-72 bg-blue-600 text-white p-6 flex-col min-h-screen sticky top-0">
          <h2 className="font-black text-xl uppercase mb-10 text-center">REX360 Admin</h2>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab===tab.id?'bg-white text-blue-600 shadow-lg':'hover:bg-white/10'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-grow p-4 md:p-8">
          <header className="flex justify-between items-center mb-8 border-b pb-6">
            <h1 className="text-xl md:text-3xl font-black uppercase text-blue-600">{activeTab} Manager</h1>
            {loading && <Loader className="animate-spin text-green-600" size={20} />}
          </header>
          {activeTab === 'orders' && <OrdersManager registrations={data.registrations} />}
          {activeTab === 'services' && <ServicesManager services={data.services} fetchData={fetchData} />}
          {activeTab === 'news' && <NewsManager news={data.news} fetchData={fetchData} />}
          {activeTab === 'slides' && <SlidesManager slides={data.slides} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
          {activeTab === 'assets' && <AssetsManager assets={data.assets} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;