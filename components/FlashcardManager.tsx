import React, { useState } from 'react';
import { FlashcardContent, PacerType } from '../types';
import { generateId } from '../services/storageService';
import { Plus, Trash2, X, Quote, FileText } from 'lucide-react';
import { Button } from './ui/Button';

interface FlashcardManagerProps {
  type: PacerType;
  cards: FlashcardContent[];
  onChange: (cards: FlashcardContent[]) => void;
}

export const FlashcardManager: React.FC<FlashcardManagerProps> = ({ type, cards, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [tempFront, setTempFront] = useState('');
  const [tempBack, setTempBack] = useState('');
  const [tempSource, setTempSource] = useState('');

  const isEvidence = type === PacerType.EVIDENCE;
  const labelFront = isEvidence ? 'Hypothesis / Claim' : 'Term / Key';
  const labelBack = isEvidence ? 'Evidence / Proof' : 'Definition / Value';

  const handleAdd = () => {
    if (!tempFront.trim() || !tempBack.trim()) return;

    const newCard: FlashcardContent = {
      id: generateId(),
      front: tempFront,
      back: tempBack,
      source: tempSource
    };

    onChange([...cards, newCard]);
    // Reset
    setTempFront('');
    setTempBack('');
    setTempSource('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this card?")) {
      onChange(cards.filter(c => c.id !== id));
    }
  };

  const renderInput = (
    label: string, 
    value: string, 
    setValue: (val: string) => void, 
    placeholder: string,
    multiline = false
  ) => (
    <div className="relative group">
       <label className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-colors group-focus-within:text-blue-600">
         {label}
       </label>
       {multiline ? (
         <textarea
           value={value}
           onChange={(e) => setValue(e.target.value)}
           placeholder={placeholder}
           className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white border-b-2 border-gray-300 focus:border-blue-600 rounded-t-xl px-4 pt-7 pb-2 outline-none transition-all min-h-[100px] resize-y text-gray-900 placeholder:text-gray-400"
         />
       ) : (
         <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white border-b-2 border-gray-300 focus:border-blue-600 rounded-t-xl px-4 pt-7 pb-2 outline-none transition-all text-gray-900 placeholder:text-gray-400"
         />
       )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      
      {/* List View */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {cards.map((card, index) => (
            <div key={card.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="mb-3 flex justify-between items-start">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isEvidence ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                   #{index + 1}
                 </span>
                 <button 
                   onClick={() => handleDelete(card.id)}
                   className="text-gray-300 hover:text-red-500 transition-colors"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{card.front}</h4>
              <p className="text-sm text-gray-500 line-clamp-3">{card.back}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Mode or Empty State */}
      {isAdding ? (
        <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800">Add New {isEvidence ? 'Evidence' : 'Reference'}</h3>
             <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
               <X size={20} />
             </button>
           </div>
           
           <div className="space-y-4">
              {renderInput(labelFront, tempFront, setTempFront, isEvidence ? "e.g. Earth is round" : "e.g. HTTP 404")}
              {renderInput(labelBack, tempBack, setTempBack, isEvidence ? "e.g. Satellite photos show curvature..." : "e.g. Not Found", true)}
              {renderInput("Source (Optional)", tempSource, setTempSource, "e.g. Wikipedia / Page 42")}
           </div>

           <div className="flex justify-end gap-3 mt-6">
             <Button variant="text" onClick={() => setIsAdding(false)}>Cancel</Button>
             <Button variant="filled" onClick={handleAdd} disabled={!tempFront || !tempBack}>Add Card</Button>
           </div>
        </div>
      ) : (
        <>
          {cards.length === 0 && (
            <div className="text-center py-12 px-6 bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200 mb-6">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isEvidence ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                 {isEvidence ? <Quote size={24} /> : <FileText size={24} />}
               </div>
               <h3 className="text-gray-900 font-medium mb-1">
                 {isEvidence ? 'Evidence connects claims to reality' : 'Reference stores definitions'}
               </h3>
               <p className="text-sm text-gray-500 max-w-sm mx-auto">
                 {isEvidence 
                   ? 'Don\'t just state a concept. Prove it with specific examples, quotes, or data.' 
                   : 'Keep your working memory clear by offloading nitty-gritty details here.'}
               </p>
            </div>
          )}
          
          <Button 
            variant={cards.length === 0 ? 'filled' : 'tonal'} 
            onClick={() => setIsAdding(true)} 
            icon={<Plus size={18} />}
            className="w-full md:w-auto mx-auto"
          >
            Add {isEvidence ? 'Evidence' : 'Reference'}
          </Button>
        </>
      )}

    </div>
  );
};
