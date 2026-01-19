import React, { useState, useEffect } from 'react';
import { 
  Edit3, Trash2, Camera, DollarSign, Newspaper, Layout, 
  Check, Upload, Loader, Image as ImageIcon, X, FileText, Eye 
} from 'lucide-react';
import { supabase } from '../SupabaseClient';

// --- HELPER: FAST IMAGE COMPRESSOR (Optimized for Speed & Sharpness) ---
const compressImage = (file, maxWidth = 1600) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
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
        
        // High-speed smoothing settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          // Optimized for web at 0.75 quality
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.75); 
      };
    };
  });
};

// ==========================================
//  1. CLIENT ORDERS MANAGER
// ==========================================
const OrdersManager = ({ registrations }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase font-black text-slate-400">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Client</th>
              <th className="p-4">Service</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-slate-800">{order.surname} {order.firstname}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{order.service_type}</span></td>
                <td className="p-4 font-black text-green-600">₦{parseInt(order.amount).toLocaleString()}</td>
                <td className="p-4">
                  <button onClick={() => setSelectedOrder(order)} className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600 flex items-center gap-1">
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0">
              <h3 className="text-lg font-black uppercase">Registration Data</h3>
              <button onClick={() => setSelectedOrder(null)} className="hover:text-red-400"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Service</p><p className="font-black text-lg">{selectedOrder.service_type}</p></div>
                    <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Paid</p><p className="font-black text-lg text-green-600">₦{parseInt(selectedOrder.amount).toLocaleString()}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedOrder.full_details || {}).map(([key, value]) => (
                        <div key={key} className="p-3 border rounded-lg bg-white">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-bold text-slate-700 break-words">{value || 'N/A'}</p>
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

// ==========================================
//  2. SERVICES MANAGER
// ==========================================
const ServicesManager = ({ services, fetchData }) => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const save = async () => {
    await supabase.from('services').update({ name: formData.name, price: formData.price, old_price: formData.old_price }).eq('id', editId);
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
//  3. NEWS MANAGER
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
        {news.map(p=>(
          <div key={p.id} className="bg-white p-5 rounded-xl border shadow-sm flex justify-between group hover:border-cac-blue">
            <div><span className="text-[10px] font-black text-cac-green">{p.date}</span><h4 className="font-bold text-slate-800">{p.title}</h4></div>
            <button onClick={async()=>{if(window.confirm("Delete?")){await supabase.from('news').delete().eq('id', p.id); fetchData();}}} className="text-red-300 hover:text-red-600 p-2"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
//  4. HERO SLIDES MANAGER (With Full Body 16:9 Placeholder)
// ==========================================
const SlidesManager = ({ slides, fetchData, handleUpload, uploadingId }) => {
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', image_url: '' });

  const addSlide = async () => {
    if(!newSlide.image_url) return alert("Please upload an image first!");
    const { error } = await supabase.from('hero_slides').insert([newSlide]);
    if(!error) {
      setNewSlide({ title: '', subtitle: '', image_url: '' });
      fetchData();
      alert("Slide Published!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-4xl">
        <h3 className="font-bold text-sm uppercase mb-6 text-slate-400 tracking-wider">New Banner Settings</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Heading</label>
            <input className="w-full border p-2.5 rounded-lg text-sm font-bold bg-slate-50 focus:bg-white outline-none transition-all" value={newSlide.title} onChange={e=>setNewSlide({...newSlide, title: e.target.value})} placeholder="e.g. Fast CAC Registration"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Subtitle</label>
            <input className="w-full border p-2.5 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none transition-all" value={newSlide.subtitle} onChange={e=>setNewSlide({...newSlide, subtitle: e.target.value})} placeholder="e.g. Registered in record time"/>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Banner Image Preview (Full Body 16:9)</label>
          
          <div className="max-w-[500px]"> 
            {newSlide.image_url ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-900 group">
                {/* Full Body View inside Placeholder */}
                <img src={newSlide.image_url} className="w-full h-full object-contain relative z-10" alt="preview"/>
                {/* Blurred Background to fill corners */}
                <img src={newSlide.image_url} className="absolute inset-0 w-full h-full object-cover blur-md opacity-30" alt="blur-bg"/>
                
                <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={()=>setNewSlide({...newSlide, image_url: ''})} className="bg-white text-red-600 px-4 py-2 rounded-full text-xs font-black shadow-xl">REMOVE</button>
                </div>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-slate-200 aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-cac-blue hover:bg-slate-50 rounded-xl transition-all group">
                {uploadingId === 'slide-upload' ? (
                  <div className="flex flex-col items-center">
                    <Loader className="animate-spin text-cac-blue mb-2" size={24}/>
                    <span className="text-[10px] font-bold text-cac-blue uppercase tracking-widest">Compressing & Uploading...</span>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="bg-slate-100 p-3 rounded-full inline-block mb-2 group-hover:bg-cac-blue group-hover:text-white transition-colors">
                      <ImageIcon size={24}/>
                    </div>
                    <p className="text-xs font-bold text-slate-500">Click to upload full banner</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={async(e)=>{
                  const file = e.target.files[0];
                  if(file) {
                    const url = await handleUpload(file, 'slide-upload'); 
                    if(url) setNewSlide({...newSlide, image_url: url});
                  }
                }}/>
              </label>
            )}
          </div>
        </div>

        <button onClick={addSlide} disabled={!newSlide.image_url} className="bg-cac-blue text-white px-8 py-3 rounded-lg font-black text-xs uppercase shadow-lg hover:bg-slate-900 disabled:bg-slate-200 transition-all">
          Publish to Slider
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Live Homepage Slides</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map(s => (
            <div key={s.id} className="bg-white p-2 rounded-xl border relative aspect-video group overflow-hidden shadow-sm hover:border-cac-blue transition-all">
              <img src={s.image_url} className="w-full h-full object-contain rounded-lg relative z-10" alt="slide"/>
              <img src={s.image_url} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-20" alt="bg"/>
              <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <button onClick={async()=>{if(window.confirm("Delete Slide?")){await supabase.from('hero_slides').delete().eq('id', s.id); fetchData();}}} className="self-end bg-red-600 text-white p-2 rounded-lg shadow-lg">
                  <Trash2 size={14}/>
                </button>
                <div className="text-white">
                  <p className="font-black text-sm truncate">{s.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
//  5. ASSETS MANAGER (Required for Dashboard)
// ==========================================
const AssetsManager = ({ assets, fetchData, handleUpload, uploadingId }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {assets.map(asset => (
      <div key={asset.id} className="bg-white p-6 rounded-xl border shadow-sm">
        <h4 className="font-bold text-xs uppercase text-slate-400 mb-4">{asset.name}</h4>
        <div className="aspect-square bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border">
           <img src={asset.url} className="w-full h-full object-contain" alt={asset.name}/>
        </div>
        <label className="w-full bg-slate-100 hover:bg-cac-blue hover:text-white py-2 rounded font-bold text-xs text-center block cursor-pointer transition-all">
          {uploadingId === asset.id ? 'UPLOADING...' : 'REPLACE IMAGE'}
          <input type="file" className="hidden" onChange={async(e)=>{
            const url = await handleUpload(e.target.files[0], asset.id);
            if(url) {
              await supabase.from('site_assets').update({ url }).eq('id', asset.id);
              fetchData();
            }
          }}/>
        </label>
      </div>
    ))}
  </div>
);

// ==========================================
//  MAIN ADMIN DASHBOARD
// ==========================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
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
      // COMPRESSION: Use 1600px for Slides, 800px for Assets/News
      const optimizedFile = await compressImage(file, contextId === 'slide-upload' ? 1600 : 800);
      const fileName = `${Date.now()}_rex360.jpg`;
      
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <div className="w-full md:w-72 bg-cac-blue text-white p-6 flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-cac-green rounded-lg mx-auto mb-3 flex items-center justify-center font-black text-xl">R</div>
          <h2 className="font-black text-lg uppercase tracking-tighter">REX360 Admin</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'orders', icon: <FileText size={20}/>, label: 'Client Orders' },
            { id: 'slides', icon: <Layout size={20}/>, label: 'Hero Slides' },
            { id: 'services', icon: <DollarSign size={20}/>, label: 'Services' },
            { id: 'news', icon: <Newspaper size={20}/>, label: 'News' },
            { id: 'assets', icon: <Camera size={20}/>, label: 'Site Assets' }
          ].map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full p-4 rounded-xl text-left font-bold flex gap-3 transition-all ${activeTab===tab.id?'bg-white text-cac-blue shadow-lg':'hover:bg-white/10'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-black uppercase text-cac-blue tracking-tighter">{activeTab} Manager</h1>
          {loading && <Loader className="animate-spin text-cac-green" size={24}/>}
        </header>
        {activeTab === 'orders' && <OrdersManager registrations={data.registrations} />}
        {activeTab === 'services' && <ServicesManager services={data.services} fetchData={fetchData} />}
        {activeTab === 'news' && <NewsManager news={data.news} fetchData={fetchData} />}
        {activeTab === 'slides' && <SlidesManager slides={data.slides} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
        {activeTab === 'assets' && <AssetsManager assets={data.assets} fetchData={fetchData} handleUpload={handleUpload} uploadingId={uploadingId} />}
      </div>
    </div>
  );
};

export default AdminDashboard;