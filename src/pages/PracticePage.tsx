import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  Layers,
  HelpCircle,
  Bookmark,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Difficulty, QuestionItem, QuestionType } from '../types';
import { fireConfetti } from '../utils/confetti';

interface PracticePageProps {
  chapterMode?: boolean;
}

export const PracticePage: React.FC<PracticePageProps> = ({ chapterMode = false }) => {
  const {
    activeBook,
    activeChapter,
    recordPracticeResult,
    wrongQuestionsPool,
    navigateTo
  } = useApp();

  // Mode state: 'setup' | 'session' | 'result'
  const [sessionState, setSessionState] = useState<'setup' | 'session' | 'result'>('setup');

  // Configuration options
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [onlyWrongQuestions, setOnlyWrongQuestions] = useState(false);

  // Active session questions
  const [sessionQuestions, setSessionQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillInputText, setFillInputText] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answeredResults, setAnsweredResults] = useState<
    { question: QuestionItem; isCorrect: boolean; selectedOptionIndex?: number; textAnswer?: string }[]
  >([]);

  // Source question bank
  const sourceBank: QuestionItem[] = useMemo(() => {
    if (!activeBook) return [];
    if (chapterMode && activeChapter) {
      return activeChapter.questionBank;
    }
    return activeBook.chapters.flatMap((c) => c.questionBank);
  }, [activeBook, activeChapter, chapterMode]);

  const handleStartSession = (overrideQuestions?: QuestionItem[]) => {
    let pool = overrideQuestions || [...sourceBank];

    if (onlyWrongQuestions) {
      if (wrongQuestionsPool.length > 0) {
        pool = [...wrongQuestionsPool];
      }
    } else if (selectedDifficulty !== 'mixed') {
      const filtered = pool.filter((q) => q.difficulty === selectedDifficulty);
      if (filtered.length > 0) pool = filtered;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (selected.length === 0) return;

    setSessionQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setFillInputText('');
    setHasAnswered(false);
    setAnsweredResults([]);
    setSessionState('session');
  };

  const currentQ = sessionQuestions[currentIndex];

  const handleAnswerMCQ = (optionIdx: number) => {
    if (hasAnswered || !currentQ) return;
    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const isCorrect = optionIdx === currentQ.correctAnswerIndex;
    setAnsweredResults((prev) => [
      ...prev,
      { question: currentQ, isCorrect, selectedOptionIndex: optionIdx }
    ]);
  };

  const handleAnswerFillBlank = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasAnswered || !currentQ || !fillInputText.trim()) return;
    setHasAnswered(true);

    const cleanInput = fillInputText.trim().toLowerCase();
    const cleanTarget = (currentQ.correctAnswerText || '').toLowerCase();
    const isCorrect =
      cleanInput === cleanTarget ||
      (currentQ.options && currentQ.correctAnswerIndex !== undefined &&
        currentQ.options[currentQ.correctAnswerIndex]?.toLowerCase().includes(cleanInput));

    setAnsweredResults((prev) => [
      ...prev,
      { question: currentQ, isCorrect, textAnswer: fillInputText.trim() }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFillInputText('');
      setHasAnswered(false);
    } else {
      // Session finished
      setSessionState('result');
      const correctCount = answeredResults.filter((r) => r.isCorrect).length;
      const wrongList = answeredResults.filter((r) => !r.isCorrect).map((r) => r.question);

      if (activeBook) {
        recordPracticeResult(activeBook.id, correctCount, sessionQuestions.length, wrongList);
      }

      if (correctCount / (sessionQuestions.length || 1) >= 0.7) {
        fireConfetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
      }
    }
  };

  if (!activeBook || sourceBank.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">Practice Question Bank Empty</h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload or select a chapter with questions to start practice mode.
        </p>
      </div>
    );
  }

  // 1. SETUP SCREEN
  if (sessionState === 'setup') {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in duration-150">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Targeted Practice Mode</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customize Practice Session
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Draws randomized questions with immediate explanations from {chapterMode ? activeChapter?.title : activeBook.title}.
          </p>
        </div>

        {/* Practice Wrong Questions Banner if available */}
        {wrongQuestionsPool.length > 0 && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-950">
                  {wrongQuestionsPool.length} Missed Questions in Weak Pool
                </p>
                <p className="text-[11px] text-amber-800/80">
                  Target and re-drill questions you answered incorrectly earlier.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setOnlyWrongQuestions(true);
                handleStartSession(wrongQuestionsPool);
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-2xs transition-colors"
            >
              Drill Missed
            </button>
          </div>
        )}

        {/* Difficulty Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Difficulty Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'mixed', label: 'Mixed' },
              { id: 'easy', label: 'Easy' },
              { id: 'medium', label: 'Medium' },
              { id: 'hard', label: 'Hard' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDifficulty(d.id as any);
                  setOnlyWrongQuestions(false);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  selectedDifficulty === d.id && !onlyWrongQuestions
                    ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Question Count
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, Math.min(30, sourceBank.length)].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  questionCount === count
                    ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setOnlyWrongQuestions(false);
            handleStartSession();
          }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Start Practice Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 3. RESULT SCREEN
  if (sessionState === 'result') {
    const correctCount = answeredResults.filter((r) => r.isCorrect).length;
    const totalCount = sessionQuestions.length;
    const percent = Math.round((correctCount / totalCount) * 100);
    const wrongItems = answeredResults.filter((r) => !r.isCorrect).map((r) => r.question);

    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs text-center space-y-6 animate-in fade-in duration-150">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Practice Complete</h2>
          <p className="text-xs text-slate-500 mt-1">
            {chapterMode ? activeChapter?.title : activeBook.title}
          </p>
        </div>

        {/* Score Box */}
        <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="text-4xl font-extrabold text-slate-900">
            {correctCount} <span className="text-lg text-slate-400 font-normal">/ {totalCount}</span>
          </div>
          <div className="text-base font-bold text-blue-600 mt-1">{percent}% Accuracy</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {wrongItems.length > 0 && (
            <button
              onClick={() => handleStartSession(wrongItems)}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Practice {wrongItems.length} Missed Questions</span>
            </button>
          )}

          <button
            onClick={() => setSessionState('setup')}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs shadow-2xs transition-colors"
          >
            Configure New Session
          </button>
        </div>
      </div>
    );
  }

  // 2. ACTIVE PRACTICE SESSION
  const correctSoFar = answeredResults.filter((r) => r.isCorrect).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Live Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
            Question {currentIndex + 1} of {sessionQuestions.length}
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
              currentQ.difficulty === 'easy'
                ? 'bg-emerald-50 text-emerald-700'
                : currentQ.difficulty === 'medium'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {currentQ.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-600">{correctSoFar} Correct</span>
          <span className="text-slate-300">|</span>
          <span className="text-rose-600">{answeredResults.length - correctSoFar} Incorrect</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <div>
          <span className="text-xs text-slate-400 font-medium">{currentQ.chapterTitle}</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options for MCQ / True-False */}
        {(currentQ.questionType === 'mcq' || currentQ.questionType === 'true-false') && currentQ.options && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentQ.correctAnswerIndex;

              let style = 'bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-slate-50';

              if (hasAnswered) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  style = 'bg-white border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleAnswerMCQ(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the blank input */}
        {currentQ.questionType === 'fill-blank' && (
          <form onSubmit={handleAnswerFillBlank} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                disabled={hasAnswered}
                value={fillInputText}
                onChange={(e) => setFillInputText(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              {!hasAnswered && (
                <button
                  type="submit"
                  disabled={!fillInputText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Check Answer
                </button>
              )}
            </div>

            {hasAnswered && (
              <div className="text-xs text-slate-600 pt-1">
                Target answer: <span className="font-bold text-slate-900">{currentQ.correctAnswerText || currentQ.options?.[currentQ.correctAnswerIndex || 0]}</span>
              </div>
            )}
          </form>
        )}

        {/* Immediate Explanation Box */}
        {hasAnswered && (
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Explanation & Document Citation</span>
              {currentQ.pageNumber && (
                <span className="text-[11px] font-mono text-slate-500">
                  Page {currentQ.pageNumber} ({currentQ.sourceSection || 'Chapter Section'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next Question CTA */}
        {hasAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentIndex < sessionQuestions.length - 1 ? 'Next Question' : 'View Practice Result'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
