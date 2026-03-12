'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, BookOpen, Zap, Target, Brain, Database } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  items?: SidebarItem[]
  defaultOpen?: boolean
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Math Foundations',
    href: '/docs/math-foundations',
    icon: <Zap size={18} />,
    items: [
      { title: 'Linear Algebra', href: '/docs/math-foundations/linear-algebra', icon: <Database size={16} /> },
      { title: 'Probability & Stats', href: '/docs/math-foundations/probability', icon: <Database size={16} /> },
      { title: 'Calculus', href: '/docs/math-foundations/calculus', icon: <Database size={16} /> },
      { title: 'Information Theory', href: '/docs/math-foundations/info-theory', icon: <Database size={16} /> },
    ],
    defaultOpen: true,
  },
  {
    title: 'Phase 1: Foundations',
    href: '/docs/phase-1-foundations',
    icon: <BookOpen size={18} />,
    items: [
      { title: '01. Embeddings & Vector Search', href: '/docs/phase-1-foundations/embeddings', icon: <Database size={16} /> },
      { title: '02. Tokenization', href: '/docs/phase-1-foundations/tokenization', icon: <Database size={16} /> },
      { title: '03. Prompt Engineering', href: '/docs/phase-1-foundations/prompt-engineering', icon: <Database size={16} /> },
      { title: 'Q&A', href: '/docs/phase-1-foundations/qa', icon: <Database size={16} /> },
    ],
    defaultOpen: true,
  },
  {
    title: 'Phase 2: RAG',
    href: '/docs/phase-2-rag',
    icon: <Zap size={18} />,
    items: [
      { title: '04. Chunking Strategies', href: '/docs/phase-2-rag/chunking-strategies', icon: <Database size={16} /> },
      { title: '05. Naive RAG', href: '/docs/phase-2-rag/naive-rag', icon: <Database size={16} /> },
      { title: '06. Advanced RAG', href: '/docs/phase-2-rag/advanced-rag', icon: <Database size={16} /> },
      { title: '07. Reranking', href: '/docs/phase-2-rag/reranking', icon: <Database size={16} /> },
      { title: '08. RAG Evaluation', href: '/docs/phase-2-rag/rag-evaluation', icon: <Database size={16} /> },
      { title: 'Q&A', href: '/docs/phase-2-rag/qa', icon: <Database size={16} /> },
    ],
    defaultOpen: false,
  },
  {
    title: 'Phase 3: Structured Outputs',
    href: '/docs/phase-3-structured-outputs',
    icon: <Target size={18} />,
    items: [
      { title: '09. Function Calling', href: '/docs/phase-3-structured-outputs/function-calling', icon: <Database size={16} /> },
      { title: '10. NL-to-SQL', href: '/docs/phase-3-structured-outputs/nl-to-sql', icon: <Database size={16} /> },
      { title: '11. Improving NL-to-SQL', href: '/docs/phase-3-structured-outputs/improving-nl-to-sql', icon: <Database size={16} /> },
      { title: 'Q&A', href: '/docs/phase-3-structured-outputs/qa', icon: <Database size={16} /> },
    ],
    defaultOpen: false,
  },
  {
    title: 'Phase 4: Fine-tuning',
    href: '/docs/phase-4-fine-tuning',
    icon: <Zap size={18} />,
    items: [
      { title: '12. When to Fine-Tune', href: '/docs/phase-4-fine-tuning/when-to-fine-tune', icon: <Database size={16} /> },
      { title: '13. LoRA & Techniques', href: '/docs/phase-4-fine-tuning/parameter-efficient', icon: <Database size={16} /> },
      { title: '14. Alignment', href: '/docs/phase-4-fine-tuning/alignment', icon: <Database size={16} /> },
      { title: 'Q&A', href: '/docs/phase-4-fine-tuning/qa', icon: <Database size={16} /> },
    ],
    defaultOpen: false,
  },
  {
    title: 'Phase 5: Agents',
    href: '/docs/phase-5-agents',
    icon: <Brain size={18} />,
    items: [
      { title: '15. ReAct Pattern', href: '/docs/phase-5-agents/react-pattern', icon: <Database size={16} /> },
      { title: '16. LangGraph', href: '/docs/phase-5-agents/langgraph-multi-agent', icon: <Database size={16} /> },
      { title: '17. Failure Modes', href: '/docs/phase-5-agents/agent-failure-modes', icon: <Database size={16} /> },
      { title: 'Q&A', href: '/docs/phase-5-agents/qa', icon: <Database size={16} /> },
    ],
    defaultOpen: false,
  },
]

const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
  const [isOpen, setIsOpen] = useState(item.defaultOpen || false)
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <div>
      {item.items ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {item.title}
            </span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isOpen && (
            <div className="ml-4 border-l border-slate-200 py-2">
              {item.items.map((subitem) => (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  className={`block px-4 py-2 rounded text-sm transition-all ${
                    pathname === subitem.href
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {subitem.title}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? 'bg-primary/10 text-primary border-l-4 border-primary'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {item.icon}
          {item.title}
        </Link>
      )}
    </div>
  )
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform md:translate-x-0 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => (
            <SidebarItemComponent key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </>
  )
}
