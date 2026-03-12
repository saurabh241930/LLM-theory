'use client';
import ContentPage from '@/components/ContentPage';
export default function Page() {
  return (
    <ContentPage
      title="13. LoRA & Parameter-Efficient Methods"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 4', href: '/docs/phase-4-fine-tuning' },
        { label: 'LoRA' }
      ]}
    >
      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <p className="text-yellow-800 font-semibold">📝 Content Coming Soon</p>
        </div>
        <h2>Overview</h2>
        <p>Fine-tune with only 1-10% of parameters using LoRA and QLoRA. Make fine-tuning practical for GPUs you can afford.</p>
        <div className="text-center py-8">
          <a href="/docs/phase-4-fine-tuning" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg">← Back</a>
        </div>
      </div>
    </ContentPage>
  );
}
