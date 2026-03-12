'use client'

import Link from 'next/link'
import ContentPage from '@/components/ContentPage'
import { ArrowRight, Zap } from 'lucide-react'

const mathTopics = [
  {
    number: '00',
    title: 'Linear Algebra',
    description: 'Vectors, dot products, cosine similarity, matrix multiplication, LoRA decomposition',
    href: '/docs/math-foundations/linear-algebra',
  },
  {
    number: '01',
    title: 'Probability & Statistics',
    description: 'Distributions, softmax, Bayes theorem, cross-entropy loss, KL divergence',
    href: '/docs/math-foundations/probability',
  },
  {
    number: '02',
    title: 'Calculus & Optimization',
    description: 'Derivatives, gradient descent, chain rule, learning rates, momentum',
    href: '/docs/math-foundations/calculus',
  },
  {
    number: '03',
    title: 'Information Theory',
    description: 'Entropy, cross-entropy, perplexity, mutual information, TF-IDF',
    href: '/docs/math-foundations/info-theory',
  },
]

export default function MathFoundationsPage() {
  return (
    <ContentPage
      title="Math Foundations for LLMs"
      breadcrumb={[{ label: 'Foundations', href: '#' }]}
    >
      <div className="space-y-12">
        {/* Hero */}
        <section className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12">
          <h2 className="text-3xl font-bold mb-4">Master the Math Behind LLMs</h2>
          <p className="text-xl opacity-90 mb-6">
            Do this BEFORE Phase 1, or in parallel. Understanding the math transforms you from a user of frameworks to a true engineer.
          </p>
          <p className="text-lg opacity-80">
            ~4 weeks of study. Intermediate level — just enough to understand why, not PhD-level rigor.
          </p>
        </section>

        {/* Why Math Matters */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why This Matters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-6">
              <h3 className="font-bold text-blue-900 mb-3">Without Math:</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Memorizing definitions without understanding why</li>
                <li>• Can't debug when things break</li>
                <li>• Stuck using frameworks as black boxes</li>
                <li>• Can't optimize or make architecture decisions</li>
              </ul>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-6">
              <h3 className="font-bold text-green-900 mb-3">With Math:</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Understand exactly why embeddings work</li>
                <li>• Debug optimization issues confidently</li>
                <li>• Make informed architecture choices</li>
                <li>• Interview competence at next level</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Topics */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Topics</h2>
          <div className="space-y-4">
            {mathTopics.map((topic) => (
              <Link key={topic.href} href={topic.href}>
                <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 font-bold">
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

        {/* Connection Table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How Math Connects to LLMs</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Topic You'll Study</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Math That Unlocks It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">Embeddings & cosine similarity</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Linear algebra — dot products</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">How LLMs generate tokens</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Probability — softmax, distributions</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">Chunking & BM25 search</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Information theory — TF-IDF math</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">LoRA mechanism</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Linear algebra — low-rank decomposition</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">Fine-tuning & loss functions</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Calculus + cross-entropy</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">RLHF / DPO alignment</td>
                  <td className="px-6 py-4 text-sm text-slate-700">KL divergence, probability</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700">RAG evaluation (RAGAS)</td>
                  <td className="px-6 py-4 text-sm text-slate-700">Statistics — precision, recall, F1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-xl bg-slate-50 border border-slate-200 p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900">
                Do I need to be a math expert?
                <span className="transition group-open:rotate-180">›</span>
              </summary>
              <p className="mt-4 text-slate-700">
                No. This is intermediate level — understand concepts intuitively, not formulas. We skip proofs and focus on usage.
              </p>
            </details>
            <details className="group rounded-xl bg-slate-50 border border-slate-200 p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900">
                How long will this take?
                <span className="transition group-open:rotate-180">›</span>
              </summary>
              <p className="mt-4 text-slate-700">
                Total: ~4 weeks of focused study. Linear Algebra: 1.5 weeks. Probability: 1 week. Calculus: 0.5 weeks. Information Theory: 3-4 days.
              </p>
            </details>
            <details className="group rounded-xl bg-slate-50 border border-slate-200 p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-slate-900">
                Can I skip this and go straight to Phase 1?
                <span className="transition group-open:rotate-180">›</span>
              </summary>
              <p className="mt-4 text-slate-700">
                Yes, but you'll struggle. You'll learn faster with this foundation. Recommended: Do Math + Phase 1 in parallel.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap />
            Ready to Master the Math?
          </h3>
          <p className="mb-6 opacity-90">
            Start with Linear Algebra — it unlocks embeddings, which is the foundation of RAG and everything else.
          </p>
          <Link
            href="/docs/math-foundations/linear-algebra"
            className="inline-block rounded-lg bg-primary text-slate-900 px-8 py-3 font-bold hover:bg-primary/90 transition"
          >
            Start with Linear Algebra →
          </Link>
        </section>

        {/* Q&A */}
        <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📚 Math Q&A</h2>
          <p className="text-slate-700 mb-6">
            After studying all 4 topics, test your understanding with our comprehensive Q&A:
          </p>
          <Link
            href="/docs/math-foundations/qa"
            className="inline-block rounded-lg bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 transition"
          >
            Math Foundations Q&A →
          </Link>
        </section>
      </div>
    </ContentPage>
  )
}
