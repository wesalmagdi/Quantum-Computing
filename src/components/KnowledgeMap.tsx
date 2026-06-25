'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MapNode {
  id: string;
  label: string;
  type: 'meeting' | 'concept' | 'note' | 'reference';
  x: number;
  y: number;
  radius: number;
  color: string;
  connections: string[];
}

const TYPE_CONFIG = {
  meeting: { color: '#818cf8', radius: 28, icon: '◆' },
  concept: { color: '#22d3ee', radius: 20, icon: '◇' },
  note: { color: '#34d399', radius: 16, icon: '⬡' },
  reference: { color: '#f472b6', radius: 14, icon: '◈' },
};

export default function KnowledgeMap() {
  const [dimensions, setDimensions] = useState({ w: 1000, h: 600 });
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const w = Math.max(800, window.innerWidth - 80);
    const h = Math.max(500, window.innerHeight - 200);
    setDimensions({ w, h });

    const initialNodes: MapNode[] = [
      {
        id: 'project', label: 'Grad Project', type: 'meeting',
        x: w * 0.5, y: h * 0.15, radius: 34, color: '#818cf8',
        connections: ['m1', 'concept-qrl', 'note-intro'],
      },
      {
        id: 'm1', label: 'Meeting 1: Kickoff', type: 'meeting',
        x: w * 0.25, y: h * 0.38, radius: TYPE_CONFIG.meeting.radius, color: TYPE_CONFIG.meeting.color,
        connections: ['m2', 'concept-nisq', 'ref-sciam'],
      },
      {
        id: 'm2', label: 'Meeting 2: QRL & Direction', type: 'meeting',
        x: w * 0.65, y: h * 0.42, radius: TYPE_CONFIG.meeting.radius, color: TYPE_CONFIG.meeting.color,
        connections: ['concept-qrl', 'concept-simulation', 'ref-papers'],
      },
      {
        id: 'concept-nisq', label: 'NISQ+ Era', type: 'concept',
        x: w * 0.08, y: h * 0.55, radius: TYPE_CONFIG.concept.radius, color: TYPE_CONFIG.concept.color,
        connections: [],
      },
      {
        id: 'concept-qrl', label: 'Quantum RL', type: 'concept',
        x: w * 0.45, y: h * 0.55, radius: TYPE_CONFIG.concept.radius, color: TYPE_CONFIG.concept.color,
        connections: ['concept-simulation'],
      },
      {
        id: 'concept-simulation', label: 'Quantum Simulation', type: 'concept',
        x: w * 0.78, y: h * 0.58, radius: TYPE_CONFIG.concept.radius, color: TYPE_CONFIG.concept.color,
        connections: [],
      },
      {
        id: 'note-intro', label: 'Intro to QC', type: 'note',
        x: w * 0.35, y: h * 0.78, radius: TYPE_CONFIG.note.radius, color: TYPE_CONFIG.note.color,
        connections: ['concept-nisq'],
      },
      {
        id: 'ref-sciam', label: 'Scientific American', type: 'reference',
        x: w * 0.15, y: h * 0.72, radius: TYPE_CONFIG.reference.radius, color: TYPE_CONFIG.reference.color,
        connections: [],
      },
      {
        id: 'ref-papers', label: 'Research Papers', type: 'reference',
        x: w * 0.6, y: h * 0.75, radius: TYPE_CONFIG.reference.radius, color: TYPE_CONFIG.reference.color,
        connections: [],
      },
    ];

    setNodes(initialNodes);
  }, []);

  const getConnected = (nodeId: string): Set<string> => {
    const connected = new Set<string>([nodeId]);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.connections.forEach(c => connected.add(c));
      nodes.forEach(n => {
        if (n.connections.includes(nodeId)) connected.add(n.id);
      });
    }
    return connected;
  };

  if (nodes.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pb-16">
        <div className="border-b border-journey-border/30 px-4 md:px-8 py-6">
          <h1 className="text-xl font-bold text-journey-text font-mono">◈ Knowledge Map</h1>
        </div>
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="text-journey-muted/40 font-mono text-xs">Initializing network...</span>
        </div>
      </div>
    );
  }

  const connectedSet = hovered ? getConnected(hovered) : null;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="border-b border-journey-border/30 px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-journey-primary" style={{ boxShadow: '0 0 6px rgba(129,140,248,0.4)' }} />
          <span className="uppercase tracking-wider">Network</span>
          <span className="text-journey-border/30">/</span>
          <span>{nodes.length} nodes</span>
        </div>
        <h1 className="text-xl font-bold text-journey-text font-mono">◈ Knowledge Map</h1>
      </div>

      <div className="px-4 md:px-8 mt-6">
        <div className="border border-journey-border/20 rounded-lg bg-journey-card/20 overflow-hidden relative"
          style={{ minHeight: dimensions.h }}>
          <svg width={dimensions.w} height={dimensions.h} className="w-full" style={{ minHeight: dimensions.h }}>
            <defs>
              <pattern id="kgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.5" fill="rgba(129,140,248,0.06)" />
              </pattern>
              <filter id="kglow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width={dimensions.w} height={dimensions.h} fill="url(#kgrid)" />

            {/* Connection lines */}
            {nodes.map(node =>
              node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;
                const isHighlighted = !connectedSet || (connectedSet.has(node.id) && connectedSet.has(targetId));
                return (
                  <line key={`c-${node.id}-${targetId}`}
                    x1={node.x} y1={node.y}
                    x2={target.x} y2={target.y}
                    stroke={isHighlighted ? node.color : 'rgba(129,140,248,0.06)'}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    opacity={isHighlighted ? 0.5 : 0.2}
                  />
                );
              })
            )}

            {/* Nodes */}
            {nodes.map(node => {
              const cfg = TYPE_CONFIG[node.type];
              const isHovered = hovered === node.id;
              const isVisible = !connectedSet || connectedSet.has(node.id);
              const opacity = isVisible ? 1 : 0.15;

              return (
                <g key={node.id}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                  opacity={opacity}
                >
                  {isHovered && (
                    <circle cx={node.x} cy={node.y} r={node.radius + 10}
                      fill="none" stroke={node.color} strokeWidth="1" opacity="0.25">
                      <animate attributeName="r" from={node.radius + 10} to={node.radius + 16} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.25" to="0.05" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={node.x} cy={node.y} r={node.radius}
                    fill={`${node.color}15`} stroke={node.color}
                    strokeWidth={isHovered ? 2 : 1}
                    filter={isHovered ? 'url(#kglow)' : undefined}
                  />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fill={node.color} fontSize={node.type === 'meeting' ? '16' : '12'} fontFamily="monospace">
                    {cfg.icon}
                  </text>
                  <text x={node.x} y={node.y + node.radius + 14} textAnchor="middle"
                    fill={isHovered ? node.color : 'rgba(226,232,240,0.35)'}
                    fontSize="9" fontFamily="monospace">
                    {node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-journey-card/60 backdrop-blur-sm border border-journey-border/10 rounded-lg px-3 py-2">
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="text-[8px]" style={{ color: cfg.color }}>{cfg.icon}</span>
                <span className="text-[8px] font-mono text-journey-muted/60 uppercase">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-[9px] font-mono text-journey-muted/30 text-center">
          Hover nodes to explore connections · The knowledge graph grows as your project expands
        </div>
      </div>
    </div>
  );
}
