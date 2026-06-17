/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Zap } from 'lucide-react';
import { WorksSection } from './components/WorksSection';
import { AboutSection } from './components/AboutSection';

export default function App() {
  const [deviceTime, setDeviceTime] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'portfolio' | 'about'>('landing');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [dotColorIndex, setDotColorIndex] = useState(0);

  const dotColors = ['#ff2a00', '#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

  // Dot color pulsing index loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDotColorIndex((prev) => (prev + 1) % dotColors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep a live local clock state
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeviceTime(now.toLocaleTimeString('zh-CN', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#fcfaf2] text-[#231f20] relative flex flex-col justify-start select-none font-sans">
      
      {/* MAIN SCREEN INTERFACE CONTENT */}
      <div className="flex-grow min-h-0 w-full relative">
        <AnimatePresence mode="wait">
          
          {/* A. SPLASH / LANDING SCREEN (首屏页面) */}
          {currentScreen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 text-[#231f20] bg-[#fcfaf2] overflow-hidden relative"
            >
              
              {/* Top-left Brand Initial Banner/Logo Badge */}
              <div className="absolute top-6 left-6 sm:top-10 sm:left-10 md:top-12 md:left-12 flex items-center gap-2 z-20">
                <span 
                  style={{ fontSize: '19px' }}
                  className="font-mono text-xs font-black uppercase tracking-widest text-[#231f20]"
                >
                  Chloe's
                </span>
              </div>
              
              {/* Elegant light brown dashed grid background pattern overlay */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="landing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b7355" strokeWidth="1" strokeDasharray="3 3" opacity="0.12" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#landing-grid)" />
                </svg>
              </div>

              {/* Centered Giant Title "imagine." */}
              <div className="flex flex-col items-center justify-center my-auto relative z-10 text-center">
                <motion.h1 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 80 }}
                  style={{ paddingRight: '0px', marginRight: '75px', fontSize: '140px' }}
                  className="font-heading font-black text-[#231f20] tracking-tighter text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] leading-none select-none lowercase"
                >
                  profile<span style={{ color: dotColors[dotColorIndex], marginLeft: '0px' }} className="transition-colors duration-1000">.</span>
                </motion.h1>
              </div>

              {/* Right-aligned, vertical navigation column (WORKS, ABOUT ME, CONTACT in uppercase) */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginLeft: '0px', paddingLeft: '3px', marginRight: '-6px' }}
                className="absolute right-6 sm:right-12 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 md:gap-5 z-20"
              >
                <button
                  id="nav-works-btn"
                  onClick={() => setCurrentScreen('portfolio')}
                  className="relative pb-1 bg-transparent border-0 text-[#231f20] font-display text-base sm:text-lg md:text-xl font-black hover:text-[#0047ff] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider after:absolute after:bottom-0 after:right-0 after:h-[3px] after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 after:ease-out"
                >
                  WORKS
                </button>
                <button
                  id="nav-about-btn"
                  onClick={() => setCurrentScreen('about')}
                  className="relative pb-1 bg-transparent border-0 text-[#231f20] font-display text-base sm:text-lg md:text-xl font-black hover:text-[#ec4899] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider after:absolute after:bottom-0 after:right-0 after:h-[3px] after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 after:ease-out"
                >
                  ABOUT ME
                </button>
                <button
                  id="nav-contact-btn"
                  onClick={() => setIsContactOpen(true)}
                  className="relative pb-1 bg-transparent border-0 text-[#231f20] font-display text-base sm:text-lg md:text-xl font-black hover:text-[#10b981] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider after:absolute after:bottom-0 after:right-0 after:h-[3px] after:w-0 hover:after:w-full after:bg-current after:transition-all after:duration-300 after:ease-out"
                >
                  CONTACT
                </button>
              </motion.div>

            </motion.div>
          )}

          {/* B. PORTFOLIO VIEW (PORTFOLIO WORKS STREAM CONTAINER) */}
          {currentScreen === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full flex flex-col justify-stretch min-h-0 overflow-hidden"
            >
              <WorksSection onBackToHome={() => setCurrentScreen('landing')} />
            </motion.div>
          )}

          {/* C. STANDALONE ABOUT PAGE (独立关于我页面) */}
          {currentScreen === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full overflow-y-auto bg-[#fcfaf2]"
            >
              <AboutSection 
                onBack={() => setCurrentScreen('landing')} 
                onGoToWorks={() => setCurrentScreen('portfolio')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* GLOBAL MODALS (ABOUT ME & CONTACT) */}
      {/* ======================================================== */}
      <AnimatePresence>
        
        {/* 2. CONTACT MODAL */}
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-55 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border-4 border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none w-full max-w-md p-5 sm:p-6 font-mono text-xs relative"
            >
              <button 
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 cursor-pointer rounded-none bg-stone-100 text-black border-2 border-black flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors"
              >
                ×
              </button>
              
              <div className="border-b-2 border-black pb-3 mb-4">
                <div className="bg-black text-[#ffaee3] px-2 py-0.5 font-bold inline-block mb-1">STATION_CONTACT // REACH_OUT</div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-black leading-none mt-1">
                  REACH OUT // 联系我
                </h2>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('📬 Your transmission request has been compiled and dispatched securely! I will respond to your coordinates immediately.');
                  setIsContactOpen(false);
                }}
                className="space-y-3 font-sans"
              >
                <div>
                  <label className="block font-mono font-bold text-[10px] text-gray-500 mb-1 uppercase">YOUR_NAME // 称呼</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Explorer Alpha" 
                    className="w-full p-2 border-2 border-black text-black placeholder-gray-400 bg-white rounded-none focus:bg-stone-50 outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-[10px] text-gray-500 mb-1 uppercase">EMAIL_COORDINATES // 邮箱</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="name@domain.com" 
                    className="w-full p-2 border-2 border-black text-black placeholder-gray-400 bg-white rounded-none focus:bg-stone-50 outline-none text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-[10px] text-gray-500 mb-1 uppercase">TRANSMISSION // 留言内容</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Say hello, describe your projects, or ask questions..." 
                    className="w-full p-2 border-2 border-black text-black placeholder-gray-400 bg-white rounded-none focus:bg-stone-50 outline-none text-xs"
                  />
                </div>

                <div className="border border-black/10 bg-stone-50 p-2 text-[10px] text-gray-600 rounded-none leading-relaxed font-sans font-bold">
                  💡 <strong>PRO tip:</strong> Let’s collaborate on neon branding, podcast hosting, or building delightful full-screen user interfaces!
                </div>

                <button
                  type="submit"
                  className="w-full text-center border-2 border-black py-2.5 bg-black text-white font-black font-mono text-xs uppercase cursor-pointer hover:bg-stone-900 transition-all"
                >
                  TRANSMIT MESSENGER 🚀
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
export { App };
