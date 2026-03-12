'use client';

import ContentPage from '@/components/ContentPage';

export default function AlignmentPage() {
  return (
    <ContentPage
      title="Phase 4: Alignment & RLHF"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 4', href: '/docs/phase-4-fine-tuning' },
        { label: 'Alignment' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
          <p className="text-yellow-700 mt-2">
            This page is being updated with full content and diagrams. The foundation is in place!
          </p>
        </div>

        <section className="mb-8">
          <h2>How to Complete This</h2>
          <ol className="space-y-3">
            <li>
              <strong>Get your markdown content:</strong> Look in <code>/home/sp241930/Documents/LLM-theory/Phase-4-Fine-Tuning/</code>
            </li>
            <li>
              <strong>Get your diagram:</strong> Look for a numbered .jsx file in the Phase-4-Fine-Tuning folder
            </li>
            <li>
              <strong>Follow the integration guide:</strong> Open <code>DIAGRAM-INTEGRATION-GUIDE.md</code>
            </li>
            <li>
              <strong>Import the diagram and add content</strong> using sections and the MergedContentSection component
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2>What Should Be Here</h2>
          <p>
            This page should contain:
          </p>
          <ul>
            <li>Definition of alignment and RLHF</li>
            <li>Visual diagrams showing the process</li>
            <li>Key concepts and terminology</li>
            <li>Real-world examples</li>
            <li>Interview Q&A snippets</li>
          </ul>
        </section>

        <section className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Back to Phase 4 overview:
          </p>
          <a
            href="/docs/phase-4-fine-tuning"
            className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            ← Phase 4 Landing
          </a>
        </section>
      </div>
    </ContentPage>
  );
}
