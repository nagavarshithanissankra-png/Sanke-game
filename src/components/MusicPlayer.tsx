import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            handleSkip(1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, track.duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = (direction: number) => {
    setProgress(0);
    setCurrentTrackIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = DUMMY_TRACKS.length - 1;
      if (next >= DUMMY_TRACKS.length) next = 0;
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm bg-[#0f0f12] border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-600/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isPlaying ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-white/40'}`}>
              <Music className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Neural Audio Engine</span>
          </div>
          <Volume2 className="w-4 h-4 text-white/30 cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="relative mb-8 aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={track.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={track.coverUrl}
              alt={track.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {isPlaying && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 right-4 text-white/20"
            >
              <Disc className="w-12 h-12" />
            </motion.div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <motion.h3 
              key={`title-${track.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold text-white tracking-tight"
            >
              {track.title}
            </motion.h3>
            <motion.p 
               key={`artist-${track.id}`}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="text-sm text-white/60 font-medium"
            >
              {track.artist}
            </motion.p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
              style={{ width: `${(progress / track.duration) * 100}%` }}
              layoutId="progress"
            />
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => handleSkip(-1)}
            className="text-white/40 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={() => handleSkip(1)}
            className="text-white/40 hover:text-white transition-colors active:scale-90"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">Stream Status: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
