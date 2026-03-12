'use client';
import ContentPage from '@/components/ContentPage';
export default function Page() {
  return (
    <ContentPage
      title="05. Naive RAG"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 2', href: '/docs/phase-2-rag' },
        { label: 'Naive RAG' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>
        <h2>Overview</h2>
        <p>Build a basic RAG system: retrieve documents based on embedding similarity, then feed to LLM.</p>
        <div className="text-center py-8">
          <a href="/docs/phase-2-rag" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg">← Back</a>
        </div>
      </div>
    </ContentPage>
  );
}
