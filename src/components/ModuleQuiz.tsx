'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from '@/lib/content';

export default function ModuleQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const total = questions.length;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60 text-center">
        <div className="text-3xl mb-3">{score === total ? '🎉' : score >= total / 2 ? '👍' : '💪'}</div>
        <h3 className="text-lg font-bold text-white mb-1">Quiz Complete!</h3>
        <p className="text-3xl font-bold text-quantum-purple mb-2">{score}/{total}</p>
        <p className="text-sm text-gray-500 mb-4">
          {score === total ? 'Perfect! You really know your stuff.' : score >= total / 2 ? 'Great job! Keep practicing.' : 'Keep exploring the module and try again.'}
        </p>
        <button onClick={handleReset} className="px-6 py-2 text-sm bg-quantum-purple text-white rounded-lg hover:bg-purple-600 transition-colors">
          🔄 Retry quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-quantum-card rounded-xl border border-gray-800/60 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Quiz</h3>
          <span className="text-xs text-gray-600">Question {current + 1} of {total}</span>
        </div>

        <div className="flex gap-1.5 mb-5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < current ? 'bg-quantum-purple' : i === current ? 'bg-purple-500/50' : 'bg-gray-800'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-medium text-white mb-4">{q.question}</p>

            <div className="space-y-2 mb-4">
              {q.options.map((opt, idx) => {
                let style = 'border-gray-800/60 hover:border-gray-600 hover:bg-gray-800/40';
                if (answered) {
                  if (idx === q.correctIndex) style = 'border-green-500/60 bg-green-900/20 text-green-300';
                  else if (idx === selected) style = 'border-red-500/60 bg-red-900/20 text-red-300';
                  else style = 'border-gray-800/30 opacity-40';
                } else if (selected === idx) {
                  style = 'border-quantum-purple bg-purple-900/20';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
                  >
                    <span className="font-mono text-xs opacity-50 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs p-3 rounded-lg mb-3 ${selected === q.correctIndex ? 'bg-green-900/20 text-green-300 border border-green-800/30' : 'bg-red-900/20 text-red-300 border border-red-800/30'}`}
              >
                {selected === q.correctIndex ? '✓ ' : '✗ '}
                {q.explanation}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-2.5 text-sm font-medium bg-quantum-purple text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            {current < total - 1 ? 'Next question →' : 'See results'}
          </button>
        )}
      </div>
    </div>
  );
}
