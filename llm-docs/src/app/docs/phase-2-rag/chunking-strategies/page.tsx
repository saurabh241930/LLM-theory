'use client';

import ContentPage from '@/components/ContentPage';

export default function ChunkingPage() {
  return (
    <ContentPage
      title="04. Chunking Strategies"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 2', href: '/docs/phase-2-rag' },
        { label: 'Chunking' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>

        <h2>Overview</h2>
        <p>How to split documents into chunks for optimal vector database indexing and retrieval. Topics include chunk size, overlap, and boundary detection.</p>

        <div className="text-center py-8">
          <a href="/docs/phase-2-rag" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">← Back to Phase 2</a>
        </div>
      </div>
    </ContentPage>
  );
}
