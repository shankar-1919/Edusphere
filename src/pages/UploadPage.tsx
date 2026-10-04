import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';

export const UploadPage: React.FC = () => {
  const { addBook, selectBook } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    sizeFormatted: string;
    estimatedPages: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const processingSteps = [
    'Reading document',
    'Detecting chapters',
    'Understanding topics',
    'Creating study structure',
    'Preparing resources'
  ];

  const handleFile = (file: File) => {
    if (!file) return;
    const estPages = Math.max(15, Math.min(650, Math.round(file.size / 38000) || 240));
    setSelectedFile({
      file,
      name: file.name,
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      estimatedPages: estPages
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sampleName: string, pages: number) => {
    // Create a mock File object
    const blob = new Blob(['Mock PDF content for sample textbook analysis'], {
      type: 'application/pdf'
    });
    const file = new File([blob], sampleName, { type: 'application/pdf' });
    setSelectedFile({
      file,
      name: sampleName,
      sizeFormatted: '16.4 MB',
      estimatedPages: pages
    });
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setProgressPercent(10);

    try {
      const generatedBook = await AIService.analyzeDocument(
        selectedFile.file,
        (stepIdx, stepName, pct) => {
          setCurrentStepIndex(stepIdx);
          setProgressPercent(pct);
        }
      );

      // Add to store and navigate to Book Overview
      addBook(generatedBook);
      selectBook(generatedBook.id, 'book-overview');
    } catch (err) {
      console.error('Analysis error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Upload Study Material
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload any PDF textbook, lecture notes, or course guide to generate study tools.
        </p>
      </div>

      {/* AI Processing Screen */}
      {isProcessing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Analyzing your book...</h2>
            <p className="text-xs text-slate-500 mt-1">
              Extracting knowledge structures, generating flashcards and questions
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>{processingSteps[currentStepIndex]}</span>
              <span className="text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Processing Steps Checklist */}
          <div className="max-w-xs mx-auto text-left space-y-2.5 pt-4 border-t border-slate-100">
            {processingSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-xs ${
                    isCompleted
                      ? 'text-slate-900 font-medium'
                      : isCurrent
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-200 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div className="space-y-6">
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all bg-white ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/40 scale-[0.99]'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">Upload your study material</h3>
              <p className="text-sm text-slate-500 mt-1">
                Drag & drop your PDF here
              </p>

              <div className="my-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
                or
              </div>

              <button
                type="button"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-2xs transition-colors pointer-events-none"
              >
                Choose PDF
              </button>

              <div className="mt-4 text-[11px] text-slate-600 font-medium">
                Supported format: <span className="text-slate-700 font-semibold">PDF</span> (up to 100MB)
              </div>
            </div>
          ) : (
            /* Selected File Card */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedFile.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedFile.estimatedPages} pages · {selectedFile.sizeFormatted}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Ready for AI Chapter & Study Synthesis</span>
                </div>
                <span className="font-semibold text-slate-900">Estimated ~3 seconds</span>
              </div>

              <button
                onClick={handleStartAnalysis}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze with AI</span>
              </button>
            </div>
          )}

          {/* Quick 1-Click Sample Textbooks */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Or test with ready sample textbooks:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() =>
                  handleSampleSelect('Data_Structures_and_Algorithms.pdf', 380)
                }
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all text-xs group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                  Data Structures & Algorithms
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">380 pages · CS Core</div>
              </button>

              <button
                onClick={() =>
                  handleSampleSelect('Computer_Networks_Top_Down_Approach.pdf', 420)
                }
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all text-xs group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                  Computer Networks
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">420 pages · Networking</div>
              </button>

              <button
                onClick={() =>
                  handleSampleSelect('Organic_Chemistry_Principles.pdf', 290)
                }
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all text-xs group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                  Organic Chemistry
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">290 pages · Chemistry</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
