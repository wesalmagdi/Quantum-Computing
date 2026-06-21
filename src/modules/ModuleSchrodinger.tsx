'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import SchrodingerCatVisual from '@/components/visuals/SchrodingerCatVisual';
import HistoryCard from '@/components/HistoryCard';
import { moduleContent } from '@/lib/content';

export default function ModuleSchrodinger() {
  const [time, setTime] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(1);
  const [showCatStory, setShowCatStory] = useState(false);

  const wavePoints = useMemo(() => {
    const n = energyLevel;
    const pts: string[] = [];
    const amp = 50;
    for (let i = 0; i <= 300; i++) {
      const x = (i / 300) * 400;
      const position = i / 300;
      const sinePart = Math.sin(n * Math.PI * position);
      const timePart = Math.cos(n * n * time);
      const y = 50 + sinePart * timePart * amp;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [time, energyLevel]);

  const probDensityPoints = useMemo(() => {
    const n = energyLevel;
    const pts: string[] = [];
    for (let i = 0; i <= 300; i++) {
      const x = (i / 300) * 400;
      const position = i / 300;
      const sinePart = Math.sin(n * Math.PI * position);
      const prob = sinePart * sinePart;
      const y = 30 + prob * 40;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [energyLevel]);

  const energy = useMemo(() => energyLevel * energyLevel, [energyLevel]);

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Schrodinger&rsquo;s Equation</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          The Schrodinger equation is the <strong className="text-journey-text">F = ma of quantum mechanics</strong>.
          It describes how quantum states evolve in time. While Newton&rsquo;s laws predict where a ball will go,
          Schrodinger&rsquo;s equation predicts how a <strong className="text-journey-text">wavefunction</strong> evolves --
          and from that wavefunction, we can extract everything knowable about a quantum system.
        </p>
      </div>

      <HistoryCard
        concept="The fundamental law of quantum time evolution"
        items={[
          { year: 1926, scientist: 'Erwin Schrodinger', story: 'Published his famous wave equation in a series of four papers written in just six months. He was 38 years old, and the equation came to him during a Christmas holiday in the Swiss Alps with his mistress. Within weeks, physicists used it to predict the energy levels of the hydrogen atom with stunning accuracy — matching experimental data that had baffled science for decades. Schrodinger won the Nobel Prize in 1933 alongside Paul Dirac.', quote: { text: 'I do not like this modern quantum mechanics. I am sorry I ever had anything to do with it.', source: 'Erwin Schrodinger, late in life' } },
          { year: 1935, scientist: 'Schrodinger\'s Cat', story: 'Schrodinger devised the cat paradox not as a serious proposal but as a reductio ad absurdum — a way to show that the Copenhagen interpretation led to absurd conclusions when applied to everyday objects. Ironically, the thought experiment became more famous than the equation that made him a Nobel laureate, and it remains the most popular gateway into quantum philosophy.', quote: { text: 'The task is not to see what no one has yet seen, but to think what nobody has yet thought about that which everybody sees.', source: 'Erwin Schrodinger' } },
        ]}
      />

      <div className="bg-white rounded-xl p-6 border border-journey-border">
        <div className="text-center mb-6">
          <div className="inline-block bg-journey-border/30 rounded-lg px-6 py-4 border border-journey-border">
            <span className="text-xl md:text-2xl font-serif italic text-journey-text">{'i\u210F'}</span>
            <span className="text-xl md:text-2xl text-journey-muted font-serif italic">{'\u2202'}</span>
            <span className="text-lg md:text-xl text-journey-muted font-serif">{'|\u03C8\u27E9'}</span>
            <span className="text-xl md:text-2xl text-journey-muted font-serif italic">{' / \u2202t = '}</span>
            <span className="text-xl md:text-2xl font-serif italic text-journey-primary">{'\u0124'}</span>
            <span className="text-lg md:text-xl text-journey-muted font-serif">{' |\u03C8\u27E9'}</span>
          </div>
        </div>

        <div className="bg-journey-surface rounded-lg p-5 border border-journey-border mb-5 space-y-3 text-sm text-journey-muted leading-relaxed">
          <p>
            <strong className="text-journey-text">What it means:</strong> The left side tells us &ldquo;how the
            state changes over time.&rdquo; The right side tells us &ldquo;what energy is in the system&rdquo; (the
            Hamiltonian acts on the state). They must be equal. That is it. From this simple equation, we derive the behavior of
            atoms, molecules, lasers, transistors, and -- yes -- quantum computers.
          </p>
          <p className="text-xs text-journey-muted">
            Erwin Schrodinger published this in 1926. He was 38. Within months, physicists used it to
            explain the hydrogen atom with stunning precision -- matching experimental data that had
            puzzled science for decades.
          </p>
        </div>

        <button
          onClick={() => setShowCatStory(!showCatStory)}
          className="w-full mb-5 py-3 rounded-lg text-sm font-medium bg-journey-surface text-journey-accent hover:bg-journey-surface transition-colors tracking-wide"
        >
          {showCatStory ? 'Hide Schrodinger\'s Cat story' : 'Read the story of Schrodinger\'s Cat'}
        </button>

        <SchrodingerCatVisual showStory={showCatStory} />

        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-journey-text">Time (t) -- watch the wave evolve</span>
              <span className="text-journey-muted font-mono">{time.toFixed(1)}</span>
            </div>
            <input type="range" min={0} max={20} step={0.1} value={time} onChange={e => setTime(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-journey-text">Energy level (n) -- higher means more energy</span>
              <span className="text-journey-muted font-mono">n = {energyLevel}</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={energyLevel} onChange={e => setEnergyLevel(+e.target.value)} className="w-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-border">
            <div className="text-xs text-journey-muted mb-3 font-medium">Wavefunction psi(x, t)</div>
            <svg width="400" height="100" viewBox="0 0 400 100" className="w-full">
              <rect x="0" y="0" width="400" height="100" fill="transparent" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeWidth="0.5" />
              <motion.polyline
                points={wavePoints}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                key={`wave-${time.toFixed(1)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
            </svg>
            <p className="text-[10px] text-journey-muted mt-2 leading-relaxed">
              The wavefunction contains all information about the system. It evolves smoothly in time.
            </p>
          </div>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-border">
            <div className="text-xs text-journey-muted mb-3 font-medium">Probability density |psi|<sup>2</sup></div>
            <svg width="400" height="100" viewBox="0 0 400 100" className="w-full">
              <rect x="0" y="0" width="400" height="100" fill="transparent" />
              <motion.polyline
                points={probDensityPoints}
                fill="#7c3aed"
                fillOpacity="0.15"
                stroke="#7c3aed"
                strokeWidth="1.5"
                key={`prob-${energyLevel}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </svg>
            <p className="text-[10px] text-journey-muted mt-2 leading-relaxed">
              |psi|<sup>2</sup> = probability of finding the particle at each position. Higher = more likely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg p-4 text-center bg-journey-surface border border-journey-border">
            <div className="text-xs text-journey-muted mb-1">Energy</div>
            <div className="text-sm font-bold text-journey-primary">E{energyLevel} = {energy} &middot; E<sub>0</sub></div>
            <div className="text-[10px] text-journey-muted mt-1">E proportional to n<sup>2</sup> (energy grows quadratically)</div>
          </div>
          <div className="rounded-lg p-4 text-center bg-journey-surface border border-journey-border">
            <div className="text-xs text-journey-muted mb-1">Nodes (zero crossings)</div>
            <div className="text-sm font-bold text-journey-text">{energyLevel - 1}</div>
            <div className="text-[10px] text-journey-muted mt-1">{energyLevel > 1 ? `${energyLevel - 1} point${energyLevel > 2 ? 's' : ''} where psi = 0` : 'No nodes -- ground state'}</div>
          </div>
          <div className="rounded-lg p-4 text-center bg-journey-surface border border-journey-border">
            <div className="text-xs text-journey-muted mb-1">Wavelength</div>
            <div className="text-sm font-bold text-journey-text">lambda = L/{energyLevel}</div>
            <div className="text-[10px] text-journey-muted mt-1">Higher energy = shorter wavelength</div>
          </div>
        </div>
      </div>

      <div className="bg-white/50 rounded-xl p-5 border border-journey-border">
        <p className="text-sm text-journey-muted text-center leading-relaxed">
          The wavefunction <span className="font-serif text-journey-text">psi</span> encodes
          <strong className="text-journey-text"> everything</strong> knowable about a quantum system.
          <span className="font-serif text-journey-primary"> |psi|<sup>2</sup></span> gives the probability density
          of finding the particle at each position. Higher energy levels produce
          <strong className="text-journey-text"> more nodes</strong> and
          <strong className="text-journey-text"> shorter wavelengths</strong> -- which is why electrons in
          atoms occupy distinct shells (n = 1, 2, 3...). The Schrodinger equation predicted this
          quantization in 1926, and it has been experimentally verified billions of times since.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.schrodinger} />
        <ModuleQuiz questions={moduleContent.schrodinger.quiz} />
      </div>
    </div>
  );
}
