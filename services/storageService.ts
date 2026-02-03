import { PacerSession, DraftState, WizardStep, DEFAULT_MERMAID } from '../types';

const SESSION_KEY = 'pacer-sessions-v1';
const DRAFT_KEY = 'pacer-draft-v1';

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const createEmptySession = (): PacerSession => ({
  id: generateId(),
  topic: '',
  createdAt: Date.now(),
  procedural: { steps: [] },
  analogous: { conceptA: '', conceptB: '', similarities: '', differences: '', context: '' },
  conceptual: { mermaidCode: DEFAULT_MERMAID },
  evidence: [],
  reference: [],
  distractions: []
});

// --- DRAFT MANAGEMENT ---

export const saveDraft = (draft: DraftState) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error("Failed to save draft", e);
  }
};

export const getDraft = (): DraftState | null => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

// --- SESSION ARCHIVE ---

export const saveSession = (session: PacerSession) => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
};

export const getSessions = (): PacerSession[] => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const deleteSession = (id: string) => {
  // Filter out the session with the matching ID
  const sessions = getSessions().filter(s => s.id !== id);
  // Save the new list back to storage
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
};

// --- DATA MANAGEMENT ---

export const importSessions = (sessions: PacerSession[]) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
};

export const clearAllSessions = () => {
  // Explicitly write an empty array
  localStorage.setItem(SESSION_KEY, JSON.stringify([]));
};
