export enum PacerType {
  PROCEDURAL = 'PROCEDURAL',
  ANALOGOUS = 'ANALOGOUS',
  CONCEPTUAL = 'CONCEPTUAL',
  EVIDENCE = 'EVIDENCE',
  REFERENCE = 'REFERENCE',
}

// Sub-content types
export interface ProceduralItem {
  id: string;
  text: string;
  completed: boolean;
}
export interface ProceduralContent {
  steps: ProceduralItem[];
}

export interface AnalogousContent {
  conceptA: string;
  conceptB: string;
  similarities: string;
  differences: string;
  context: string;
}

export interface ConceptualContent {
  mermaidCode: string;
}

export interface FlashcardContent {
  id: string;
  front: string;
  back: string;
  source?: string;
}

// Unified Session Type
export interface PacerSession {
  id: string;
  topic: string;
  createdAt: number;
  procedural: ProceduralContent;
  analogous: AnalogousContent;
  conceptual: ConceptualContent;
  evidence: FlashcardContent[];
  reference: FlashcardContent[];
  distractions: string[];
}

// Draft State for Wizard
export enum WizardStep {
  TOPIC = 0,
  PROCEDURAL = 1,
  ANALOGOUS = 2,
  CONCEPTUAL = 3,
  EVIDENCE = 4,
  REFERENCE = 5,
  REVIEW = 6
}

export interface DraftState {
  currentStep: WizardStep;
  session: PacerSession;
}

export const DEFAULT_MERMAID = `graph TD
    A[Central Concept] --> B(Key Idea 1)
    A --> C(Key Idea 2)
    B --> D{Decision}
    C --> E[Result]`;
