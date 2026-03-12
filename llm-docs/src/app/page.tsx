'use client'

import Link from 'next/link'
import { Brain, BookOpen, Zap, Target, ArrowRight } from 'lucide-react'

const phases = [
  {
    id: 'phase-1',
    title: 'Phase 1: Foundations',
    description: 'Embeddings, Tokenization, Prompt Engineering',
    slug: 'phase-1-foundations',
    topics: 3,
    color: 'from-blue-500 to-cyan-500',
    icon: BookOpen,
  },
  {
    id: 'phase-2',
    title: 'Phase 2: RAG',
    description: 'Chunking, Naive RAG, Advanced RAG, Reranking, Evaluation',
    slug: 'phase-2-rag',
    topics: 5,
    color: 'from-purple-500 to-pink-500',
    icon: Zap,
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Structured Outputs',
    description: 'Function Calling, NL-to-SQL, Query Improvement',
    slug: 'phase-3-structured-outputs',
    topics: 3,
    color: 'from-green-500 to-emerald-500',
    icon: Target,
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Fine-tuning',
    description: 'Decision Making, LoRA, Alignment Techniques',
    slug: 'phase-4-fine-tuning',
    topics: 3,
    color: 'from-orange-500 to-red-500',
    icon: Zap,
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Agents',
    description: 'ReAct, LangGraph, Multi-Agent Systems, Failure Modes',
    slug: 'phase-5-agents',
    topics: 4,
    color: 'from-indigo-500 to-purple-500',
    icon: Brain,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              LLM Theory & Fundamentals
            </h1>
            <p className="text-xl text-slate-600">
              Master AI Engineering with visual-first learning. From embeddings to agents.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-16 grid grid-cols-3 gap-4 rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">22+</div>
              <p className="mt-2 text-sm text-slate-600">Topics</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">5</div>
              <p className="mt-2 text-sm text-slate-600">Phases</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100%</div>
              <p className="mt-2 text-sm text-slate-600">Interview-Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-slate-900">
            Learning Path
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {phases.map((phase, idx) => {
              const Icon = phase.icon
              return (
                <Link
                  key={phase.id}
                  href={`/docs/${phase.slug}`}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl hover:scale-105 cursor-pointer">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} opacity-0 transition-opacity group-hover:opacity-5`} />

                    <div className="relative p-8">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-xl bg-gradient-to-br ${phase.color} p-3`}>
                            <Icon className="text-white" size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">
                              {phase.title}
                            </h3>
                            <p className="mt-2 text-slate-600">{phase.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <badge className="inline-block rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                          {phase.topics} Topics
                        </badge>
                        <ArrowRight className="text-primary transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Math Foundations CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-bold">📐 Math Foundations First?</h2>
          <p className="mb-6 text-lg opacity-90">
            Understand the mathematical bedrock behind LLMs: Linear Algebra, Probability, Calculus, and Information Theory
          </p>
          <Link
            href="/docs/math-foundations"
            className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-primary transition-transform hover:scale-105"
          >
            Learn Math Fundamentals →
          </Link>
        </div>
      </section>
    </main>
  )
}
