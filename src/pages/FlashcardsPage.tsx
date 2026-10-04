import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Shuffle,
  Volume2,
  Sparkles,
  ArrowLeft,
  Filter,
  Plus,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Difficulty, Flashcard, FlashcardMastery } from '../types';

interface FlashcardsPageProps {
  chapterMode?: boolean;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ chapterMode = false }) => {
  const {
    activeBook,
    activeChapter,
    updateFlashcardStatus,
    generateMoreCardsForChapter,
    navigateTo
  } = useApp();

  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterMastery, setFilterMastery] = useState<string>('all');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  // All cards for current scope
  const rawCards: Flashcard[] = useMemo(() => {
    if (!activeBook) return [];
    if (chapterMode && activeChapter) {
      return activeChapter.flashcards;
    }
    return activeBook.chapters.flatMap((c) => c.flashcards);
  }, [activeBook, activeChapter, chapterMode]);

  // Filtered cards
  const cards: Flashcard[] = useMemo(() => {
    return rawCards.filter((card) => {
      if (filterDifficulty !== 'all' && card.difficulty !== filterDifficulty) return false;
      if (filterMastery === 'need-review' && card.mastery !== 'need-review') return false;
      if (filterMastery === 'known' && card.mastery !== 'known') return false;
      return true;
    });
  }, [rawCards, filterDifficulty, filterMastery]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterDifficulty, filterMastery, rawCards.length]);

  const currentCard = cards[currentIndex] || cards[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Digit1') {
        handleMark('need-review');
      } else if (e.code === 'Digit2') {
        handleMark('known');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    // Shuffle in place
    setCurrentIndex(0);
  };

  const handleMark = (mastery: FlashcardMastery) => {
    if (!currentCard) return;
    updateFlashcardStatus(currentCard.id, mastery);

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGenerateMore = async () => {
    if (!activeChapter) return;
    setIsGeneratingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    generateMoreCardsForChapter(activeChapter.id);
    setIsGeneratingMore(false);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!activeBook || rawCards.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">No Flashcards Available</h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload or select a chapter to begin practicing flashcards.
        </p>
      </div>
    );
  }

  const needReviewCount = rawCards.filter((c) => c.mastery === 'need-review').length;
  const knownCount = rawCards.filter((c) => c.mastery === 'known').length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      {!chapterMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <button
              onClick={() => navigateTo('book-overview')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Flashcard Decks</h1>
            <p className="text-xs text-slate-500">{activeBook.title} · {rawCards.length} Total Cards</p>
          </div>
        </div>
      )}

      {/* Control Bar: Filters & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status Filters */}
          <div className="flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'all', label: `All (${rawCards.length})` },
              { id: 'need-review', label: `Need Review (${needReviewCount})` },
              { id: 'known', label: `Known (${knownCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterMastery(tab.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterMastery === tab.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Generate More & Shuffle */}
          <div className="flex items-center gap-2">
            {chapterMode && (
              <button
                onClick={handleGenerateMore}
                disabled={isGeneratingMore}
                className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isGeneratingMore ? 'Synthesizing...' : 'Generate More'}</span>
              </button>
            )}

            <button
              onClick={handleShuffle}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-500" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Linear progress & card counter */}
        {cards.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="text-slate-400">Card Progress</span>
              <span className="font-mono">
                {currentIndex + 1} / {cards.length}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No cards in this filter</h3>
          <p className="text-xs text-slate-500">
            {filterMastery === 'need-review'
              ? 'Great work! No cards are currently flagged as needing review.'
              : 'Try changing your filter settings.'}
          </p>
          <button
            onClick={() => {
              setFilterMastery('all');
              setFilterDifficulty('all');
            }}
            className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Show All Cards
          </button>
        </div>
      ) : (
        <>
          {/* Large Centered 3D Interactive Flashcard */}
          <div className="perspective-1000">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative min-h-[300px] sm:min-h-[340px] w-full rounded-2xl cursor-pointer select-none transition-transform duration-500 transform-style-3d shadow-xs hover:shadow-sm border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between ${
                isFlipped ? 'rotate-y-180 bg-blue-50/20' : ''
              }`}
            >
              {/* Card Front */}
              <div
                className={`flex flex-col justify-between h-full backface-hidden ${
                  isFlipped ? 'hidden' : 'flex'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-600">
                      {currentCard.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        currentCard.difficulty === 'easy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : currentCard.difficulty === 'medium'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {currentCard.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.question);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto py-6 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                    {currentCard.question}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                    <Bookmark className="w-3.5 h-3.5 text-slate-600" />
                    <span>{currentCard.sourceSection || 'Section 1'} {currentCard.pageNumber ? `(p. ${currentCard.pageNumber})` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click or Space to flip</span>
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div
                className={`flex flex-col justify-between h-full backface-hidden rotate-y-180 ${
                  !isFlipped ? 'hidden' : 'flex'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-600">
                    Grounded Definition / Answer
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.answer);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto py-6 text-center">
                  <p className="text-base sm:text-xl font-medium text-slate-800 leading-relaxed">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Need Review | Known */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => handleMark('need-review')}
              className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                currentCard.mastery === 'need-review'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-white hover:bg-rose-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <X className="w-4 h-4 text-rose-500" />
              <span>Need Review</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(1)</span>
            </button>

            <button
              onClick={() => handleMark('known')}
              className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                currentCard.mastery === 'known'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Known</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(2)</span>
            </button>
          </div>

          {/* Bottom Navigation: Previous | Next */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-[11px] text-slate-400 font-mono">
              Space = flip | 1 = Need review | 2 = Known
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
