'use client';

import { useState, useMemo } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import DoubleSlitVisual from '@/components/visuals/DoubleSlitVisual';
import HistoryCard from '@/components/HistoryCard';
import { moduleContent } from '@/lib/content';

function WaveSVG({ phase, label, color, amp }: { phase: number; label: string; color: string; amp: number }) {
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 400;
      const y = 40 + Math.sin((i / 200) * Math.PI * 4 + phase) * 30 * amp;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [phase, amp]);

  return (
    <div className="mb-2">
      <div className="text-xs text-journey-muted mb-2">{label}</div>
      <svg width="400" height="80" viewBox="0 0 400 80" className="w-full">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function ModuleInterference() {
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(Math.PI);
  const [amp1, setAmp1] = useState(1);
  const [amp2, setAmp2] = useState(1);

  const interferencePoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 400;
      const y1 = Math.sin((i / 200) * Math.PI * 4 + phase1) * 30 * amp1;
      const y2 = Math.sin((i / 200) * Math.PI * 4 + phase2) * 30 * amp2;
      const ySum = y1 + y2;
      const clampedY = Math.max(-70, Math.min(70, ySum));
      pts.push(`${x},${40 + clampedY}`);
    }
    return pts.join(' ');
  }, [phase1, phase2, amp1, amp2]);

  const totalIntensity = useMemo(() => {
    const samples = 500;
    let sum = 0;
    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 4;
      const w1 = Math.sin(t + phase1) * amp1;
      const w2 = Math.sin(t + phase2) * amp2;
      sum += (w1 + w2) ** 2;
    }
    return sum / samples;
  }, [phase1, phase2, amp1, amp2]);

  const constructive = useMemo(() => {
    const diff = Math.abs(phase2 - phase1) % (2 * Math.PI);
    return diff < 0.1 || diff > 2 * Math.PI - 0.1;
  }, [phase1, phase2]);

  const destructive = useMemo(() => {
    const diff = Math.abs(phase2 - phase1) % (2 * Math.PI);
    return Math.abs(diff - Math.PI) < 0.1;
  }, [phase1, phase2]);

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Interference</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          Interference is what makes quantum computing truly powerful. Quantum amplitudes combine
          like waves -- when they are <strong className="text-green-400">in phase</strong> they
          reinforce (constructive interference), and when they are
          <strong className="text-red-400"> opposite</strong> they cancel (destructive interference).
          Quantum algorithms arrange paths so <em className="text-journey-text">correct answers amplify</em>
          and <em className="text-journey-text">wrong answers cancel</em>.
        </p>
      </div>

      <HistoryCard
        concept="The wave-like combination of quantum amplitudes"
        items={[
          { year: 1801, scientist: 'Thomas Young', story: 'Performed the double-slit experiment before the Royal Institution in London, demonstrating that light behaves as a wave. His experiment was so elegantly simple that anyone could repeat it — a single light source, two slits, and a screen. The interference pattern he observed became the central metaphor for quantum behavior nearly two centuries later.', quote: { text: 'I am happy to find that I have been able to confirm, by a new and decisive experiment, the law which I had formerly deduced.', source: 'Thomas Young, 1801' } },
          { year: 1965, scientist: 'Richard Feynman', story: 'Called the double-slit experiment "the only mystery" of quantum mechanics in his famous Feynman Lectures on Physics. He argued that the experiment contains the entire essence of quantum behavior — superposition, interference, and the strange role of measurement — and that anyone who claims to understand quantum mechanics must first come to terms with it.', quote: { text: 'It has in it the heart of quantum mechanics. In reality, it contains the only mystery.', source: 'Richard Feynman, on the double-slit experiment' } },
        ]}
      />

      <DoubleSlitVisual />

      <div className="bg-white rounded-xl p-6 border border-journey-border">
        <h3 className="font-bold text-journey-text mb-5 text-sm uppercase tracking-wide">Interference Sandbox</h3>

        <div className="bg-journey-surface rounded-lg p-4 border border-journey-border mb-5">
          <p className="text-xs text-journey-muted leading-relaxed">
            Adjust the sliders below to control two waves. Watch how they combine -- when they
            align, they amplify; when opposed, they cancel. This exact principle is what quantum
            computers use to amplify the probability of correct answers.
          </p>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-journey-primary">Wave A phase</span>
              <span className="text-journey-muted font-mono">{(phase1 % (2 * Math.PI)).toFixed(2)} rad</span>
            </div>
            <input type="range" min={0} max={2 * Math.PI} step={0.02} value={phase1} onChange={e => setPhase1(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-journey-accent">Wave B phase</span>
              <span className="text-journey-muted font-mono">{(phase2 % (2 * Math.PI)).toFixed(2)} rad</span>
            </div>
            <input type="range" min={0} max={2 * Math.PI} step={0.02} value={phase2} onChange={e => setPhase2(+e.target.value)} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-journey-primary">Wave A amplitude</span>
                <span className="text-journey-muted font-mono">{amp1.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1.5} step={0.01} value={amp1} onChange={e => setAmp1(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-journey-accent">Wave B amplitude</span>
                <span className="text-journey-muted font-mono">{amp2.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1.5} step={0.01} value={amp2} onChange={e => setAmp2(+e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <WaveSVG phase={phase1} label="Path A amplitude" color="#00d4ff" amp={amp1} />
          <WaveSVG phase={phase2} label="Path B amplitude" color="#ff00aa" amp={amp2} />
          <div>
            <div className="text-xs text-journey-muted mb-2">Combined (interference pattern)</div>
            <svg width="400" height="80" viewBox="0 0 400 80" className="w-full">
              <polyline points={interferencePoints} fill="none" stroke="#ff6b35" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className={`
            rounded-lg p-3 text-center border transition-all
            ${constructive ? 'bg-green-50 border-green-400' : destructive ? 'bg-red-50 border-red-400' : 'bg-journey-surface border-journey-border'}
          `}>
            <div className="text-xs text-journey-muted">Interference type</div>
            <div className={`text-sm font-bold mt-0.5 ${constructive ? 'text-green-400' : destructive ? 'text-red-400' : 'text-journey-muted'}`}>
              {constructive ? 'Constructive' : destructive ? 'Destructive' : 'Mixed'}
            </div>
          </div>
          <div className="rounded-lg p-3 text-center bg-journey-surface border border-journey-border">
            <div className="text-xs text-journey-muted">Phase difference</div>
            <div className="text-sm font-bold text-journey-text mt-0.5">
              {((Math.abs(phase2 - phase1) % (2 * Math.PI)) * 180 / Math.PI).toFixed(0)}&deg;
            </div>
          </div>
          <div className="rounded-lg p-3 text-center bg-journey-surface border border-journey-border">
            <div className="text-xs text-journey-muted">Combined intensity</div>
            <div className="text-sm font-bold text-journey-accent mt-0.5">{totalIntensity.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/50 rounded-xl p-5 border border-journey-border">
        <p className="text-sm text-journey-muted text-center leading-relaxed">
          When waves are <strong className="text-green-400">in phase</strong> (difference = 0&deg;),
          they add up to full intensity. When <strong className="text-red-400">opposite</strong> (180&deg;),
          they cancel completely. Quantum algorithms like
          <strong className="text-journey-text"> Grover&rsquo;s search</strong> and
          <strong className="text-journey-text"> Shor&rsquo;s factoring</strong> orchestrate millions of these
          interferences to amplify the right answer -- like tuning a radio to the correct frequency.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.interference} />
        <ModuleQuiz questions={moduleContent.interference.quiz} />
      </div>
    </div>
  );
}
