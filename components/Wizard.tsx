import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Search
} from 'lucide-react';
import { DraftState, WizardStep, PacerSession, PacerType } from '../types';
import * as Storage from '../services/storageService';
import { Button } from './ui/Button';
import { FocusEngine } from './FocusEngine';

// Module Editors
import { ProceduralEditor } from './modules/ProceduralEditor';
import { AnalogousEditor } from './modules/AnalogousEditor';
import { ConceptualEditor } from './modules/ConceptualEditor';
import { FlashcardManager } from './FlashcardManager';
import { ReviewStep } from './modules/ReviewStep';

interface WizardProps {
  initialState: DraftState;
  onComplete: () => void;
  onDiscard: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ initialState, onComplete, onDiscard }) => {
  const [draft, setDraft] = useState<DraftState>(initialState);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold latest draft for event listeners to avoid stale closures
  const draftRef = useRef(draft);

  // Sync ref
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  // Auto-save
  useEffect(() => {
    Storage.saveDraft(draft);
  }, [draft]);

  // Scroll to top on step change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [draft.currentStep]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Meta (Mac Command)
      const isModifierActive = e.ctrlKey || e.metaKey;

      if (!isModifierActive) return;

      const currentDraft = draftRef.current;
      const { currentStep, session } = currentDraft;

      const handleNext = () => {
        // Validation: Topic required
        if (currentStep === WizardStep.TOPIC && !session.topic.trim()) {
           return;
        }

        if (currentStep < WizardStep.REVIEW) {
          setDraft(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
        } else {
          // Finish
          Storage.saveSession(session);
          Storage.clearDraft();
          onComplete();
        }
      };

      const handlePrev = () => {
        if (currentStep > WizardStep.TOPIC) {
          setDraft(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
        }
      };

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        // Ctrl+S acts as "Save & Next" or "Finish" depending on context
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  const updateSession = (updates: Partial<PacerSession>) => {
    setDraft(prev => ({
      ...prev,
      session: { ...prev.session, ...updates }
    }));
  };

  const nextStep = () => {
    if (draft.currentStep === WizardStep.TOPIC && !draft.session.topic.trim()) {
        return; // Passive block, button should be disabled
    }
    if (draft.currentStep < WizardStep.REVIEW) {
      setDraft(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      Storage.saveSession(draft.session);
      Storage.clearDraft();
      onComplete();
    }
  };

  const prevStep = () => {
    if (draft.currentStep > WizardStep.TOPIC) {
      setDraft(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  // Logic for Zone Distractions
  const handleDistraction = (text: string) => {
    updateSession({ distractions: [...draft.session.distractions, text] });
  };

  // --- M3 RENDERERS ---

  const renderProgress = () => {
    const totalSteps = 7; // Topic -> Review
    const current = draft.currentStep + 1;
    
    // Desktop/Laptop: Bubbles
    const desktopProgress = (
      <div className="hidden lg:flex gap-2 mb-8 px-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isActive = idx <= draft.currentStep;
          const isCurrent = idx === draft.currentStep;
          
          return (
            <div 
              key={idx}
              className={`h-2 rounded-pill flex-1 transition-all duration-500 ease-out
                ${isActive ? 'bg-m3-primary' : 'bg-m3-secondary-container'}
                ${isCurrent ? 'bg-opacity-100' : isActive ? 'bg-opacity-40' : ''}
              `}
            />
          );
        })}
      </div>
    );

    // Mobile/Tablet: Text + Thin Line
    const mobileProgress = (
      <div className="lg:hidden flex flex-col gap-2 mb-6 px-1">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
           <span>Step {current} / {totalSteps}</span>
           <span>{Object.keys(WizardStep).filter(k => isNaN(Number(k)))[draft.currentStep]}</span>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
           <div 
             className="h-full bg-m3-primary transition-all duration-500 ease-out" 
             style={{ width: `${(current / totalSteps) * 100}%` }}
           />
        </div>
      </div>
    );

    return (
      <>
        {desktopProgress}
        {mobileProgress}
      </>
    );
  };

  const renderContent = () => {
    const commonContainerClass = "animate-in fade-in slide-in-from-bottom-4 duration-500";
    
    switch (draft.currentStep) {
      case WizardStep.TOPIC:
        return (
          <div className={`flex flex-col items-center justify-center min-h-[40vh] text-center space-y-8 ${commonContainerClass}`}>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-normal text-gray-900">What are you learning?</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Define the core subject. The PACER system works best when you focus on one specific topic at a time.
              </p>
            </div>
            
            {/* Google Search Style Input */}
            <div className="relative w-full max-w-xl group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className={`w-6 h-6 transition-colors ${draft.session.topic ? 'text-m3-primary' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                value={draft.session.topic}
                onChange={(e) => updateSession({ topic: e.target.value })}
                placeholder="e.g. Machine Learning Basics"
                className="block w-full h-16 pl-16 pr-6 rounded-pill bg-m3-surface-container-high border-none text-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-m3-primary focus:bg-white transition-all shadow-sm hover:shadow-md focus:shadow-m3-1 outline-none"
                autoFocus
              />
            </div>
          </div>
        );

      case WizardStep.PROCEDURAL:
        return (
          <div className={commonContainerClass}>
            <div className="mb-8">
               <span className="text-m3-p text-sm font-bold tracking-wider uppercase mb-1 block">Step 1 . Practice</span>
               <h2 className="text-2xl md:text-3xl text-gray-900">Procedural Checklist</h2>
               <p className="text-gray-500 mt-2 max-w-2xl">
                 Information is useless if you can't apply it. Break down the "How-to" into a strict sequence. 
               </p>
            </div>
            <ProceduralEditor 
              content={draft.session.procedural}
              onChange={(c) => updateSession({ procedural: c })}
            />
          </div>
        );

      case WizardStep.ANALOGOUS:
        return (
          <div className={commonContainerClass}>
             <div className="mb-8">
               <span className="text-m3-a text-sm font-bold tracking-wider uppercase mb-1 block">Step 2 . Critique</span>
               <h2 className="text-2xl md:text-3xl text-gray-900">Analogous Comparison</h2>
               <p className="text-gray-500 mt-2 max-w-2xl">
                 Deep understanding comes from connection. Anchor this new concept (Unknown) to something you already understand (Known).
               </p>
            </div>
            <AnalogousEditor 
              content={draft.session.analogous}
              onChange={(c) => updateSession({ analogous: c })}
            />
          </div>
        );

      case WizardStep.CONCEPTUAL:
        return (
          <div className={commonContainerClass}>
             <div className="mb-8">
               <span className="text-m3-c text-sm font-bold tracking-wider uppercase mb-1 block">Step 3 . Map</span>
               <h2 className="text-2xl md:text-3xl text-gray-900">Conceptual Graph</h2>
               <p className="text-gray-500 mt-2 max-w-2xl">
                 Visualize the system. How do the individual facts connect to form the Big Picture?
               </p>
            </div>
            <ConceptualEditor 
              content={draft.session.conceptual}
              onChange={(c) => updateSession({ conceptual: c })}
            />
          </div>
        );

      case WizardStep.EVIDENCE:
        return (
           <div className={commonContainerClass}>
            <div className="mb-8">
               <span className="text-m3-e text-sm font-bold tracking-wider uppercase mb-1 block">Step 4 . Store</span>
               <h2 className="text-2xl md:text-3xl text-gray-900">Evidence Gathering</h2>
               <p className="text-gray-500 mt-2 max-w-2xl">
                 Store concrete proof. Quotes, statistics, case studies, or observations that support your conceptual claims.
               </p>
            </div>
            <FlashcardManager
              type={PacerType.EVIDENCE}
              cards={draft.session.evidence}
              onChange={(c) => updateSession({ evidence: c })}
            />
          </div>
        );

      case WizardStep.REFERENCE:
        return (
           <div className={commonContainerClass}>
             <div className="mb-8">
               <span className="text-m3-r text-sm font-bold tracking-wider uppercase mb-1 block">Step 5 . Store</span>
               <h2 className="text-2xl md:text-3xl text-gray-900">Reference Data</h2>
               <p className="text-gray-500 mt-2 max-w-2xl">
                 Store the nitty-gritty. Definitions, syntax, dates, formulas, or raw data that you need to memorize by rote.
               </p>
            </div>
            <FlashcardManager
              type={PacerType.REFERENCE}
              cards={draft.session.reference}
              onChange={(c) => updateSession({ reference: c })}
            />
          </div>
        );

      case WizardStep.REVIEW:
        return <ReviewStep session={draft.session} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. FIXED HEADER */}
      <header className="flex-none z-30 bg-white border-b px-4 py-3 md:px-6 md:py-4 flex justify-between items-center shadow-sm">
         <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 tracking-tight">PACER</span>
            <span className="text-xs text-gray-400 font-medium">Wizard Mode</span>
         </div>
         <Button 
           variant="text" 
           onClick={() => {
             if (window.confirm("Discard draft?")) onDiscard();
           }}
           className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-10 px-4"
         >
           Exit
         </Button>
      </header>

      {/* 2. HUD: Focus Engine (Fixed Overlay) */}
      <FocusEngine 
        savedDistractions={draft.session.distractions} 
        onAddDistraction={handleDistraction} 
      />

      {/* 3. SCROLLABLE CONTENT AREA */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative w-full"
        id="wizard-scroll-container"
      >
        {/* Inner Content Wrapper */}
        <div className="w-full min-h-full p-4 pb-32 lg:max-w-5xl lg:mx-auto lg:my-8 lg:bg-white lg:rounded-[24px] lg:shadow-sm lg:border lg:p-8 lg:pb-8 transition-all">
          {renderProgress()}
          {renderContent()}
        </div>
      </div>

      {/* 4. FIXED FOOTER */}
      <div className="flex-none z-30 bg-white border-t p-4 pb-safe flex flex-col md:flex-row justify-between items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           
           <Button 
             variant="text" 
             onClick={prevStep} 
             disabled={draft.currentStep === WizardStep.TOPIC}
             className={`w-full md:w-auto ${draft.currentStep === WizardStep.TOPIC ? 'opacity-0 pointer-events-none' : ''}`}
             icon={<ArrowLeft size={18} />}
             title="Previous Step (Ctrl + Left Arrow)"
           >
             Back
           </Button>

           {draft.currentStep === WizardStep.REVIEW ? (
              <Button 
                variant="filled" 
                onClick={nextStep}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 px-8"
                icon={<Save size={18} />}
                title="Finish (Ctrl + S)"
              >
                Finish Session
              </Button>
           ) : (
              <Button 
                variant="filled" 
                onClick={nextStep}
                disabled={draft.currentStep === WizardStep.TOPIC && !draft.session.topic.trim()}
                icon={<ArrowRight size={18} />}
                className="w-full md:w-auto px-8"
                title="Next Step (Ctrl + Right Arrow or Ctrl + S)"
              >
                Next
              </Button>
           )}
      </div>

    </div>
  );
};
