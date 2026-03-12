'use client';

import ContentPage from '@/components/ContentPage';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Phase3StructuredOutputsPage() {
  const topics = [
    {
      id: 'json-mode',
      title: 'JSON Mode & Structured Outputs',
      description: 'Force language models to output structured data formats',
      icon: '🔧'
    },
    {
      id: 'schema-validation',
      title: 'Schema Validation',
      description: 'Ensure model outputs conform to predefined schemas',
      icon: '✓'
    },
    {
      id: 'function-calling',
      title: 'Function Calling',
      description: 'Enable models to call external functions and tools',
      icon: '📞'
    },
  ];

  return (
    <ContentPage
      title="Phase 3: Structured Outputs & Function Calling"
      breadcrumb={[{ label: 'Phases', href: '/#phases' }, { label: 'Phase 3: Structured Outputs' }]}
    >
      <section className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Phase 3 focuses on controlling model outputs and enabling models to interact with external tools and APIs. 
          Instead of just generating text, we force structured outputs that can be programmatically processed.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This is essential for building reliable applications where model behavior must be constrained and predictable.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Topics in Phase 3</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/docs/phase-3-structured-outputs/${topic.id}`}
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

      <section className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 mb-12">
        <div className="flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Learning Tips</h3>
            <ul className="text-purple-800 space-y-2 text-sm">
              <li>• Start with simple JSON mode before complex schemas</li>
              <li>• Understand the limitations of format enforcement</li>
              <li>• Practice building agents that call multiple functions</li>
              <li>• Think about error handling for invalid outputs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Test Your Knowledge?</h3>
        <p className="mb-6 opacity-90">Review all Phase 3 concepts with our comprehensive Q&A section</p>
        <Link
          href="/docs/phase-3-structured-outputs/qa"
          className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Q&A →
        </Link>
      </section>
    </ContentPage>
  );
}
