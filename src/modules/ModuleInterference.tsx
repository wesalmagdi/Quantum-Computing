'use client';

import { useState, useMemo } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import DoubleSlitVisual from '@/components/visuals/DoubleSlitVisual';
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
      <div className="text-xs text-gray-500 mb-2">{label}</div>
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
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Interference</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Interference is what makes quantum computing truly powerful. Quantum amplitudes combine
          like waves -- when they are <strong className="text-green-400">in phase</strong> they
          reinforce (constructive interference), and when they are
          <strong className="text-red-400"> opposite</strong> they cancel (destructive interference).
          Quantum algorithms arrange paths so <em className="text-gray-300">correct answers amplify</em>
          and <em className="text-gray-300">wrong answers cancel</em>.
        </p>
      </div>

      <DoubleSlitVisual />

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wide">Interference Sandbox</h3>

        <div className="bg-black/30 rounded-lg p-4 border border-gray-800/40 mb-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            Adjust the sliders below to control two waves. Watch how they combine -- when they
            align, they amplify; when opposed, they cancel. This exact principle is what quantum
            computers use to amplify the probability of correct answers.
          </p>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-quantum-cyan">Wave A phase</span>
              <span className="text-gray-500 font-mono">{(phase1 % (2 * Math.PI)).toFixed(2)} rad</span>
            </div>
            <input type="range" min={0} max={2 * Math.PI} step={0.02} value={phase1} onChange={e => setPhase1(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-quantum-magenta">Wave B phase</span>
              <span className="text-gray-500 font-mono">{(phase2 % (2 * Math.PI)).toFixed(2)} rad</span>
            </div>
            <input type="range" min={0} max={2 * Math.PI} step={0.02} value={phase2} onChange={e => setPhase2(+e.target.value)} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-quantum-cyan">Wave A amplitude</span>
                <span className="text-gray-500 font-mono">{amp1.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1.5} step={0.01} value={amp1} onChange={e => setAmp1(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-quantum-magenta">Wave B amplitude</span>
                <span className="text-gray-500 font-mono">{amp2.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1.5} step={0.01} value={amp2} onChange={e => setAmp2(+e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <WaveSVG phase={phase1} label="Path A amplitude" color="#00d4ff" amp={amp1} />
          <WaveSVG phase={phase2} label="Path B amplitude" color="#ff00aa" amp={amp2} />
          <div>
            <div className="text-xs text-gray-500 mb-2">Combined (interference pattern)</div>
            <svg width="400" height="80" viewBox="0 0 400 80" className="w-full">
              <polyline points={interferencePoints} fill="none" stroke="#ff6b35" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className={`
            rounded-lg p-3 text-center border transition-all
            ${constructive ? 'bg-green-900/20 border-green-700/40' : destructive ? 'bg-red-900/20 border-red-700/40' : 'bg-gray-900/30 border-gray-800/40'}
          `}>
            <div className="text-xs text-gray-500">Interference type</div>
            <div className={`text-sm font-bold mt-0.5 ${constructive ? 'text-green-400' : destructive ? 'text-red-400' : 'text-gray-400'}`}>
              {constructive ? 'Constructive' : destructive ? 'Destructive' : 'Mixed'}
            </div>
          </div>
          <div className="rounded-lg p-3 text-center bg-gray-900/30 border border-gray-800/40">
            <div className="text-xs text-gray-500">Phase difference</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {((Math.abs(phase2 - phase1) % (2 * Math.PI)) * 180 / Math.PI).toFixed(0)}&deg;
            </div>
          </div>
          <div className="rounded-lg p-3 text-center bg-gray-900/30 border border-gray-800/40">
            <div className="text-xs text-gray-500">Combined intensity</div>
            <div className="text-sm font-bold text-quantum-orange mt-0.5">{totalIntensity.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="bg-quantum-card/50 rounded-xl p-5 border border-gray-800/40">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          When waves are <strong className="text-green-400">in phase</strong> (difference = 0&deg;),
          they add up to full intensity. When <strong className="text-red-400">opposite</strong> (180&deg;),
          they cancel completely. Quantum algorithms like
          <strong className="text-gray-200"> Grover&rsquo;s search</strong> and
          <strong className="text-gray-200"> Shor&rsquo;s factoring</strong> orchestrate millions of these
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
