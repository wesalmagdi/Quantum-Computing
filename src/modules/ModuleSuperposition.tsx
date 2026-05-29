'use client';

import { useState, useCallback } from 'react';
import BlochSphere from '@/components/BlochSphere';
import AmplitudeControls from '@/components/AmplitudeControls';
import ProbabilityDisplay from '@/components/ProbabilityDisplay';
import StateDisplay from '@/components/StateDisplay';
import MeasureButton from '@/components/MeasureButton';
import IntuitionCard from '@/components/IntuitionCard';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import { moduleContent } from '@/lib/content';

export default function ModuleSuperposition() {
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedValue, setCollapsedValue] = useState<0 | 1 | null>(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [collapseKey, setCollapseKey] = useState(0);

  const handleThetaChange = useCallback((v: number) => {
    setTheta(v);
    setCollapsed(false);
    setCollapsedValue(null);
  }, []);

  const handlePhiChange = useCallback((v: number) => {
    setPhi(v);
    setCollapsed(false);
    setCollapsedValue(null);
  }, []);

  const handleMeasure = useCallback((result: 0 | 1) => {
    setCollapsedValue(result);
    setCollapsed(true);
    setCollapseKey((k) => k + 1);
  }, []);

  const handleReset = useCallback(() => {
    setCollapsedValue(null);
    setCollapsed(false);
  }, []);

  const sphereTheta = collapsed ? (collapsedValue === 0 ? 0 : Math.PI) : theta;

  return (
    <div key={collapseKey} className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Superposition</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Superposition is the quantum ability to be in
          <strong className="text-white"> multiple states at once</strong> -- until you measure.
          The Bloch sphere is your map: every possible superposition is a point on its surface.
          North pole is <span className="text-quantum-cyan">|0&gt;</span>, south pole is
          <span className="text-quantum-magenta"> |1&gt;</span>, and everything in between is a unique blend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-quantum-card rounded-xl border border-gray-800/60 overflow-hidden">
          <div className={collapsed ? 'animate-collapse-glow' : ''}>
            <BlochSphere theta={sphereTheta} phi={phi} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-quantum-card rounded-xl p-5 border border-gray-800/60">
            <AmplitudeControls
              theta={theta}
              phi={phi}
              onThetaChange={handleThetaChange}
              onPhiChange={handlePhiChange}
              disabled={collapsed}
            />
          </div>
          <div className="bg-quantum-card rounded-xl p-5 border border-gray-800/60">
            <ProbabilityDisplay theta={theta} />
          </div>
          <div className="bg-quantum-card rounded-xl p-5 border border-gray-800/60">
            <StateDisplay theta={theta} phi={phi} />
          </div>
          <div className="bg-quantum-card rounded-xl p-5 border border-gray-800/60">
            <MeasureButton
              theta={theta}
              collapsed={collapsed}
              collapsedValue={collapsedValue}
              onMeasure={handleMeasure}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>

      <IntuitionCard
        step={lessonStep}
        total={5}
        onNext={() => setLessonStep((s) => Math.min(s + 1, 4))}
        onPrev={() => setLessonStep((s) => Math.max(s - 1, 0))}
      />

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.superposition} />
        <ModuleQuiz questions={moduleContent.superposition.quiz} />
      </div>
    </div>
  );
}
