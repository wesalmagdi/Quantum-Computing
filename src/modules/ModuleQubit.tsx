'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AmplitudeControls from '@/components/AmplitudeControls';
import ProbabilityDisplay from '@/components/ProbabilityDisplay';
import StateDisplay from '@/components/StateDisplay';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import HistoryCard from '@/components/HistoryCard';
import { moduleContent } from '@/lib/content';

export default function ModuleQubit() {
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">What is a Qubit?</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          A qubit is the <strong className="text-journey-text">quantum version of a bit</strong>.
          But unlike a classical bit (which is strictly 0 or 1), a qubit lives in a much richer
          space. It can be <span className="text-journey-primary">|0&gt;</span>,
          <span className="text-journey-accent"> |1&gt;</span>, or
          <strong className="text-journey-text"> any blend of both</strong> at the same time.
          This section explores what that actually means.
        </p>
      </div>

      <HistoryCard
        concept="The qubit as a unit of quantum information"
        items={[
          { year: 1995, scientist: 'Benjamin Schumacher', story: 'Coined the term "qubit" (short for "quantum bit") in a paper titled "Quantum Coding." He showed that quantum information could be compressed, establishing the first rigorous connection between information theory and quantum mechanics — founding the field of quantum information theory in the process.', quote: { text: 'Information is physical.', source: 'Rolf Landauer, 1991' } },
          { year: 1985, scientist: 'David Deutsch', story: 'Published "Quantum Theory, the Church-Turing Principle and the Universal Quantum Computer," formalizing the concept of a universal quantum computer and proving that quantum computation could solve problems no classical computer ever could. He showed that a qubit is fundamentally different from a probabilistic classical bit because of interference.', quote: { text: 'The quantum theory of computation brings together two of the great intellectual achievements of the twentieth century — quantum theory and computing.', source: 'David Deutsch' } },
        ]}
      />

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <div className="text-center mb-6">
          <div className="inline-block bg-journey-border/30 rounded-lg px-6 py-4 font-mono text-sm md:text-base border border-journey-border">
            <span className="text-journey-muted">|psi&gt; = </span>
            <span className="text-journey-primary">alpha</span>
            <span className="text-journey-muted"> |0&gt; </span>
            <span className="text-journey-muted">+ </span>
            <span className="text-journey-accent">beta</span>
            <span className="text-journey-muted"> |1&gt;</span>
          </div>
        </div>

        <div className="bg-journey-surface rounded-lg p-5 border border-journey-border mb-6 space-y-3 text-sm text-journey-muted leading-relaxed">
          <p>
            <strong className="text-journey-text">Alpha</strong> and
            <strong className="text-journey-text"> beta</strong> are called
            <strong className="text-journey-text"> probability amplitudes</strong>.
            Think of them as <em className="text-journey-text">&ldquo;how much&rdquo;</em> of |0&gt; and |1&gt;
            are in the blend. But here is the catch:
          </p>
          <ul className="space-y-2 pl-5 text-sm">
            <li className="flex gap-2">
              <span className="text-journey-primary shrink-0">*</span>
              <span>The probability of measuring <span className="text-journey-primary">|0&gt;</span> is
                <strong className="text-journey-text"> |alpha|<sup>2</sup></strong> &mdash; the <em>square</em> of alpha.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-journey-accent shrink-0">*</span>
              <span>The probability of measuring <span className="text-journey-accent">|1&gt;</span> is
                <strong className="text-journey-text"> |beta|<sup>2</sup></strong> &mdash; the <em>square</em> of beta.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-journey-muted shrink-0">*</span>
              <span>These always add up to <strong className="text-journey-text">100%</strong> (|alpha|<sup>2</sup> + |beta|<sup>2</sup> = 1).</span>
            </li>
          </ul>
          <div className="bg-journey-surface rounded-lg p-3 border border-journey-primary/30 mt-3">
            <p className="text-xs text-journey-primary leading-relaxed">
              <strong>Why square?</strong> Because probabilities cannot be negative,
              but amplitudes can (imagine a wave that goes above and below zero). Squaring makes everything positive.
              This is the same reason we use amplitude<sup>2</sup> for sound waves and light intensity.
            </p>
          </div>
        </div>

        <AmplitudeControls theta={theta} phi={phi} onThetaChange={setTheta} onPhiChange={setPhi} disabled={false} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-journey-card rounded-xl p-5 border border-journey-border">
          <ProbabilityDisplay theta={theta} />
        </div>
        <div className="bg-journey-card rounded-xl p-5 border border-journey-border">
          <StateDisplay theta={theta} phi={phi} />
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="font-bold text-journey-text mb-3 tracking-wide text-sm uppercase">What about the Phase?</h3>
        <p className="text-sm text-journey-muted leading-relaxed">
          The <strong className="text-journey-text">phi (phi) slider</strong> controls the
          <strong className="text-journey-text"> relative phase</strong> -- a kind of &ldquo;twist&rdquo; in the
          quantum state. It does not affect the probabilities at all (try it!), but it matters enormously
          when qubits <strong className="text-journey-text">interact with each other</strong>.
          Think of it like the <em className="text-journey-text">exact moment</em> two waves meet:
          aligned = they add up, misaligned = they cancel. That is interference, and it is the
          secret sauce behind every quantum algorithm.
        </p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30 mt-4">
          <p className="text-xs text-journey-primary leading-relaxed">
            <strong>Why this matters:</strong> If quantum computing were just about probabilities,
            we could simulate it with a classical computer and a random number generator. The phase is
            what makes it <em>truly quantum</em> &mdash; it is where the &ldquo;quantum magic&rdquo; lives.
          </p>
        </div>
      </div>

      <div className="bg-journey-card/50 rounded-xl p-5 border border-journey-border">
        <p className="text-sm text-journey-muted text-center leading-relaxed">
          Move the sliders above. Watch how the blend between
          <span className="text-journey-primary"> |0&gt;</span> and
          <span className="text-journey-accent"> |1&gt;</span> changes.
          The state vector <span className="font-mono text-journey-text">|psi&gt;</span> and
          probability bars update instantly. Then nudge the phase slider -- the state vector changes
          but the probabilities stay the same. <strong className="text-journey-text">That</strong> is
          the quantum difference.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.qubit} />
        <ModuleQuiz questions={moduleContent.qubit.quiz} />
      </div>
    </div>
  );
}
