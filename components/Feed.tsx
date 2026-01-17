
import React from 'react';
import { Post, Comment, User } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  comments: Comment[];
  currentUser: User;
  onAddComment: (postId: string, text: string, options?: { isAlternative?: boolean, image?: string }) => void;
  // Added onThank to FeedProps to support the thank functionality
  onThank: (postId: string) => void;
  // Added isQuietMode to FeedProps to fix the error in App.tsx
  isQuietMode: boolean;
}

// Fixed Feed component: Added isQuietMode to props and removed unused onTogglePlug, onMarkSolved, onGaveUp to match App.tsx and PostCardProps
const Feed: React.FC<FeedProps> = ({ posts, comments, currentUser, onAddComment, onThank, isQuietMode }) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
        <div className="w-16 h-16 mb-4 opacity-20">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <p className="font-medium text-[10px] uppercase font-black tracking-widest">Nothing here yet.</p>
        <p className="text-xs">Be the first to ask or offer something!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          postComments={comments.filter(c => c.postId === post.id)}
          currentUser={currentUser}
          // Added a wrapper to satisfy PostCard's required options signature while maintaining Feed's optional options
          onAddComment={(pid, text, opt) => onAddComment(pid, text, opt || {})}
          // Removed onTogglePlug, onMarkSolved, onGaveUp as they are not in PostCardProps and not passed from App.tsx
          onThank={onThank}
          isQuietMode={isQuietMode}
        />
      ))}
    </div>
  );
};

export default Feed;
