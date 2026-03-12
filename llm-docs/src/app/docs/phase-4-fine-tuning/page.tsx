'use client';

import ContentPage from '@/components/ContentPage';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Phase4FineTuningPage() {
  const topics = [
    {
      id: 'alignment',
      title: 'Alignment & RLHF',
      description: 'Align models to human preferences through reinforcement learning',
      icon: '🎯'
    },
    {
      id: 'fine-tuning',
      title: 'Fine-tuning Fundamentals',
      description: 'Adapt pre-trained models to specific tasks and domains',
      icon: '⚙️'
    },
    {
      id: 'parameter-efficient',
      title: 'Parameter-Efficient Methods',
      description: 'LoRA, QLoRA, and other efficient fine-tuning techniques',
      icon: '⚡'
    },
  ];

  return (
    <ContentPage
      title="Phase 4: Fine-tuning & Alignment"
      breadcrumb={[{ label: 'Phases', href: '/#phases' }, { label: 'Phase 4: Fine-tuning' }]}
    >
      <section className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Phase 4 explores how to adapt pre-trained models to specific tasks and how to align them with human preferences. 
          Fine-tuning allows you to specialize models for particular domains and applications.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          This phase covers both supervised fine-tuning and reinforcement learning from human feedback (RLHF), 
          which are critical techniques for building production-ready LLM applications.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Topics in Phase 4</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/docs/phase-4-fine-tuning/${topic.id}`}
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

      <section className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 mb-12">
        <div className="flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Learning Tips</h3>
            <ul className="text-orange-800 space-y-2 text-sm">
              <li>• Understand the difference between pretrain, supervised fine-tuning, and RLHF</li>
              <li>• Learn about parameter-efficient methods to reduce memory requirements</li>
              <li>• Study real-world alignment approaches used by major labs</li>
              <li>• Practice setting up fine-tuning experiments with open-source tools</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Test Your Knowledge?</h3>
        <p className="mb-6 opacity-90">Review all Phase 4 concepts with our comprehensive Q&A section</p>
        <Link
          href="/docs/phase-4-fine-tuning/qa"
          className="inline-block bg-white text-teal-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Q&A →
        </Link>
      </section>
    </ContentPage>
  );
}
