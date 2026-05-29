'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import GloveAnalogyVisual from '@/components/visuals/GloveAnalogyVisual';
import { moduleContent } from '@/lib/content';

type QubitState = 'mixed' | 0 | 1;

export default function ModuleEntanglement() {
  const [entangled, setEntangled] = useState(false);
  const [qubitA, setQubitA] = useState<QubitState>('mixed');
  const [qubitB, setQubitB] = useState<QubitState>('mixed');
  const [measuredA, setMeasuredA] = useState(false);
  const [animating, setAnimating] = useState(false);

  const entangle = useCallback(() => {
    setEntangled(true);
    setQubitA('mixed');
    setQubitB('mixed');
    setMeasuredA(false);
  }, []);

  const measureQubit = useCallback(() => {
    if (measuredA || animating) return;
    setAnimating(true);

    setTimeout(() => {
      const result: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
      setQubitA(result);
      setMeasuredA(true);

      setTimeout(() => {
        setQubitB(result);
        setAnimating(false);
      }, 500);
    }, 300);
  }, [measuredA, animating]);

  const reset = useCallback(() => {
    setEntangled(false);
    setQubitA('mixed');
    setQubitB('mixed');
    setMeasuredA(false);
  }, []);

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Entanglement</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Einstein called it <strong className="text-white">&ldquo;spooky action at a distance.&rdquo;</strong>
          Entanglement is a quantum connection where two qubits become inextricably linked --
          measuring one <em>instantly</em> reveals the state of the other, no matter how far apart
          they are. It sounds like magic, but it is real, and it has been experimentally verified
          thousands of times.
        </p>
      </div>

      <GloveAnalogyVisual showResult={measuredA} />

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wide">The Entanglement Simulator</h3>

        <div className="grid grid-cols-5 gap-4 items-center mb-6">
          <div className="text-center">
            <div className={`
              w-20 h-20 mx-auto rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 border-2
              ${qubitA === 'mixed' ? 'bg-gray-900 border-gray-700 text-gray-500' : qubitA === 0 ? 'bg-quantum-cyan/20 border-quantum-cyan text-quantum-cyan shadow-lg shadow-cyan-500/20' : 'bg-quantum-magenta/20 border-quantum-magenta text-quantum-magenta shadow-lg shadow-magenta-500/20'}
            `}>
              {qubitA === 'mixed' ? '?' : `|${qubitA}>`}
            </div>
            <div className="text-xs text-gray-500 mt-2">Qubit A</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: entangled ? [1, 1.05, 1] : 1,
                opacity: entangled ? 1 : 0.3,
              }}
              transition={{ repeat: entangled ? Infinity : 0, duration: 1.5 }}
            >
              <svg width="60" height="40" viewBox="0 0 60 40">
                <motion.path
                  d="M5,20 Q30,0 55,20"
                  fill="none"
                  stroke={entangled ? '#7c3aed' : '#333'}
                  strokeWidth="2"
                  animate={entangled ? { d: ['M5,20 Q30,0 55,20', 'M5,20 Q30,40 55,20', 'M5,20 Q30,0 55,20'] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.path
                  d="M5,20 Q30,40 55,20"
                  fill="none"
                  stroke={entangled ? '#7c3aed' : '#333'}
                  strokeWidth="2"
                  animate={entangled ? { d: ['M5,20 Q30,40 55,20', 'M5,20 Q30,0 55,20', 'M5,20 Q30,40 55,20'] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <circle cx="30" cy="20" r="2" fill={entangled ? '#7c3aed' : '#333'} />
              </svg>
            </motion.div>
            {entangled && <div className="text-[10px] text-quantum-purple font-bold mt-1 tracking-wider">ENTANGLED</div>}
          </div>

          <div className="text-center">
            <div className={`
              w-20 h-20 mx-auto rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 border-2
              ${qubitB === 'mixed' && !measuredA ? 'bg-gray-900 border-gray-700 text-gray-500' : qubitB === 0 ? 'bg-quantum-cyan/20 border-quantum-cyan text-quantum-cyan shadow-lg shadow-cyan-500/20' : 'bg-quantum-magenta/20 border-quantum-magenta text-quantum-magenta shadow-lg shadow-magenta-500/20'}
            `}>
              {qubitB === 'mixed' && !measuredA ? '?' : `|${qubitB}>`}
            </div>
            <div className="text-xs text-gray-500 mt-2">Qubit B</div>
          </div>
        </div>

        {!entangled ? (
          <button
            onClick={entangle}
            className="w-full py-3 rounded-xl font-bold text-sm bg-quantum-purple text-white hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
          >
            Entangle qubits into Bell state (|00&gt; + |11&gt;)/\u221A2
          </button>
        ) : (
          <div className="space-y-4">
            {!measuredA ? (
              <div>
                <button
                  onClick={measureQubit}
                  disabled={animating}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-quantum-purple text-white hover:bg-purple-600 disabled:opacity-50 transition-all"
                >
                  {animating ? 'Measuring...' : 'Measure Qubit A'}
                </button>
                <p className="text-xs text-gray-600 text-center mt-2">
                  Click to measure Qubit A -- watch what happens to Qubit B
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4 rounded-lg bg-purple-900/20 border border-purple-800/30"
                >
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Measuring Qubit A = <strong className={qubitA === 0 ? 'text-quantum-cyan' : 'text-quantum-magenta'}>|{qubitA}&gt;</strong>{' '}
                    instantly collapsed Qubit B to{' '}
                    <strong className={qubitB === 0 ? 'text-quantum-cyan' : 'text-quantum-magenta'}>|{qubitB}&gt;</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    They are perfectly correlated -- if we ran this 1,000 times, they would match every single time.
                    This is not a simulation of pre-existing values; quantum mechanics says the outcomes
                    are genuinely created at the moment of measurement, and the correlation is instant.
                  </p>
                </motion.div>
                <button
                  onClick={reset}
                  className="w-full py-2 rounded-xl font-medium text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                >
                  Reset and try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-quantum-card/50 rounded-xl p-5 border border-gray-800/40">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          Entanglement is not just a curiosity -- it is a
          <strong className="text-white"> computational resource</strong>. Quantum computers use it
          to explore correlations that classical computers cannot efficiently simulate. It is also
          the basis of <strong className="text-gray-200">quantum cryptography</strong> (unhackable
          communication) and <strong className="text-gray-200">quantum teleportation</strong> (no,
          not Star Trek -- but the quantum state can be transmitted instantaneously).
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.entanglement} />
        <ModuleQuiz questions={moduleContent.entanglement.quiz} />
      </div>
    </div>
  );
}
