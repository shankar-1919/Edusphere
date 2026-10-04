export type FileType = 'PDF' | 'EPUB' | 'TXT' | 'DOCX';

export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'short-answer';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FlashcardMastery = 'new' | 'learning' | 'known' | 'need-review';

export interface KeyConcept {
  id: string;
  term: string;
  definition: string;
  importance: 'foundational' | 'high' | 'medium';
  example?: string;
  pageNumber?: number;
}

export interface Flashcard {
  id: string;
  chapterId?: string;
  question: string;
  answer: string;
  category: string;
  difficulty: Difficulty;
  mastery: FlashcardMastery;
  sourceSection?: string;
  pageNumber?: number;
  lastReviewed?: string;
}

export interface QuestionItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  question: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  options?: string[]; // for MCQ
  correctAnswerIndex?: number; // for MCQ & True/False
  correctAnswerText?: string; // for Fill-in-the-blank & short-answer
  explanation: string;
  topic: string;
  sourceSection?: string;
  pageNumber?: number;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface SummarySection {
  heading: string;
  content: string;
  bulletPoints?: string[];
  formulasOrSteps?: string[];
}

export interface ChapterSummary {
  whatYouWillLearn: string[];
  overview: string;
  sections: SummarySection[];
  keyTakeaways: string[];
  snippets?: CodeSnippet[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  readTime: string;
  progress: number;
  pageRange?: string;
  summary: ChapterSummary;
  flashcards: Flashcard[];
  questionBank: QuestionItem[];
  keyConcepts: KeyConcept[];
  learningObjectives: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  fileType: FileType;
  fileSize: string;
  pages: number;
  chaptersCount: number;
  topicsCount: number;
  conceptsCount: number;
  quizQuestionsCount: number;
  progress: number;
  lastStudied: string;
  coverGradient: string;
  badge: string;
  rawExtractedText?: string;
  chapters: Chapter[];
  weakTopics: string[];
  strongTopics: string[];
}

export interface PracticeConfig {
  chapterId?: string | 'all';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  questionTypes: QuestionType[];
  onlyWrongQuestions?: boolean;
}

export interface UserStats {
  booksUploaded: number;
  topicsCompleted: number;
  flashcardsReviewed: number;
  flashcardsNeedingReview: number;
  averageQuizScore: number;
  practiceAccuracy: number;
  practiceCompletedCount: number;
  overallProgress: number;
  studyStreakDays: number;
  strongTopics: string[];
  weakTopics: string[];
  weeklyActivity: { day: string; minutes: number; cardsCount: number }[];
  recentScores: {
    id: string;
    date: string;
    bookTitle: string;
    itemTitle: string;
    score: number;
    total: number;
    percentage: number;
    type: 'quiz' | 'exam' | 'practice';
  }[];
}
