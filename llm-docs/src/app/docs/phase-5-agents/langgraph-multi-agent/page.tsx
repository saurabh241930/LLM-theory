'use client';
import ContentPage from '@/components/ContentPage';
export default function Page() {
  return (
    <ContentPage
      title="16. LangGraph & Multi-Agent Systems"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 5', href: '/docs/phase-5-agents' },
        { label: 'LangGraph' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>
        <h2>Overview</h2>
        <p>Build multi-agent systems with LangGraph. Orchestrate specialized agents and coordinate their interactions.</p>
        <div className="text-center py-8">
          <a href="/docs/phase-5-agents" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg">← Back</a>
        </div>
      </div>
    </ContentPage>
  );
}
