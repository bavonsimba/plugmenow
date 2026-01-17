
import React, { useState, useEffect } from 'react';
import { Post, Category, PostType } from '../types';
import { getMarketInsights } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Icons } from '../constants';

interface DashboardProps {
  posts: Post[];
}

const Dashboard: React.FC<DashboardProps> = ({ posts }) => {
  const [insight, setInsight] = useState('Crunching market intel...');
  
  useEffect(() => {
    const fetchInsight = async () => {
      const text = await getMarketInsights(posts);
      setInsight(text);
    };
    fetchInsight();
  }, [posts]);

  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    count: posts.filter(p => p.category === cat).length
  })).filter(d => d.count > 0);

  const gaveUpReasons = posts
    .filter(p => p.gaveUpReason)
    .reduce((acc, p) => {
      acc[p.gaveUpReason!] = (acc[p.gaveUpReason!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const gaveUpData = Object.entries(gaveUpReasons).map(([name, value]) => ({ name, value }));

  const typeData = [
    { name: 'Looking', value: posts.filter(p => p.type === PostType.LOOKING).length },
    { name: 'Have', value: posts.filter(p => p.type === PostType.HAVE).length },
    { name: 'Solved', value: posts.filter(p => p.isSolved).length },
  ];

  const MODERN_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#14b8a6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* AI Summary Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20">
               <Icons.Sparkles />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-200">Demand Intelligence</h2>
          </div>
          <p className="text-2xl font-black leading-tight tracking-tight italic">
            "{insight}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Tags */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
            <Icons.Box /> Market Tags
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gave Up Stats */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2 text-rose-500">
             Failed Demand (Gave Up)
          </h3>
          {gaveUpData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaveUpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gaveUpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-300 font-bold uppercase text-[10px] italic">
              No one's given up yet!
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-[2.5rem] p-10">
        <h3 className="text-xs font-black uppercase text-indigo-400 mb-8 tracking-widest flex items-center gap-2">
          <Icons.Map /> Neighborhood Heat
        </h3>
        <div className="space-y-4">
            {Array.from(new Set(posts.map(p => p.location))).slice(0, 5).map(loc => {
                const locPosts = posts.filter(p => p.location === loc);
                const solveRate = (locPosts.filter(p => p.isSolved).length / locPosts.length * 100).toFixed(0);
                return (
                  <div key={loc} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Icons.MapPin />
                          </div>
                          <div>
                              <p className="text-sm font-black uppercase text-slate-900">{loc}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{locPosts.length} Active Posts</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-xl font-black text-indigo-600 leading-none">{solveRate}%</p>
                          <p className="text-[8px] font-black uppercase text-slate-300">Plug Success</p>
                      </div>
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
