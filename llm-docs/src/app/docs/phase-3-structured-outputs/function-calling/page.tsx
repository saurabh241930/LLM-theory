'use client';
import ContentPage from '@/components/ContentPage';
export default function Page() {
  return (
    <ContentPage
      title="09. Function Calling"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 3', href: '/docs/phase-3-structured-outputs' },
        { label: 'Function Calling' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>
        <h2>Overview</h2>
        <p>Enable LLMs to call external functions and APIs. Foundation for building agents and tool-using systems.</p>
        <div className="text-center py-8">
          <a href="/docs/phase-3-structured-outputs" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg">← Back</a>
        </div>
      </div>
    </ContentPage>
  );
}
