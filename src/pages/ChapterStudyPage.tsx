import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowLeft,
  BookMarked,
  Layers,
  HelpCircle,
  Target,
  Send,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Copy,
  Check,
  Bot,
  AlertCircle
} from 'lucide-react';
import { useApp, ChapterTab } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { FlashcardsPage } from './FlashcardsPage';
import { QuizPage } from './QuizPage';
import { PracticePage } from './PracticePage';

export const ChapterStudyPage: React.FC = () => {
  const {
    activeBook,
    activeChapter,
    activeChapterTab,
    setActiveChapterTab,
    selectChapter,
    navigateTo
  } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: 'user' | 'assistant'; text: string; citations?: string[] }[]
  >([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello! I am your AI study assistant grounded strictly on **${
        activeChapter?.title || 'this chapter'
      }** of *${activeBook?.title || 'your book'}*.\n\nAsk me any question, definition, step, or formula from this material!`,
      citations: [`Document Scope: Chapter ${activeChapter?.number || 1}`]
    }
  ]);

  if (!activeBook || !activeChapter) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No chapter selected.</p>
        <button
          onClick={() => navigateTo('my-books')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Select a Book
        </button>
      </div>
    );
  }

  const handleAskAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAsking) return;

    const userQ = chatInput.trim();
    setChatInput('');
    const userMsgId = `user-${Date.now()}`;

    const updatedMessages = [
      ...chatMessages,
      { id: userMsgId, role: 'user' as const, text: userQ }
    ];
    setChatMessages(updatedMessages);
    setIsAsking(true);

    try {
      const historyTurns = updatedMessages.map((m) => ({
        role: m.role,
        content: m.text
      }));

      const aiResponse = await AIService.askChapterAi(
        userQ,
        activeChapter,
        activeBook.title,
        historyTurns
      );

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: aiResponse.text,
          citations: aiResponse.citations
        }
      ]);
    } catch (err) {
      console.error('AI Ask Error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: 'I couldn\'t find this in the uploaded material.'
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentChapterIndex = activeBook.chapters.findIndex(
    (c) => c.id === activeChapter.id
  );
  const nextChapter = activeBook.chapters[currentChapterIndex + 1];
  const prevChapter = activeBook.chapters[currentChapterIndex - 1];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back button & chapter switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigateTo('book-overview')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {activeBook.title}</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {prevChapter && (
            <button
              onClick={() => selectChapter(prevChapter.id, activeChapterTab)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors"
            >
              ← Prev Chapter
            </button>
          )}
          {nextChapter && (
            <button
              onClick={() => selectChapter(nextChapter.id, activeChapterTab)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors"
            >
              Next Chapter →
            </button>
          )}
        </div>
      </div>

      {/* Main Chapter Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Chapter {activeChapter.number}
            </span>
            {activeChapter.pageRange && (
              <span className="text-xs text-slate-400 font-mono">
                · {activeChapter.pageRange}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeChapter.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeBook.title} · Estimated study time: {activeChapter.readTime}
          </p>
        </div>

        {/* 5 Tabs: Summary | Overview | Flashcards | Quiz | Practice */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-sm font-semibold">
          {[
            { id: 'summary' as ChapterTab, label: 'Summary', icon: BookMarked },
            { id: 'overview' as ChapterTab, label: 'Overview', icon: BookOpen },
            { id: 'flashcards' as ChapterTab, label: 'Flashcards', icon: Layers, count: activeChapter.flashcards.length },
            { id: 'quiz' as ChapterTab, label: 'Quiz', icon: HelpCircle, count: 10 },
            { id: 'practice' as ChapterTab, label: 'Practice Mode', icon: Target, count: activeChapter.questionBank.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChapterTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveChapterTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SMART SUMMARY */}
        {activeChapterTab === 'summary' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* What you'll learn */}
            <div className="p-5 bg-blue-50/40 border border-blue-100/80 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>What you'll learn</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {activeChapter.summary.whatYouWillLearn.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Overview text */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Chapter Overview
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                {activeChapter.summary.overview}
              </p>
            </div>

            {/* Detailed Organized Sections */}
            {activeChapter.summary.sections && activeChapter.summary.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-3 p-5 bg-slate-50/60 border border-slate-200/70 rounded-xl">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {section.heading}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {section.content}
                </p>

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-1 pt-1 text-xs sm:text-sm text-slate-600">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.formulasOrSteps && section.formulasOrSteps.length > 0 && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs text-slate-800 font-mono">
                    {section.formulasOrSteps.map((step, stIdx) => (
                      <div key={stIdx}>{step}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Code Snippets */}
            {activeChapter.summary.snippets && activeChapter.summary.snippets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Code & Formulas
                </h3>
                <div className="space-y-3">
                  {activeChapter.summary.snippets.map((snip, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 text-xs font-mono"
                    >
                      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700/80 flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-xs font-sans text-slate-200">
                          {snip.title}
                        </span>
                        <button
                          onClick={() => handleCopyCode(snip.code, idx)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto leading-relaxed text-blue-200">
                        {snip.code}
                      </pre>
                      <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800 text-slate-400 text-[11px] font-sans">
                        {snip.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Concepts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Important Concepts ({activeChapter.keyConcepts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeChapter.keyConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{concept.term}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                          concept.importance === 'foundational'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {concept.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {concept.definition}
                    </p>
                    {concept.pageNumber && (
                      <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60">
                        Page {concept.pageNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Takeaways
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {activeChapter.summary.keyTakeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask about this chapter Section */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span>Ask about this chapter</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI tutor strictly grounded on the uploaded text.
                </p>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white ml-8 sm:ml-12'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 mr-4 sm:mr-8'
                    }`}
                  >
                    <div className="font-semibold text-[11px] mb-1 opacity-80">
                      {msg.role === 'user' ? 'You' : 'EduSphere AI Tutor'}
                    </div>
                    <div className="whitespace-pre-line font-normal">{msg.text}</div>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                        <Bookmark className="w-3 h-3 text-slate-600" />
                        <span>Source: {msg.citations.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}

                {isAsking && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Analyzing your question in context...</span>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">Ask follow-up:</span>
                {[
                  'Give me an example',
                  'Why is this useful?',
                  'Explain it simpler',
                  'How does it work step-by-step?',
                  'Compare with alternatives'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setChatInput(chip);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[11px] font-medium transition-colors shrink-0 border border-slate-200/80"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskAi} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about this chapter..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAsking}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeChapterTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Learning Objectives</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {activeChapter.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div
                onClick={() => setActiveChapterTab('flashcards')}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>{activeChapter.flashcards.length} Flashcards</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Active recall drills with spaced repetition tags.
                </p>
              </div>

              <div
                onClick={() => setActiveChapterTab('quiz')}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>10 Randomized Questions</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Instant evaluation with detailed citations.
                </p>
              </div>

              <div
                onClick={() => setActiveChapterTab('practice')}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Practice Mode</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Custom question count and missed question drills.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLASHCARDS */}
        {activeChapterTab === 'flashcards' && (
          <div className="animate-in fade-in duration-150">
            <FlashcardsPage chapterMode={true} />
          </div>
        )}

        {/* TAB 4: QUIZ */}
        {activeChapterTab === 'quiz' && (
          <div className="animate-in fade-in duration-150">
            <QuizPage chapterMode={true} />
          </div>
        )}

        {/* TAB 5: PRACTICE MODE */}
        {activeChapterTab === 'practice' && (
          <div className="animate-in fade-in duration-150">
            <PracticePage chapterMode={true} />
          </div>
        )}
      </div>
    </div>
  );
};
