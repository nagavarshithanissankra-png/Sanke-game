/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Gamepad2, Settings2, Info } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/10 blur-[150px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }}
        />
      </div>

      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/5 flex flex-col items-center py-8 z-50 bg-black/40 backdrop-blur-xl hidden md:flex">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Activity className="text-black" />
        </div>
        
        <div className="flex flex-col gap-8 flex-1">
          <button className="text-cyan-500 transition-all hover:scale-110 active:scale-95">
            <Gamepad2 className="w-6 h-6" />
          </button>
          <button className="text-white/20 hover:text-white transition-all hover:scale-110 active:scale-95">
            <Settings2 className="w-6 h-6" />
          </button>
        </div>

        <button className="text-white/20 hover:text-white transition-all hover:scale-110 active:scale-95">
          <Info className="w-6 h-6" />
        </button>
      </nav>

      <main className="relative z-10 md:ml-20 min-h-screen flex flex-col p-6 md:p-12 lg:p-20">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <span className="w-8 h-[2px] bg-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500 font-bold">Neural Arcade v2.04</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic"
            >
              NEON <span className="text-transparent border-t-none bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">PULSE</span>
            </motion.h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Session Score</div>
              <div className="text-4xl font-black font-mono tracking-tighter">{currentScore.toString().padStart(4, '0')}</div>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Game Window */}
          <section className="lg:col-span-12 xl:col-span-8 flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-[500px] xl:max-w-none lg:mx-0 mx-auto"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white/60 font-medium">Arcade Module _01</h2>
              </div>
              <SnakeGame onScoreUpdate={setCurrentScore} />
            </motion.div>
          </section>

          {/* Sidebar / Player */}
          <aside className="lg:col-span-12 xl:col-span-4 flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-white/60 font-medium">Audio Interface _02</h2>
              </div>
              <MusicPlayer />
            </motion.div>

            {/* Extra Info / Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md hidden xl:block"
            >
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-4">Hardware Telemetry</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">GPU Load</span>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: '64%' }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Audio Sync</span>
                  <span className="text-[10px] font-mono text-green-500">OPTIMIZED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Latent Buffer</span>
                  <span className="text-[10px] font-mono text-fuchsia-500">1.04ms</span>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
            © 2026 NEON PULSE Arcades / System.Auth_Verified
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono">X</div>
            <div className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono">Y</div>
            <div className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono">B</div>
            <div className="w-8 h-8 rounded border border-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono">A</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
