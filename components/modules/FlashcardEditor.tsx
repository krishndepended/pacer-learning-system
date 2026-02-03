import React, { useState } from 'react';
import { FlashcardContent, PacerType } from '../../types';
import { RotateCw } from 'lucide-react';

interface FlashcardEditorProps {
  content: FlashcardContent;
  type: PacerType;
  onChange: (newContent: FlashcardContent) => void;
}

export const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ content, type, onChange }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const isEvidence = type === PacerType.EVIDENCE;
  const themeColor = isEvidence ? 'amber' : 'red';
  const themeBorder = isEvidence ? 'border-amber-500' : 'border-red-500';
  const themeText = isEvidence ? 'text-amber-700' : 'text-red-700';
  const themeBg = isEvidence ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-8">
       <div className={`${themeBg} border-l-4 ${themeBorder} p-3 md:p-4 rounded-r-md`}>
        <p className={`text-xs md:text-sm ${themeText} font-medium`}>
          <strong>PACER ({isEvidence ? 'E' : 'R'}):</strong> {isEvidence ? 'Store concrete details to support concepts.' : 'Store definitions and raw data.'}
        </p>
      </div>

      <div className="perspective-1000 w-full h-80 md:h-96 relative group">
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT */}
          <div className="absolute w-full h-full backface-hidden">
             <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-8 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                   <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${themeText}`}>
                     {isEvidence ? 'Hypothesis / Claim' : 'Term / Key'}
                   </span>
                   <button 
                    onClick={() => setIsFlipped(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-xs md:text-sm"
                   >
                     Flip <RotateCw size={14} />
                   </button>
                </div>
                <textarea
                  value={content.front}
                  onChange={(e) => onChange({...content, front: e.target.value})}
                  placeholder={isEvidence ? "Enter the claim..." : "Enter the term..."}
                  className="flex-1 w-full text-xl md:text-2xl font-serif resize-none outline-none text-gray-800 placeholder-gray-200 text-center flex items-center justify-center pt-8 md:pt-12"
                />
             </div>
          </div>

          {/* BACK */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-4 md:p-8 flex flex-col text-white">
                <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-2">
                   <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                     {isEvidence ? 'Evidence / Proof' : 'Definition / Data'}
                   </span>
                   <button 
                    onClick={() => setIsFlipped(false)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs md:text-sm"
                   >
                     Flip <RotateCw size={14} />
                   </button>
                </div>
                <textarea
                  value={content.back}
                  onChange={(e) => onChange({...content, back: e.target.value})}
                  placeholder="..."
                  className="flex-1 w-full text-base md:text-lg bg-transparent resize-none outline-none text-slate-200 placeholder-slate-600"
                />
                <input
                  type="text"
                  value={content.source || ''}
                  onChange={(e) => onChange({...content, source: e.target.value})}
                  placeholder="Source / Citation (optional)"
                  className="mt-2 md:mt-4 w-full bg-slate-900/50 p-2 rounded text-xs text-slate-400 outline-none focus:bg-slate-900"
                />
             </div>
          </div>

        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 px-4">
        Tap "Flip" to toggle sides.
      </div>
    </div>
  );
};