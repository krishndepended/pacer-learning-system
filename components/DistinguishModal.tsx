import React, { useState } from 'react';
import { X, Wind, CheckCircle2, ArrowRight, BrainCircuit } from 'lucide-react';
import { Button } from './ui/Button';

interface DistinguishModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

const COMMON_FEELINGS = [
  "Tired", "Anxious", "Bored", "Overwhelmed", "Distracted", "Excited", "Neutral"
];

export const DistinguishModal: React.FC<DistinguishModalProps> = ({ isOpen, onComplete, onCancel }) => {
  const [feeling, setFeeling] = useState('');
  const [stage, setStage] = useState<'INPUT' | 'AFFIRMATION'>('INPUT');

  if (!isOpen) return null;

  const handleIdentify = () => {
    if (feeling.trim()) {
      setStage('AFFIRMATION');
    }
  };

  const reset = () => {
    setFeeling('');
    setStage('INPUT');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={reset}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-500
            ${stage === 'INPUT' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}
          `}>
             {stage === 'INPUT' ? <BrainCircuit size={32} /> : <Wind size={32} />}
          </div>

          {stage === 'INPUT' ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif text-slate-800 mb-2">Pre-Flight Check</h2>
              <p className="text-slate-500 mb-8">
                Distinguish yourself from your state. <br/>How are you feeling right now?
              </p>
              
              {/* Chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {COMMON_FEELINGS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFeeling(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${feeling === f 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                    `}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative mb-8">
                <input
                  type="text"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Or type here..."
                  className="w-full text-center border-b-2 border-slate-200 focus:border-slate-800 outline-none py-2 text-lg text-slate-800 placeholder:text-slate-300 bg-transparent transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleIdentify()}
                />
              </div>

              <Button 
                variant="filled" 
                onClick={handleIdentify} 
                disabled={!feeling}
                className="w-full bg-slate-800 hover:bg-slate-900"
                icon={<ArrowRight size={18} />}
              >
                Detach & Continue
              </Button>
            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-medium text-slate-400 uppercase tracking-widest mb-6">
                Distinction Made
              </h2>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-8">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-serif">
                  "You feel <strong className="text-blue-700">{feeling}</strong>."
                </p>
                <div className="my-4 h-px bg-blue-200/50 w-1/2 mx-auto" />
                <p className="text-slate-600">
                  That is a temporary sensation. It is not a command.<br/>
                  You can feel <span className="text-slate-800 font-medium">{feeling}</span> and still do the work.
                </p>
              </div>

              <Button 
                variant="filled" 
                onClick={() => {
                  setStage('INPUT');
                  setFeeling('');
                  onComplete();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
                icon={<CheckCircle2 size={18} />}
              >
                Acknowledge & Begin
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};