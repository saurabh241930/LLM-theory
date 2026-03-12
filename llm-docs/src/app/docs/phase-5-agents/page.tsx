'use client';

import ContentPage from '@/components/ContentPage';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Phase5AgentsPage() {
  const topics = [
    {
      id: 'agent-loops',
      title: 'Agent Loops & Reasoning',
      description: 'Build systems where models can think, plan, and iterate',
      icon: '🔄'
    },
    {
      id: 'failure-modes',
      title: 'Agent Failure Modes',
      description: 'Understand and mitigate common agent failure patterns',
      icon: '⚠️'
    },
    {
      id: 'multi-agent',
      title: 'Multi-Agent Systems',
      description: 'Orchestrate multiple specialized agents and their interactions',
      icon: '👥'
    },
  ];

  return (
    <ContentPage
      title="Phase 5: Agents & Multi-Agent Systems"
      breadcrumb={[{ label: 'Phases', href: '/#phases' }, { label: 'Phase 5: Agents' }]}
    >
      <section className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Phase 5 explores the frontier of LLM applications: autonomous agents. These systems combine reasoning, 
          planning, tool use, and feedback loops to solve complex problems that require multiple steps and decision-making.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This is the cutting edge of LLM development where research is rapidly evolving. Understanding agent architectures 
          and failure modes is critical for building robust systems.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Topics in Phase 5</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/docs/phase-5-agents/${topic.id}`}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{topic.icon}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600">{topic.title}</h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-8 mb-12">
        <div className="flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Learning Tips</h3>
            <ul className="text-red-800 space-y-2 text-sm">
              <li>• Study different agent architectures (ReAct, AutoGPT, BabyAGI)</li>
              <li>• Understand the trade-offs between autonomous and human-in-the-loop agents</li>
              <li>• Learn about prompt engineering for agent reasoning</li>
              <li>• Experiment with building and debugging agent loops</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Test Your Knowledge?</h3>
        <p className="mb-6 opacity-90">Review all Phase 5 concepts with our comprehensive Q&A section</p>
        <Link
          href="/docs/phase-5-agents/qa"
          className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Q&A →
        </Link>
      </section>
    </ContentPage>
  );
}
