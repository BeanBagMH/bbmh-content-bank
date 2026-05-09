import React, { useState } from 'react';
import { toast } from '../../hooks/useToast';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // The password can be set in VITE_APP_PASSWORD or default to "bbmh2026"
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'bbmh2024';
    
    setTimeout(() => {
      if (password === correctPassword) {
        localStorage.setItem('bbmh_sanctuary_key', 'granted');
        toast.success('Sanctuary Access Granted');
        window.location.reload(); // Refresh to trigger App.tsx session check
      } else {
        toast.error('Invalid Access Protocol');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fcfaf9] selection:bg-cyan/20">
      <div className="w-full max-w-[440px] space-y-12 p-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display text-dark italic-serif leading-none">BBMh</h1>
          <div className="h-px w-12 bg-cyan mx-auto" />
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-ash/80">Strategic Sanctuary Access</p>
        </div>

        <div className="bg-white p-10 border border-mist shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ash/70 block">
                Access Protocol
              </label>
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Strategic Key"
                className="w-full bg-transparent border-b border-mist focus:border-cyan outline-none transition-all p-3 text-[14px]"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-dark hover:bg-cyan transition-all h-14 text-[11px] font-bold tracking-[0.2em] uppercase text-white shadow-xl shadow-dark/10 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
           <p className="text-[11px] leading-relaxed text-ash italic-serif font-display">
             "Access restricted to BBMh Strategic Personnel."
           </p>
        </div>
      </div>
    </div>
  );
};
