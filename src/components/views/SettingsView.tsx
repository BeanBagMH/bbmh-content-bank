import React from 'react';
import { User, Shield, Bell, Database, Globe } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Setup & Preferences</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">System Configuration & Workspace Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation for settings */}
        <div className="md:col-span-1 space-y-2">
           <SettingsNavItem icon={User} label="Profile" isActive={true} />
           <SettingsNavItem icon={Shield} label="Security" />
           <SettingsNavItem icon={Bell} label="Notifications" />
           <SettingsNavItem icon={Database} label="Integrations" />
           <SettingsNavItem icon={Globe} label="Workspace" />
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-12">
           <section className="bg-white border border-mist p-10 rounded-[32px] space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-light-grey flex items-center justify-center text-2xl font-display font-black text-ash/30 border-2 border-white shadow-xl">MP</div>
                 <div>
                    <h3 className="text-2xl font-display font-bold text-dark">Murphy Patel</h3>
                    <p className="text-ash/60 text-sm font-medium">Head of Strategy • BeanBag Media</p>
                 </div>
                 <button className="ml-auto bg-dark text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan transition-all">Edit Profile</button>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-mist/40">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Full Name</label>
                    <div className="p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20">Murphy Patel</div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Email Address</label>
                    <div className="p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20">murphy@beanbag.media</div>
                 </div>
              </div>
           </section>

           <section className="bg-white border border-mist p-10 rounded-[32px] space-y-8">
              <h3 className="text-xl font-display font-bold text-dark">Data Management</h3>
              <p className="text-ash/60 text-sm leading-relaxed font-medium">Export your strategic data or reset the workspace environment. Warning: This action is permanent.</p>
              
              <div className="flex gap-4 pt-4">
                 <button className="flex-1 py-4 bg-light-grey rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mist transition-all">Export JSON</button>
                 <button className="flex-1 py-4 border border-red-100 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reset OS</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const SettingsNavItem = ({ icon: Icon, label, isActive }: { icon: any, label: string, isActive?: boolean }) => (
  <button className={cn(
    "w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold text-[13px]",
    isActive ? "bg-dark text-white shadow-lg shadow-dark/10" : "text-ash/60 hover:bg-light-grey hover:text-dark"
  )}>
    <Icon size={18} className={isActive ? "text-turquoise" : ""} />
    <span>{label}</span>
  </button>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
