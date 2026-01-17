
import React, { useState } from 'react';
import { Post, PostType, Category } from '../types';
import { Icons } from '../constants';
import { refinePostDescription, generatePostImage } from '../services/gemini';

interface CreatePostModalProps {
  onClose: () => void;
  onSave: (post: Post) => void;
  currentUser: { id: string, name: string };
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSave, currentUser }) => {
  const [type, setType] = useState<PostType>(PostType.LOOKING);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [isRefining, setIsRefining] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleRefine = async () => {
    if (!description || description.length < 5) return;
    setIsRefining(true);
    const refined = await refinePostDescription(description);
    setDescription(refined);
    setIsRefining(false);
  };

  const handleVisualize = async () => {
    if (!title) return;
    setIsVisualizing(true);
    setStatusMessage('Sketching your request...');
    const generatedImage = await generatePostImage(title, description);
    if (generatedImage) {
      setImage(generatedImage);
    }
    setIsVisualizing(false);
    setStatusMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      description,
      category: Category.OTHER,
      location,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: Date.now(),
      isSolved: false,
      thankedCount: 0,
      image: image
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-2xl p-10 overflow-y-auto max-h-[95vh] animate-in zoom-in duration-500 border border-white/50 dark:border-slate-700">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 dark:text-slate-500 hover:text-slate-600 transition-colors w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
          ✕
        </button>

        <div className="mb-10 text-center">
          <h2 className="brand-font text-3xl italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
             {type === PostType.LOOKING ? 'What do you need?' : 'What can you plug?'}
          </h2>
        </div>

        {/* AI Preview Area */}
        {(image || isVisualizing) && (
          <div className="mb-8 relative h-64 w-full bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-700 group">
            {isVisualizing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-indigo-50/50 dark:bg-indigo-900/20 backdrop-blur-md">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{statusMessage}</p>
              </div>
            ) : (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-1000" />
                <button 
                  onClick={() => setImage(undefined)}
                  className="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700">
            <button type="button" onClick={() => setType(PostType.LOOKING)} className={`flex-1 py-3.5 rounded-[1.75rem] font-black uppercase text-[9px] tracking-widest transition-all ${type === PostType.LOOKING ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}>I'm Looking</button>
            <button type="button" onClick={() => setType(PostType.HAVE)} className={`flex-1 py-3.5 rounded-[1.75rem] font-black uppercase text-[9px] tracking-widest transition-all ${type === PostType.HAVE ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' : 'text-slate-400 dark:text-slate-500'}`}>I Have This</button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-2">
              <label className="block text-[9px] font-black uppercase text-slate-400">Item Name</label>
              {title.length > 3 && !image && (
                <button 
                  type="button" 
                  onClick={handleVisualize}
                  disabled={isVisualizing}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-500 dark:text-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50"
                >
                  <Icons.Camera /> Visualize with AI
                </button>
              )}
            </div>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-white"
              placeholder="e.g. Vintage Nikon Camera"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Location</label>
            <input 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-white"
              placeholder="Where are you looking?"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2 ml-2">
              <label className="block text-[9px] font-black uppercase text-slate-400">Context</label>
              {description.length > 5 && (
                <button 
                  type="button" 
                  onClick={handleRefine}
                  disabled={isRefining}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  {isRefining ? 'Polishing...' : <><Icons.Sparkles /> Refine with AI</>}
                </button>
              )}
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-4 text-sm font-medium h-32 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none dark:text-white ${isRefining ? 'opacity-50 blur-[1px]' : ''}`}
              placeholder="Any details to help the plug find you?"
            />
          </div>

          <button 
            type="submit"
            className="w-full vibrant-gradient text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95"
          >
            Broadcast to Hood
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
