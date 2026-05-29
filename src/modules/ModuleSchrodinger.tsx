'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import SchrodingerCatVisual from '@/components/visuals/SchrodingerCatVisual';
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
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Schrodinger&rsquo;s Equation</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          The Schrodinger equation is the <strong className="text-white">F = ma of quantum mechanics</strong>.
          It describes how quantum states evolve in time. While Newton&rsquo;s laws predict where a ball will go,
          Schrodinger&rsquo;s equation predicts how a <strong className="text-white">wavefunction</strong> evolves --
          and from that wavefunction, we can extract everything knowable about a quantum system.
        </p>
      </div>

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <div className="text-center mb-6">
          <div className="inline-block bg-black/40 rounded-lg px-6 py-4 border border-gray-800/50">
            <span className="text-xl md:text-2xl font-serif italic text-gray-300">{'i\u210F'}</span>
            <span className="text-xl md:text-2xl text-gray-500 font-serif italic">{'\u2202'}</span>
            <span className="text-lg md:text-xl text-gray-400 font-serif">{'|\u03C8\u27E9'}</span>
            <span className="text-xl md:text-2xl text-gray-500 font-serif italic">{' / \u2202t = '}</span>
            <span className="text-xl md:text-2xl font-serif italic text-quantum-purple">{'\u0124'}</span>
            <span className="text-lg md:text-xl text-gray-400 font-serif">{' |\u03C8\u27E9'}</span>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-5 border border-gray-800/40 mb-5 space-y-3 text-sm text-gray-400 leading-relaxed">
          <p>
            <strong className="text-gray-200">What it means:</strong> The left side tells us &ldquo;how the
            state changes over time.&rdquo; The right side tells us &ldquo;what energy is in the system&rdquo; (the
            Hamiltonian acts on the state). They must be equal. That is it. From this simple equation, we derive the behavior of
            atoms, molecules, lasers, transistors, and -- yes -- quantum computers.
          </p>
          <p className="text-xs text-gray-500">
            Erwin Schrodinger published this in 1926. He was 38. Within months, physicists used it to
            explain the hydrogen atom with stunning precision -- matching experimental data that had
            puzzled science for decades.
          </p>
        </div>

        <button
          onClick={() => setShowCatStory(!showCatStory)}
          className="w-full mb-5 py-3 rounded-lg text-sm font-medium bg-gray-800 text-amber-400 hover:bg-gray-700 transition-colors tracking-wide"
        >
          {showCatStory ? 'Hide Schrodinger\'s Cat story' : 'Read the story of Schrodinger\'s Cat'}
        </button>

        <SchrodingerCatVisual showStory={showCatStory} />

        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-300">Time (t) -- watch the wave evolve</span>
              <span className="text-gray-500 font-mono">{time.toFixed(1)}</span>
            </div>
            <input type="range" min={0} max={20} step={0.1} value={time} onChange={e => setTime(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-300">Energy level (n) -- higher means more energy</span>
              <span className="text-gray-500 font-mono">n = {energyLevel}</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={energyLevel} onChange={e => setEnergyLevel(+e.target.value)} className="w-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800/50">
            <div className="text-xs text-gray-500 mb-3 font-medium">Wavefunction psi(x, t)</div>
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
            <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">
              The wavefunction contains all information about the system. It evolves smoothly in time.
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800/50">
            <div className="text-xs text-gray-500 mb-3 font-medium">Probability density |psi|<sup>2</sup></div>
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
            <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">
              |psi|<sup>2</sup> = probability of finding the particle at each position. Higher = more likely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg p-4 text-center bg-gray-900/30 border border-gray-800/40">
            <div className="text-xs text-gray-500 mb-1">Energy</div>
            <div className="text-sm font-bold text-quantum-purple">E{energyLevel} = {energy} &middot; E<sub>0</sub></div>
            <div className="text-[10px] text-gray-600 mt-1">E proportional to n<sup>2</sup> (energy grows quadratically)</div>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-900/30 border border-gray-800/40">
            <div className="text-xs text-gray-500 mb-1">Nodes (zero crossings)</div>
            <div className="text-sm font-bold text-white">{energyLevel - 1}</div>
            <div className="text-[10px] text-gray-600 mt-1">{energyLevel > 1 ? `${energyLevel - 1} point${energyLevel > 2 ? 's' : ''} where psi = 0` : 'No nodes -- ground state'}</div>
          </div>
          <div className="rounded-lg p-4 text-center bg-gray-900/30 border border-gray-800/40">
            <div className="text-xs text-gray-500 mb-1">Wavelength</div>
            <div className="text-sm font-bold text-white">lambda = L/{energyLevel}</div>
            <div className="text-[10px] text-gray-600 mt-1">Higher energy = shorter wavelength</div>
          </div>
        </div>
      </div>

      <div className="bg-quantum-card/50 rounded-xl p-5 border border-gray-800/40">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          The wavefunction <span className="font-serif text-gray-300">psi</span> encodes
          <strong className="text-white"> everything</strong> knowable about a quantum system.
          <span className="font-serif text-quantum-purple"> |psi|<sup>2</sup></span> gives the probability density
          of finding the particle at each position. Higher energy levels produce
          <strong className="text-gray-200"> more nodes</strong> and
          <strong className="text-gray-200"> shorter wavelengths</strong> -- which is why electrons in
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
