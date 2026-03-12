# 🚀 LLM Docs Setup Guide

This guide walks you through setting up and deploying your interactive LLM documentation site.

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd llm-docs
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** to see your site!

---

## What You Have

A Next.js documentation site with:

✅ **Responsive layout** - Navbar + Sidebar navigation
✅ **Topic organization** - 5 phases + math foundations (22+ topics)
✅ **Content merging** - Markdown text + React diagrams side-by-side
✅ **Mobile-friendly** - Works on all devices
✅ **Interview-ready** - Professional styling with ByteByteGo aesthetic

---

## Project Structure

```
llm-docs/
├── src/
│   ├── app/                    # Next.js pages & routes
│   ├── components/             # Reusable UI components
│   ├── diagrams/               # Diagram component exports
│   └── lib/                    # Utilities
├── package.json
├── tailwind.config.ts
├── next.config.js
└── README.md                   # Detailed documentation
```

---

## Adding Your JSX Diagrams

Your diagram JSX files are in the parent directories. Here's how to integrate them:

### Step 1: Reference Original Diagrams

In `src/diagrams/Phase1Embeddings.tsx`:

```tsx
'use client'

// Option A: Copy the diagram structure from 01.jsx into here
// Option B: Import and re-export components

export default function Phase1EmbeddingsDiagrams({ variant }) {
  switch(variant) {
    case 'whatIsEmbedding':
      return <CardWhatIsEmbedding />
    case 'cosineSimilarity':
      return <CardCosineSimilarity />
    default:
      return null
  }
}
```

### Step 2: Use in Content Pages

In `src/app/docs/phase-1-foundations/embeddings/page.tsx`:

```tsx
import Phase1EmbeddingsDiagrams from '@/diagrams/Phase1Embeddings'

<MergedContentSection
  title="Section Title"
  diagram={<Phase1EmbeddingsDiagrams variant="whatIsEmbedding" />}
  content={[...]}
/>
```

---

## Creating New Pages

### Template: Basic Topic Page

Create `src/app/docs/phase-X-name/topic-name/page.tsx`:

```tsx
'use client'

import ContentPage from '@/components/ContentPage'
import MergedContentSection from '@/components/MergedContentSection'
import DiagramComponent from '@/diagrams/PhaseXDiagrams'

export default function TopicPage() {
  return (
    <ContentPage
      title="Your Topic Title"
      breadcrumb={[
        { label: 'Phase Name', href: '/docs/phase-x' },
        { label: 'Topic', href: '#' },
      ]}
    >
      <div className="space-y-16">
        {/* Section 1 */}
        <MergedContentSection
          title="First Concept"
          diagram={<DiagramComponent variant="diagram1" />}
          content={[
            {
              section: 'Definition',
              text: 'Your explanation here...'
            },
            {
              section: 'How It Works',
              text: 'More details...'
            },
          ]}
        />

        {/* Section 2 - reversed layout */}
        <MergedContentSection
          title="Second Concept"
          diagram={<DiagramComponent variant="diagram2" />}
          content={[...]}
          reversed={true}
        />

        {/* Summary */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Takeaways</h3>
          <ul className="space-y-3 text-slate-700">
            <li>✅ First key point</li>
            <li>✅ Second key point</li>
          </ul>
        </div>
      </div>
    </ContentPage>
  )
}
```

---

## Customization

### Change Colors

Edit `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: '#41d8a0',      // Change to your primary color
      secondary: '#2e9e73',    // Change to your secondary color
      accent: '#a6f0d4',
    },
  },
},
```

### Modify Navigation

Edit `src/components/Sidebar.tsx` - the `sidebarItems` array:

```tsx
const sidebarItems: SidebarItem[] = [
  {
    title: 'Your Section',
    href: '/docs/your-section',
    icon: <BookOpen size={18} />,
    items: [
      { title: 'Topic 1', href: '/docs/your-section/topic-1', ... },
      { title: 'Topic 2', href: '/docs/your-section/topic-2', ... },
    ],
  },
]
```

### Add New Phase

1. Create directory: `src/app/docs/phase-X-name/`
2. Create landing page: `src/app/docs/phase-X-name/page.tsx`
3. Add to sidebar navigation
4. Create topic subdirectories

---

## Deployment

### Deploy to Vercel (Easiest)

```bash
npm i -g vercel
vercel
```

Follow prompts - your site will be live in seconds!

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Your Own Server

```bash
npm run build
npm start
```

---

## Features by Component

### ContentPage
- Breadcrumb navigation
- Page title
- Back navigation

### MergedContentSection
- Side-by-side layout (text + diagram)
- Reversible (swap positions)
- Responsive grid
- Markdown-aware

### Sidebar
- Auto-expand current section
- Collapsible on mobile
- Auto-highlight active page
- Search-ready hooks

### Navbar
- Logo + branding
- Mobile menu toggle
- Navigation links

---

## Adding Interactivity

### Add a Quiz Component

Create `src/components/Quiz.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].correct) {
      setScore(score + 1)
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    }
  }

  return (
    // ... quiz UI
  )
}
```

### Add Code Blocks

```tsx
<pre className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto">
  <code>{codeString}</code>
</pre>
```

---

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

---

## File Organization Tips

**✅ DO:**
- Keep pages in `/app/docs/` hierarchy matching URL structure
- Put reusable components in `/components/`
- Export diagram variants from single files
- Use TypeScript types for props

**❌ DON'T:**
- Don't modify Next.js core config without reason
- Don't add global styles outside `globals.css`
- Don't create nested component files (flat structure better)

---

## Next Steps

1. **Copy JSX diagrams** into `/src/diagrams/` folder
2. **Create topic pages** using the template above
3. **Add breadcrumbs** and navigation links
4. **Test mobile** responsiveness
5. **Deploy** to Vercel or Netlify

---

## Example: Complete Setup for 1 Topic

### Files to Create:

1. **Diagram export:**
   ```
   src/diagrams/Phase1Embeddings.tsx
   ```

2. **Topic page:**
   ```
   src/app/docs/phase-1-foundations/embeddings/page.tsx
   ```

3. **Add to sidebar** - edit `src/components/Sidebar.tsx`

4. **Deploy:**
   ```bash
   vercel
   ```

That's it! Your topic is live.

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Diagrams not showing?**
- Check import paths (use `@/diagrams/...`)
- Ensure component is marked `'use client'`
- Check variant prop matches case

**Colors look wrong?**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run dev`

**Mobile menu not working?**
- Ensure `Sidebar.tsx` has `onClose` callback
- Check `RootLayoutClient.tsx` state management

---

## Resources

- [Next.js Docs](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Lucide Icons](https://lucide.dev)

---

**You're all set! 🚀**

Questions? Check the detailed README.md in the llm-docs folder.
