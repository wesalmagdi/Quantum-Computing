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
import HistoryCard from '@/components/HistoryCard';
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
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Superposition</h2>
        <p className="text-journey-muted text-sm leading-relaxed max-w-2xl">
          Superposition is the quantum ability to be in
          <strong className="text-journey-text"> multiple states at once</strong> -- until you measure.
          The Bloch sphere is your map: every possible superposition is a point on its surface.
          North pole is <span className="text-journey-primary">|0&gt;</span>, south pole is
          <span className="text-journey-accent"> |1&gt;</span>, and everything in between is a unique blend.
        </p>
      </div>

      <HistoryCard
        concept="The ability of a quantum system to exist in multiple states at once"
        items={[
          { year: 1935, scientist: 'Erwin Schrodinger', story: 'Published a paper titled "The Present Situation in Quantum Mechanics" in which he introduced the now-famous cat thought experiment to argue that superposition cannot literally apply to macroscopic objects. The paper was written in German and was a direct critique of the Copenhagen interpretation. It was here that the word "superposition" entered the quantum lexicon.', quote: { text: 'One can even set up quite ridiculous cases. A cat is penned up in a steel chamber... The psi-function of the entire system would express this by having in it the living and dead cat mixed or smeared out in equal parts.', source: 'Erwin Schrodinger, 1935' } },
          { year: 1801, scientist: 'Thomas Young', story: 'Performed the double-slit experiment, the first recorded demonstration of wave-like superposition. Though he was studying light, not quantum mechanics, his experiment became the archetype for all subsequent superposition thought experiments. Over a century later, physicists would repeat it with single electrons, confirming that superposition is real — not just a mathematical fiction.', quote: { text: 'The experiments I am about to relate... may be repeated with great ease, whenever the sun shines.', source: 'Thomas Young, 1801' } },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-journey-border overflow-hidden">
          <div className={collapsed ? 'animate-collapse-glow' : ''}>
            <BlochSphere theta={sphereTheta} phi={phi} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-journey-border">
            <AmplitudeControls
              theta={theta}
              phi={phi}
              onThetaChange={handleThetaChange}
              onPhiChange={handlePhiChange}
              disabled={collapsed}
            />
          </div>
          <div className="bg-white rounded-xl p-5 border border-journey-border">
            <ProbabilityDisplay theta={theta} />
          </div>
          <div className="bg-white rounded-xl p-5 border border-journey-border">
            <StateDisplay theta={theta} phi={phi} />
          </div>
          <div className="bg-white rounded-xl p-5 border border-journey-border">
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
