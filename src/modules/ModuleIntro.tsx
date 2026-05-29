'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleQuiz from '@/components/ModuleQuiz';
import BitVsQubitVisual from '@/components/visuals/BitVsQubitVisual';
import HistoryCard from '@/components/HistoryCard';
import { moduleContent } from '@/lib/content';

export default function ModuleIntro() {
  const [bitValue, setBitValue] = useState<0 | 1>(0);
  const [qubitBlend, setQubitBlend] = useState(0.5);
  const [showKet, setShowKet] = useState(false);

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">From Bits to Qubits</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Before we can explore quantum computing, we need to speak its language.
          The difference between a <strong className="text-white">bit</strong> and a
          <strong className="text-white"> qubit</strong> is subtle but world-changing.
          Let us start with what you already know.
        </p>
      </div>

      <HistoryCard
        concept="The bridge between classical and quantum computing"
        items={[
          { year: 1939, scientist: 'Paul Dirac', story: 'Invented bra-ket notation at age 37, giving us the |\u27E9 symbols that encode quantum states. Dirac shared the 1933 Nobel Prize with Erwin Schrodinger for discovering that quantum mechanics and relativity could be unified. He called the notation a "bra(c)ket" as a pun — combining "bra" and "ket" to form "bracket."', quote: { text: 'Pick a flower on Earth and you move the farthest star.', source: 'Paul Dirac' } },
          { year: 1981, scientist: 'Richard Feynman', story: 'Delivered a visionary lecture at MIT titled "Simulating Physics with Computers," arguing that nature is not classical and that a fundamentally quantum computer would be needed to simulate quantum systems. This lecture is widely considered the birth of quantum computing as a field.', quote: { text: 'Nature isn\'t classical, dammit, and if you want to simulate nature, you\'d better make it quantum mechanical.', source: 'Richard Feynman, 1981' } },
        ]}
      />

      <BitVsQubitVisual
        bitValue={bitValue}
        qubitBlend={qubitBlend}
        onBitToggle={() => setBitValue(bitValue === 0 ? 1 : 0)}
        onBlendChange={setQubitBlend}
      />

      <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">The Notation: What is with the vertical bar and angle bracket?</h3>
          <button
            onClick={() => setShowKet(!showKet)}
            className="text-xs text-quantum-purple hover:text-purple-400 font-medium px-3 py-1.5 rounded border border-quantum-purple/30 hover:bg-purple-900/20 transition-colors"
          >
            {showKet ? 'Hide' : 'Read'} explanation
          </button>
        </div>

        {showKet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 text-sm text-gray-400 leading-relaxed"
          >
            <p>
              The notation <span className="font-mono text-quantum-cyan">|0&gt;</span> is pronounced
              <strong className="text-white"> &ldquo;ket zero&rdquo;</strong>. It comes from something called
              <strong className="text-white"> Dirac notation</strong> (or bra-ket notation),
              invented by the physicist <strong className="text-white">Paul Dirac</strong> in 1939.
            </p>
            <p>
              Think of it this way: a regular <span className="font-mono text-gray-300">0</span> is
              just a number. You can multiply it, add it, whatever. But
              <span className="font-mono text-quantum-cyan"> |0&gt;</span> means
              <strong className="text-white"> &ldquo;the quantum state representing 0&rdquo;</strong>.
              The vertical bar and angle bracket is like a container that says &ldquo;this is a quantum state, not a regular number.&rdquo;
            </p>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm space-y-2 border border-gray-800/40">
              <div className="text-gray-600">{'0  --  just the number zero (classical)'}</div>
              <div className="text-quantum-cyan">{'|0>  --  "ket zero" = qubit in the 0 state'}</div>
              <div className="text-quantum-magenta">{'|1>  --  "ket one" = qubit in the 1 state'}</div>
              <div className="text-gray-400">{'|psi>  --  "ket psi" = the qubit\'s current quantum state'}</div>
              <div className="text-gray-500 text-xs mt-2">(psi is the Greek letter, pronounced &ldquo;sigh&rdquo;)</div>
            </div>
            <p>
              The Greek letter <span className="font-mono text-gray-300">psi</span> is the universal
              symbol for a quantum state. So when you see
              <span className="font-mono text-gray-300"> |psi&gt; = alpha|0&gt; + beta|1&gt;</span>, it reads:
            </p>
            <p className="italic text-gray-500 pl-4 border-l-2 border-gray-800">
              &ldquo;The current quantum state of our qubit is a blend of |0&gt; (with strength alpha)
              and |1&gt; (with strength beta).&rdquo;
            </p>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30">
              <p className="text-xs text-purple-300 leading-relaxed">
                <strong>Fun fact:</strong> Dirac was only 26 when he invented this notation.
                He said the name &ldquo;bra-ket&rdquo; was a pun -- when you multiply a
                <strong className="text-white"> bra</strong> with a
                <strong className="text-white"> ket</strong>, you get a
                <strong className="text-white"> bra(c)ket</strong>. Physicists love wordplay.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-quantum-card/50 rounded-xl p-5 border border-gray-800/40">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          <strong className="text-gray-300">Key idea:</strong> A classical bit is {bitValue} or the opposite &mdash; like a switch.
          A <strong className="text-white">qubit</strong> can be a blend of
          <span className="text-quantum-cyan"> |0&gt;</span> and
          <span className="text-quantum-magenta"> |1&gt;</span> &mdash; like a spinning coin.
          That &ldquo;blend&rdquo; is called <strong className="text-white">superposition</strong>,
          and it is the first ingredient that makes quantum computing possible.
        </p>
      </div>

      <div className="space-y-6 mt-4">
        <VideoPlayer {...moduleContent.intro} />
        <ModuleQuiz questions={moduleContent.intro.quiz} />
      </div>
    </div>
  );
}
