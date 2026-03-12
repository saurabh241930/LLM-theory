import React from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-2xl text-slate-700 mb-8">Page Not Found</p>
        <p className="text-slate-600 mb-8 max-w-md">
          This page hasn't been created yet. Check back soon as we expand the documentation!
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-primary text-slate-900 font-bold px-8 py-3 hover:bg-primary/90 transition"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
