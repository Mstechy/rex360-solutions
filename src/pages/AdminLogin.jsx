import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple check - in a real app, this connects to a database
    if (email === "info@rex360solutions.com" && password === "RexSemovita@12") {
      navigate('/admin/dashboard');
    } else {
      alert("Unauthorized Access Detected");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="bg-cac-blue p-8 text-center text-white">
          <ShieldAlert size={48} className="mx-auto mb-2 text-cac-green" />
          <h1 className="text-2xl font-black tracking-tighter uppercase">Rex360 Admin</h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Secure Management Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Admin Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-cac-blue font-bold text-slate-700" 
                /* Updated Placeholder to be generic */
                placeholder="admin@company.com" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-cac-blue font-bold text-slate-700" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-cac-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cac-green transition-all shadow-xl active:scale-95">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;