'use client'

import Link from 'next/link'
import ContentPage from '@/components/ContentPage'
import { ArrowRight, BookOpen } from 'lucide-react'

const topics = [
  {
    number: '01',
    title: 'Embeddings & Vector Search',
    description: 'Dense vector representations, cosine similarity, vector databases',
    href: '/docs/phase-1-foundations/embeddings',
  },
  {
    number: '02',
    title: 'Tokenization & Context Windows',
    description: 'Tokens, different tokenizers, context limits, token counting',
    href: '/docs/phase-1-foundations/tokenization',
  },
  {
    number: '03',
    title: 'Prompt Engineering',
    description: 'Zero-shot, few-shot, CoT, structured outputs, chaining',
    href: '/docs/phase-1-foundations/prompting',
  },
]

export default function Phase1Page() {
  return (
    <ContentPage
      title="Phase 1: Foundations"
      breadcrumb={[{ label: 'Phases', href: '/#phases' }]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Phase 1 covers the foundational concepts that power all LLM applications. You'll learn how text becomes numbers (embeddings), how models process text (tokenization), and how to communicate effectively with models (prompt engineering).
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            This phase is mandatory — everything else builds on these concepts.
          </p>
        </section>

        {/* Topics Grid */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Topics</h2>
          <div className="space-y-4">
            {topics.map((topic) => (
              <Link key={topic.href} href={topic.href}>
                <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                          {topic.number}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition">
                          {topic.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 ml-13">{topic.description}</p>
                    </div>
                    <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Q&A */}
        <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            Quiz Yourself
          </h2>
          <p className="text-slate-700 mb-6">
            After studying these topics, test your understanding with our interview-style Q&A:
          </p>
          <Link
            href="/docs/phase-1-foundations/qa"
            className="inline-block rounded-lg bg-blue-600 text-white px-6 py-3 font-bold hover:bg-blue-700 transition"
          >
            Phase 1 Q&A →
          </Link>
        </section>

        {/* Learning Tips */}
        <section className="rounded-2xl bg-slate-900 text-white p-8">
          <h3 className="text-xl font-bold mb-4">💡 Learning Tips</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Start with Embeddings (foundation of RAG)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Tokenization explains why context windows matter</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Prompt engineering is art + science — practice matters</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>These concepts repeat in every subsequent phase</span>
            </li>
          </ul>
        </section>
      </div>
    </ContentPage>
  )
}
