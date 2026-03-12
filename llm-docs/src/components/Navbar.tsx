'use client'

import Link from 'next/link'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  onToggleSidebar?: () => void
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-secondary p-2">
              <Brain className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">LLM Theory</h1>
              <p className="text-xs text-slate-500">Interview Prep</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary transition">
              Home
            </Link>
            <Link href="/docs/math-foundations" className="text-sm font-medium text-slate-600 hover:text-primary transition">
              Math Foundations
            </Link>
            <Link href="/docs/phase-1-foundations" className="text-sm font-medium text-slate-600 hover:text-primary transition">
              Phases
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-primary transition">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-600 hover:text-primary transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  )
}
