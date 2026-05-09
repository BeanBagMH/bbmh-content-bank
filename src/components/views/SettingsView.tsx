import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Database, Globe, Camera as Instagram, Video as Youtube, Users as Linkedin, Share2 as Twitter, Save, Sparkles } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';
import { cn } from '../common/Badge';
import { toast } from '../../hooks/useToast';

export const SettingsView: React.FC = () => {
  const { currentProfile, updateProfile } = useContentStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    full_name: '',
    email: '',
    role: '',
    avatar_url: '',
    instagram_handle: '',
    youtube_channel_id: '',
    linkedin_url: '',
    twitter_handle: '',
    niche: '',
    primary_platform: '',
    posting_frequency: '',
    timezone: 'UTC'
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        full_name: currentProfile.full_name || '',
        email: currentProfile.email || '',
        role: currentProfile.role || '',
        avatar_url: currentProfile.avatar_url || '',
        instagram_handle: currentProfile.instagram_handle || '',
        youtube_channel_id: currentProfile.youtube_channel_id || '',
        linkedin_url: currentProfile.linkedin_url || '',
        twitter_handle: currentProfile.twitter_handle || '',
        niche: currentProfile.niche || '',
        primary_platform: currentProfile.primary_platform || '',
        posting_frequency: currentProfile.posting_frequency || '',
        timezone: currentProfile.timezone || 'UTC'
      });
    }
  }, [currentProfile]);

  const handleSave = async () => {
    if (!currentProfile) return;
    try {
      await updateProfile(currentProfile.id, formData);
      setIsEditing(false);
      toast.success('Strategy profile updated');
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  const TABS = ['Profile', 'Integrations', 'Workspace', 'Security'];

  return (
    <div className="space-y-12 pb-40 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl lg:text-7xl font-display font-bold text-dark tracking-tighter mb-4 italic-serif">Setup & Preferences</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">System Configuration & Workspace Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
           <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 no-scrollbar border-b lg:border-none border-mist/30">
              {TABS.map((tab) => (
                <SettingsNavItem 
                  key={tab}
                  icon={tab === 'Profile' ? User : tab === 'Security' ? Shield : tab === 'Notifications' ? Bell : tab === 'Integrations' ? Database : Globe} 
                  label={tab} 
                  isActive={activeTab === tab} 
                  onClick={() => setActiveTab(tab)}
                />
              ))}
           </div>
        </div>

        <div className="lg:col-span-3 space-y-12">
           {activeTab === 'Profile' && (
              <section className="bg-white border border-mist p-8 lg:p-12 rounded-[40px] space-y-10 shadow-sm animate-in">
                 <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-light-grey flex items-center justify-center text-3xl font-display font-black text-ash/30 border-2 border-white shadow-xl overflow-hidden flex-shrink-0">
                       {formData.avatar_url ? (
                         <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         formData.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'
                       )}
                    </div>
                    <div className="flex-1">
                       <h3 className="text-3xl font-display font-bold text-dark mb-1">{formData.full_name || 'Guest User'}</h3>
                       <p className="text-ash/60 text-sm font-medium uppercase tracking-widest">{formData.role || 'Strategic Director'}</p>
                    </div>
                    <button 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={cn(
                        "md:ml-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                        isEditing ? "bg-cyan text-white shadow-lg shadow-cyan/20" : "bg-dark text-white hover:bg-cyan"
                      )}
                    >
                      {isEditing ? <Save size={14} /> : <Sparkles size={14} />}
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-mist/40">
                    <InputField label="Full Name" value={formData.full_name} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, full_name: v })} />
                    <InputField label="Email Address" value={formData.email} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                    <InputField label="Strategic Role" value={formData.role} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, role: v })} />
                    <InputField label="Avatar URL" value={formData.avatar_url} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, avatar_url: v })} />
                 </div>
              </section>
           )}

           {activeTab === 'Integrations' && (
              <section className="bg-white border border-mist p-8 lg:p-12 rounded-[40px] space-y-10 shadow-sm animate-in">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-dark">Social Profiles</h3>
                    <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.2em]">Map your content ecosystem IDs</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <SocialInput icon={Instagram} color="text-ig" label="Instagram Handle" value={formData.instagram_handle} onChange={(v: string) => setFormData({ ...formData, instagram_handle: v })} placeholder="@username" />
                       <SocialInput icon={Linkedin} color="text-blue-600" label="LinkedIn Profile Slug" value={formData.linkedin_url} onChange={(v: string) => setFormData({ ...formData, linkedin_url: v })} placeholder="your-name" />
                    </div>
                    <div className="space-y-6">
                       <SocialInput icon={Youtube} color="text-yt" label="YouTube Channel ID" value={formData.youtube_channel_id} onChange={(v: string) => setFormData({ ...formData, youtube_channel_id: v })} placeholder="UCxxx..." />
                       <SocialInput icon={Twitter} color="text-dark" label="Twitter/X Handle" value={formData.twitter_handle} onChange={(v: string) => setFormData({ ...formData, twitter_handle: v })} placeholder="@username" />
                    </div>
                 </div>
                 <div className="flex justify-end pt-4 border-t border-mist/20">
                    <button onClick={handleSave} className="bg-dark text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan transition-all">Update Profiles</button>
                 </div>
              </section>
           )}

           {activeTab === 'Workspace' && (
              <section className="bg-white border border-mist p-8 lg:p-12 rounded-[40px] space-y-10 shadow-sm animate-in">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-dark">Strategic Workspace</h3>
                    <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.2em]">Fine-tune your posting environment</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <InputField label="Content Niche" value={formData.niche} onChange={(v: string) => setFormData({ ...formData, niche: v })} placeholder="e.g. Design Education" />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Primary Platform</label>
                          <select 
                            value={formData.primary_platform}
                            onChange={(e) => setFormData({ ...formData, primary_platform: e.target.value })}
                            className="w-full p-4 bg-light-grey rounded-xl text-[13px] font-bold text-dark border border-mist/20 outline-none focus:bg-white focus:border-cyan transition-all appearance-none"
                          >
                             <option value="Instagram">Instagram</option>
                             <option value="YouTube">YouTube</option>
                             <option value="Multi-platform">Multi-platform</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Posting Frequency Goal</label>
                          <select 
                            value={formData.posting_frequency}
                            onChange={(e) => setFormData({ ...formData, posting_frequency: e.target.value })}
                            className="w-full p-4 bg-light-grey rounded-xl text-[13px] font-bold text-dark border border-mist/20 outline-none focus:bg-white focus:border-cyan transition-all appearance-none"
                          >
                             <option value="3x/week">3x per week</option>
                             <option value="5x/week">5x per week</option>
                             <option value="Daily">Daily Velocity</option>
                          </select>
                       </div>
                       <InputField label="Timezone" value={formData.timezone} onChange={(v: string) => setFormData({ ...formData, timezone: v })} placeholder="Asia/Kolkata" />
                    </div>
                 </div>
                 <div className="flex justify-end pt-4 border-t border-mist/20">
                    <button onClick={handleSave} className="bg-dark text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan transition-all">Save Workspace</button>
                 </div>
              </section>
           )}

           <section className="bg-white border border-mist p-8 lg:p-12 rounded-[40px] space-y-8 shadow-sm">
              <h3 className="text-xl font-display font-bold text-dark">Security & Session</h3>
              <p className="text-ash/60 text-sm leading-relaxed font-medium">Reset your local strategic environment or export all active data for backup.</p>
              
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                 <button 
                   onClick={() => {
                     const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString() }, null, 2)], { type: 'application/json' });
                     const a = document.createElement('a');
                     a.href = URL.createObjectURL(blob);
                     a.download = 'bbmh-strategy-export.json';
                     a.click();
                   }}
                   className="flex-1 py-5 bg-light-grey rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-mist transition-all"
                 >
                   Export JSON
                 </button>
                 <button className="flex-1 py-5 border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reset OS</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, disabled, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">{label}</label>
    <input 
      type="text"
      disabled={disabled}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all disabled:opacity-50" 
    />
  </div>
);

const SocialInput = ({ icon: Icon, color, label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-1">
       <Icon size={14} className={color} />
       <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">{label}</label>
    </div>
    <input 
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 bg-light-grey/50 rounded-xl text-[13px] font-bold text-dark border border-mist/20 focus:bg-white focus:border-cyan outline-none transition-all" 
    />
  </div>
);

const SettingsNavItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex-shrink-0 lg:w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold text-[13px] whitespace-nowrap",
      isActive ? "bg-dark text-white shadow-lg shadow-dark/10" : "text-ash/60 hover:bg-light-grey hover:text-dark"
    )}
  >
    <Icon size={18} className={isActive ? "text-cyan" : ""} />
    <span>{label}</span>
  </button>
);
