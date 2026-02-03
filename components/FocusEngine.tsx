import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Send, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface FocusEngineProps {
  savedDistractions: string[];
  onAddDistraction: (text: string) => void;
}

export const FocusEngine: React.FC<FocusEngineProps> = ({ savedDistractions, onAddDistraction }) => {
  // --- UPTIME LOGIC ---
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- ZONE LOGIC ---
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCapture = () => {
    if (!inputValue.trim()) return;

    // Offload the thought
    onAddDistraction(inputValue);
    
    // Visual Feedback
    setInputValue('');
    setShowSuccess(true);
    
    // Reset success state after delay
    setTimeout(() => {
      setShowSuccess(false);
      // Optional: Close after saving to get back to flow immediately
      // setIsOpen(false); 
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCapture();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-[80px] right-4 z-40 flex flex-col items-end gap-2 font-sans">
      
      {/* HUD BAR */}
      <div className="bg-gray-900/90 backdrop-blur-md text-white rounded-full p-1 pl-4 pr-1 shadow-2xl flex items-center gap-4 border border-white/10 transition-all hover:bg-gray-900">
        
        {/* Uptime Display */}
        <div className="flex items-center gap-2 select-none" title="Session Uptime">
           <Timer size={14} className="text-blue-400" />
           <span className="font-mono font-medium text-sm tracking-wider">
             {formatTime(seconds)}
           </span>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-700"></div>

        {/* Zone Trigger */}
        <Button 
          variant="text" 
          onClick={() => setIsOpen(!isOpen)}
          className={`h-8 w-8 p-0 rounded-full hover:bg-white/10 ${isOpen ? 'text-yellow-400 bg-white/10' : 'text-gray-400'}`}
          title="Trap Distraction (The Zone)"
        >
          <Zap size={16} fill={isOpen ? "currentColor" : "none"} />
        </Button>
        
        {/* Distraction Count Badge */}
        {savedDistractions.length > 0 && !isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm pointer-events-none">
             {savedDistractions.length}
           </span>
        )}
      </div>

      {/* THE ZONE POPOVER (Appears Below HUD) */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-72 mt-2 animate-in slide-in-from-top-5 fade-in duration-200 origin-top-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
              <Zap size={12} /> The Zone
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-gray-500"
            >
              <span className="text-xs">Close (Esc)</span>
            </button>
          </div>
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Dump distraction here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-8"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
               {showSuccess ? <Check size={16} className="text-green-500" /> : <Send size={14} />}
            </div>
          </div>
          
          {showSuccess && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-green-600 font-medium text-sm animate-in fade-in zoom-in-95">
               <Check size={16} className="mr-2" /> Saved. Keep going.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
