import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import * as Storage from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void; // This connects to App.tsx to refresh the screen
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = Storage.getSessions();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `pacer_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStatus({ type: 'success', msg: 'Backup downloaded successfully.' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          Storage.importSessions(json);
          onDataChange(); // Refresh App State immediately
          setStatus({ type: 'success', msg: 'Data restored successfully.' });
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        setStatus({ type: 'error', msg: 'Invalid JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    if (window.confirm("CRITICAL WARNING: This will permanently delete ALL your sessions. This cannot be undone. Are you sure?")) {
        // 1. Clear Storage
        Storage.clearAllSessions();
        
        // 2. FORCE REFRESH in Parent (App.tsx)
        onDataChange(); 
        
        // 3. Close the modal
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" />
                Data Management
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
            
            {/* Status Toast */}
            {status && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {status.msg}
                </div>
            )}

            {/* Portability Section */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Portability</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                    >
                        <Download size={18} /> Export JSON
                    </button>
                    <button 
                        onClick={handleImportClick}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                    >
                        <Upload size={18} /> Import JSON
                    </button>
                    {/* Hidden Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".json" 
                        className="hidden" 
                    />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    Backup your learning progress or move it to another device.
                </p>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                    <AlertCircle size={14} /> Danger Zone
                </h3>
                <div className="border border-red-100 bg-red-50/50 rounded-xl p-4">
                    <p className="text-sm text-red-800 mb-4">
                        Permanently delete all sessions and reset the archive. This action cannot be undone.
                    </p>
                    <button 
                        onClick={handleDeleteAll}
                        className="w-full py-3 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <Trash2 size={18} /> Delete All Data
                    </button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};
