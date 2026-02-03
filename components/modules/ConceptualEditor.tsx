import React, { useEffect, useRef, useState } from 'react';
import { ConceptualContent, DEFAULT_MERMAID } from '../../types';
import { RefreshCcw, AlertTriangle, Code, Info } from 'lucide-react';

// Declaration for global mermaid
declare global {
  interface Window {
    mermaid: any;
  }
}

interface ConceptualEditorProps {
  content: ConceptualContent;
  onChange: (newContent: ConceptualContent) => void;
}

export const ConceptualEditor: React.FC<ConceptualEditorProps> = ({ content, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const renderChart = async () => {
    if (window.mermaid && chartRef.current) {
      try {
        setError(null);
        window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
        
        // Generate unique ID for the SVG
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render
        const { svg } = await window.mermaid.render(id, content.mermaidCode);
        chartRef.current.innerHTML = svg;
      } catch (err: any) {
        // We do not clear the innerHTML on error so the user can see their last valid graph
        console.error("Mermaid Render Error:", err);
        setError("Syntax Error: Check your connections and brackets.");
      }
    }
  };

  // Debouncing Logic (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      renderChart();
    }, 500);
    return () => clearTimeout(timer);
  }, [content.mermaidCode]);

  // Initial Load
  useEffect(() => {
    renderChart();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-[600px] lg:h-[calc(100vh-220px)]">
      
      {/* LEFT COLUMN: Code Editor */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3 min-h-[300px] lg:min-h-0 relative">
         <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
            <p className="text-sm text-emerald-800 font-medium leading-relaxed">
              <strong>PACER (C):</strong> Map the system. Connect facts to theories using Mermaid syntax.
            </p>
          </div>

        <div className="flex-1 bg-gray-900 rounded-3xl p-5 font-mono text-sm shadow-inner overflow-hidden flex flex-col relative group border border-gray-700 transition-all focus-within:ring-2 focus-within:ring-emerald-500/50">
          <div className="flex justify-between items-center mb-3 text-gray-400 border-b border-gray-700 pb-2">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold"><Code size={14} /> Source</span>
            <a href="https://mermaid.js.org/intro/" target="_blank" rel="noreferrer" className="text-xs hover:text-white transition-colors flex items-center gap-1">
              <Info size={12}/> Syntax Help
            </a>
          </div>
          <textarea
            value={content.mermaidCode}
            onChange={(e) => onChange({ ...content, mermaidCode: e.target.value })}
            className="w-full flex-1 bg-transparent text-emerald-300 outline-none resize-none text-xs md:text-sm leading-6 placeholder-gray-600"
            spellCheck={false}
            placeholder="graph TD..."
          />
        </div>

        {/* Error Toast */}
        {error && (
          <div className="absolute bottom-4 right-4 left-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col relative min-h-[400px] overflow-hidden">
         <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 p-3 flex justify-end z-10">
           <button 
            onClick={renderChart}
            className="p-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-all hover:rotate-180 duration-500"
            title="Force Re-render"
           >
             <RefreshCcw size={16} />
           </button>
         </div>
         
         <div className="flex-1 overflow-auto p-8 bg-m3-surface-container-high flex items-center justify-center">
            {/* Watermark / Placeholder when empty */}
            {!content.mermaidCode.trim() ? (
              <div className="text-center text-gray-300 select-none">
                <Code size={48} className="mx-auto mb-2 opacity-20" />
                <span className="text-2xl font-black opacity-20">PREVIEW</span>
              </div>
            ) : (
              <div ref={chartRef} className="w-full h-full flex items-center justify-center" />
            )}
         </div>
      </div>
    </div>
  );
};