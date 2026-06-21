'use client';

interface Props {
  theta: number;
  phi: number;
  onThetaChange: (v: number) => void;
  onPhiChange: (v: number) => void;
  disabled: boolean;
}

export default function AmplitudeControls({ theta, phi, onThetaChange, onPhiChange, disabled }: Props) {
  const p0 = (Math.cos(theta / 2) ** 2 * 100).toFixed(0);
  const p1 = (Math.sin(theta / 2) ** 2 * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-journey-primary">|0⟩ vs |1⟩ blend</span>
          <span className="text-xs text-journey-muted">
            {p0}% / {p1}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.PI}
          step={0.005}
          value={theta}
          onChange={(e) => onThetaChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-journey-muted mt-1">
          <span className="text-journey-primary/60">Pure |0⟩</span>
          <span className="text-journey-muted">Equal</span>
          <span className="text-journey-accent/60">Pure |1⟩</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-journey-text">Relative phase (φ)</span>
          <span className="text-xs text-journey-muted">{phi.toFixed(2)} rad</span>
        </div>
        <input
          type="range"
          min={0}
          max={2 * Math.PI}
          step={0.005}
          value={phi}
          onChange={(e) => onPhiChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  );
}
