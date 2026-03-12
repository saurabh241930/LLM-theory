'use client';
import ContentPage from '@/components/ContentPage';
export default function Page() {
  return (
    <ContentPage
      title="15. ReAct Pattern"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 5', href: '/docs/phase-5-agents' },
        { label: 'ReAct' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>
        <h2>Overview</h2>
        <p>ReAct (Reasoning + Acting) enables LLMs to think, plan, act, and observe in loops to solve complex problems.</p>
        <div className="text-center py-8">
          <a href="/docs/phase-5-agents" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg">← Back</a>
        </div>
      </div>
    </ContentPage>
  );
}
