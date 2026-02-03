import React from 'react';
import { AnalogousContent } from '../../types';
import { Lightbulb, ArrowRightLeft, Scale, Info } from 'lucide-react';

interface AnalogousEditorProps {
  content: AnalogousContent;
  onChange: (newContent: AnalogousContent) => void;
}

export const AnalogousEditor: React.FC<AnalogousEditorProps> = ({ content, onChange }) => {
  const handleChange = (field: keyof AnalogousContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const isEmpty = !content.conceptA && !content.conceptB;

  const renderInput = (label: string, value: string, field: keyof AnalogousContent, placeholder: string, icon?: React.ReactNode) => (
    <div className="relative group flex-1">
      <div className="flex items-center gap-2 mb-1 pl-1">
         {icon && <span className="text-gray-400">{icon}</span>}
         <label className="text-xs font-bold uppercase tracking-wider text-gray-500 group-focus-within:text-m3-primary transition-colors">
           {label}
         </label>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 px-4 bg-gray-100 hover:bg-gray-200 focus:bg-white border-b-2 border-gray-300 focus:border-m3-primary rounded-t-lg outline-none font-medium text-lg text-gray-900 transition-all placeholder:text-gray-400"
        />
      </div>
    </div>
  );

  const renderTextArea = (
    label: string, 
    value: string, 
    field: keyof AnalogousContent, 
    themeClass: string,
    placeholder: string
  ) => (
    <div className={`flex flex-col h-full min-h-[180px] rounded-2xl overflow-hidden border border-transparent transition-all hover:shadow-md ${themeClass}`}>
      <div className="px-4 py-3 border-b border-black/5 text-sm font-bold tracking-wide uppercase flex items-center justify-between">
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(field, e.target.value)}
        className="flex-1 w-full p-4 resize-none outline-none bg-transparent text-gray-800 leading-relaxed placeholder:text-gray-400/70"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      {isEmpty && (
        <div className="bg-violet-50 border border-violet-100 text-violet-900 p-5 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in">
           <div className="p-2 bg-violet-200 rounded-full text-violet-700">
             <Lightbulb size={20} />
           </div>
           <div className="flex-1">
             <strong className="block text-base mb-1">How to use Analogous Thinking</strong>
             <p className="opacity-90 leading-relaxed mb-2">
               To understand <strong>Concept A (Unknown)</strong>, compare it to <strong>Concept B (Known)</strong>. 
               The brain learns best by anchoring new information to existing neural pathways.
             </p>
             <p className="text-xs opacity-70">
               Example: If learning "React Props", compare it to "Function Arguments".
             </p>
           </div>
        </div>
      )}

      {/* Top Section: The Pair */}
      <div className="flex flex-col md:flex-row gap-6 items-end">
        {renderInput('Concept A (New)', content.conceptA, 'conceptA', 'e.g. Redux Store', <div className="w-2 h-2 rounded-full bg-m3-primary"/>)}
        
        <div className="hidden md:flex items-center justify-center pb-4 text-gray-300">
           <ArrowRightLeft size={24} />
        </div>
        
        {renderInput('Concept B (Known)', content.conceptB, 'conceptB', 'e.g. Database', <div className="w-2 h-2 rounded-full bg-gray-400"/>)}
      </div>

      {/* Bottom Section: The Analysis */}
      {/* Mobile/Tablet: Stacked Column. Desktop (lg+): 3-Column Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:h-[500px] lg:min-h-[400px]">
        {renderTextArea(
          'Similarities', 
          content.similarities, 
          'similarities', 
          'bg-green-50 hover:bg-green-100/50',
          'How are they alike? e.g., Both hold data...'
        )}
        
        {renderTextArea(
          'Differences', 
          content.differences, 
          'differences', 
          'bg-red-50 hover:bg-red-100/50',
          'How do they differ? e.g., Redux is client-side...'
        )}
        
        {renderTextArea(
          'Context / Nuance', 
          content.context, 
          'context', 
          'bg-blue-50 hover:bg-blue-100/50',
          'When does the analogy break down?'
        )}
      </div>
    </div>
  );
};