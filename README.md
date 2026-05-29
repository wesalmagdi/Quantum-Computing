# Quantum Superposition

An interactive, visual-first quantum computing learning platform. Nine progressive modules guide learners from classical bits through superposition, entanglement, gates, interference, and the Schrodinger equation -- with real-time 3D Bloch sphere visualization, Feynman-style analogies, and embedded quizzes.

## Modules

| # | Module | Core Concept |
|---|--------|-------------|
| 1 | Introduction | Bits vs qubits, Dirac notation |
| 2 | Qubit | Amplitude, probability, phase |
| 3 | Superposition | Bloch sphere, state vectors |
| 4 | Measurement | Collapse, statistics, histograms |
| 5 | Entanglement | Bell states, non-locality |
| 6 | Hadamard Gate | Creating superposition, H^2 = I |
| 7 | Pauli-X Gate | Quantum NOT, X^2 = I |
| 8 | Interference | Wave mechanics, constructive/destructive |
| 9 | Schrodinger Equation | Wavefunctions, time evolution, energy levels |

## Stack

- **Framework**: Next.js 14 (TypeScript)
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js via @react-three/fiber + @react-three/drei
- **Animation**: Framer Motion
- **Visual Storytelling**: Inline SVG illustrations with animated polylines

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

Produces an optimized static export in the `out/` directory.

## License

MIT
