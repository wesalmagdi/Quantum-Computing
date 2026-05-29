'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AmplitudeControls from '@/components/AmplitudeControls';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import QuantumDiceVisual from '@/components/visuals/QuantumDiceVisual';
import HistoryCard from '@/components/HistoryCard';
import { runTrials, getProbabilities } from '@/lib/quantum';
import { moduleContent } from '@/lib/content';

export default function ModuleMeasurement() {
  const [theta, setTheta] = useState(Math.PI / 3);
  const [phi, setPhi] = useState(0);
  const [results, setResults] = useState<{ zeros: number; ones: number } | null>(null);
  const [running, setRunning] = useState(false);

  const runExperiment = useCallback(() => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      const r = runTrials(theta, 1000);
      setResults(r);
      setRunning(false);
    }, 300);
  }, [theta]);

  const expected = getProbabilities(theta);
  const total = results ? results.zeros + results.ones : 0;

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Measurement</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Measurement is the moment of truth in quantum mechanics. While a qubit is in superposition,
          it is a blend of <span className="text-quantum-cyan">|0&gt;</span> and
          <span className="text-quantum-magenta"> |1&gt;</span>. But the moment you measure it,
          <strong className="text-white"> the superposition collapses</strong> to a single definite
          outcome -- either <span className="text-quantum-cyan">|0&gt;</span> or
          <span className="text-quantum-magenta"> |1&gt;</span>. Which one? It is
          <strong className="text-white"> random</strong> -- but the odds follow the probabilities
          you have set.
        </p>
      </div>

      <HistoryCard
        concept="The collapse of a quantum state upon observation"
        items={[
          { year: 1926, scientist: 'Max Born', story: 'Proposed the statistical interpretation of the wavefunction — that |psi|<sup>2</sup> gives the probability of finding a particle at a given position, not the particle\'s definite location. This was a radical departure from classical determinism. Born received the 1954 Nobel Prize for this work, which remains one of the most philosophically debated ideas in all of science.', quote: { text: 'The motion of particles follows probability laws, but the probability itself propagates according to the law of causality.', source: 'Max Born, 1926' } },
          { year: 1927, scientist: 'Werner Heisenberg', story: 'Formulated the uncertainty principle, showing that the more precisely you measure a particle\'s position, the less precisely you can know its momentum — and vice versa. This is not a limitation of instruments but a fundamental feature of reality. Heisenberg was 26 years old when he published this, and he won the Nobel Prize at 31.', quote: { text: 'The more precisely the position is determined, the less precisely the momentum is known in this instant, and vice versa.', source: 'Werner Heisenberg, 1927' } },
        ]}
      />

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <AmplitudeControls theta={theta} phi={phi} onThetaChange={setTheta} onPhiChange={setPhi} disabled={running} />
      </div>

      <QuantumDiceVisual
        p0={expected.p0}
        results={results}
        onRoll={runExperiment}
      />

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-quantum-card rounded-xl p-6 border border-gray-800/60"
        >
          <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Observed Results</h3>

          <div className="bg-black/30 rounded-lg p-4 border border-gray-800/40 mb-5">
            <p className="text-xs text-gray-500 leading-relaxed">
              We ran <strong className="text-white">1,000</strong> identical experiments on the same
              qubit state. Each time, the qubit &ldquo;chose&rdquo; randomly -- but the overall pattern reveals
              the underlying probabilities. This is called the
              <strong className="text-gray-300"> frequentist interpretation</strong> of probability:
              run enough trials and the statistics converge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-quantum-cyan">{results.zeros}</div>
              <div className="text-xs text-gray-500">out of {total}</div>
              <div className="text-sm text-gray-400 mt-1">({((results.zeros / total) * 100).toFixed(1)}%)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-quantum-magenta">{results.ones}</div>
              <div className="text-xs text-gray-500">out of {total}</div>
              <div className="text-sm text-gray-400 mt-1">({((results.ones / total) * 100).toFixed(1)}%)</div>
            </div>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30">
            <p className="text-xs text-purple-300 leading-relaxed">
              The observed frequencies match the predicted probabilities! This is the
              <strong className="text-white"> law of large numbers</strong> in action.
              Each individual measurement is random, but the aggregate reveals the quantum
              probability distribution. This is how we <em>know</em> quantum mechanics is correct --
              the predictions match experiment after experiment, billions of times over.
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.measurement} />
        <ModuleQuiz questions={moduleContent.measurement.quiz} />
      </div>
    </div>
  );
}
