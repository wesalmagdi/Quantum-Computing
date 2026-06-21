'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import BlochSphere from '@/components/BlochSphere';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import HistoryCard from '@/components/HistoryCard';
import { applyPauliX, getProbabilities } from '@/lib/quantum';
import { moduleContent } from '@/lib/content';

export default function ModulePauliX() {
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(0);
  const [applied, setApplied] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [prevTheta, setPrevTheta] = useState(0);
  const [prevPhi, setPrevPhi] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  const apply = useCallback(() => {
    if (animating) return;
    setPrevTheta(theta);
    setPrevPhi(phi);
    setAnimating(true);
    setTimeout(() => {
      const result = applyPauliX(theta, phi);
      setTheta(result.theta);
      setPhi(result.phi);
      setApplied(true);
      setFlipCount(c => c + 1);
      setAnimating(false);
    }, 350);
  }, [theta, phi, animating]);

  const reset = useCallback(() => {
    setTheta(0);
    setPhi(0);
    setApplied(false);
    setFlipCount(0);
  }, []);

  const beforeProbs = getProbabilities(prevTheta);
  const afterProbs = getProbabilities(theta);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Pauli-X Gate (Quantum NOT)</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          The Pauli-X gate is the quantum equivalent of a
          <strong className="text-journey-text"> NOT gate</strong>. It flips
          <span className="text-journey-primary"> |0&gt;</span> to
          <span className="text-journey-accent"> |1&gt;</span> and vice versa.
          On the Bloch sphere, it is a crisp 180&deg; rotation around the X axis.
        </p>
      </div>

      <HistoryCard
        concept="The quantum equivalent of a NOT gate"
        items={[
          { year: 1927, scientist: 'Wolfgang Pauli', story: 'Introduced the three Pauli matrices (sigma_x, sigma_y, sigma_z) to describe the spin of an electron — a purely quantum property with no classical analogue. The Pauli-X matrix, sigma_x, is the flip operator that exchanges spin-up and spin-down. Pauli was only 25 when he made this contribution. He won the 1945 Nobel Prize for the Pauli exclusion principle.', quote: { text: 'I don\'t mind your thinking slowly; I mind your publishing faster than you think.', source: 'Wolfgang Pauli' } },
        ]}
      />

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-border mb-5">
          <p className="text-xs text-journey-muted leading-relaxed">
            <strong className="text-journey-text">Classical vs quantum NOT:</strong> In classical computing,
            a NOT gate simply flips 0 to 1 and 1 to 0. The Pauli-X does the same for basis states, but it also
            works on <em className="text-journey-text">any superposition</em>. Applying X to (|0&gt;+|1&gt;)/radic;2
            gives (|1&gt;+|0&gt;)/radic;2 -- which is the same state! X does not destroy superposition, it just
            rotates it around the X axis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-journey-card rounded-xl p-4 border border-journey-border">
            <div className="text-xs text-journey-muted uppercase tracking-wider mb-2">
              Bloch sphere {applied ? `(flip #${flipCount})` : '(initial)'}
            </div>
            <BlochSphere theta={theta} phi={phi} />
          </div>

          <div className="space-y-5">
            <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
              <h3 className="font-bold text-journey-text text-sm uppercase tracking-wide mb-4">Effect</h3>

              <div className="font-mono text-sm bg-journey-surface rounded-lg p-4 text-center border border-journey-border mb-5">
                <motion.div
                  key={flipCount}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {theta < 0.01 ? (
                    <span>
                      <span className="text-journey-primary">|0&gt;</span>
                      <span className="text-journey-muted">  -- X --  </span>
                      <span className="text-journey-accent">|1&gt;</span>
                    </span>
                  ) : theta > Math.PI - 0.01 ? (
                    <span>
                      <span className="text-journey-accent">|1&gt;</span>
                      <span className="text-journey-muted">  -- X --  </span>
                      <span className="text-journey-primary">|0&gt;</span>
                    </span>
                  ) : (
                    <span>
                      <span className="text-journey-muted">theta = </span>
                      <span className="text-journey-text">{(theta * 180 / Math.PI).toFixed(0)}&deg;</span>
                      <span className="text-journey-muted">  -- X --  </span>
                      <span className="text-journey-muted">theta = </span>
                      <span className="text-journey-text">{((Math.PI - theta) * 180 / Math.PI).toFixed(0)}&deg;</span>
                    </span>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <div className="text-xs text-journey-muted mb-2">Before</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-journey-surface">
                    <div className="bg-journey-primary" style={{ width: `${beforeProbs.p0 * 100}%` }} />
                    <div className="bg-journey-accent" style={{ width: `${beforeProbs.p1 * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-journey-muted mt-1">
                    |0&gt;: {(beforeProbs.p0 * 100).toFixed(0)}% |1&gt;: {(beforeProbs.p1 * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-journey-muted mb-2">After X</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-journey-surface">
                    <div className="bg-journey-primary" style={{ width: `${afterProbs.p0 * 100}%` }} />
                    <div className="bg-journey-accent" style={{ width: `${afterProbs.p1 * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-journey-muted mt-1">
                    |0&gt;: {(afterProbs.p0 * 100).toFixed(0)}% |1&gt;: {(afterProbs.p1 * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={apply}
                  disabled={animating}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-journey-primary text-white hover:bg-journey-primary-dark disabled:opacity-50 transition-all"
                >
                  {animating ? 'Flipping...' : 'Apply X gate'}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 rounded-xl text-sm bg-journey-surface text-journey-muted hover:text-journey-text transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {applied && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-journey-card rounded-xl p-4 border border-journey-border"
              >
                <p className="text-sm text-journey-muted leading-relaxed">
                  Flip #{flipCount}: theta went from {((prevTheta * 180 / Math.PI)).toFixed(0)}&deg; to{' '}
                  {((theta * 180 / Math.PI)).toFixed(0)}&deg;. Since
                  <strong className="text-journey-text"> X<sup>2</sup> = I</strong>, two flips return you to the
                  original state. Try it!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-journey-card/50 rounded-xl p-5 border border-journey-border">
        <p className="text-sm text-journey-muted text-center leading-relaxed">
          Pauli-X is the quantum NOT gate: <span className="font-mono text-journey-text">X|0&gt; = |1&gt;</span>.
          But it is also a <strong className="text-journey-text">rotation</strong> -- 180&deg; around the X axis
          on the Bloch sphere. Apply it twice and you are back where you started
          (<span className="font-mono text-journey-text">X<sup>2</sup> = I</span>). This combination of &ldquo;flip&rdquo; and
          &ldquo;rotate&rdquo; is fundamental to how quantum gates work.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.paulix} />
        <ModuleQuiz questions={moduleContent.paulix.quiz} />
      </div>
    </div>
  );
}
