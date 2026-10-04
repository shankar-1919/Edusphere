import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  ArrowLeft,
  Sparkles,
  Eye,
  Shuffle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem } from '../types';
import { fireConfetti } from '../utils/confetti';

interface QuizPageProps {
  chapterMode?: boolean;
}

export const QuizPage: React.FC<QuizPageProps> = ({ chapterMode = false }) => {
  const {
    activeBook,
    activeChapter,
    recordQuizResult,
    navigateTo
  } = useApp();

  // Source bank
  const sourceBank: QuestionItem[] = useMemo(() => {
    if (!activeBook) return [];
    if (chapterMode && activeChapter) {
      return activeChapter.questionBank;
    }
    return activeBook.chapters.flatMap((c) => c.questionBank);
  }, [activeBook, activeChapter, chapterMode]);

  // Active randomized 10-question set
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [fillInput, setFillInput] = useState('');
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedIndex?: number; textAnswer?: string; isCorrect: boolean; topic: string }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Initialize randomized quiz questions
  const initializeQuiz = () => {
    if (sourceBank.length === 0) return;
    const shuffled = [...sourceBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setFillInput('');
    setHasSubmittedAnswer(false);
    setUserAnswers([]);
    setIsCompleted(false);
    setIsReviewMode(false);
  };

  useEffect(() => {
    initializeQuiz();
  }, [activeBook?.id, activeChapter?.id, chapterMode, sourceBank.length]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer || !currentQuestion) return;
    setSelectedOptionIndex(idx);
    setHasSubmittedAnswer(true);

    const isCorrect = idx === currentQuestion.correctAnswerIndex;
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: idx,
        isCorrect,
        topic: currentQuestion.topic
      }
    ]);
  };

  const handleFillAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasSubmittedAnswer || !currentQuestion || !fillInput.trim()) return;
    setHasSubmittedAnswer(true);

    const cleanInput = fillInput.trim().toLowerCase();
    const cleanTarget = (currentQuestion.correctAnswerText || '').toLowerCase();
    const isCorrect =
      cleanInput === cleanTarget ||
      (currentQuestion.options && currentQuestion.correctAnswerIndex !== undefined &&
        currentQuestion.options[currentQuestion.correctAnswerIndex]?.toLowerCase().includes(cleanInput));

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        textAnswer: fillInput.trim(),
        isCorrect,
        topic: currentQuestion.topic
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setFillInput('');
      setHasSubmittedAnswer(false);
    } else {
      // Quiz Finished!
      setIsCompleted(true);
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const wrongTopics = userAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => a.topic);

      if (activeBook && activeChapter) {
        recordQuizResult(
          activeBook.id,
          activeChapter.id,
          correctCount,
          questions.length,
          wrongTopics
        );
      }

      if (correctCount / (questions.length || 1) >= 0.7) {
        fireConfetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  if (!activeBook || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">No Quiz Questions Available</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select or upload a chapter with questions to begin.
        </p>
      </div>
    );
  }

  // QUIZ RESULT SCREEN
  if (isCompleted && !isReviewMode) {
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const totalCount = questions.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    const incorrectCount = totalCount - correctCount;

    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs text-center space-y-6 animate-in fade-in duration-150">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quiz Result</h2>
          <p className="text-xs text-slate-500 mt-1">
            {chapterMode ? activeChapter?.title : activeBook.title}
          </p>
        </div>

        {/* Large Score Metric */}
        <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900">
            {correctCount} <span className="text-xl sm:text-2xl font-normal text-slate-400">/ {totalCount}</span>
          </div>
          <div className="text-lg font-bold text-blue-600 mt-1">
            {percentage}%
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Answered</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{totalCount}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Correct</div>
              <div className="font-bold text-emerald-600 text-sm mt-0.5">{correctCount}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Incorrect</div>
              <div className="font-bold text-rose-600 text-sm mt-0.5">{incorrectCount}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsReviewMode(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Review Answers</span>
          </button>

          <button
            onClick={initializeQuiz}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (New Questions)</span>
          </button>
        </div>
      </div>
    );
  }

  // REVIEW ANSWERS MODE
  if (isReviewMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Review Answers</h2>
            <p className="text-xs text-slate-500">Explanations and citations from the uploaded material</p>
          </div>
          <button
            onClick={() => setIsReviewMode(false)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Back to Result
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAns = userAnswers.find((a) => a.questionId === q.id);
            const isCorrect = userAns?.isCorrect;

            return (
              <div
                key={q.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400">
                    Question {idx + 1} of {questions.length} · {q.topic}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="font-semibold text-slate-900 text-sm">{q.question}</p>

                {/* Options List */}
                {q.options && (
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswerIndex;
                      const isUserChoice = userAns?.selectedIndex === optIdx;

                      let optStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (isUserChoice && !isCorrectOpt) {
                        optStyle = 'bg-rose-50/80 border-rose-300 text-rose-900';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {isCorrectOpt && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation with Citation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span>Explanation:</span>
                    {q.pageNumber && (
                      <span className="text-[10px] font-mono text-slate-500">
                        Page {q.pageNumber} ({q.sourceSection || 'Chapter Section'})
                      </span>
                    )}
                  </div>
                  <p>{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION SCREEN
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {!chapterMode && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <button
              onClick={() => navigateTo('book-overview')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeBook.title} Quiz
            </h1>
          </div>
          <button
            onClick={initializeQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500" />
            <span>New Questions</span>
          </button>
        </div>
      )}

      {/* Counter & Progress bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-50 text-emerald-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          <span className="text-slate-400 font-mono">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* MCQ / True-False Options */}
        {currentQuestion.options && (
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;

              let buttonStyle =
                'border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-800 bg-white';

              if (hasSubmittedAnswer) {
                if (isCorrect) {
                  buttonStyle =
                    'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs';
                } else if (isSelected && !isCorrect) {
                  buttonStyle =
                    'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  buttonStyle = 'border-slate-100 text-slate-400 opacity-60 bg-white';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasSubmittedAnswer}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {hasSubmittedAnswer && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {hasSubmittedAnswer && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in blank input */}
        {currentQuestion.questionType === 'fill-blank' && (
          <form onSubmit={handleFillAnswer} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                disabled={hasSubmittedAnswer}
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              {!hasSubmittedAnswer && (
                <button
                  type="submit"
                  disabled={!fillInput.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Check
                </button>
              )}
            </div>
          </form>
        )}

        {/* Feedback / Short Explanation once answered */}
        {hasSubmittedAnswer && (
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">
                {selectedOptionIndex === currentQuestion.correctAnswerIndex || userAnswers[userAnswers.length - 1]?.isCorrect ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </span>

              {currentQuestion.pageNumber && (
                <span className="text-[11px] font-mono text-slate-500">
                  Page {currentQuestion.pageNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Question CTA */}
        {hasSubmittedAnswer && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Result'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
