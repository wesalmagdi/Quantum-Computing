export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleContent {
  videoId: string;
  title: string;
  description: string;
  quiz: QuizQuestion[];
}

export const moduleContent: Record<string, ModuleContent> = {
  intro: {
    videoId: 'Kv8N9alyYNc',
    title: 'Quantum Computers: Explained VISUALLY',
    description: 'A visual walkthrough of quantum computing fundamentals — perfect for absolute beginners.',
    quiz: [
      { question: 'A classical bit can be:', options: ['Only 0 or 1', 'Both 0 and 1 at once', 'Neither 0 nor 1'], correctIndex: 0, explanation: 'Classical bits are strictly 0 or 1. Qubits can be in a blend of both — that is superposition.' },
      { question: 'The notation |0⟩ is pronounced:', options: ['Ket zero', 'Bra zero', 'Zero ket'], correctIndex: 0, explanation: 'The | ⟩ is called a "ket" (from Dirac bra-ket notation). So |0⟩ is "ket zero" — a qubit in the 0 state.' },
      { question: 'What makes a qubit different from a classical bit?', options: ['It can be a blend of |0⟩ and |1⟩', 'It is faster', 'It uses less power'], correctIndex: 0, explanation: 'A qubit can exist in a superposition — a blend of |0⟩ and |1⟩ at the same time — unlike a classical bit.' },
    ],
  },
  qubit: {
    videoId: 'HSM1GfukQMI',
    title: 'How Qubits Really Work',
    description: 'IBM Quantum explains what qubits are, how they differ from bits, and the Bloch sphere representation.',
    quiz: [
      { question: 'The probabilities |α|² and |β|² always add up to:', options: ['1 (100%)', '2 (200%)', '0.5 (50%)'], correctIndex: 0, explanation: 'The total probability of measuring either |0⟩ or |1⟩ must be 1, so |α|² + |β|² = 1.' },
      { question: 'If α = 1 and β = 0, the qubit is in state:', options: ['|0⟩', '|1⟩', 'Superposition'], correctIndex: 0, explanation: 'α = 1 means 100% chance of measuring |0⟩, so the state is |0⟩.' },
      { question: 'The phase φ affects:', options: ['Interference between qubits', 'The measurement probability', 'Both'], correctIndex: 0, explanation: 'The phase φ doesn\'t change |α|² or |β|² (the probabilities), but it matters when qubits interact and interfere.' },
    ],
  },
  superposition: {
    videoId: 'WjjUfEpej-0',
    title: 'Visualizing Qubits on the Bloch Sphere',
    description: 'A quick visual guide to superposition on the Bloch sphere from IBM Quantum.',
    quiz: [
      { question: 'On the Bloch sphere, |0⟩ is at the:', options: ['North pole', 'South pole', 'Equator'], correctIndex: 0, explanation: '|0⟩ is at the north pole (top) of the Bloch sphere. |1⟩ is at the south pole.' },
      { question: 'When you measure a qubit in superposition, the state:', options: ['Collapses to |0⟩ or |1⟩', 'Stays the same', 'Disappears'], correctIndex: 0, explanation: 'Measurement collapses superposition — the qubit randomly becomes |0⟩ or |1⟩ based on the probabilities.' },
      { question: 'Equal superposition (50/50) lies on the:', options: ['Equator of the Bloch sphere', 'North pole', 'South pole'], correctIndex: 0, explanation: 'Equal superposition states like (|0⟩ + |1⟩)/√2 lie on the equator of the Bloch sphere.' },
    ],
  },
  measurement: {
    videoId: 'HSM1GfukQMI',
    title: 'How Qubits Really Work (Measurement section)',
    description: 'Review how measurement collapses qubit states and why repeated measurements reveal probabilities.',
    quiz: [
      { question: 'If you measure a qubit and get |0⟩, then measure again, you get:', options: ['|0⟩ again', '|1⟩', 'Random'], correctIndex: 0, explanation: 'Once measured, the qubit collapses. A second measurement of the same qubit gives the same result.' },
      { question: 'Measurement outcomes are fundamentally:', options: ['Random (probabilistic)', 'Deterministic', 'Predictable'], correctIndex: 0, explanation: 'Quantum measurement is inherently random. Only the probabilities can be predicted.' },
      { question: 'Running many measurements reveals:', options: ['The probability distribution', 'The exact state', 'Nothing useful'], correctIndex: 0, explanation: 'Repeated measurements of identical states produce a histogram matching |α|² and |β|².' },
    ],
  },
  entanglement: {
    videoId: 'rGRUFzPeJI4',
    title: 'Entanglement Explained Simply',
    description: 'IBM Quantum explains entanglement and how it connects qubits in this beginner-friendly video.',
    quiz: [
      { question: 'Measuring one entangled qubit:', options: ['Instantly affects the other', 'Has no effect on the other', 'Destroys both'], correctIndex: 0, explanation: 'Entangled qubits are correlated — measuring one instantly determines the state of the other.' },
      { question: 'Entangled qubits are always:', options: ['Perfectly correlated', 'Independent', 'Opposite'], correctIndex: 0, explanation: 'In a Bell state like (|00⟩ + |11⟩)/√2, the two qubits are perfectly correlated — both 0 or both 1.' },
      { question: 'Einstein called entanglement:', options: ['Spooky action at a distance', 'Quantum magic', 'Particle bonding'], correctIndex: 0, explanation: 'Einstein famously described entanglement as "spooky action at a distance" because it seemed to involve instantaneous influence.' },
    ],
  },
  hadamard: {
    videoId: 'cbPW2hTrMG4',
    title: 'Introduction to Basic Quantum Gates',
    description: 'Learn about the Hadamard, Pauli, and controlled gates in this tutorial.',
    quiz: [
      { question: 'H|0⟩ produces:', options: ['Equal superposition of |0⟩ and |1⟩', '|0⟩', '|1⟩'], correctIndex: 0, explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2, which is an equal superposition — 50% chance of measuring either.' },
      { question: 'The Hadamard gate creates:', options: ['Superposition', 'Entanglement', 'Measurement'], correctIndex: 0, explanation: 'Hadamard is the gate that puts a qubit into superposition, mapping |0⟩ to |+⟩ on the equator.' },
      { question: 'Applying H twice in a row (H²) gives:', options: ['The original state (identity)', 'The opposite state', 'Another superposition'], correctIndex: 0, explanation: 'H² = I — the Hadamard gate is its own inverse. Two applications return the original state.' },
    ],
  },
  paulix: {
    videoId: 'cbPW2hTrMG4',
    title: 'Introduction to Basic Quantum Gates',
    description: 'The same tutorial covers Pauli-X gate operations and how they flip qubit states.',
    quiz: [
      { question: 'X|0⟩ = ', options: ['|1⟩', '|0⟩', 'Superposition'], correctIndex: 0, explanation: 'The Pauli-X gate flips |0⟩ to |1⟩ — it is the quantum version of a classical NOT gate.' },
      { question: 'Pauli-X is the quantum version of a:', options: ['NOT gate', 'AND gate', 'OR gate'], correctIndex: 0, explanation: 'X gate acts as a quantum NOT gate — it maps |0⟩ ↔ |1⟩.' },
      { question: 'Applying X twice (X²) gives:', options: ['The original state (identity)', 'The opposite state', 'A superposition'], correctIndex: 0, explanation: 'X² = I — two Pauli-X flips return the qubit to its original state.' },
    ],
  },
  interference: {
    videoId: 'Kv8N9alyYNc',
    title: 'Quantum Computers: Explained VISUALLY',
    description: 'This video covers interference and how quantum amplitudes combine — a core concept.',
    quiz: [
      { question: 'Constructive interference happens when waves are:', options: ['In phase (aligned)', 'Out of phase (opposite)', 'Random'], correctIndex: 0, explanation: 'In-phase waves add up — their amplitudes combine to produce a larger wave (constructive interference).' },
      { question: 'Destructive interference causes waves to:', options: ['Cancel each other out', 'Amplify each other', 'Pass through each other'], correctIndex: 0, explanation: 'Out-of-phase waves cancel — their amplitudes subtract, potentially reducing to zero (destructive interference).' },
      { question: 'Quantum algorithms use interference to:', options: ['Amplify correct answers and cancel wrong ones', 'Randomize outputs', 'Speed up classical operations'], correctIndex: 0, explanation: 'Quantum algorithms cleverly arrange interference so correct paths reinforce and incorrect paths cancel.' },
    ],
  },
  schrodinger: {
    videoId: 'QeUMFo8sODk',
    title: "What is The Schrödinger Equation, Exactly?",
    description: 'Up and Atom explains the Schrödinger equation conceptually — the F=ma of quantum mechanics.',
    quiz: [
      { question: 'The Schrödinger equation describes how quantum states:', options: ['Evolve in time', 'Are measured', 'Become entangled'], correctIndex: 0, explanation: 'The Schrödinger equation is the fundamental law of quantum time evolution — like F=ma for quantum systems.' },
      { question: '|ψ|² (the squared wavefunction) gives:', options: ['Probability density', 'Energy', 'Velocity'], correctIndex: 0, explanation: 'Max Born interpreted |ψ|² as the probability density — the likelihood of finding a particle at a given position.' },
      { question: 'Higher energy levels correspond to:', options: ['More nodes in the wavefunction', 'Fewer nodes', 'No change in nodes'], correctIndex: 0, explanation: 'Higher n means more nodes (points where the wavefunction crosses zero), corresponding to shorter wavelengths.' },
    ],
  },
};
