export function getAmplitudes(theta: number, phi: number) {
  const alpha = Math.cos(theta / 2);
  const betaReal = Math.sin(theta / 2) * Math.cos(phi);
  const betaImag = Math.sin(theta / 2) * Math.sin(phi);
  return { alpha, betaReal, betaImag };
}

export function getProbabilities(theta: number) {
  const p0 = Math.cos(theta / 2) ** 2;
  const p1 = Math.sin(theta / 2) ** 2;
  return { p0, p1 };
}

export function getBlochCoordinates(theta: number, phi: number) {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

export function measure(theta: number): 0 | 1 {
  const { p0 } = getProbabilities(theta);
  return Math.random() < p0 ? 0 : 1;
}

export function applyPauliX(theta: number, phi: number) {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  const xp = x;
  const yp = -y;
  const zp = -z;
  const newTheta = Math.acos(Math.max(-1, Math.min(1, zp)));
  const rawPhi = Math.atan2(yp, xp);
  return { theta: newTheta, phi: ((rawPhi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) };
}

export function applyHadamard(theta: number, phi: number) {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  const xp = z;
  const yp = -y;
  const zp = x;
  const newTheta = Math.acos(Math.max(-1, Math.min(1, zp)));
  const rawPhi = Math.atan2(yp, xp);
  return { theta: newTheta, phi: ((rawPhi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) };
}

export function runTrials(theta: number, trials: number): { zeros: number; ones: number } {
  let zeros = 0;
  for (let i = 0; i < trials; i++) {
    if (measure(theta) === 0) zeros++;
  }
  return { zeros, ones: trials - zeros };
}

export const MODULES = [
  { id: 'intro', label: 'Introduction', desc: 'From bits to qubits' },
  { id: 'qubit', label: 'Qubit', desc: 'The quantum bit' },
  { id: 'superposition', label: 'Superposition', desc: 'Being two things at once' },
  { id: 'measurement', label: 'Measurement', desc: 'Collapse & statistics' },
  { id: 'entanglement', label: 'Entanglement', desc: 'Spooky action' },
  { id: 'hadamard', label: 'Hadamard Gate', desc: 'Creating superposition' },
  { id: 'paulix', label: 'Pauli-X Gate', desc: 'Quantum NOT' },
  { id: 'interference', label: 'Interference', desc: 'Waves combining' },
  { id: 'schrodinger', label: "Schr\u00f6dinger Eq.", desc: 'Time evolution' },
  { id: 'manybody', label: 'Many-Body Terms', desc: 'Excited states & fermions' },
  { id: 'break', label: 'Break Time', desc: 'Take a break — climb Icy Tower' },
];
