'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="w-full md:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
