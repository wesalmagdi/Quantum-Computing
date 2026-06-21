'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import BlochSphere from '@/components/BlochSphere';
import ProbabilityDisplay from '@/components/ProbabilityDisplay';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import HistoryCard from '@/components/HistoryCard';
import { applyHadamard, getProbabilities } from '@/lib/quantum';
import { moduleContent } from '@/lib/content';

export default function ModuleHadamard() {
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(0);
  const [applied, setApplied] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [prevTheta, setPrevTheta] = useState(0);
  const [prevPhi, setPrevPhi] = useState(0);

  const apply = useCallback(() => {
    if (animating) return;
    setPrevTheta(theta);
    setPrevPhi(phi);
    setAnimating(true);
    setTimeout(() => {
      const result = applyHadamard(theta, phi);
      setTheta(result.theta);
      setPhi(result.phi);
      setApplied(true);
      setAnimating(false);
    }, 400);
  }, [theta, phi, animating]);

  const reset = useCallback(() => {
    setTheta(0);
    setPhi(0);
    setApplied(false);
  }, []);

  const beforeProbs = getProbabilities(prevTheta);
  const afterProbs = getProbabilities(theta);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Hadamard Gate</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          The Hadamard gate (H) is the <strong className="text-journey-text">gate of creation</strong> in
          quantum computing. It takes a qubit from a definite state like
          <span className="text-journey-primary"> |0&gt;</span> and transforms it into an
          <strong className="text-journey-text"> equal superposition</strong> -- a perfect 50/50 blend.
          Almost every quantum algorithm starts with Hadamard gates.
        </p>
      </div>

      <HistoryCard
        concept="The gate that creates superposition"
        items={[
          { year: 1893, scientist: 'Jacques Hadamard', story: 'The French mathematician studied the transform that now bears his name — a matrix of +1 and -1 entries that maps a set of values onto a set of "alternating sums." Hadamard was a prolific mathematician who also contributed to prime number theory and the study of determinants, though he likely never imagined his transform would one day become a quantum logic gate.', quote: { text: 'The shortest path between two truths in the real domain passes through the complex domain.', source: 'Jacques Hadamard' } },
          { year: 1867, scientist: 'James Sylvester', story: 'Discovered the underlying mathematical structure of the Hadamard transform decades before Hadamard himself. Sylvester\'s "pavement" matrices were recursively constructed and identical to what we now call the Hadamard matrices used in quantum gates — a classic case of mathematics being discovered long before its physical application.', quote: { text: 'The music of the spheres is not limited to sound; it can be seen in the very structure of number.', source: 'James Sylvester' } },
        ]}
      />

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-border">
            <h4 className="text-xs text-journey-muted font-medium mb-2 tracking-wide">The analogy: a beam splitter</h4>
            <p className="text-xs text-journey-muted leading-relaxed">
              Imagine shining a laser at a half-silvered mirror. Half the light passes through,
              half reflects. The photon is now in a superposition of both paths. That is what
              Hadamard does to a qubit -- it splits it into two &ldquo;paths&rdquo; (|0&gt; and |1&gt;) simultaneously.
            </p>
          </div>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-border">
            <h4 className="text-xs text-journey-muted font-medium mb-2 tracking-wide">The math (for context)</h4>
            <div className="text-xs text-journey-muted leading-relaxed font-mono space-y-1">
              <div>H = 1/radic;2 &middot; [[1, 1], [1, -1]]</div>
              <div>H|0&gt; = (|0&gt; + |1&gt;) / radic;2</div>
              <div>H|1&gt; = (|0&gt; - |1&gt;) / radic;2</div>
              <div>H<sup>2</sup> = I (it is its own inverse!)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-journey-card rounded-xl p-4 border border-journey-border">
          <div className="text-xs text-journey-muted uppercase tracking-wider mb-2">
            Bloch sphere {applied ? '(after H gate)' : '(initial state)'}
          </div>
          <BlochSphere theta={theta} phi={phi} />
        </div>

        <div className="space-y-5">
          <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
            <h3 className="font-bold text-journey-text text-sm uppercase tracking-wide mb-4">Effect</h3>

            <div className="font-mono text-sm bg-journey-surface rounded-lg p-4 text-center border border-journey-border mb-5">
              <motion.div
                key={applied ? 'after' : 'before'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {!applied ? (
                  <span>
                    <span className="text-journey-primary">|0&gt;</span>
                    <span className="text-journey-muted">  -- H --  </span>
                    <span className="text-journey-text">? </span>
                    <span className="text-journey-muted">(press Apply)</span>
                  </span>
                ) : (
                  <span>
                    <span className="text-journey-primary">|0&gt;</span>
                    <span className="text-journey-muted">  -- H --  </span>
                    <span className="text-journey-primary">0.707</span>
                    <span className="text-journey-muted"> |0&gt; </span>
                    <span className="text-journey-muted">+ </span>
                    <span className="text-journey-accent">0.707</span>
                    <span className="text-journey-muted"> |1&gt;</span>
                  </span>
                )}
              </motion.div>
            </div>

            <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30 mb-5">
              <p className="text-xs text-journey-primary leading-relaxed">
                <strong>On the Bloch sphere:</strong> Hadamard rotates the state by 180&deg; around the
                <strong className="text-journey-text"> (X + Z)/radic;2 axis</strong>. Starting from the north pole
                (|0&gt;), this lands you exactly on the equator -- the
                <strong className="text-journey-text"> |+&gt; state</strong>: an equal superposition.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <div className="text-xs text-journey-muted mb-2">Before (|0&gt;)</div>
                <div className="flex h-2 rounded-full overflow-hidden bg-journey-surface">
                  <div className="bg-journey-primary" style={{ width: `${beforeProbs.p0 * 100}%` }} />
                  <div className="bg-journey-accent" style={{ width: `${beforeProbs.p1 * 100}%` }} />
                </div>
                <div className="text-[10px] text-journey-muted mt-1">
                  |0&gt;: {(beforeProbs.p0 * 100).toFixed(0)}% |1&gt;: {(beforeProbs.p1 * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-journey-muted mb-2">After H</div>
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
                {animating ? 'Applying H...' : applied ? 'Apply H again' : 'Apply H gate'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl text-sm bg-journey-surface text-journey-muted hover:text-journey-text transition-all"
              >
                Reset to |0&gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-journey-card/50 rounded-xl p-5 border border-journey-border">
        <p className="text-sm text-journey-muted text-center leading-relaxed">
          Hadamard takes <span className="text-journey-primary">|0&gt;</span> (north pole) and maps it to
          the equator -- an <strong className="text-journey-text">equal superposition</strong> called
          <strong className="text-journey-text"> |+&gt;</strong>. Apply H again and you are back to |0&gt;
          (H<sup>2</sup> = I). This &ldquo;create superposition, interfere, undo&rdquo; pattern is the beating heart
          of every quantum algorithm.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.hadamard} />
        <ModuleQuiz questions={moduleContent.hadamard.quiz} />
      </div>
    </div>
  );
}
