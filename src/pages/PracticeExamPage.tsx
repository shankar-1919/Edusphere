import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Clock,
  Flag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Check,
  Eye,
  Shuffle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem } from '../types';
import { fireConfetti } from '../utils/confetti';

export const PracticeExamPage: React.FC = () => {
  const { activeBook, recordExamResult, navigateTo, selectChapter } = useApp();

  // Aggregate full question bank across all chapters
  const allBookQuestions: QuestionItem[] = useMemo(() => {
    if (!activeBook) return [];
    return activeBook.chapters.flatMap((c) => c.questionBank);
  }, [activeBook]);

  // Randomized 30-question test set
  const [examQuestions, setExamQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 mins
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const initializeExam = () => {
    if (allBookQuestions.length === 0) return;
    const shuffled = [...allBookQuestions].sort(() => Math.random() - 0.5);
    // Take up to 30 questions
    const targetCount = Math.min(30, Math.max(10, shuffled.length));
    const selected = shuffled.slice(0, targetCount);

    setExamQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(Math.min(45, targetCount * 1.5) * 60);
    setIsTimerActive(true);
    setIsSubmitted(false);
    setIsReviewMode(false);
  };

  useEffect(() => {
    initializeExam();
  }, [activeBook?.id, allBookQuestions.length]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerActive || isSubmitted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, isSubmitted]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentIndex];

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setIsTimerActive(false);
    setShowConfirmModal(false);

    let correctCount = 0;
    const wrongTopics: string[] = [];

    examQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctAnswerIndex) {
        correctCount++;
      } else {
        if (q.topic) wrongTopics.push(q.topic);
      }
    });

    if (activeBook) {
      recordExamResult(activeBook.id, correctCount, examQuestions.length, wrongTopics);
    }

    if (correctCount / (examQuestions.length || 1) >= 0.75) {
      fireConfetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  if (!activeBook || examQuestions.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
        <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Exam Questions Available</h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload or select a textbook to generate a complete practice exam.
        </p>
      </div>
    );
  }

  // REVIEW ALL EXAM ANSWERS MODE
  if (isReviewMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exam Question Review</h2>
            <p className="text-xs text-slate-500">Detailed question-wise breakdown with source citations</p>
          </div>
          <button
            onClick={() => setIsReviewMode(false)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Back to Score
          </button>
        </div>

        <div className="space-y-4">
          {examQuestions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400">
                    Question {idx + 1} of {examQuestions.length} · {q.chapterTitle}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      !isAnswered
                        ? 'bg-slate-100 text-slate-600'
                        : isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {!isAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="font-semibold text-slate-900 text-sm">{q.question}</p>

                {q.options && (
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswerIndex;
                      const isUserSelection = userChoice === optIdx;

                      let optStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (isCorrectOpt) {
                        optStyle = 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (isUserSelection && !isCorrectOpt) {
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
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

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

  // EXAM RESULT SCREEN
  if (isSubmitted) {
    let correctCount = 0;
    let unansweredCount = 0;
    const wrongTopicsSet = new Set<string>();

    examQuestions.forEach((q) => {
      const userChoice = selectedAnswers[q.id];
      if (userChoice === undefined) {
        unansweredCount++;
        if (q.topic) wrongTopicsSet.add(q.topic);
      } else if (userChoice === q.correctAnswerIndex) {
        correctCount++;
      } else {
        if (q.topic) wrongTopicsSet.add(q.topic);
      }
    });

    const totalCount = examQuestions.length;
    const incorrectCount = totalCount - correctCount - unansweredCount;
    const percentage = Math.round((correctCount / totalCount) * 100);
    const weakTopicsList = Array.from(wrongTopicsSet);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Exam Result</h2>
            <p className="text-xs text-slate-500 mt-1">{activeBook.title} Comprehensive Exam</p>
          </div>

          {/* Large Score Box */}
          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900">
              {correctCount} <span className="text-xl text-slate-400 font-normal">/ {totalCount}</span>
            </div>
            <div className="text-lg font-bold text-blue-600 mt-1">
              {percentage}%
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200 text-xs">
              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-emerald-700 font-semibold">Correct</div>
                <div className="font-bold text-emerald-800 text-base mt-0.5">{correctCount}</div>
              </div>
              <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                <div className="text-rose-700 font-semibold">Incorrect</div>
                <div className="font-bold text-rose-800 text-base mt-0.5">{incorrectCount}</div>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-slate-600 font-semibold">Unanswered</div>
                <div className="font-bold text-slate-800 text-base mt-0.5">{unansweredCount}</div>
              </div>
            </div>
          </div>

          {/* Topics that need improvement */}
          {weakTopicsList.length > 0 && (
            <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Topics that need improvement</span>
              </div>
              <p className="text-xs text-amber-800/80">
                AI diagnostic detected lower retention in the following topics from {activeBook.title}:
              </p>
              <ul className="space-y-1.5">
                {weakTopicsList.slice(0, 5).map((topic, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (activeBook.chapters.length > 0) {
                      selectChapter(activeBook.chapters[0].id, 'summary');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <span>Review Weak Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsReviewMode(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Review All Questions</span>
            </button>

            <button
              onClick={initializeExam}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam (New Question Set)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM INTERFACE
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header with Countdown Timer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigateTo('book-overview')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Exam</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {activeBook.title} Practice Exam
          </h1>
          <p className="text-xs text-slate-500">
            {answeredCount} of {examQuestions.length} questions answered
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-mono font-bold border ${
              secondsRemaining < 300
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Question {currentIndex + 1} of {examQuestions.length}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  · {currentQuestion.chapterTitle}
                </span>
              </div>

              {/* Flag for review button */}
              <button
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'text-slate-500 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Mark for review'}
                </span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            {currentQuestion.options && (
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-semibold shadow-2xs'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Next / Previous & Submit buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < examQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  <span>Finish & Submit</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation Grid (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 sticky top-20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Navigator ({examQuestions.length})
            </h4>

            <div className="grid grid-cols-5 gap-2 text-xs font-mono font-semibold max-h-72 overflow-y-auto pr-1">
              {examQuestions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const isFlagged = flaggedQuestions[q.id];

                let itemClass = 'border-slate-200 bg-slate-50 text-slate-600';
                if (isCurrent) {
                  itemClass = 'border-blue-600 bg-blue-600 text-white font-bold ring-2 ring-blue-200';
                } else if (isFlagged) {
                  itemClass = 'border-amber-400 bg-amber-50 text-amber-900';
                } else if (isAnswered) {
                  itemClass = 'border-emerald-300 bg-emerald-50 text-emerald-800';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border flex items-center justify-center transition-all ${itemClass}`}
                  >
                    {idx + 1}
                    {isAnswered && !isCurrent && <span className="text-[9px] ml-0.5">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span>Current question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span>Flagged for review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Submit Practice Exam?</h3>
            <p className="text-xs text-slate-600">
              You have answered <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
              <span className="font-bold text-slate-900">{examQuestions.length}</span> questions.
              {answeredCount < examQuestions.length && (
                <span className="block mt-1 text-amber-700 font-semibold">
                  You have {examQuestions.length - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
