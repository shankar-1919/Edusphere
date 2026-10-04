import React, { useState } from 'react';
import {
  BookOpen,
  Menu,
  X,
  LayoutDashboard,
  Library,
  UploadCloud,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

interface NavbarProps {
  onOpenSettings: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, isLanding = false }) => {
  const { currentView, navigateTo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'landing' as NavView },
    { label: 'My Books', view: 'my-books' as NavView },
    { label: 'Dashboard', view: 'dashboard' as NavView }
  ];

  const handleNav = (view: NavView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  if (isLanding) {
    return (
      <header className="w-full bg-white/95 backdrop-blur-xs border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">StudyBuddy AI</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.view)}
                className={`transition-colors hover:text-slate-900 ${
                  currentView === link.view ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('dashboard')}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNav('upload')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Upload Your Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-md">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.view)}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('upload')}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Upload Your Book
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Mobile App Top Bar for inside dashboard/study mode
  return (
    <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <button
        onClick={() => handleNav('dashboard')}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-900 text-base">EduSphere</span>
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('dashboard')}
            className="w-full flex items-center gap-3 p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNav('my-books')}
            className="w-full flex items-center gap-3 p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <Library className="w-4 h-4 text-slate-500" />
            <span>My Books</span>
          </button>
          <button
            onClick={() => handleNav('upload')}
            className="w-full flex items-center gap-3 p-2 text-sm font-medium text-blue-600 bg-blue-50/50 rounded-lg"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>+ Upload New Book</span>
          </button>
          <button
            onClick={() => handleNav('progress')}
            className="w-full flex items-center gap-3 p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span>My Progress</span>
          </button>
        </div>
      )}
    </header>
  );
};
