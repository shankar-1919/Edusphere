import React from 'react';
import {
  BookOpen,
  BookMarked,
  Layers,
  HelpCircle,
  Award,
  Target,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookOverviewPage: React.FC = () => {
  const { activeBook, selectChapter, navigateTo, deleteBook } = useApp();

  if (!activeBook) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No book selected.</p>
        <button
          onClick={() => navigateTo('my-books')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Go to Library
        </button>
      </div>
    );
  }

  const handleStartChapter = (chapterId: string) => {
    selectChapter(chapterId, 'summary');
  };

  const handleFlashcardsAction = () => {
    if (activeBook.chapters.length > 0) {
      selectChapter(activeBook.chapters[0].id, 'flashcards');
    }
  };

  const handleQuizAction = () => {
    if (activeBook.chapters.length > 0) {
      selectChapter(activeBook.chapters[0].id, 'quiz');
    }
  };

  const handlePracticeAction = () => {
    if (activeBook.chapters.length > 0) {
      selectChapter(activeBook.chapters[0].id, 'practice');
    }
  };

  const handleSummaryAction = () => {
    if (activeBook.chapters.length > 0) {
      selectChapter(activeBook.chapters[0].id, 'summary');
    }
  };

  const handlePracticeExamAction = () => {
    navigateTo('practice-exam');
  };

  const totalBankCount = activeBook.chapters.reduce((acc, c) => acc + c.questionBank.length, 0);
  const totalCardsCount = activeBook.chapters.reduce((acc, c) => acc + c.flashcards.length, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI analysis completed · Primary Source of Truth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {activeBook.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {activeBook.pages} pages · {activeBook.chaptersCount} chapters · {activeBook.author}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm(`Remove "${activeBook.title}" from library?`)) {
                  deleteBook(activeBook.id);
                  navigateTo('my-books');
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* What AI Found Section */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            What AI structured from the document
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-lg font-bold text-slate-900">{activeBook.chaptersCount}</div>
              <div className="text-xs text-slate-500 font-medium">Chapters</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-lg font-bold text-slate-900">{totalCardsCount}</div>
              <div className="text-xs text-slate-500 font-medium">Flashcards</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-lg font-bold text-slate-900">{activeBook.conceptsCount}</div>
              <div className="text-xs text-slate-500 font-medium">Key concepts</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-lg font-bold text-slate-900">{totalBankCount}</div>
              <div className="text-xs text-slate-500 font-medium">Question Bank</div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Action Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          Choose a Study Mode
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Summary Card */}
          <button
            onClick={handleSummaryAction}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookMarked className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Summary</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Read simplified structured explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-blue-600">
              <span>Read summaries</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Flashcards Card */}
          <button
            onClick={handleFlashcardsAction}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Flashcards</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review {totalCardsCount} cards with spaced repetition.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-indigo-600">
              <span>Flip cards</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Quiz Card */}
          <button
            onClick={handleQuizAction}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Quiz</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                10 randomized questions with instant score.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-amber-600">
              <span>Start quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Practice Mode Card */}
          <button
            onClick={handlePracticeAction}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Practice</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Custom difficulties & missed questions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span>Practice mode</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Practice Exam Card */}
          <button
            onClick={handlePracticeExamAction}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Exam</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Full 30-question timed mock exam.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-blue-600">
              <span>Begin exam</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Chapters List Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Chapters</h2>
            <p className="text-xs text-slate-500">
              Select a chapter to read summaries, study cards, or take quizzes
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {activeBook.chapters.length} Chapters total
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
          {activeBook.chapters.map((chapter) => {
            const isCompleted = chapter.progress === 100;

            return (
              <div
                key={chapter.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Chapter {chapter.number}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{chapter.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {chapter.readTime}
                    </span>
                    <span>·</span>
                    <span>{chapter.flashcards.length} Flashcards</span>
                    <span>·</span>
                    <span>{chapter.questionBank.length} Bank Questions</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0 justify-between sm:justify-end">
                  {/* Progress percentage */}
                  <div className="text-right min-w-[75px]">
                    <div className="text-xs font-semibold text-slate-800">
                      {chapter.progress}%
                    </div>
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${chapter.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Start / Continue Button */}
                  <button
                    onClick={() => handleStartChapter(chapter.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : chapter.progress > 0
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>
                      {isCompleted
                        ? 'Review'
                        : chapter.progress > 0
                        ? 'Continue'
                        : 'Start'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
