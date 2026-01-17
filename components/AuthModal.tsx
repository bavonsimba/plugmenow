
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface AuthModalProps {
  onSignUp: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSignUp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Add plugScore and badges to satisfy the User interface requirements
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      profilePic,
      plugScore: 0,
      badges: ['Newbie Plug']
    };
    onSignUp(newUser);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-indigo-500/20 blur-[120px] rounded-full"></div>
         <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-rose-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-12 my-8 border border-white/40">
        <div className="text-center mb-12">
          <h1 className="brand-font text-5xl italic tracking-tighter text-indigo-600 mb-3">PLUGME</h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Connect. Find. Deal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group relative transition-all hover:scale-105 active:scale-95"
            >
              {profilePic ? (
                <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                   <div className="flex justify-center mb-2"><Icons.Plus /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Avatar</span>
                </div>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
              placeholder="YOUR STREET NAME"
            />
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
              placeholder="EMAIL ADDRESS"
            />
            <input 
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
              placeholder="PHONE NUMBER"
            />
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all"
              placeholder="CREATE PASSWORD"
            />
          </div>

          <button 
            type="submit"
            className="w-full vibrant-gradient text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 mt-4"
          >
            Create Your Account
          </button>
        </form>

        <p className="text-[9px] text-center mt-10 text-slate-300 font-bold uppercase tracking-[0.2em]">
          Join the informal economy. Be the plug.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
