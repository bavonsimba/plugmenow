
import React, { useState } from 'react';
import { Post, Comment, PostType, User } from '../types';
import { Icons } from '../constants';

interface PostCardProps {
  post: Post;
  postComments: Comment[];
  currentUser: User;
  onAddComment: (postId: string, text: string, options: { isAlternative?: boolean, image?: string }) => void;
  onThank?: (postId: string) => void;
  isQuietMode?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  postComments, 
  currentUser, 
  onAddComment, 
  onThank,
  isQuietMode
}) => {
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleThankClick = () => {
    if (onThank) {
      onThank(post.id);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1200);
    }
  };

  const isLooking = post.type === PostType.LOOKING;
  const isOwner = post.userId === currentUser.id;
  const status = post.isSolved ? 'Plugged ✅' : postComments.length > 0 ? 'Helping' : 'Open';

  return (
    <div className={`relative bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${post.isSolved ? 'border-teal-400/20 shadow-sm' : 'border-white dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl'}`}>
      
      {/* 2️⃣ Thanks Confetti */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden">
           {[...Array(15)].map((_, i) => (
             <div 
               key={i} 
               className="confetti" 
               style={{ 
                 left: `${Math.random() * 100}%`, 
                 backgroundColor: ['#6366f1', '#f43f5e', '#f59e0b', '#14b8a6'][Math.floor(Math.random()*4)],
                 animationDelay: `${Math.random() * 0.4}s`
               }} 
             />
           ))}
        </div>
      )}

      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm ${isLooking ? 'bg-indigo-500' : 'bg-amber-500'}`}>
            {isLooking ? 'Request' : 'Supply'}
          </div>
          <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${post.isSolved ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-slate-100 dark:border-slate-700'}`}>
            {status}
          </span>
        </div>
        {!isQuietMode && (
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white tracking-tight leading-tight uppercase italic">{post.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-base mb-8 leading-relaxed font-medium">{post.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-8 items-center">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-300">
              <Icons.MapPin /> {post.location}
            </div>
          
          {/* 2️⃣ Thank You Moment */}
          {post.isSolved && isOwner && (
            <button 
              onClick={handleThankClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-800 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-100 transition-all active:scale-95 shadow-sm"
            >
              ❤️ Say Thanks {(!isQuietMode && post.thankedCount) ? `(${post.thankedCount})` : ''}
            </button>
          )}
        </div>

        {/* Community Reactions & Thread */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-900 dark:text-slate-300 tracking-widest">
              <Icons.Chat /> {!isQuietMode && `${postComments.length} `}Community Responses
            </div>
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
               <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>

          {isExpanded && (
            <div className="space-y-6 mt-8 animate-in slide-in-from-top-4 duration-500">
              {postComments.map(comment => (
                <div key={comment.id} className="p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.01]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-500 text-xs">
                        {comment.userName.charAt(0)}
                      </div>
                      <span className="text-[10px] font-black text-slate-900 dark:text-slate-300 tracking-wide uppercase">@{comment.userName}</span>
                    </div>
                    {/* 5️⃣ Emoji reactions */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl">
                        {['👍', '❤️', '👀'].map(e => (
                          <button key={e} className="hover:scale-125 transition-transform text-xs grayscale hover:grayscale-0">{e}</button>
                        ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-400 font-medium leading-relaxed">{comment.text}</p>
                </div>
              ))}

              <form onSubmit={(e) => { e.preventDefault(); onAddComment(post.id, commentText, {}); setCommentText(''); }} className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="relative">
                  <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Drop the plug here..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-3xl pl-6 pr-28 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 dark:text-white"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
