
import React from 'react';
import { User } from '../types';
import { TabType } from '../App';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isQuietMode: boolean;
  toggleQuietMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onTabChange, 
  currentUser, 
  isDarkMode, 
  toggleDarkMode,
  isQuietMode,
  toggleQuietMode
}) => {
  return (
    <nav className="sticky top-6 mx-4 glass dark:bg-slate-900/80 shadow-sm z-50 rounded-[2.5rem] px-8 py-5 flex items-center justify-between max-w-2xl sm:mx-auto transition-colors">
      <div className="flex flex-col cursor-pointer group" onClick={() => onTabChange('feed')}>
        <h1 className="brand-font text-2xl leading-none text-indigo-600 dark:text-indigo-400 tracking-tighter italic group-hover:scale-105 transition-transform">PLUGME</h1>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-0.5">ESTATE MODE</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
            {/* 1️⃣2️⃣ Night Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-3 rounded-2xl transition-all border ${isDarkMode ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300' : 'bg-amber-50 border-amber-100 text-amber-500'}`}
              title="Toggle Night Mode"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            {/* 6️⃣ Quiet Mode Toggle */}
            <button 
              onClick={toggleQuietMode}
              className={`p-3 rounded-2xl transition-all border ${isQuietMode ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
              title="Toggle Quiet Mode"
            >
              {isQuietMode ? '🕊️' : '🔔'}
            </button>
        </div>

        {currentUser && (
          <button 
            onClick={() => onTabChange('profile')}
            className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 overflow-hidden shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-white bg-indigo-500">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
