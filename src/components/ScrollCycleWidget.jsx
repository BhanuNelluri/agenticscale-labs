import React, { useState, useEffect } from 'react';
import { Bike } from 'lucide-react';

export default function ScrollCycleWidget() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none px-6 max-w-7xl mx-auto">
      <div className="relative w-full bg-slate-900/90 backdrop-blur-md h-2.5 rounded-full border border-slate-800 overflow-visible shadow-2xl">
        <div 
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
        <div 
          className="absolute -top-7 transition-all duration-75 ease-out flex items-center justify-center text-blue-400 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]"
          style={{ left: `calc(${Math.min(Math.max(scrollProgress, 1), 97)}% - 14px)` }}
        >
          <div style={{ transform: `rotate(${scrollProgress * 15}deg)` }}>
            <Bike className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}