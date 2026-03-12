import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/layouts/RootLayoutClient'

export const metadata: Metadata = {
  title: 'LLM Theory & Interview Prep',
  description: 'Comprehensive guide to Large Language Models, RAG, Fine-tuning, and AI Engineering interviews. Interactive diagrams and visual-first learning.',
  keywords: ['LLM', 'AI', 'Interview Prep', 'RAG', 'Fine-tuning', 'Embeddings', 'Prompt Engineering'],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
