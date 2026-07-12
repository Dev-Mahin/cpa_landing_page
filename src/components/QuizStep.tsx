import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Loader2, Sparkles, Star, Users } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data';

interface QuizStepProps {
  onComplete: (userAnswers: Record<string, string>) => void;
}

export default function QuizStep({ onComplete }: QuizStepProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const verificationMessages = [
    'Verifying your United States IP address...',
    'Checking device compatibility and browser signatures...',
    'Allocating direct-payout reward slots for today...',
    'Unlocking premium USA high-converting offers...'
  ];

  const handleSelectOption = (option: string) => {
    const questionId = QUIZ_QUESTIONS[currentQuestionIdx].id.toString();
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Completed all questions, show loading simulation
      setIsVerifying(true);
    }
  };

  useEffect(() => {
    if (!isVerifying) return;

    const interval = setInterval(() => {
      setVerificationStep((prev) => {
        if (prev < verificationMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(answers);
          }, 800);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isVerifying, answers, onComplete]);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto" id="quiz-container">
      <AnimatePresence mode="wait">
        {!isVerifying ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden"
            id="quiz-card"
          >
            {/* Top Badge */}
            <div className="flex justify-between items-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                USA Official Portal
              </span>
              <span className="text-xs font-bold text-slate-400">
                Step {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mb-8 overflow-hidden border border-slate-200/55">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-6 min-h-[64px]" id="quiz-question-title">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3.5 mb-8" id="quiz-options-list">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  id={`quiz-option-${index}`}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left px-6 py-4.5 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-200 flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                >
                  <span className="font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                    {option}
                  </span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-900 flex items-center justify-center transition-all bg-white group-hover:bg-slate-900">
                    <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            {/* Guarantee footer */}
            <div className="flex items-start gap-3 text-xs text-slate-400 border-t border-slate-200 pt-5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                This consumer portal is fully secure. Your selection is 100% confidential and is governed by CCPA data protection guidelines. No credit card required.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loading-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center flex flex-col items-center justify-center min-h-[380px]"
            id="verifying-card"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center relative border border-blue-100 text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Processing Eligibility
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Please wait while our system routes your response to verified US reward providers.
            </p>

            {/* Step loader logs */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md">
              <div className="space-y-3 text-left">
                {verificationMessages.map((msg, idx) => {
                  const isCompleted = idx < verificationStep;
                  const isActive = idx === verificationStep;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                        isCompleted || isActive ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">
                          ✓
                        </div>
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200" />
                      )}
                      <span className={`font-medium ${isActive ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}>
                        {msg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mini social indicator */}
            <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
              <Users className="w-4 h-4 text-slate-400" />
              <span>4,128 users qualified in the last 24 hours</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
