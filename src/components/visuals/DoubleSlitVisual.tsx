'use client';

export default function DoubleSlitVisual() {
  return (
    <div className="bg-white rounded-xl p-6 border border-journey-border">
      <h3 className="font-bold text-journey-text mb-4 tracking-wide text-sm uppercase">The Double-Slit Experiment</h3>

      <svg width="100%" height="160" viewBox="0 0 600 160" className="w-full mb-4">
        <rect x="0" y="40" width="600" height="80" fill="#0a0a1a" rx="4" />

        <rect x="50" y="30" width="4" height="100" fill="#555" rx="2" />
        <rect x="50" y="95" width="4" height="4" rx="2" fill="#00d4ff" />
        <rect x="50" y="65" width="4" height="4" rx="2" fill="#ff00aa" />

        <rect x="300" y="30" width="4" height="100" fill="#555" rx="2" />
        <rect x="300" y="100" width="4" height="4" rx="2" fill="#00d4ff" />
        <rect x="300" y="70" width="4" height="4" rx="2" fill="#ff00aa" />

        <line x1="55" y1="55" x2="300" y2="55" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="75" x2="300" y2="75" stroke="#ff00aa" strokeWidth="1" opacity="0.4" />

        <path d="M302,55 Q400,30 500,55" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M302,55 Q400,50 500,40" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M302,75 Q400,60 500,65" stroke="#ff00aa" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M302,75 Q400,80 500,70" stroke="#ff00aa" strokeWidth="1" fill="none" opacity="0.3" />

        <rect x="510" y="30" width="60" height="100" fill="#0a0a1a" stroke="#333" strokeWidth="1" rx="2" />
        {Array.from({ length: 30 }).map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const intensity = Math.sin((i * 0.3) ** 2) ** 2;
          return (
            <rect
              key={i}
              x={515 + col * 5}
              y={35 + row * 30}
              width={4}
              height={28}
              fill={`rgba(124, 58, 237, ${intensity * 0.6})`}
            />
          );
        })}

        <text x="50" y="20" textAnchor="middle" fill="#555" fontSize="9" fontFamily="monospace">source</text>
        <text x="300" y="20" textAnchor="middle" fill="#555" fontSize="9" fontFamily="monospace">slit A</text>
        <text x="300" y="148" textAnchor="middle" fill="#555" fontSize="9" fontFamily="monospace">slit B</text>
        <text x="540" y="20" textAnchor="middle" fill="#555" fontSize="9" fontFamily="monospace">screen</text>
      </svg>

      <div className="bg-journey-surface rounded-lg p-3 border border-journey-border">
        <p className="text-xs text-journey-muted leading-relaxed">
          A source emits waves that pass through two slits. Each slit acts as a new wave source. Where the
          waves meet <strong className="text-journey-text">in phase</strong> (both at peak), they create a bright band.
          Where a peak meets a trough, they cancel to darkness. The result is an{' '}
          <strong className="text-journey-text">interference pattern</strong> on the screen — alternating bright and
          dark bands. Quantum algorithms orchestrate exactly this effect with probability amplitudes to amplify
          correct answers and cancel incorrect ones.
        </p>
      </div>
    </div>
  );
}
