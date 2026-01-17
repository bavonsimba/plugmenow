
import React, { useState, useRef, useMemo } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [profilePic, setProfilePic] = useState<string | undefined>(user.profilePic);
  const [isNewImage, setIsNewImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = useMemo(() => {
    return (
      name !== user.name ||
      email !== user.email ||
      phone !== user.phone ||
      profilePic !== user.profilePic
    );
  }, [name, email, phone, profilePic, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setIsNewImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePic(undefined);
    setIsNewImage(user.profilePic !== undefined);
  };

  const handleDiscardImage = () => {
    setProfilePic(user.profilePic);
    setIsNewImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    onUpdate({ ...user, name, email, phone, profilePic });
    setIsNewImage(false);
  };

  return (
    <div className="animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-48 bg-gradient-to-br from-indigo-500 via-indigo-700 to-violet-800 relative p-10 flex items-end">
          <div className="flex items-center gap-6 text-white w-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icons.Trophy />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Plug Score</span>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter leading-none">{user.plugScore}</h4>
            </div>
            <div className="flex flex-col items-end gap-2">
               {user.badges.map(badge => (
                 <span key={badge} className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase border border-white/20 tracking-widest">
                   {badge}
                 </span>
               ))}
            </div>
          </div>
          <button 
            type="button"
            onClick={onLogout}
            className="absolute top-6 right-6 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white/40 transition-all shadow-lg"
          >
            Sign Out
          </button>
        </div>

        <div className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="relative -mt-16 space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-40 h-40 rounded-[2.5rem] border-8 border-white bg-indigo-50 overflow-hidden shadow-2xl transition-all cursor-pointer group hover:scale-105 active:scale-95 ${isNewImage ? 'ring-4 ring-indigo-500/30 ring-offset-4' : ''}`}
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center font-black text-indigo-400">
                      <span className="text-6xl">{name.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Icons.Plus />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Change</span>
                  </div>

                  {isNewImage && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg border border-white/20 animate-bounce">
                      Preview
                    </div>
                  )}
                </div>
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
                >
                  <Icons.Plus />
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex gap-4">
                  {isNewImage && (
                    <button 
                      type="button" 
                      onClick={handleDiscardImage}
                      className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      Discard
                    </button>
                  )}
                  {profilePic && (
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto}
                      className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em] ml-2">Display Name</label>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="Street Name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em] ml-2">Email Address</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em] ml-2">Phone</label>
                <input 
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  placeholder="Mobile"
                />
              </div>
            </div>

            <div className="max-w-md mx-auto pt-6">
              {hasChanges ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <button 
                    type="submit"
                    className="w-full vibrant-gradient text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-[2rem]">
                   <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Profile up to date</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default ProfilePage;
