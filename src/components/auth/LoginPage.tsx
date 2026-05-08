import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#fcfaf9] selection:bg-cyan/20">
      <div className="w-full max-w-[440px] space-y-12 p-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display text-dark italic-serif leading-none">BBMh</h1>
          <div className="h-px w-12 bg-cyan mx-auto" />
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-ash/80">Strategy Archive Access</p>
          <span className="inline-block bg-cyan/10 text-cyan text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">v3.0.1 Stable</span>
        </div>

        <div className="bg-white p-10 border border-mist shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1f8e8d',
                    brandAccent: '#176b6a',
                    inputBackground: 'transparent',
                    inputText: '#252527',
                    inputPlaceholder: '#666666',
                    inputBorder: '#e2e2e2',
                    inputBorderHover: '#1f8e8d',
                    inputBorderFocus: '#1f8e8d',
                  },
                  fonts: {
                    bodyFontFamily: `'Inter', sans-serif`,
                    buttonFontFamily: `'Inter', sans-serif`,
                    inputFontFamily: `'Inter', sans-serif`,
                    labelFontFamily: `'Inter', sans-serif`,
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0px',
                    buttonBorderRadius: '0px',
                    inputBorderRadius: '0px',
                  },
                },
              },
              className: {
                button: 'w-full !bg-dark hover:!bg-cyan !transition-all !h-12 !text-[11px] !font-bold !tracking-widest !uppercase !text-white',
                container: 'space-y-6',
                label: 'text-[9px] font-bold uppercase tracking-[0.2em] text-ash/70 mb-2 block',
                input: 'w-full !bg-transparent !border-b !border-mist focus:!border-cyan !transition-all !p-3 !text-[14px]',
              }
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Professional Email',
                  password_label: 'Access Protocol',
                  button_label: 'Initialize Session',
                },
              },
            }}
          />
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
