import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { resetAllData } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('edusphere_gemini_api_key') || '';
    setApiKey(key);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('edusphere_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('edusphere_gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    resetAllData();
    setResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-medium">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Settings & AI Configuration</h3>
              <p className="text-xs text-slate-500">Manage AI engine, API keys, and local study data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-600">
          {/* AI Engine Status */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>AI Engine Architecture</span>
            </div>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              EduSphere features an intelligent local semantic extraction pipeline for instant summaries, flashcard generation, quiz validation, and practice exams. If a Google Gemini API Key is provided below, it will utilize real-time LLM grounding.
            </p>
          </div>

          {/* API Key Form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Keys are stored strictly inside your browser’s localStorage.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save API Key</span>
                )}
              </button>
              {apiKey && (
                <button
                  onClick={() => {
                    setApiKey('');
                    localStorage.removeItem('edusphere_gemini_api_key');
                  }}
                  className="text-xs text-rose-600 hover:underline font-medium"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>

          {/* Prototype Data Management */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Database className="w-4 h-4 text-slate-500" />
              <span>Study Progress & Prototype Storage</span>
            </div>
            <p className="text-xs text-slate-500">
              All books, quiz results, mastery flashcards, and exam scores are saved in your browser. You can reset anytime to the default college textbooks (Python, OS Concepts, Microeconomics).
            </p>

            {resetConfirm ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-rose-900">
                  Reset all books, quizzes, and study progress back to default demo state?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetData}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default College Books & Progress</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
