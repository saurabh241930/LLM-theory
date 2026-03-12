'use client'

import { ReactNode } from 'react'

interface MergedContentSectionProps {
  title: string
  diagram: ReactNode
  content: {
    section?: string
    text: string
  }[]
  reversed?: boolean
}

export default function MergedContentSection({
  title,
  diagram,
  content,
  reversed = false,
}: MergedContentSectionProps) {
  return (
    <section className="mb-16 scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-primary">
        {title}
      </h2>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${reversed ? 'lg:auto-cols-reverse' : ''}`}>
        {/* Diagram */}
        <div className={`flex justify-center items-start ${reversed ? 'lg:order-2' : ''}`}>
          <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {diagram}
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-6 ${reversed ? 'lg:order-1' : ''}`}>
          {content.map((block, idx) => (
            <div key={idx}>
              {block.section && (
                <h3 className="text-lg font-semibold text-slate-800 mb-3 text-primary">
                  {block.section}
                </h3>
              )}
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                {block.text.split('\n\n').map((para, pidx) => (
                  <p key={pidx} className="mb-4 text-slate-700 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
