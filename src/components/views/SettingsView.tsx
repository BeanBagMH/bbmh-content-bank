import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Database, Globe } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';
import { cn } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const { currentProfile, updateProfile } = useContentStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        full_name: currentProfile.full_name || '',
        email: currentProfile.email || '',
        role: currentProfile.role || '',
        avatar_url: currentProfile.avatar_url || ''
      });
    }
  }, [currentProfile]);

  const handleSave = async () => {
    if (!currentProfile) return;
    try {
      await updateProfile(currentProfile.id, formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="space-y-12 pb-24 lg:pb-0">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Setup & Preferences</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">System Configuration & Workspace Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation for settings */}
        <div className="md:col-span-1 space-y-2">
           {['Profile', 'Security', 'Notifications', 'Integrations', 'Workspace'].map((tab) => (
             <SettingsNavItem 
               key={tab}
               icon={tab === 'Profile' ? User : tab === 'Security' ? Shield : tab === 'Notifications' ? Bell : tab === 'Integrations' ? Database : Globe} 
               label={tab} 
               isActive={activeTab === tab} 
               onClick={() => setActiveTab(tab)}
             />
           ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-12">
           {activeTab === 'Profile' ? (
             <section className="bg-white border border-mist p-10 rounded-[32px] space-y-10 shadow-sm">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-full bg-light-grey flex items-center justify-center text-2xl font-display font-black text-ash/30 border-2 border-white shadow-xl overflow-hidden">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.full_name.split(' ').map(n => n[0]).join('')
                      )}
                   </div>
                   <div>
                      <h3 className="text-2xl font-display font-bold text-dark">{formData.full_name || 'Guest User'}</h3>
                      <p className="text-ash/60 text-sm font-medium">{formData.role || 'Member'}</p>
                   </div>
                   <button 
                     onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                     className="ml-auto bg-dark text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan transition-all"
                   >
                     {isEditing ? 'Save Changes' : 'Edit Profile'}
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 border-t border-mist/40">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email"
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Role</label>
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Avatar URL</label>
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all" 
                      />
                   </div>
                </div>
             </section>
           ) : (
             <section className="bg-white border border-mist p-20 rounded-[32px] text-center space-y-4">
                <h3 className="text-2xl font-display font-bold text-dark">{activeTab} Settings</h3>
                <p className="text-ash/40 text-sm">This module is coming soon in Phase 6.</p>
             </section>
           )}

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

const SettingsNavItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold text-[13px]",
      isActive ? "bg-dark text-white shadow-lg shadow-dark/10" : "text-ash/60 hover:bg-light-grey hover:text-dark"
    )}
  >
    <Icon size={18} className={isActive ? "text-cyan" : ""} />
    <span>{label}</span>
  </button>
);
