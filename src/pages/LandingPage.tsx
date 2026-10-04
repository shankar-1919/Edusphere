import React from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  BookMarked,
  Layers,
  HelpCircle,
  Award,
  UploadCloud,
  CheckCircle,
  FileText,
  Clock,
  Compass,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';

interface LandingPageProps {
  onOpenSettings: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenSettings }) => {
  const { navigateTo, selectBook, books } = useApp();

  const handleStartWithPython = () => {
    selectBook('python-programming', 'dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onOpenSettings={onOpenSettings} isLanding={true} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Study Platform for College Students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
            Study smarter from your books.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload your study material and let AI turn it into summaries, flashcards, quizzes, and practice exams.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigateTo('upload')}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload Your Book</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Demo Launch Shortcut */}
          <div className="mt-6 text-xs text-slate-500">
            Or explore immediately with pre-loaded textbook:{' '}
            <button
              onClick={handleStartWithPython}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
            >
              Python Programming (12 chapters)
            </button>
          </div>

          {/* Simple Visual Flow Explainer */}
          <div id="how-it-works" className="mt-16 sm:mt-20 p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs max-w-3xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
              The 3-Step Study Pipeline
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">1. Your Book</h4>
                <p className="text-xs text-slate-500 mt-1">Upload any PDF textbook, notes, or syllabus</p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex justify-center text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-blue-50/40 border border-blue-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-blue-900 text-sm">2. AI Analysis</h4>
                <p className="text-xs text-slate-600 mt-1">Detects chapters, core concepts, & key formulas</p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex justify-center text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">3. Study Resources</h4>
                <p className="text-xs text-slate-500 mt-1">Summaries, flashcards, quizzes & mock exams</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Feature Cards Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything you need to master your courses
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Designed cleanly for focused learning without clutter or distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Smart Summaries */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <BookMarked className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                📖 Smart Summaries
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Turn long chapters into easy-to-understand summaries. Get structured bullet points, key takeaways, and highlighted concept cards.
              </p>
            </div>

            {/* Card 2: Flashcards */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                🃏 Flashcards
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Automatically create useful question-and-answer cards. Flip with a click and track mastery with spaced repetition.
              </p>
            </div>

            {/* Card 3: AI Quizzes */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                ❓ AI Quizzes
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Practice with questions generated directly from your material. Get immediate feedback and clear explanations for every option.
              </p>
            </div>

            {/* Card 4: Practice Exams */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                🧪 Practice Exams
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Generate complete mock exams from your book with timed sessions, question navigation, and weakness diagnosis.
              </p>
            </div>
          </div>

          {/* Quick CTA Banner */}
          <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold">Ready to transform how you study?</h3>
              <p className="text-slate-400 text-sm mt-1">
                Join thousands of students turning complex textbooks into high grades.
              </p>
            </div>
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">EduSphere / StudyBuddy AI</span>
            <span>·</span>
            <span>Built for college students</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('dashboard')} className="hover:text-slate-900">
              Dashboard
            </button>
            <button onClick={() => navigateTo('my-books')} className="hover:text-slate-900">
              Library
            </button>
            <button onClick={onOpenSettings} className="hover:text-slate-900">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
