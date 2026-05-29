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
          <span className="text-sm font-medium text-quantum-cyan">|0⟩ vs |1⟩ blend</span>
          <span className="text-xs text-gray-500">
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
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span className="text-quantum-cyan/60">Pure |0⟩</span>
          <span className="text-gray-600">Equal</span>
          <span className="text-quantum-magenta/60">Pure |1⟩</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Relative phase (φ)</span>
          <span className="text-xs text-gray-500">{phi.toFixed(2)} rad</span>
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
