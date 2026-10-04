import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SettingsModal } from '../../pages/SettingsModal';
import { useApp } from '../../context/AppContext';
import { LandingPage } from '../../pages/LandingPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { UploadPage } from '../../pages/UploadPage';
import { BookOverviewPage } from '../../pages/BookOverviewPage';
import { ChapterStudyPage } from '../../pages/ChapterStudyPage';
import { FlashcardsPage } from '../../pages/FlashcardsPage';
import { QuizPage } from '../../pages/QuizPage';
import { PracticePage } from '../../pages/PracticePage';
import { PracticeExamPage } from '../../pages/PracticeExamPage';
import { ProgressPage } from '../../pages/ProgressPage';
import { MyBooksPage } from '../../pages/MyBooksPage';

export const AppLayout: React.FC = () => {
  const { currentView } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Landing page renders without dashboard sidebar
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage onOpenSettings={() => setSettingsOpen(true)} />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'upload':
        return <UploadPage />;
      case 'my-books':
        return <MyBooksPage />;
      case 'book-overview':
        return <BookOverviewPage />;
      case 'chapter-study':
        return <ChapterStudyPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'practice':
        return <PracticePage />;
      case 'practice-exam':
        return <PracticeExamPage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      </div>

      {/* Mobile Top Navbar */}
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};
