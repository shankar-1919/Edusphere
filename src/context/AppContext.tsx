import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, UserStats, Chapter, QuestionItem, FlashcardMastery } from '../types';
import { initialBooks, initialStats } from '../data/sampleBooks';
import { AIService } from '../services/aiService';

export type NavView =
  | 'landing'
  | 'dashboard'
  | 'my-books'
  | 'upload'
  | 'book-overview'
  | 'chapter-study'
  | 'flashcards'
  | 'quiz'
  | 'practice'
  | 'practice-exam'
  | 'progress'
  | 'settings';

export type ChapterTab = 'summary' | 'overview' | 'flashcards' | 'quiz' | 'practice';

interface AppContextType {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  books: Book[];
  activeBookId: string | null;
  activeChapterId: string | null;
  activeChapterTab: ChapterTab;
  setActiveChapterTab: (tab: ChapterTab) => void;
  stats: UserStats;
  activeBook: Book | null;
  activeChapter: Chapter | null;
  wrongQuestionsPool: QuestionItem[];
  
  // Navigation & Actions
  navigateTo: (view: NavView) => void;
  selectBook: (bookId: string, targetView?: NavView) => void;
  selectChapter: (chapterId: string, tab?: ChapterTab) => void;
  addBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  updateFlashcardStatus: (cardId: string, mastery: FlashcardMastery) => void;
  generateMoreCardsForChapter: (chapterId: string) => void;
  recordQuizResult: (bookId: string, chapterId: string, score: number, total: number, wrongTopics: string[]) => void;
  recordPracticeResult: (bookId: string, score: number, total: number, wrongQuestions: QuestionItem[]) => void;
  recordExamResult: (bookId: string, score: number, total: number, wrongTopics: string[]) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_BOOKS = 'edusphere_books_v2';
const STORAGE_KEY_STATS = 'edusphere_stats_v2';
const STORAGE_KEY_WRONG_Q = 'edusphere_wrong_q_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<NavView>('landing');
  const [activeBookId, setActiveBookId] = useState<string | null>('python-programming');
  const [activeChapterId, setActiveChapterId] = useState<string | null>('py-ch-2');
  const [activeChapterTab, setActiveChapterTab] = useState<ChapterTab>('summary');

  // Load books with fallback
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load books from localStorage', e);
    }
    return initialBooks;
  });

  // Load stats with fallback
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load stats from localStorage', e);
    }
    return initialStats;
  });

  // Load wrong questions pool
  const [wrongQuestionsPool, setWrongQuestionsPool] = useState<QuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WRONG_Q);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    } catch (e) {
      console.error('Persist books failed', e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Persist stats failed', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WRONG_Q, JSON.stringify(wrongQuestionsPool));
    } catch (e) {
      // ignore
    }
  }, [wrongQuestionsPool]);

  const activeBook = books.find((b) => b.id === activeBookId) || books[0] || null;
  const activeChapter =
    activeBook?.chapters.find((c) => c.id === activeChapterId) ||
    activeBook?.chapters[0] ||
    null;

  const navigateTo = (view: NavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectBook = (bookId: string, targetView: NavView = 'book-overview') => {
    setActiveBookId(bookId);
    const book = books.find((b) => b.id === bookId);
    if (book && book.chapters.length > 0) {
      setActiveChapterId(book.chapters[0].id);
    }
    navigateTo(targetView);
  };

  const selectChapter = (chapterId: string, tab: ChapterTab = 'summary') => {
    setActiveChapterId(chapterId);
    setActiveChapterTab(tab);
    navigateTo('chapter-study');
  };

  const addBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    setActiveBookId(newBook.id);
    if (newBook.chapters.length > 0) {
      setActiveChapterId(newBook.chapters[0].id);
    }
    setStats((prev) => ({
      ...prev,
      booksUploaded: prev.booksUploaded + 1
    }));
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => {
      const filtered = prev.filter((b) => b.id !== bookId);
      if (activeBookId === bookId && filtered.length > 0) {
        setActiveBookId(filtered[0].id);
        if (filtered[0].chapters.length > 0) {
          setActiveChapterId(filtered[0].chapters[0].id);
        }
      }
      return filtered;
    });
    setStats((prev) => ({
      ...prev,
      booksUploaded: Math.max(0, prev.booksUploaded - 1)
    }));
  };

  const updateFlashcardStatus = (cardId: string, mastery: FlashcardMastery) => {
    if (!activeBookId) return;

    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== activeBookId) return book;
        const updatedChapters = book.chapters.map((ch) => {
          const updatedCards = ch.flashcards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                mastery,
                lastReviewed: 'Just now'
              };
            }
            return card;
          });
          return { ...ch, flashcards: updatedCards };
        });
        return { ...book, chapters: updatedChapters };
      })
    );

    // Count cards needing review across active book
    const needReviewCount = activeBook?.chapters.flatMap(c => c.flashcards).filter(c => c.mastery === 'need-review').length || 0;

    setStats((prev) => ({
      ...prev,
      flashcardsReviewed: prev.flashcardsReviewed + 1,
      flashcardsNeedingReview: needReviewCount
    }));
  };

  const generateMoreCardsForChapter = (chapterId: string) => {
    if (!activeBook) return;
    const ch = activeBook.chapters.find((c) => c.id === chapterId);
    if (!ch) return;

    const newCards = AIService.generateMoreFlashcards(ch, ch.flashcards.length);

    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== activeBook.id) return book;
        const updatedChapters = book.chapters.map((chapter) => {
          if (chapter.id === chapterId) {
            return {
              ...chapter,
              flashcards: [...chapter.flashcards, ...newCards]
            };
          }
          return chapter;
        });
        return { ...book, chapters: updatedChapters };
      })
    );
  };

  const recordQuizResult = (
    bookId: string,
    chapterId: string,
    score: number,
    total: number,
    wrongTopics: string[]
  ) => {
    const percentage = Math.round((score / total) * 100);

    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== bookId) return book;
        const updatedChapters = book.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              progress: Math.max(ch.progress, percentage)
            };
          }
          return ch;
        });

        const avgProg = Math.round(
          updatedChapters.reduce((acc, c) => acc + c.progress, 0) / updatedChapters.length
        );
        const newWeak = AIService.diagnoseWeakTopics(wrongTopics, book.weakTopics);

        return {
          ...book,
          progress: avgProg,
          lastStudied: 'Just now',
          weakTopics: newWeak,
          chapters: updatedChapters
        };
      })
    );

    setStats((prev) => {
      const newScores = [
        {
          id: `score-${Date.now()}`,
          date: 'Just now',
          bookTitle: activeBook?.title || 'Study Book',
          itemTitle: `Chapter Quiz (${activeChapter?.title || 'Quiz'})`,
          score,
          total,
          percentage,
          type: 'quiz' as const
        },
        ...prev.recentScores
      ].slice(0, 15);

      const allPercents = newScores.filter((s) => s.type === 'quiz').map((s) => s.percentage);
      const avg =
        allPercents.length > 0
          ? Math.round(allPercents.reduce((a, b) => a + b, 0) / allPercents.length)
          : prev.averageQuizScore;

      const newWeak = AIService.diagnoseWeakTopics(wrongTopics, prev.weakTopics);

      return {
        ...prev,
        topicsCompleted: prev.topicsCompleted + (percentage >= 80 ? 1 : 0),
        averageQuizScore: avg,
        recentScores: newScores,
        weakTopics: newWeak
      };
    });
  };

  const recordPracticeResult = (
    bookId: string,
    score: number,
    total: number,
    wrongQuestions: QuestionItem[]
  ) => {
    const percentage = Math.round((score / total) * 100);

    // Append to wrong questions pool (prevent duplicates by ID)
    if (wrongQuestions.length > 0) {
      setWrongQuestionsPool((prev) => {
        const map = new Map<string, QuestionItem>();
        prev.forEach((q) => map.set(q.id, q));
        wrongQuestions.forEach((q) => map.set(q.id, q));
        return Array.from(map.values()).slice(0, 50);
      });
    }

    setStats((prev) => {
      const newScores = [
        {
          id: `practice-score-${Date.now()}`,
          date: 'Just now',
          bookTitle: activeBook?.title || 'Practice Mode',
          itemTitle: 'Targeted Practice Session',
          score,
          total,
          percentage,
          type: 'practice' as const
        },
        ...prev.recentScores
      ].slice(0, 15);

      const practiceScores = newScores.filter((s) => s.type === 'practice').map((s) => s.percentage);
      const acc =
        practiceScores.length > 0
          ? Math.round(practiceScores.reduce((a, b) => a + b, 0) / practiceScores.length)
          : percentage;

      const wrongTopics = wrongQuestions.map((q) => q.topic);
      const newWeak = AIService.diagnoseWeakTopics(wrongTopics, prev.weakTopics);

      return {
        ...prev,
        practiceAccuracy: acc,
        practiceCompletedCount: prev.practiceCompletedCount + 1,
        recentScores: newScores,
        weakTopics: newWeak
      };
    });
  };

  const recordExamResult = (
    bookId: string,
    score: number,
    total: number,
    wrongTopics: string[]
  ) => {
    const percentage = Math.round((score / total) * 100);

    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== bookId) return book;
        const newWeak = AIService.diagnoseWeakTopics(wrongTopics, book.weakTopics);
        return {
          ...book,
          lastStudied: 'Just now',
          weakTopics: newWeak
        };
      })
    );

    setStats((prev) => {
      const newScores = [
        {
          id: `exam-score-${Date.now()}`,
          date: 'Just now',
          bookTitle: activeBook?.title || 'Study Book',
          itemTitle: 'Comprehensive Practice Exam',
          score,
          total,
          percentage,
          type: 'exam' as const
        },
        ...prev.recentScores
      ].slice(0, 15);

      const newWeak = AIService.diagnoseWeakTopics(wrongTopics, prev.weakTopics);

      return {
        ...prev,
        recentScores: newScores,
        weakTopics: newWeak
      };
    });
  };

  const resetAllData = () => {
    setBooks(initialBooks);
    setStats(initialStats);
    setWrongQuestionsPool([]);
    setActiveBookId('python-programming');
    setActiveChapterId('py-ch-2');
    localStorage.removeItem(STORAGE_KEY_BOOKS);
    localStorage.removeItem(STORAGE_KEY_STATS);
    localStorage.removeItem(STORAGE_KEY_WRONG_Q);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        books,
        activeBookId,
        activeChapterId,
        activeChapterTab,
        setActiveChapterTab,
        stats,
        activeBook,
        activeChapter,
        wrongQuestionsPool,
        navigateTo,
        selectBook,
        selectChapter,
        addBook,
        deleteBook,
        updateFlashcardStatus,
        generateMoreCardsForChapter,
        recordQuizResult,
        recordPracticeResult,
        recordExamResult,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
