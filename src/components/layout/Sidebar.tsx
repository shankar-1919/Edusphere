import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  UploadCloud,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { currentView, navigateTo, activeBook } = useApp();

  const navItems = [
    {
      id: 'dashboard' as NavView,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'my-books' as NavView,
      label: 'My Books',
      icon: Library
    },
    {
      id: 'upload' as NavView,
      label: 'Upload',
      icon: UploadCloud
    },
    {
      id: 'progress' as NavView,
      label: 'Progress',
      icon: TrendingUp
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-lg tracking-tight">EduSphere</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500">StudyBuddy Platform</p>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'my-books' &&
                (currentView === 'book-overview' ||
                  currentView === 'chapter-study' ||
                  currentView === 'flashcards' ||
                  currentView === 'quiz' ||
                  currentView === 'practice-exam'));

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Current Study Context Widget */}
        {activeBook && (
          <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
              <span>Active Book</span>
              <span className="text-blue-600 font-semibold">{activeBook.progress}%</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 line-clamp-1 mb-2">
              {activeBook.title}
            </p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2.5">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${activeBook.progress}%` }}
              />
            </div>
            <button
              onClick={() => navigateTo('book-overview')}
              className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-white py-1.5 px-2 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <span>Continue Studying</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Footer / Account / Settings */}
      <div className="p-4 border-t border-slate-200/80 space-y-1">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & AI API</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="AI Ready" />
        </button>

        <div className="pt-2 px-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
              AS
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-800 text-[12px] leading-tight">Alex Student</p>
              <p className="text-[10px] text-slate-600">College Scholar</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('landing')}
            title="Return to Home"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
