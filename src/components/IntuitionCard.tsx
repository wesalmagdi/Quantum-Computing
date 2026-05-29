'use client';

import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: "A qubit is a blend",
    text: "A classical bit is always 0 or 1 — like a light switch. But a qubit can be a blend of both |0⟩ and |1⟩ simultaneously. The θ (theta) slider controls this blend: all the way left = pure |0⟩, all the way right = pure |1⟩, middle = 50/50. The amount of each is determined by the amplitudes α and β in the state equation |ψ⟩ = α|0⟩ + β|1⟩.",
    highlight: "Try the blend slider → watch the Bloch sphere point move",
  },
  {
    title: "The Bloch sphere is your map",
    text: "The Bloch sphere is a 3D map of all possible qubit states. The north pole is |0⟩, the south pole is |1⟩, and every other point on the surface is a different superposition. The distance from the poles determines the probability split, and the angle around the equator (φ) is the phase. Drag the sphere to rotate and explore — it's your quantum compass.",
    highlight: "Drag to rotate the sphere — see the full 3D picture",
  },
  {
    title: "Probability = amplitude squared",
    text: "The bars show the probability of measuring |0⟩ or |1⟩. These come from squaring the amplitudes: P(0) = |α|² and P(1) = |β|². Why square? Because amplitudes can be negative (or even complex!), but probabilities can't. Squaring makes everything positive while preserving the relative size. This is exactly how light intensity works: amplitude² = brightness.",
    highlight: "Watch the bars change as you adjust the θ slider",
  },
  {
    title: "Measurement collapses everything",
    text: "When you measure a qubit, the superposition 'collapses' — it instantly becomes |0⟩ or |1⟩ with the probability you set. You never measure a 'blend'; you always get a definite outcome. This is the measurement problem: why does the smooth, deterministic evolution of the Schrödinger equation suddenly snap to a random classical result? Nobody knows for sure, but it works, and it's the basis of all quantum technology.",
    highlight: "Click 'Measure' → watch the sphere snap to a pole",
  },
  {
    title: "Phase is the secret sauce",
    text: "The φ (phi) slider controls the relative phase — the 'twist' of the quantum state. It doesn't change the probabilities at all (try it!), but it dramatically affects how qubits interact. When two qubits meet, their phases determine whether they add up (constructive interference) or cancel (destructive). This is what makes quantum algorithms faster: they orchestrate phases so correct answers reinforce and wrong answers cancel.",
    highlight: "Move the phase slider → see the state rotate without changing probabilities",
  },
];

export default function IntuitionCard({
  step,
  total,
  onNext,
  onPrev,
}: {
  step: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const s = steps[step];

  return (
    <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
      <div className="flex items-center gap-2 mb-5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-10 bg-quantum-purple' : i < step ? 'w-4 bg-purple-800/50' : 'w-4 bg-gray-800'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm">{s.text}</p>
          {s.highlight && (
            <p className="text-quantum-cyan text-xs mt-3 font-medium tracking-wide">{s.highlight}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800/50">
        <span className="text-xs text-gray-600">
          Step {step + 1} of {total}
        </span>
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            disabled={step === 0}
            className="px-4 py-1.5 text-sm text-gray-500 disabled:opacity-20 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            disabled={step === total - 1}
            className="px-5 py-1.5 text-sm bg-quantum-purple text-white rounded-lg hover:bg-purple-600 disabled:opacity-20 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
