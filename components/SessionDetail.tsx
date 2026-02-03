import React, { useEffect, useRef } from 'react';
import { PacerSession, PacerType } from '../types';
import { 
  X, 
  Calendar, 
  Pencil, 
  CheckCircle2, 
  ArrowRightLeft, 
  Brain, 
  Quote, 
  FileText,
  Clock 
} from 'lucide-react';
import { Button } from './ui/Button';

// Redefine for this file context
declare global {
  interface Window {
    mermaid: any;
  }
}

interface SessionDetailProps {
  session: PacerSession;
  onClose: () => void;
  onEdit: () => void;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({ session, onClose, onEdit }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Render Mermaid Chart
  useEffect(() => {
    if (window.mermaid && chartRef.current && session.conceptual.mermaidCode) {
      try {
        window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
        const id = `mermaid-readonly-${session.id}`;
        window.mermaid.render(id, session.conceptual.mermaidCode).then((result: any) => {
             if (chartRef.current) {
                chartRef.current.innerHTML = result.svg;
             }
        });
      } catch (err) {
        console.error("Mermaid Render Error", err);
        if (chartRef.current) chartRef.current.innerHTML = '<div class="text-red-500 text-sm">Error rendering graph</div>';
      }
    }
  }, [session]);

  const SectionHeader = ({ icon, title, colorClass }: { icon: React.ReactNode, title: string, colorClass: string }) => (
    <div className={`flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 ${colorClass}`}>
      {icon}
      <h3 className="text-xl font-bold uppercase tracking-wide">{title}</h3>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 font-medium">
               <Calendar size={14} />
               {new Date(session.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               <span className="mx-1">•</span>
               <Clock size={14} />
               {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {session.topic || "Untitled Session"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="tonal" onClick={onEdit} icon={<Pencil size={18} />}>
              Edit
            </Button>
            <button 
              onClick={onClose}
              className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">

          {/* 1. PROCEDURAL */}
          {session.procedural.steps.length > 0 && (
            <section>
              <SectionHeader 
                icon={<CheckCircle2 className="text-m3-p" />} 
                title="Procedural" 
                colorClass="text-m3-p" 
              />
              <div className="bg-blue-50/50 rounded-2xl p-6 space-y-3 border border-blue-100">
                {session.procedural.steps.map((step, idx) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-blue-300'}`}>
                      {step.completed && <CheckCircle2 size={14} />}
                    </div>
                    <span className={`text-gray-800 ${step.completed ? 'line-through opacity-60' : ''}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. ANALOGOUS */}
          {(session.analogous.conceptA || session.analogous.conceptB) && (
            <section>
              <SectionHeader 
                icon={<ArrowRightLeft className="text-m3-a" />} 
                title="Analogous" 
                colorClass="text-m3-a" 
              />
              <div className="bg-violet-50/30 rounded-2xl border border-violet-100 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-violet-100 border-b border-violet-100">
                  <div className="p-4 bg-violet-100/30">
                    <span className="text-xs font-bold uppercase text-violet-600 block mb-1">New Concept</span>
                    <span className="text-lg font-bold text-gray-900">{session.analogous.conceptA}</span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Known Concept</span>
                    <span className="text-lg font-bold text-gray-600">{session.analogous.conceptB}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-violet-100">
                   <div className="p-4">
                      <span className="text-xs font-bold uppercase text-green-700 block mb-2">Similarities</span>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.analogous.similarities || '—'}</p>
                   </div>
                   <div className="p-4">
                      <span className="text-xs font-bold uppercase text-red-700 block mb-2">Differences</span>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.analogous.differences || '—'}</p>
                   </div>
                   <div className="p-4">
                      <span className="text-xs font-bold uppercase text-blue-700 block mb-2">Context</span>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.analogous.context || '—'}</p>
                   </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. CONCEPTUAL */}
          {session.conceptual.mermaidCode && (
            <section>
              <SectionHeader 
                icon={<Brain className="text-m3-c" />} 
                title="Conceptual Map" 
                colorClass="text-m3-c" 
              />
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-center overflow-x-auto">
                 <div ref={chartRef} className="w-full flex justify-center" />
              </div>
            </section>
          )}

          {/* 4. EVIDENCE & REFERENCE */}
          {(session.evidence.length > 0 || session.reference.length > 0) && (
            <section>
              <SectionHeader 
                 icon={<FileText className="text-gray-700" />} 
                 title="Knowledge Store" 
                 colorClass="text-gray-700" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evidence Cards */}
                {session.evidence.map((card) => (
                   <div key={card.id} className="group relative h-48 perspective-1000">
                      <div className="absolute inset-0 w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180">
                         {/* Front */}
                         <div className="absolute inset-0 backface-hidden bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <Quote size={20} className="text-amber-300 mb-2" />
                            <h4 className="font-serif text-lg text-amber-900 leading-tight">{card.front}</h4>
                            <span className="absolute bottom-4 text-[10px] uppercase font-bold text-amber-400 tracking-widest">Evidence</span>
                         </div>
                         {/* Back */}
                         <div className="absolute inset-0 backface-hidden rotate-y-180 bg-amber-100 border border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <p className="text-sm text-amber-900">{card.back}</p>
                            {card.source && <span className="mt-2 text-xs text-amber-700 italic border-t border-amber-200 pt-2">{card.source}</span>}
                         </div>
                      </div>
                   </div>
                ))}

                {/* Reference Cards */}
                {session.reference.map((card) => (
                   <div key={card.id} className="group relative h-48 perspective-1000">
                      <div className="absolute inset-0 w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180">
                         {/* Front */}
                         <div className="absolute inset-0 backface-hidden bg-white border-l-4 border-red-500 rounded-r-2xl border-y border-r border-gray-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <h4 className="font-bold text-lg text-gray-800">{card.front}</h4>
                            <span className="absolute bottom-4 text-[10px] uppercase font-bold text-red-500 tracking-widest">Reference</span>
                         </div>
                         {/* Back */}
                         <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm text-white">
                            <p className="text-sm">{card.back}</p>
                            {card.source && <span className="mt-2 text-xs text-gray-500 italic border-t border-gray-700 pt-2">{card.source}</span>}
                         </div>
                      </div>
                   </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};
