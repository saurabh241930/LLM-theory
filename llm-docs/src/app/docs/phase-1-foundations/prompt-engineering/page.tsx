'use client';

import ContentPage from '@/components/ContentPage';

export default function PromptEngineeringPage() {
  return (
    <ContentPage
      title="03. Prompt Engineering"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 1', href: '/docs/phase-1-foundations' },
        { label: 'Prompting' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
          <p className="text-yellow-700 mt-2">Full diagrams and content will be added shortly. Reference: Phase-1-Foundations/03-Prompt-Engineering.md</p>
        </div>

        <section className="mb-8">
          <h2>Overview</h2>
          <p>Prompt engineering is the art and science of creating effective prompts for language models. Learn techniques like few-shot learning, chain-of-thought, and more.</p>
        </section>

        <section className="text-center py-8">
          <a href="/docs/phase-1-foundations" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            ← Back to Phase 1
          </a>
        </section>
      </div>
    </ContentPage>
  );
}
