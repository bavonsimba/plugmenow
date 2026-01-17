
import React, { useState, useEffect } from 'react';
import { Post, Category, PostType } from '../types';
import { getMarketInsights } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Icons } from '../constants';

interface DashboardProps {
  posts: Post[];
  isQuietMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, isQuietMode }) => {
  const [insight, setInsight] = useState('Gathering neighborhood pulses...');
  
  useEffect(() => {
    const fetchInsight = async () => {
      const text = await getMarketInsights(posts);
      setInsight(text);
    };
    fetchInsight();
  }, [posts]);

  // Transform data for human-friendly charts
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    count: posts.filter(p => p.category === cat).length
  })).filter(d => d.count > 0);

  // Mock trend data for "Neighborhood Pulse"
  const pulseData = [
    { day: 'Mon', active: 12 },
    { day: 'Tue', active: 18 },
    { day: 'Wed', active: 15 },
    { day: 'Thu', active: 22 },
    { day: 'Fri', active: 30 },
    { day: 'Sat', active: 28 },
    { day: 'Sun', active: 20 },
  ];

  const MODERN_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#14b8a6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 1️⃣ Demand Intelligence Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 p-10 rounded-[3rem] shadow-2xl shadow-slate-100 dark:shadow-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-800">
               <Icons.Sparkles />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Demand Intelligence</h2>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight italic">
            "{insight}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Neighborhood Pulse Area Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-sm border border-slate-50 dark:border-slate-700">
          <h3 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-8 flex items-center gap-2">
            <Icons.Map /> Neighborhood Pulse
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pulseData}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-sm border border-slate-50 dark:border-slate-700">
          <h3 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-8 flex items-center gap-2">
            <Icons.Box /> Active Sectors
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barSize={20} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Neighborhood Success Metrics */}
      {!isQuietMode && (
        <div className="bg-indigo-600 dark:bg-indigo-900/40 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            <div>
               <p className="text-4xl font-black italic tracking-tighter mb-1">84%</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Plug Success Rate</p>
            </div>
            <div>
               <p className="text-4xl font-black italic tracking-tighter mb-1">12m</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Avg Response Time</p>
            </div>
            <div>
               <p className="text-4xl font-black italic tracking-tighter mb-1">452</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Active Neighborhoods</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
