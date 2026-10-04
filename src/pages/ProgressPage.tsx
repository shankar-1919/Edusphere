import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Layers,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressPage: React.FC = () => {
  const { stats, books, selectBook, navigateTo } = useApp();

  const completedBooksCount = books.filter((b) => b.progress === 100).length;
  const totalChaptersCount = books.reduce((acc, b) => acc + b.chapters.length, 0);
  const completedChaptersCount = books.reduce(
    (acc, b) => acc + b.chapters.filter((c) => c.progress === 100).length,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Title Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          My Progress & Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics, practice accuracy, retention rates, and topic mastery breakdown.
        </p>
      </div>

      {/* Top Highlight Box: Overall progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Course Mastery Index
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Overall progress: {stats.overallProgress}%
          </div>
          <p className="text-xs text-slate-500">
            Based on completed chapters, flashcard recall rates, and assessment evaluations.
          </p>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Overall Completion</span>
            <span className="text-blue-600">{stats.overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chapters completed */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Chapters completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {completedChaptersCount} <span className="text-sm font-normal text-slate-400">/ {totalChaptersCount}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% finished modules</div>
        </div>

        {/* Flashcards reviewed & need review */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Flashcards reviewed</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.flashcardsReviewed}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.flashcardsNeedingReview > 0 ? (
              <span className="text-rose-600 font-semibold">{stats.flashcardsNeedingReview} need review</span>
            ) : (
              'All caught up'
            )}
          </div>
        </div>

        {/* Practice Accuracy */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Practice accuracy</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.practiceAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.practiceCompletedCount} sessions completed</div>
        </div>

        {/* Average quiz score */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Average quiz score</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.averageQuizScore}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all quizzes</div>
        </div>
      </div>

      {/* Simple Readable Progress & Activity Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Weekly Study Consistency</h3>
            <p className="text-xs text-slate-500">Minutes spent studying and flashcards reviewed per day</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>5-day study streak 🔥</span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-slate-100 pb-3">
          {stats.weeklyActivity.map((act) => {
            const maxMinutes = 100;
            const heightPercent = Math.min(100, Math.round((act.minutes / maxMinutes) * 100));

            return (
              <div key={act.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {act.minutes}m
                </div>
                <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-32">
                  <div
                    className="bg-blue-600 group-hover:bg-blue-700 transition-all rounded-t-lg"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">{act.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong Topics & Topics to Review Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Strong Topics</span>
          </div>
          <p className="text-xs text-slate-500">
            High recall scores and consistently correct quiz answers.
          </p>

          <div className="space-y-2">
            {stats.strongTopics.map((topic, i) => (
              <div
                key={i}
                className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-emerald-950">{topic}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  92%+ Mastery
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics to Review */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Topics to Review</span>
          </div>
          <p className="text-xs text-slate-500">
            AI flagged areas that need reinforcement based on missed questions.
          </p>

          <div className="space-y-2">
            {stats.weakTopics.map((topic, i) => (
              <div
                key={i}
                className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-amber-950">{topic}</span>
                <button
                  onClick={() => {
                    if (books.length > 0) {
                      selectBook(books[0].id, 'practice');
                    }
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <span>Practice Topic</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
