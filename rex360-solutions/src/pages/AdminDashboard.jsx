import React, { useState, useEffect } from 'react';
import {
  Edit3, Trash2, Camera, DollarSign, Newspaper, Layout,
  Check, Loader, Image as ImageIcon, X, FileText, Eye, Menu, TrendingUp
} from 'lucide-react';
import JSZip from 'jszip';
import { supabase } from '../SupabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

// 1. CLIENT REGISTRATION MANAGER - SPECIALIZED FOR VERIFICATION DOCUMENTS
const OrdersManager = ({ registrations, fetchData }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [zipping, setZipping] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending, paid, unpaid
  const [paymentFilter, setPaymentFilter] = useState('all'); // all, paid, pending

  // Check document completeness
  const getDocumentStatus = (order) => {
    const docs = order.full_details?.uploaded_docs || {};
    const required = ['ID Card', 'Signature', 'Passport'];
    const uploaded = Object.keys(docs);
    const complete = required.every(doc => uploaded.includes(doc));
    return { complete, uploaded: uploaded.length, required: required.length };
  };

  // Filter registrations by document status AND payment status
  const filteredRegistrations = registrations.filter(reg => {
    // Document filter
    let docMatch = true;
    if (filterStatus === 'verified') docMatch = getDocumentStatus(reg).complete;
    if (filterStatus === 'pending') docMatch = !getDocumentStatus(reg).complete;
    
    // Payment filter
    let paymentMatch = true;
    if (paymentFilter === 'paid') paymentMatch = reg.payment_status === 'paid';
    if (paymentFilter === 'pending') paymentMatch = reg.payment_status !== 'paid';
    
    return docMatch && paymentMatch;
  });

  const downloadClientForm = async (client) => {
    const formData = client.full_details || {};

    // Create text file with form data
    let content = `REGISTRATION FORM - ${client.service_type}\n`;
    content += `=====================================\n\n`;
    content += `PAYMENT REFERENCE: ${client.paystack_ref}\n`;
    content += `PAYMENT STATUS: ${client.payment_status}\n`;
    content += `AMOUNT: ₦${parseInt(client.amount).toLocaleString()}\n`;
    content += `DATE: ${new Date(client.created_at).toLocaleDateString()}\n\n`;

    content += `PERSONAL INFORMATION:\n`;
    content += `---------------------\n`;
    content += `Surname: ${client.surname}\n`;
    content += `First Name: ${client.firstname}\n`;
    content += `Email: ${client.email || 'N/A'}\n`;
    content += `Phone: ${client.phone || 'N/A'}\n\n`;

    content += `BUSINESS DETAILS:\n`;
    content += `-----------------\n`;
    content += `Service Type: ${client.service_type}\n`;
    content += `Business Category: ${formData.business_category || 'N/A'}\n`;
    content += `Business Nature: ${formData.business_nature || 'N/A'}\n\n`;

    content += `ADDITIONAL FORM DATA:\n`;
    content += `---------------------\n`;
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'uploaded_docs' && key !== 'business_category' && key !== 'business_nature') {
        const displayKey = key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        content += `${displayKey}: ${value || 'N/A'}\n`;
      }
    });

    // Download as text file
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${client.surname}_${client.firstname}_Registration_Form.txt`;
    link.click();
  };

  const downloadAllAsZip = async (order) => {
    setZipping(true);
    const zip = new JSZip();
    const folder = zip.folder(`${order.surname}_${order.firstname}_Verification`);

    const docs = order.full_details?.uploaded_docs || {};
    const downloadPromises = [];

    Object.entries(docs).forEach(([docType, urls]) => {
      urls.forEach((url, index) => {
        const promise = fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const extension = url.split('.').pop().split(/\#|\?/)[0] || 'jpg';
            folder.file(`${docType}_${index + 1}.${extension}`, blob);
          });
        downloadPromises.push(promise);
      });
    });

    try {
      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${order.surname}_${order.firstname}_VerificationDocs.zip`;
      link.click();
    } catch (err) {
      alert("Error creating ZIP: " + err.message);
    } finally {
      setZipping(false);
    }
  };

  const downloadAllFormsAsZip = async () => {
    setZipping(true);
    const zip = new JSZip();

    try {
      for (const reg of filteredRegistrations) {
        const formData = reg.full_details || {};
        const clientFolder = zip.folder(`${reg.surname}_${reg.firstname}_${reg.service_type.replace(/\s+/g, '_')}`);

        // Create text file with form data
        let content = `REGISTRATION FORM - ${reg.service_type}\n`;
        content += `=====================================\n\n`;
        content += `PAYMENT REFERENCE: ${reg.paystack_ref}\n`;
        content += `PAYMENT STATUS: ${reg.payment_status}\n`;
        content += `AMOUNT: ₦${parseInt(reg.amount).toLocaleString()}\n`;
        content += `DATE: ${new Date(reg.created_at).toLocaleDateString()}\n\n`;

        content += `PERSONAL INFORMATION:\n`;
        content += `---------------------\n`;
        content += `Surname: ${reg.surname}\n`;
        content += `First Name: ${reg.firstname}\n`;
        content += `Email: ${reg.email || 'N/A'}\n`;
        content += `Phone: ${reg.phone || 'N/A'}\n\n`;

        content += `BUSINESS DETAILS:\n`;
        content += `-----------------\n`;
        content += `Service Type: ${reg.service_type}\n`;
        content += `Business Category: ${formData.business_category || 'N/A'}\n`;
        content += `Business Nature: ${formData.business_nature || 'N/A'}\n\n`;

        content += `ADDITIONAL FORM DATA:\n`;
        content += `---------------------\n`;
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'uploaded_docs' && key !== 'business_category' && key !== 'business_nature') {
            const displayKey = key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            content += `${displayKey}: ${value || 'N/A'}\n`;
          }
        });

        clientFolder.file(`Registration_Form.txt`, content);

        // Add uploaded documents
        const docs = formData.uploaded_docs || {};
        const downloadPromises = [];

        Object.entries(docs).forEach(([docType, urls]) => {
          if (Array.isArray(urls)) {
            urls.forEach((url, index) => {
              if (url && typeof url === 'string') {
                const promise = fetch(url)
                  .then(res => res.blob())
                  .then(blob => {
                    const extension = url.split('.').pop().split(/\#|\?/)[0] || 'jpg';
                    clientFolder.file(`${docType}_${index + 1}.${extension}`, blob);
                  })
                  .catch(err => console.error(`Failed to download ${docType}_${index + 1}:`, err));
                downloadPromises.push(promise);
              }
            });
          }
        });

        await Promise.all(downloadPromises);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `All_Registered_Forms_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
    } catch (err) {
      alert("Error creating forms ZIP: " + err.message);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs - Documents */}
      <div>
        <p className="text-[10px] font-black text-slate-500 mb-2 uppercase">Filter by Documents</p>
        <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl border shadow-sm mb-4">
          <button onClick={() => setFilterStatus('all')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All Clients ({registrations.length})
          </button>
          <button onClick={() => setFilterStatus('verified')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${filterStatus === 'verified' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            ✓ Verified ({registrations.filter(r => getDocumentStatus(r).complete).length})
          </button>
          <button onClick={() => setFilterStatus('pending')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${filterStatus === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            📄 Incomplete Docs ({registrations.filter(r => !getDocumentStatus(r).complete).length})
          </button>
        </div>
      </div>

      {/* Filter Tabs - Payment Status */}
      <div>
        <p className="text-[10px] font-black text-slate-500 mb-2 uppercase">Filter by Payment Status</p>
        <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl border shadow-sm mb-4">
          <button onClick={() => setPaymentFilter('all')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${paymentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All ({registrations.length})
          </button>
          <button onClick={() => setPaymentFilter('paid')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${paymentFilter === 'paid' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            ✅ Paid ({registrations.filter(r => r.payment_status === 'paid').length})
          </button>
          <button onClick={() => setPaymentFilter('pending')} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition-all ${paymentFilter === 'pending' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            ⏳ Unpaid ({registrations.filter(r => r.payment_status !== 'paid').length})
          </button>
        </div>
      </div>

      {/* Download All Forms Button */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-4">
        <button
          onClick={downloadAllFormsAsZip}
          disabled={zipping || filteredRegistrations.length === 0}
          className={`w-full px-6 py-3 rounded-lg font-black text-sm uppercase transition-all flex items-center justify-center gap-2 ${
            zipping || filteredRegistrations.length === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
          }`}
        >
          {zipping ? (
            <>
              <Loader className="animate-spin" size={16} />
              Creating ZIP...
            </>
          ) : (
            <>
              📁 Download All Forms as ZIP ({filteredRegistrations.length} forms)
            </>
          )}
        </button>
        <p className="text-[9px] text-slate-400 text-center mt-2">
          Downloads all registration forms with business category and nature details
        </p>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 text-[9px] md:text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="p-2 md:p-4">Client Name</th>
                <th className="p-2 md:p-4">Service</th>
                <th className="p-2 md:p-4">Business Category</th>
                <th className="p-2 md:p-4">Business Nature</th>
                <th className="p-2 md:p-4">Amount</th>
                <th className="p-2 md:p-4">Documents</th>
                <th className="p-2 md:p-4">Payment</th>
                <th className="p-2 md:p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg) => {
                const docStatus = getDocumentStatus(reg);
                const isPaid = reg.payment_status === 'paid';
                const businessCategory = reg.full_details?.business_category || reg.business_category || 'N/A';
                const businessNature = reg.full_details?.business_nature || reg.business_nature || 'N/A';
                return (
                  <tr key={reg.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-2 md:p-4">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{reg.surname} {reg.firstname}</p>
                        <p className="text-[9px] md:text-[10px] text-slate-400">{reg.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <p className="font-bold text-blue-600 text-xs md:text-sm">{reg.service_type}</p>
                    </td>
                    <td className="p-2 md:p-4">
                      <p className="text-xs md:text-sm font-medium text-slate-700 truncate max-w-[120px]" title={businessCategory}>
                        {businessCategory}
                      </p>
                    </td>
                    <td className="p-2 md:p-4">
                      <p className="text-xs md:text-sm font-medium text-slate-700 truncate max-w-[150px]" title={businessNature}>
                        {businessNature}
                      </p>
                    </td>
                    <td className="p-2 md:p-4">
                      <p className="font-black text-green-600 text-sm md:text-lg">₦{parseInt(reg.amount).toLocaleString()}</p>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className={`text-[10px] md:text-xs font-black px-2 py-1 rounded-full ${docStatus.complete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {docStatus.complete ? '✓ VERIFIED' : 'INCOMPLETE'}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <span className={`text-[10px] md:text-xs font-black px-2 py-1 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isPaid ? '✅ PAID' : '⏳ PENDING'}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 text-center">
                      <div className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center">
                        <button
                          onClick={() => setSelectedClient(reg)}
                          className="px-2 md:px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] md:text-xs hover:bg-blue-700 transition-all"
                        >
                          VIEW
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete ${reg.surname} ${reg.firstname}? This cannot be undone.`)) {
                              try {
                                const { error } = await supabase.from('registrations').delete().eq('id', reg.id);
                                if (error) throw error;
                                alert('✅ Registration deleted successfully');
                                await fetchData();
                              } catch (err) {
                                alert(`❌ Delete failed: ${err.message}`);
                              }
                            }
                          }}
                          className="px-2 md:px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] md:text-xs hover:bg-red-700 transition-all"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLIENT DETAIL MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex justify-between items-start sticky top-0 z-10">
              <div>
                <h3 className="text-sm md:text-lg font-black uppercase">Client Verification Details</h3>
                <p className="text-[10px] text-slate-300 font-bold mt-1">Ref: {selectedClient.paystack_ref}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadClientForm(selectedClient)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all"
                >
                  📄 Download Form
                </button>
                <button
                  onClick={() => downloadAllAsZip(selectedClient)}
                  disabled={zipping}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  {zipping ? <Loader className="animate-spin" size={12} /> : '📁'} Download Docs
                </button>
                <button onClick={() => setSelectedClient(null)} className="hover:text-red-400 transition-colors"><X size={24} /></button>
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-6">
              {/* Client Header */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</p>
                    <p className="font-black text-lg text-slate-800">{selectedClient.surname} {selectedClient.firstname}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Service</p>
                    <p className="font-black text-blue-600">{selectedClient.service_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount Paid</p>
                    <p className="font-black text-green-600 text-lg">₦{parseInt(selectedClient.amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Registration Data */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Registration Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(selectedClient.full_details || {}).map(([key, value]) => {
                    if (key === 'uploaded_docs') return null;
                    return (
                      <div key={key} className="p-3 border rounded-lg bg-slate-50 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{key.replace(/[-_]/g, ' ')}</p>
                        <p className="text-sm font-bold text-slate-800 break-words">{value || '—'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verification Documents Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Documents</h4>
                  <span className={`text-xs font-black px-2 py-1 rounded ${getDocumentStatus(selectedClient).complete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {getDocumentStatus(selectedClient).uploaded}/{getDocumentStatus(selectedClient).required}
                  </span>
                </div>
                
                {selectedClient.full_details?.uploaded_docs && Object.keys(selectedClient.full_details.uploaded_docs).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(selectedClient.full_details.uploaded_docs).map(([docType, urls]) => {
                      // Filter out empty arrays and null values
                      const validUrls = Array.isArray(urls) ? urls.filter(url => url && typeof url === 'string') : [];
                      
                      return validUrls.length > 0 ? validUrls.map((url, index) => (
                        <a 
                          key={`${docType}-${index}`} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="group block relative aspect-square border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 transition-all shadow-sm hover:shadow-lg"
                        >
                          <img 
                            src={url} 
                            alt={docType}
                            onError={(e) => {
                              console.error(`Failed to load document image: ${url}`);
                              e.target.style.display = 'none';
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-center backdrop-blur-sm">
                            <p className="text-[8px] text-white font-black uppercase">{docType}</p>
                          </div>
                        </a>
                      )) : null;
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <p className="text-slate-400 font-bold text-sm">No documents uploaded yet</p>
                  </div>
                )}
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

//  5. REVENUE MANAGER - PAYSTACK REVENUE DASHBOARD
const RevenueManager = ({ registrations }) => {
  const [resetDashboard, setResetDashboard] = useState(false);

  // Calculate revenue data
  const paidRegistrations = registrations.filter(reg => reg.payment_status === 'paid');

  // Group by date
  const revenueByDate = paidRegistrations.reduce((acc, reg) => {
    const date = new Date(reg.created_at).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = { amount: 0, count: 0 };
    acc[date].amount += parseInt(reg.amount);
    acc[date].count += 1;
    return acc;
  }, {});

  // Prepare chart data (last 30 days)
  const chartData = Object.entries(revenueByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: data.amount,
      transactions: data.count
    }));

  // Calculate totals
  const totalRevenue = paidRegistrations.reduce((sum, reg) => sum + parseInt(reg.amount), 0);
  const totalTransactions = paidRegistrations.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Today's revenue
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = revenueByDate[today]?.amount || 0;
  const todayTransactions = revenueByDate[today]?.count || 0;

  const handleResetDashboard = () => {
    if (window.confirm('Are you sure you want to reset the dashboard view? This will clear the current display but keep all transaction history in the database.')) {
      setResetDashboard(true);
      setTimeout(() => setResetDashboard(false), 100); // Temporary reset
      alert('Dashboard view has been reset. Transaction history remains intact.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Revenue</p>
              <p className="text-2xl font-black text-green-600">₦{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Transactions</p>
              <p className="text-2xl font-black text-blue-600">{totalTransactions}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Today's Revenue</p>
              <p className="text-2xl font-black text-purple-600">₦{todayRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Avg Transaction</p>
              <p className="text-2xl font-black text-orange-600">₦{Math.round(averageTransaction).toLocaleString()}</p>
            </div>
            <Check className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-4">Revenue Trend (Last 30 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `₦${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Transactions'
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Revenue Breakdown */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-4">Revenue by Service Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={
              Object.entries(
                paidRegistrations.reduce((acc, reg) => {
                  const service = reg.service_type;
                  if (!acc[service]) acc[service] = 0;
                  acc[service] += parseInt(reg.amount);
                  return acc;
                }, {})
              ).map(([service, amount]) => ({ service, amount }))
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-black text-slate-800">Recent Paystack Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 text-[9px] md:text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="p-2 md:p-4">Date</th>
                <th className="p-2 md:p-4">Client</th>
                <th className="p-2 md:p-4">Service</th>
                <th className="p-2 md:p-4">Amount</th>
                <th className="p-2 md:p-4">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidRegistrations.slice(0, 10).map((reg) => (
                <tr key={reg.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-2 md:p-4">
                    <p className="font-bold text-slate-800 text-sm">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="font-bold text-slate-800 text-sm">
                      {reg.surname} {reg.firstname}
                    </p>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="font-bold text-blue-600 text-xs md:text-sm">
                      {reg.service_type}
                    </p>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="font-black text-green-600 text-sm md:text-lg">
                      ₦{parseInt(reg.amount).toLocaleString()}
                    </p>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="text-xs font-mono text-slate-600">
                      {reg.paystack_ref}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

//  6. ASSETS MANAGER (FIXED)
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
                    // 2. Use upsert to insert if not exists, or update if exists
                    const { error } = await supabase
                      .from('site_assets')
                      .upsert({ 
                        key: item.key, 
                        image_url: newUrl 
                      }, { 
                        onConflict: 'key',
                        ignoreDuplicates: false 
                      });

                    if (error) {
                      console.error("Backend Error:", error);
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
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setConnectionStatus('connecting');
    setErrorMsg('');
    
    try {
      console.log('📡 Connecting to Supabase...');
      console.log('🔌 Supabase URL:', supabase.supabaseUrl || 'using default');
      
      // Test each table one by one for better error handling
      let r, s, n, sl, a;
      
      try {
        console.log('📋 Fetching registrations...');
        const result = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
        if (result.error) throw new Error(`Registrations: ${result.error.message}`);
        r = result;
        console.log('✅ Registrations fetched:', r.data?.length || 0);
      } catch (err) {
        console.error('❌ Registrations error:', err.message);
        throw new Error(`Registrations table error: ${err.message}`);
      }
      
      try {
        console.log('💰 Fetching services...');
        const result = await supabase.from('services').select('*').order('display_order');
        if (result.error) throw new Error(`Services: ${result.error.message}`);
        s = result;
        console.log('✅ Services fetched:', s.data?.length || 0);
      } catch (err) {
        console.error('❌ Services error:', err.message);
        throw new Error(`Services table error: ${err.message}`);
      }
      
      try {
        console.log('📰 Fetching news...');
        const result = await supabase.from('news').select('*').order('id', { ascending: false });
        if (result.error) throw new Error(`News: ${result.error.message}`);
        n = result;
        console.log('✅ News fetched:', n.data?.length || 0);
      } catch (err) {
        console.error('❌ News error:', err.message);
        throw new Error(`News table error: ${err.message}`);
      }
      
      try {
        console.log('🖼️ Fetching hero slides...');
        const result = await supabase.from('hero_slides').select('*').order('id');
        if (result.error) throw new Error(`Slides: ${result.error.message}`);
        sl = result;
        console.log('✅ Slides fetched:', sl.data?.length || 0);
      } catch (err) {
        console.error('❌ Slides error:', err.message);
        throw new Error(`Hero slides table error: ${err.message}`);
      }
      
      try {
        console.log('📦 Fetching site assets...');
        const result = await supabase.from('site_assets').select('*');
        if (result.error) throw new Error(`Assets: ${result.error.message}`);
        a = result;
        console.log('✅ Assets fetched:', a.data?.length || 0);
      } catch (err) {
        console.error('❌ Assets error:', err.message);
        throw new Error(`Site assets table error: ${err.message}`);
      }

      console.log(`✅ Supabase Connected Successfully!`);
      console.log(`📋 Registrations: ${r.data?.length || 0} clients`);
      console.log(`💰 Services: ${s.data?.length || 0} items`);
      console.log(`📰 News: ${n.data?.length || 0} posts`);
      console.log(`🖼️ Slides: ${sl.data?.length || 0} banners`);
      console.log(`📦 Assets: ${a.data?.length || 0} images`);

      setData({ 
        registrations: r.data || [], 
        services: s.data || [], 
        news: n.data || [], 
        slides: sl.data || [], 
        assets: a.data || [] 
      });
      
      setConnectionStatus('connected');
      setErrorMsg('');
    } catch (error) {
      console.error('❌ Supabase Connection Error:', error);
      console.error('Error details:', error);
      setConnectionStatus('error');
      setErrorMsg(error.message || 'Failed to connect to Supabase');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, contextId) => {
    if (!file) return null;
    setUploadingId(contextId);
    try {
      const optimizedFile = await compressImage(file, contextId === 'slide-upload' ? 1600 : 800);
      const fileName = `${Date.now()}_${contextId}.jpg`;
      
      // Upload with public read access
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, optimizedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        });
      
      if (error) throw error;
      
      // Get the public URL properly
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      const publicUrl = urlData.publicUrl;
      
      console.log('✅ Upload successful:', publicUrl);
      setUploadingId(null);
      return publicUrl;
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert("Upload Failed: " + error.message);
      setUploadingId(null);
      return null;
    }
  };

  const tabs = [
    { id: 'orders', icon: <FileText size={18}/>, label: 'Orders' },
    { id: 'revenue', icon: <TrendingUp size={18}/>, label: 'Revenue' },
    { id: 'slides', icon: <Layout size={18}/>, label: 'Slides' },
    { id: 'services', icon: <DollarSign size={18}/>, label: 'Prices' },
    { id: 'news', icon: <Newspaper size={18}/>, label: 'News' },
    { id: 'assets', icon: <Camera size={18}/>, label: 'Assets' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-blue-600 text-white w-64 h-full p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-3 mt-8">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => {setActiveTab(tab.id); setMobileMenuOpen(false);}} className={`w-full p-2.5 rounded-lg text-left font-bold flex gap-2 text-sm ${activeTab===tab.id?'bg-white text-blue-600':'hover:bg-white/10'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <div className="hidden md:flex w-64 bg-blue-600 text-white p-4 flex-col min-h-screen sticky top-0">
          <nav className="space-y-2 mt-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full p-3 rounded-lg text-left font-bold flex gap-2 text-sm transition-all ${activeTab===tab.id?'bg-white text-blue-600 shadow-lg':'hover:bg-white/10'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-grow p-3 md:p-6 w-full">
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-4 pb-3 border-b">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-blue-600 text-white rounded-lg">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-black uppercase text-blue-600">{activeTab} Manager</h1>
            <div className={`text-xs font-black px-2 py-1 rounded-full ${connectionStatus === 'connected' ? 'bg-green-100 text-green-700' : connectionStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {connectionStatus === 'connected' && '🟢'}
              {connectionStatus === 'error' && '🔴'}
              {connectionStatus === 'connecting' && '🟡'}
            </div>
          </div>

          {/* Connection Status Bar */}
          {connectionStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm font-bold text-red-700">❌ Database Connection Error</p>
              <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
              <button onClick={fetchData} className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 underline">🔄 Retry Connection</button>
            </div>
          )}

          <header className="hidden md:flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase text-blue-600">{activeTab} Manager</h1>
              <div className={`text-xs font-black px-2 py-1 rounded-full ${connectionStatus === 'connected' ? 'bg-green-100 text-green-700' : connectionStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {connectionStatus === 'connected' && '🟢 Connected'}
                {connectionStatus === 'error' && '🔴 Error'}
                {connectionStatus === 'connecting' && '🟡 Connecting...'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading && <Loader className="animate-spin text-green-600" size={18} />}
              <button onClick={fetchData} className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-all">🔄 Refresh</button>
            </div>
          </header>

          {activeTab === 'orders' && <OrdersManager registrations={data.registrations} fetchData={fetchData} />}
          {activeTab === 'revenue' && <RevenueManager registrations={data.registrations} />}
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