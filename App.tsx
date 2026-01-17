
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, PostType, Category, Comment, Condition, User } from './types';
import { Icons } from './constants';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import CreatePostModal from './components/CreatePostModal';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    type: PostType.LOOKING,
    title: 'Vintage Camera Lens',
    description: 'Looking for an old Helios 44-2 lens. Anyone seen one in CBD?',
    category: Category.ELECTRONICS,
    location: 'Nairobi CBD',
    userId: 'u1',
    userName: 'Kameraman',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    urgency: 'Medium',
    isSolved: false,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
  }
];

export type TabType = 'feed' | 'dashboard' | 'profile';

export default function App() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [filterType, setFilterType] = useState<PostType | 'ALL'>('ALL');
  const [showToast, setShowToast] = useState<{message: string, icon: string} | null>(null);
  
  // Night Mode & Quiet Mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuietMode, setIsQuietMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const notify = useCallback((message: string, icon: string = '✨') => {
    if (isQuietMode) return;
    setShowToast({ message, icon });
    setTimeout(() => setShowToast(null), 3000);
  }, [isQuietMode]);

  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setIsModalOpen(false);
    notify("Sent to the neighborhood.", "📡");
  }, [notify]);

  const addComment = useCallback((postId: string, text: string, options: { isAlternative?: boolean, image?: string } = {}) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.profilePic,
      text,
      isHelpfulPlug: false,
      isAlternative: !!options.isAlternative,
      image: options.image,
      upvotes: 0,
      createdAt: Date.now(),
      reactions: []
    };
    setComments(prev => [...prev, newComment]);
    notify("Thanks for helping!", "🤝");
  }, [currentUser, notify]);

  const handleThank = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, thankedCount: (p.thankedCount || 0) + 1 } : p
    ));
    notify("You made their day", "💖");
  }, [notify]);

  const handleSignUp = (user: User) => {
    setCurrentUser({
      ...user,
      plugScore: 0,
      badges: ['Newbie Plug'],
      bio: "Local Plug"
    });
  };

  if (!currentUser) {
    return <AuthModal onSignUp={handleSignUp} />;
  }

  return (
    <div className={`min-h-screen pb-32 ${isDarkMode ? 'dark' : ''} transition-colors duration-500`}>
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isQuietMode={isQuietMode}
        toggleQuietMode={() => setIsQuietMode(!isQuietMode)}
      />

      <main className="max-w-2xl mx-auto px-4 pt-12">
        {activeTab === 'feed' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Community Vibes */}
            {!isQuietMode && (
              <div className="flex items-center gap-4 mb-10 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-8 rounded-[3rem] shadow-sm">
                <div className="text-2xl">🌍</div>
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-indigo-400 dark:text-indigo-300 tracking-[0.2em]">Weekly Pulse</p>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Neighborhoods are helping each other more than ever. 530 plugs this week.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
              {['ALL', PostType.LOOKING, PostType.HAVE].map((type) => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-8 py-3.5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {type === 'ALL' ? 'Community' : type === PostType.LOOKING ? 'Requests' : 'Available'}
                </button>
              ))}
            </div>

            <Feed 
              posts={posts.filter(p => filterType === 'ALL' || p.type === filterType)} 
              comments={comments}
              currentUser={currentUser}
              onAddComment={addComment}
              onThank={handleThank}
              isQuietMode={isQuietMode}
            />
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard posts={posts} isQuietMode={isQuietMode} />}
        
        {activeTab === 'profile' && (
          <ProfilePage 
            user={currentUser} 
            onUpdate={setCurrentUser} 
            onLogout={() => setCurrentUser(null)}
          />
        )}
      </main>

      {/* Soft Notifications */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
            <span className="text-lg">{showToast.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{showToast.message}</span>
          </div>
        </div>
      )}

      {/* No Clutter FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 w-20 h-20 vibrant-gradient text-white rounded-[2.2rem] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white dark:border-slate-800"
      >
        <Icons.Plus />
      </button>

      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={addPost}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
