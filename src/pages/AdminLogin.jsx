import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../SupabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If a valid session already exists, skip straight to the dashboard.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data?.session) {
        navigate('/admin/dashboard', { replace: true });
      }
    });
    return () => { active = false; };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // A real Supabase session is REQUIRED here. The dashboard reads the
    // registrations table through RLS policies that only admit the
    // `authenticated` role, so a fake client-side check would leave the
    // query running as `anon` and silently return zero rows.
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      // Keep the on-screen copy deliberately vague (never disclose whether the
      // email exists), but surface the REAL Supabase code in devtools — the
      // two cases look identical to the user and are very different fixes:
      //   invalid_credentials -> no such Auth user, OR wrong password
      //   email_not_confirmed -> user exists but was never confirmed
      //   over_request_rate_limit / provider_* -> Supabase-side config
      console.error(
        '[admin-login] Supabase rejected sign-in:',
        JSON.stringify({ status: authError.status, code: authError.code, message: authError.message })
      );
      setError('Invalid email or password.');
      return;
    }

    navigate('/admin/dashboard', { replace: true });
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
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl" role="alert">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-xs font-black text-slate-500 uppercase tracking-widest">Admin Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                id="admin-email"
                type="email"
                autoComplete="username" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-cac-blue font-bold text-slate-700" 
                /* Neutral on purpose: a fake example address here (the old
                   "admin@company.com") reads like a real login and sends people
                   chasing a password problem when the email is what's wrong. */
                placeholder="Enter admin email" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-xs font-black text-slate-500 uppercase tracking-widest">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                id="admin-password"
                type="password"
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-cac-blue font-bold text-slate-700" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cac-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cac-green transition-all shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" /> Verifying...
              </>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;