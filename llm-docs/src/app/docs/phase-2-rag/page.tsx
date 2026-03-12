'use client';

import ContentPage from '@/components/ContentPage';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Phase2RAGPage() {
  const topics = [
    {
      id: 'retrieval-augmented-generation',
      title: 'Retrieval Augmented Generation (RAG)',
      description: 'Learn how to augment language models with external knowledge sources',
      icon: '🔍'
    },
    {
      id: 'vector-databases',
      title: 'Vector Databases',
      description: 'Store and retrieve embeddings efficiently at scale',
      icon: '📊'
    },
    {
      id: 'semantic-search',
      title: 'Semantic Search',
      description: 'Finding relevant information using semantic similarity',
      icon: '🎯'
    },
    {
      id: 'chunking-strategies',
      title: 'Chunking Strategies',
      description: 'Splitting documents for optimal retrieval',
      icon: '✂️'
    },
  ];

  return (
    <ContentPage
      title="Phase 2: Retrieval Augmented Generation"
      breadcrumb={[{ label: 'Phases', href: '/#phases' }, { label: 'Phase 2: RAG' }]}
    >
      {/* Introduction */}
      <section className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Phase 2 explores how to extend language models with retrieval capabilities. Instead of relying solely on 
          model parameters, RAG systems fetch relevant information from external sources and feed it into the model's context.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This is critical for building systems that can access up-to-date information, domain-specific knowledge, and 
          avoid hallucinations by grounding responses in real data.
        </p>
      </section>

      {/* Topics Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Topics in Phase 2</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/docs/phase-2-rag/${topic.id}`}
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

      {/* Learning Tips */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 mb-12">
        <div className="flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Learning Tips</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• Understand vector similarity before diving into RAG pipelines</li>
              <li>• Experiment with different chunking sizes and overlap strategies</li>
              <li>• Think about trade-offs between retrieval speed and relevance</li>
              <li>• Practice building a simple RAG system with a vector database</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Test Your Knowledge?</h3>
        <p className="mb-6 opacity-90">Review all Phase 2 concepts with our comprehensive Q&A section</p>
        <Link
          href="/docs/phase-2-rag/qa"
          className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Q&A →
        </Link>
      </section>
    </ContentPage>
  );
}
