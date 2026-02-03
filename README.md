# PACER Learning System

> **A Cognitive Note-Taking Engine built with React, TypeScript & Material Design 3.**

![React](https://img.shields.io/badge/React-18%2B-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🧠 The Philosophy: "Information Digestion"

Most note-taking apps are designed for **Information Consumption**—collecting links, pasting text, and hoarding PDFs. This creates a "Knowledge Illusion" where you feel smarter because you *have* the data, even if you haven't *processed* it.

**PACER** is an "Information Digestion" engine. It forces a cognitive transformation workflow:

0.  **Pre-Flight (Distinguish):** Acknowledging current emotional state to detach "You" from "Your Feelings" before starting.
1.  **P - Procedural (Practice):** "How do I do this?" (Checklists/Action Steps)
2.  **A - Analogous (Critique):** "What is this like?" (Comparing Unknowns to Knowns)
3.  **C - Conceptual (Map):** "How does it fit?" (System diagrams via Mermaid.js)
4.  **E - Evidence (Store):** "How do I know it's true?" (Hypotheses & Proof)
5.  **R - Reference (Store):** "What are the specs?" (Definitions & Syntax)

---

## ✨ Key Features

### 📱 Progressive Web App (PWA)
Installable on mobile and desktop. Works offline, supports touch gestures, and handles display notches natively.
*   **Offline-First:** No internet connection required.
*   **App-Like Experience:** Runs in its own window without browser chrome.

### 🔒 The "No Escape" Wizard
A linear, state-machine-driven interface. You cannot simply "jot down a note." You must categorize the information.
*   **Auto-Save:** Drafts are persisted to `localStorage` on every keystroke.
*   **State Recovery:** Refreshing the page brings you exactly back to the step you were on.

### 🧘 Focus Engine & Distraction Trap
A dedicated HUD (Heads-Up Display) that tracks session uptime and provides a "Trap Door" for distractions.
*   **The Zone:** Quickly offload intrusive thoughts without leaving the flow state.
*   **Uptime Tracker:** Visual feedback on how long you've been deep in the session.

### 🎨 Material Design 3 (M3)
The UI is built on a custom Tailwind configuration implementing Google's Material 3 Design tokens.
*   **Surface Containers:** Distinct visual hierarchy using `surface`, `surface-container`, and `surface-container-high`.
*   **Semantic Colors:** Each PACER module has a dedicated color identity (Blue, Violet, Emerald, Amber, Red).

### 📊 Visual Reasoning Engine
Integrated **Mermaid.js** support allows users to type code to generate live system architecture diagrams instantly.
*   *Write:* `graph TD; A-->B;`
*   *See:* A visual flowchart rendered in real-time.

### 💾 Data Sovereignty & Portability
*   **Zero Cloud Dependency:** All data lives in your browser's `localStorage`.
*   **JSON Import/Export:** Backup your brain or migrate devices easily.
*   **Privacy Focused:** Your thoughts never leave your device unless you export them.

---

## 🛠 Technical Architecture

This project is architected as a modular React application focusing on component isolation and strict typing.

### Folder Structure
```
/
├── components/
│   ├── modules/          # Specific editors for P, A, C, E, R
│   │   ├── AnalogousEditor.tsx
│   │   ├── ConceptualEditor.tsx
│   │   └── ...
│   ├── ui/               # Reusable atomic components (Button, etc.)
│   ├── FocusEngine.tsx   # HUD & Distraction Logic
│   ├── SettingsModal.tsx # Data Management
│   └── Wizard.tsx        # Core state machine
├── services/
│   └── storageService.ts # LocalStorage abstraction layer
├── types.ts              # Shared interfaces (PacerSession, DraftState)
└── App.tsx               # Entry point & Router logic
```

### Stack
*   **React 18:** Component library.
*   **Vite:** Build tool & Dev server.
*   **TailwindCSS:** Styling engine with custom M3 configuration.
*   **Mermaid.js:** Diagramming tool.
*   **Vite PWA Plugin:** Service worker generation and manifest management.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pacer-learning-system.git
    cd pacer-learning-system
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

## 📄 License
This project is open-source and available under the MIT License.
