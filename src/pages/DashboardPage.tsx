import React from 'react';
import {
  UploadCloud,
  BookOpen,
  CheckCircle2,
  Layers,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { stats, books, selectBook, navigateTo } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 18) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            What do you want to study today?
          </p>
        </div>

        <button
          onClick={() => navigateTo('upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Upload New Book</span>
        </button>
      </div>

      {/* Your Study Progress Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Your Study Progress
          </h2>
          <button
            onClick={() => navigateTo('progress')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Books uploaded */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Books uploaded</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{books.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active in library</div>
          </div>

          {/* Card 2: Topics completed */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Topics completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.topicsCompleted}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Mastered concepts</div>
          </div>

          {/* Card 3: Flashcards reviewed */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Flashcards reviewed</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.flashcardsReviewed}</div>
            <div className="text-[11px] text-slate-500 mt-1">Total cards flipped</div>
          </div>

          {/* Card 4: Quiz score */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Quiz score</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.averageQuizScore}%</div>
            <div className="text-[11px] text-slate-500 mt-1">Average performance</div>
          </div>
        </div>
      </section>

      {/* My Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">My Books</h2>
            <p className="text-xs text-slate-500">Pick up where you left off</p>
          </div>
          <button
            onClick={() => navigateTo('my-books')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({books.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                    {book.fileType}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>{book.lastStudied}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {book.pages} pages · {book.chaptersCount} chapters
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-900">{book.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        book.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-2">
                <button
                  onClick={() => selectBook(book.id, 'book-overview')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Continue Studying</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick Upload Placeholder Card */}
          <button
            onClick={() => navigateTo('upload')}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center mb-3 transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-700">
              Upload Another Book
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Add a new PDF to generate study materials in seconds
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};
