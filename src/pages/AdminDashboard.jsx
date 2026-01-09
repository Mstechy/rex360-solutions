import React, { useState, useEffect } from 'react';
import { 
  Edit3, Trash2, Camera, DollarSign, Newspaper, Layout, 
  Check, Upload, Loader, Image as ImageIcon, X 
} from 'lucide-react';
import { supabase } from '../SupabaseClient';

// ==========================================
//  COMPONENT 1: SERVICES MANAGER
// ==========================================
const ServicesManager = ({ services, fetchData }) => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  const save = async () => {
    await supabase.from('services').update({ 
      name: formData.name, price: formData.price, old_price: formData.old_price 
    }).eq('id', editId);
    setEditId(null); fetchData(); alert("Service Updated!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs uppercase font-black text-slate-400">
          <tr><th className="p-4">Name</th><th className="p-4">Old Price</th><th className="p-4">New Price</th><th className="p-4">Edit</th></tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} className="border-b hover:bg-slate-50">
              {editId === s.id ? (
                <>
                  <td className="p-4"><input className="border p-2 rounded w-full font-bold bg-yellow-50" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}/></td>
                  <td className="p-4"><input className="border p-2 rounded w-20 bg-yellow-50" value={formData.old_price} onChange={e=>setFormData({...formData, old_price: e.target.value})}/></td>
                  <td className="p-4"><input className="border p-2 rounded w-20 font-bold text-green-600 bg-yellow-50" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})}/></td>
                  <td className="p-4 flex gap-2">
                      <button onClick={save} className="bg-green-100 text-green-600 p-2 rounded"><Check size={16}/></button>
                      <button onClick={()=>setEditId(null)} className="bg-red-100 text-red-600 p-2 rounded"><X size={16}/></button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-4 font-bold">{s.name}</td>
                  <td className="p-4 line-through text-slate-400">₦{parseInt(s.old_price).toLocaleString()}</td>
                  <td className="p-4 font-black text-green-600">₦{parseInt(s.price).toLocaleString()}</td>
                  <td className="p-4"><button onClick={()=>{setEditId(s.id); setFormData(s)}} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit3 size={16}/></button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================
//  COMPONENT 2: NEWS MANAGER
// ==========================================
const NewsManager = ({ news, fetchData }) => {
  return (
      <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={async(e)=>{
              e.preventDefault();
              await supabase.from('news').insert([{title: e.target.title.value, content: e.target.content.value, date: new Date().toISOString().split('T')[0]}]);
              e.target.reset(); fetchData(); alert("News Posted!");
          }} className="bg-white p-6 rounded-xl border shadow-sm h-fit">
              <h3 className="font-bold text-sm uppercase mb-4 text-slate-400">Post Update</h3>
              <input name="title" placeholder="Headline" className="w-full border p-3 mb-4 rounded font-bold" required/>
              <textarea name="content" placeholder="Details..." className="w-full border p-3 mb-4 rounded h-32" required/>
              <button className="w-full bg-cac-blue text-white py-3 rounded font-bold hover:bg-cac-green transition-all">PUBLISH NOW</button>
          </form>

          <div className="space-y-4">
              {news.length === 0 && <p className="text-slate-400">No news updates yet.</p>}
              {news.map(p=>(
                  <div key={p.id} className="bg-white p-5 rounded-xl border shadow-sm flex justify-between group hover:border-cac-blue">
                      <div>
                          <span className="text-[10px] font-black text-cac-green">{p.date}</span>
                          <h4 className="font-bold text-slate-800">{p.title}</h4>
                      </div>
                      <button onClick={async()=>{if(window.confirm("Delete?")){await supabase.from('news').delete().eq('id', p.id); fetchData();}}} className="text-red-300 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                  </div>
              ))}
          </div>
      </div>
  );
};

// ==========================================
//  COMPONENT 3: SLIDES MANAGER (FIXED STATE)
// ==========================================
const SlidesManager = ({ slides, fetchData, handleUpload, uploadingId }) => {
  // This state is now safe inside its own stable component
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', image_url: '' });

  const addSlide = async () => {
      if(!newSlide.image_url) return alert("You must upload an image first!");
      await supabase.from('hero_slides').insert([newSlide]);
      setNewSlide({ title: '', subtitle: '', image_url: '' }); 
      fetchData();
      alert("Slide Published!");
  };

  return (
    <div className="space-y-8">
      {/* ADD NEW */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-sm uppercase mb-6 text-cac-blue">1. Add New Homepage Banner</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Main Title</label>
                  <input className="w-full border p-3 rounded font-bold" value={newSlide.title} onChange={e=>setNewSlide({...newSlide, title: e.target.value})} placeholder="e.g. Fast Registration"/>
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Subtitle</label>
                  <input className="w-full border p-3 rounded" value={newSlide.subtitle} onChange={e=>setNewSlide({...newSlide, subtitle: e.target.value})} placeholder="e.g. We help you..."/>
              </div>
          </div>

          {/* IMAGE UPLOAD PREVIEW */}
          <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 mb-2 block">Background Image</label>
              {newSlide.image_url ? (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-green-500 bg-slate-100">
                      <img src={newSlide.image_url} className="w-full h-full object-cover"/>
                      <button onClick={()=>setNewSlide({...newSlide, image_url: ''})} className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Change Image</button>
                  </div>
              ) : (
                  <label className="block border-2 border-dashed border-slate-300 p-8 text-center cursor-pointer hover:bg-slate-50 rounded-lg">
                      {uploadingId === 'slide-upload' ? (
                          <span className="flex justify-center text-cac-blue font-bold"><Loader className="animate-spin mr-2"/> Uploading...</span>
                      ) : (
                          <>
                              <ImageIcon className="mx-auto text-slate-300 mb-2" size={32}/>
                              <span className="text-xs font-bold text-slate-400">Click to Upload Background</span>
                          </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={async(e)=>{
                          const url = await handleUpload(e.target.files[0], 'slide-upload');
                          if(url) setNewSlide({...newSlide, image_url: url});
                      }}/>
                  </label>
              )}
          </div>

          <button onClick={addSlide} disabled={!newSlide.image_url} className="w-full bg-cac-blue text-white py-4 rounded-lg font-black disabled:opacity-50 hover:bg-cac-green transition-all shadow-lg">
              PUBLISH SLIDE
          </button>
      </div>

      {/* LIST */}
      <h3 className="font-bold text-sm uppercase text-slate-400">Active Slides</h3>
      <div className="grid md:grid-cols-2 gap-6">
          {slides.map(s => (
              <div key={s.id} className="bg-white p-2 rounded-xl border relative h-48 group overflow-hidden shadow-sm">
                  <img src={s.image_url} className="absolute inset-0 w-full h-full object-cover" onError={(e)=>{e.target.src='https://via.placeholder.com/400'}}/>
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="relative z-10 p-6 text-white h-full flex flex-col justify-center text-center">
                      <h4 className="font-black text-2xl mb-2">{s.title}</h4>
                      <p className="text-sm font-medium opacity-90">{s.subtitle}</p>
                  </div>
                  <button onClick={async()=>{if(window.confirm("Delete Slide?")){await supabase.from('hero_slides').delete().eq('id', s.id); fetchData();}}} className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full z-20 hover:scale-110 shadow-lg">
                      <Trash2 size={16}/>
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
};

// ==========================================
//  COMPONENT 4: ASSETS MANAGER
// ==========================================
const AssetsManager = ({ assets, fetchData, handleUpload, uploadingId }) => {
  return (
      <div className="grid md:grid-cols-2 gap-8">
          {assets.map(asset => (
              <div key={asset.key} className="bg-white p-8 rounded-2xl border text-center relative shadow-md">
                  <h3 className="font-bold uppercase mb-6 text-xs tracking-widest text-slate-400">{asset.label}</h3>
                  
                  <div className="w-48 h-48 mx-auto bg-slate-100 rounded-full overflow-hidden mb-8 border-4 border-slate-50 shadow-inner relative">
                      {asset.image_url ? (
                          <img src={asset.image_url} className="w-full h-full object-cover" key={Date.now()} />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                      )}
                  </div>

                  <label className={`cursor-pointer w-full py-4 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${uploadingId === asset.key ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white hover:bg-cac-blue'}`}>
                      {uploadingId === asset.key ? <Loader className="animate-spin" size={16}/> : <Upload size={16}/>}
                      {uploadingId === asset.key ? 'Uploading...' : 'Upload New Photo'}
                      
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const url = await handleUpload(e.target.files[0], asset.key);
                          if(url) {
                              await supabase.from('site_assets').update({image_url: url}).eq('key', asset.key);
                              fetchData(); alert("Image Updated!");
                          }
                      }}/>
                  </label>
              </div>
          ))}
      </div>
  );
};

// ==========================================
//  MAIN ADMIN DASHBOARD (PARENT)
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('slides'); // Default to Slides to test
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  // DATA STATE
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: s } = await supabase.from('services').select('*').order('id');
    const { data: n } = await supabase.from('news').select('*').order('id', { ascending: false });
    const { data: sl } = await supabase.from('hero_slides').select('*').order('id');
    const { data: a } = await supabase.from('site_assets').select('*');
    
    if(s) setServices(s);
    if(n) setNews(n);
    if(sl) setSlides(sl);
    if(a) setAssets(a);
    setLoading(false);
  };

  const handleUpload = async (file, contextId) => {
    if (!file) return null;
    setUploadingId(contextId);

    try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
        const fileName = `${Date.now()}_${cleanName}`;
        
        const { error } = await supabase.storage.from('images').upload(fileName, file);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <div className="w-full md:w-72 bg-cac-blue text-white p-6 flex flex-col shadow-2xl z-10">
        <div className="mb-10 text-center">
            <div className="w-12 h-12 bg-cac-green rounded-lg mx-auto mb-3 flex items-center justify-center font-black text-xl">R</div>
            <h2 className="font-black text-lg">REX360 ADMIN</h2>
        </div>
        <nav className="space-y-2 flex-grow">
            <button onClick={()=>setActiveTab('slides')} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab==='slides'?'bg-white text-cac-blue shadow-lg':'hover:bg-white/10'}`}>
                <Layout size={20}/> Hero Slides
            </button>
            <button onClick={()=>setActiveTab('services')} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab==='services'?'bg-white text-cac-blue shadow-lg':'hover:bg-white/10'}`}>
                <DollarSign size={20}/> Services
            </button>
            <button onClick={()=>setActiveTab('news')} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab==='news'?'bg-white text-cac-blue shadow-lg':'hover:bg-white/10'}`}>
                <Newspaper size={20}/> News
            </button>
            <button onClick={()=>setActiveTab('assets')} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab==='assets'?'bg-white text-cac-blue shadow-lg':'hover:bg-white/10'}`}>
                <Camera size={20}/> Site Assets
            </button>
        </nav>
      </div>

      <div className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-black uppercase text-cac-blue tracking-tighter">{activeTab} Manager</h1>
            {loading && <span className="text-xs font-bold text-cac-green flex items-center gap-2"><Loader className="animate-spin" size={14}/> Loading Data...</span>}
        </header>

        {activeTab === 'services' && <ServicesManager services={services} fetchData={fetchData} />}
        {activeTab === 'news' && <NewsManager news={news} fetchData={fetchData} />}
        {activeTab === 'slides' && <SlidesManager slides={slides} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
        {activeTab === 'assets' && <AssetsManager assets={assets} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
      </div>
    </div>
  );
};

export default AdminDashboard;