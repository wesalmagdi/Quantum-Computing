'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import BlochSphere from '@/components/BlochSphere';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
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
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Pauli-X Gate (Quantum NOT)</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          The Pauli-X gate is the quantum equivalent of a
          <strong className="text-white"> NOT gate</strong>. It flips
          <span className="text-quantum-cyan"> |0&gt;</span> to
          <span className="text-quantum-magenta"> |1&gt;</span> and vice versa.
          On the Bloch sphere, it is a crisp 180&deg; rotation around the X axis.
        </p>
      </div>

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <div className="bg-black/30 rounded-lg p-4 border border-gray-800/40 mb-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-200">Classical vs quantum NOT:</strong> In classical computing,
            a NOT gate simply flips 0 to 1 and 1 to 0. The Pauli-X does the same for basis states, but it also
            works on <em className="text-gray-300">any superposition</em>. Applying X to (|0&gt;+|1&gt;)/radic;2
            gives (|1&gt;+|0&gt;)/radic;2 -- which is the same state! X does not destroy superposition, it just
            rotates it around the X axis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-quantum-card rounded-xl p-4 border border-gray-800/60">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Bloch sphere {applied ? `(flip #${flipCount})` : '(initial)'}
            </div>
            <BlochSphere theta={theta} phi={phi} />
          </div>

          <div className="space-y-5">
            <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Effect</h3>

              <div className="font-mono text-sm bg-black/30 rounded-lg p-4 text-center border border-gray-800/50 mb-5">
                <motion.div
                  key={flipCount}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {theta < 0.01 ? (
                    <span>
                      <span className="text-quantum-cyan">|0&gt;</span>
                      <span className="text-gray-400">  -- X --  </span>
                      <span className="text-quantum-magenta">|1&gt;</span>
                    </span>
                  ) : theta > Math.PI - 0.01 ? (
                    <span>
                      <span className="text-quantum-magenta">|1&gt;</span>
                      <span className="text-gray-400">  -- X --  </span>
                      <span className="text-quantum-cyan">|0&gt;</span>
                    </span>
                  ) : (
                    <span>
                      <span className="text-gray-400">theta = </span>
                      <span className="text-white">{(theta * 180 / Math.PI).toFixed(0)}&deg;</span>
                      <span className="text-gray-400">  -- X --  </span>
                      <span className="text-gray-400">theta = </span>
                      <span className="text-white">{((Math.PI - theta) * 180 / Math.PI).toFixed(0)}&deg;</span>
                    </span>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Before</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
                    <div className="bg-quantum-cyan" style={{ width: `${beforeProbs.p0 * 100}%` }} />
                    <div className="bg-quantum-magenta" style={{ width: `${beforeProbs.p1 * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    |0&gt;: {(beforeProbs.p0 * 100).toFixed(0)}% |1&gt;: {(beforeProbs.p1 * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">After X</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
                    <div className="bg-quantum-cyan" style={{ width: `${afterProbs.p0 * 100}%` }} />
                    <div className="bg-quantum-magenta" style={{ width: `${afterProbs.p1 * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    |0&gt;: {(afterProbs.p0 * 100).toFixed(0)}% |1&gt;: {(afterProbs.p1 * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={apply}
                  disabled={animating}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-quantum-purple text-white hover:bg-purple-600 disabled:opacity-50 transition-all"
                >
                  {animating ? 'Flipping...' : 'Apply X gate'}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 rounded-xl text-sm bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {applied && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-quantum-card rounded-xl p-4 border border-gray-800/60"
              >
                <p className="text-sm text-gray-400 leading-relaxed">
                  Flip #{flipCount}: theta went from {((prevTheta * 180 / Math.PI)).toFixed(0)}&deg; to{' '}
                  {((theta * 180 / Math.PI)).toFixed(0)}&deg;. Since
                  <strong className="text-gray-200"> X<sup>2</sup> = I</strong>, two flips return you to the
                  original state. Try it!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-quantum-card/50 rounded-xl p-5 border border-gray-800/40">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          Pauli-X is the quantum NOT gate: <span className="font-mono text-gray-300">X|0&gt; = |1&gt;</span>.
          But it is also a <strong className="text-white">rotation</strong> -- 180&deg; around the X axis
          on the Bloch sphere. Apply it twice and you are back where you started
          (<span className="font-mono text-gray-300">X<sup>2</sup> = I</span>). This combination of &ldquo;flip&rdquo; and
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
