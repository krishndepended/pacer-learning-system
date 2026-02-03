import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  History, 
  BookOpen, 
  ChevronRight, 
  Calendar,
  Trash2,
  Search,
  X,
  Pencil,
  Settings
} from 'lucide-react';
import { PacerSession, DraftState, WizardStep } from './types';
import * as Storage from './services/storageService';
import { Wizard } from './components/Wizard';
import { SessionDetail } from './components/SessionDetail';
import { SettingsModal } from './components/SettingsModal';
import { DistinguishModal } from './components/DistinguishModal';

type AppMode = 'ARCHIVE' | 'WIZARD';

const App = () => {
  const [mode, setMode] = useState<AppMode>('ARCHIVE');
  const [sessions, setSessions] = useState<PacerSession[]>([]);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for read-only view
  const [viewingSession, setViewingSession] = useState<PacerSession | null>(null);
  
  // State for Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State for DFUZ Distinguish Check
  const [isDistinguishOpen, setIsDistinguishOpen] = useState(false);

  // Boot Logic
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setSessions(Storage.getSessions());
    const savedDraft = Storage.getDraft();
    if (savedDraft) {
      setDraft(savedDraft);
    }
  };

  // Callback when settings changes data
  const handleDataRefresh = () => {
     setSessions(Storage.getSessions());
  };

  // Step 1: User clicks "New Session"
  const startNewSession = () => {
    if (draft && !window.confirm("You have an unfinished draft. Start a new session and discard it?")) {
      return;
    }
    setIsDistinguishOpen(true);
  };

  // Step 2: User completes "Distinguish" -> Launch Wizard
  const handleDistinguishComplete = () => {
    setIsDistinguishOpen(false);

    const newSession = Storage.createEmptySession();
    const newDraft: DraftState = {
      currentStep: WizardStep.TOPIC,
      session: newSession
    };
    setDraft(newDraft);
    Storage.saveDraft(newDraft);
    setMode('WIZARD');
  };

  const editSession = (session: PacerSession, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setViewingSession(null);

    if (draft && !window.confirm("You have an unfinished draft. Discard it to edit this session?")) {
      return;
    }

    const editDraft: DraftState = {
      currentStep: WizardStep.TOPIC,
      session: session
    };

    setDraft(editDraft);
    Storage.saveDraft(editDraft);
    setMode('WIZARD');
  };

  const handleWizardComplete = () => {
    setSessions(Storage.getSessions());
    setDraft(null);
    setMode('ARCHIVE');
  };

  const handleWizardDiscard = () => {
    Storage.clearDraft();
    setDraft(null);
    setMode('ARCHIVE');
  };

  // --- FIXED DELETE LOGIC ---
  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop the card click
    e.preventDefault();  // Stop default button behavior

    if (window.confirm("Permanently delete this session record?")) {
      // 1. Delete from database
      Storage.deleteSession(id);
      
      // 2. INSTANTLY update the screen (Optimistic UI)
      setSessions(prev => prev.filter(s => s.id !== id));
      
      // 3. Close the detail view if it was open
      if (viewingSession?.id === id) {
        setViewingSession(null);
      }
    }
  };

  const openSession = (session: PacerSession) => {
    setViewingSession(session);
  };

  // Filter Logic
  const filteredSessions = sessions.filter(session => 
    session.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (mode === 'WIZARD' && draft) {
    return (
      <Wizard 
        initialState={draft} 
        onComplete={handleWizardComplete} 
        onDiscard={handleWizardDiscard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onDataChange={handleDataRefresh}
      />

      {/* DFUZ Pre-Flight Check */}
      <DistinguishModal 
        isOpen={isDistinguishOpen} 
        onComplete={handleDistinguishComplete}
        onCancel={() => setIsDistinguishOpen(false)}
      />

      {/* Read Only Modal */}
      {viewingSession && (
        <SessionDetail 
          session={viewingSession} 
          onClose={() => setViewingSession(null)}
          onEdit={() => editSession(viewingSession)}
        />
      )}

      {/* Archive Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto relative">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              PACER <span className="text-gray-400 font-normal">Memory Archive</span>
            </h1>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              title="Settings & Data"
            >
              <Settings size={24} />
            </button>
          </div>

          <p className="text-lg text-gray-500 mb-8 max-w-xl">
            Your collection of processed knowledge. Review past sessions or begin a new learning cycle.
          </p>
          
          <button 
            onClick={startNewSession}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
          >
            <PlusCircle size={24} />
            Start New Session
          </button>
        </div>
      </header>

      {/* Session List */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Search Bar */}
        {sessions.length > 0 && (
          <div className="relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`w-5 h-5 transition-colors ${searchQuery ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic..."
              className="block w-full h-12 pl-12 pr-10 rounded-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold uppercase tracking-wider text-sm">
          <History size={16} /> Past Sessions
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No sessions recorded</h3>
            <p className="text-gray-400 mt-2">Click the blue button to start your first PACER cycle.</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No matching sessions</h3>
            <p className="text-gray-500">We couldn't find any sessions matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
             {filteredSessions.map(session => (
               <div 
                 key={session.id}
                 onClick={() => openSession(session)}
                 className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
               >
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                       {session.topic || 'Untitled Session'}
                     </h3>
                     <div className="flex items-center gap-4 text-sm text-gray-500">
                       <span className="flex items-center gap-1">
                         <Calendar size={14} /> {new Date(session.createdAt).toLocaleDateString()}
                       </span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                         {session.evidence.length + session.reference.length} Cards
                       </span>
                     </div>
                   </div>
                   
                   {/* Action Buttons - Always visible now */}
                   <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => editSession(session, e)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit Session"
                      >
                        <Pencil size={18} className="pointer-events-none" />
                      </button>
                      
                      <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 size={18} className="pointer-events-none" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openSession(session);
                        }}
                        className="p-2 text-gray-300 group-hover:text-blue-600 transition-colors"
                        title="Open Session"
                      >
                        <ChevronRight size={22} className="pointer-events-none" />
                      </button>
                   </div>
                 </div>
                 
                 {/* Badges */}
                 <div className="flex gap-2 mt-4">
                    {session.procedural.steps.length > 0 && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" title="Procedural" />
                    )}
                    {(session.analogous.conceptA || session.analogous.conceptB) && (
                      <div className="w-2 h-2 rounded-full bg-violet-500" title="Analogous" />
                    )}
                    {(session.conceptual.mermaidCode) && (
                       <div className="w-2 h-2 rounded-full bg-emerald-500" title="Conceptual" />
                    )}
                    {session.evidence.length > 0 && (
                       <div className="w-2 h-2 rounded-full bg-amber-500" title="Evidence" />
                    )}
                    {session.reference.length > 0 && (
                       <div className="w-2 h-2 rounded-full bg-red-500" title="Reference" />
                    )}
                 </div>
               </div>
             ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
