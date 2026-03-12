'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface ContentPageProps {
  title: string
  breadcrumb: { label: string; href?: string }[]
  children: ReactNode
}

export default function ContentPage({ title, breadcrumb, children }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 md:ml-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-slate-600 hover:text-primary transition flex items-center gap-1">
              <Home size={16} />
              Home
            </Link>
            {breadcrumb.map((item, idx) => (
              <div key={idx}>
                <span className="text-slate-400 mx-2">/</span>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-semibold">{item.label}</span>
                )}
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {children}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-secondary transition">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
