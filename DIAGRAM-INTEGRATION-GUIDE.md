# 📊 Integrating Your JSX Diagrams - Step-by-Step

This guide shows you exactly how to integrate your existing JSX diagram files into the documentation site.

## Overview

You have `.jsx` files in each Phase directory:
- `Phase-1-Foundations/01.jsx` ← Embeddings diagram
- `Phase-2-RAG/04.jsx`, `05.jsx`, `06.jsx`, `07.jsx`, `08.jsx` ← RAG diagrams
- etc.

Goal: Import these into the Next.js site and display alongside markdown content.

---

## Method 1: Copy-Paste (Simplest)

### Step 1: Create Diagram File in Next.js Project

Create `llm-docs/src/diagrams/Phase1Embeddings.tsx`

### Step 2: Copy from Original JSX

From: `Phase-1-Foundations/01.jsx`
Extract the component definitions and paste into the new file.

Example structure:
```tsx
'use client'

import React from 'react'
import { Type, Binary, Network, ... } from 'lucide-react'

// PASTE ALL COMPONENT DEFINITIONS HERE
const THEME = { ... }
const Card = ({ ... }) => { ... }
const Node = ({ ... }) => { ... }
const CardWhatIsEmbedding = () => { ... }
const CardCosineSimilarity = () => { ... }
// ... etc

// EXPORT WRAPPER
export default function Phase1EmbeddingsDiagrams({ variant }) {
  switch(variant) {
    case 'whatIsEmbedding':
      return <CardWhatIsEmbedding />
    case 'cosineSimilarity':
      return <CardCosineSimilarity />
    case 'vectorDBIndexing':
      return <CardVectorDBIndexing />
    default:
      return null
  }
}
```

### Step 3: Use Variant-Based Rendering

In your content page:
```tsx
<MergedContentSection
  title="What is an Embedding?"
  diagram={<Phase1EmbeddingsDiagrams variant="whatIsEmbedding" />}
  content={[...]}
/>
```

---

## Method 2: Import & Re-export (Advanced)

### Use if you want to keep original JSX files untouched

#### Step 1: Create Wrapper

```tsx
// llm-docs/src/diagrams/Phase1Embeddings.tsx

'use client'

// Import specific components from parent directory
// This requires proper module resolution in next.config.js
import type { ReactNode } from 'react'

// For now, placeholder - Next.js can't easily import from parent
// But you CAN access them via dynamic imports or bundling

export default function Phase1EmbeddingsDiagrams({ variant }): ReactNode {
  // Return appropriate diagram
  // ...
}
```

---

## Complete Integration Checklist

### Phase 1: Foundations (3 topics)

- [ ] Create `src/diagrams/Phase1Embeddings.tsx`
  - Copy from `Phase-1-Foundations/01.jsx`
  - Variants: `whatIsEmbedding`, `cosineSimilarity`, `vectorDBIndexing`
  
- [ ] Create `src/app/docs/phase-1-foundations/embeddings/page.tsx`
  - Use `MergedContentSection` × 4 sections
  
- [ ] Create `src/app/docs/phase-1-foundations/tokenization/page.tsx`
  
- [ ] Create `src/app/docs/phase-1-foundations/prompting/page.tsx`

### Phase 2: RAG (5 topics)

- [ ] Create `src/diagrams/Phase2RAG.tsx`
  - Copy from `Phase-2-RAG/04.jsx`, `05.jsx`, `06.jsx`, `07.jsx`, `08.jsx`
  - Variants: `chunking`, `naiveRAG`, `advancedRAG`, `reranking`, `evaluation`
  
- [ ] Create top-level pages for each topic
  - `src/app/docs/phase-2-rag/chunking/page.tsx`
  - `src/app/docs/phase-2-rag/naive-rag/page.tsx`
  - etc.

### Phase 3-5: Similar pattern

---

## Example: Complete Integration (Phase 1 - Embeddings)

### File 1: Create Diagram Wrapper

**File:** `llm-docs/src/diagrams/Phase1Embeddings.tsx`

```tsx
'use client'

import React from 'react'
import { 
  Type, Binary, Network, Search, Database, 
  Cpu, Layers, Target, Split, FileText, 
  MessageSquare, Calculator, Zap, Clock 
} from 'lucide-react'

// --- COPY ENTIRE CONTENT FROM Phase-1-Foundations/01.jsx ---
// Paste all THEME, Card, Node, Label, etc. definitions here
// Paste all Card1, Card2, Card3, etc. components

// --- ADD EXPORT WRAPPER ---
export interface DiagramProps {
  variant?: string
}

export default function Phase1EmbeddingsDiagrams({ variant = 'whatIsEmbedding' }: DiagramProps) {
  switch(variant) {
    case 'whatIsEmbedding':
      return <CardWhatIsEmbedding />
    case 'cosineSimilarity':
      return <CardCosineSimilarity />
    case 'vectorDBIndexing':
      // Map to correct card from original
      return <CardVectorDBIndexing />
    default:
      return <CardWhatIsEmbedding />
  }
}
```

### File 2: Create Topic Page

**File:** `llm-docs/src/app/docs/phase-1-foundations/embeddings/page.tsx`

```tsx
'use client'

import ContentPage from '@/components/ContentPage'
import MergedContentSection from '@/components/MergedContentSection'
import Phase1EmbeddingsDiagrams from '@/diagrams/Phase1Embeddings'

export default function EmbeddingsPage() {
  return (
    <ContentPage
      title="01. Embeddings & Vector Search"
      breadcrumb={[
        { label: 'Phase 1: Foundations', href: '/docs/phase-1-foundations' },
        { label: 'Embeddings', href: '#' },
      ]}
    >
      <div className="space-y-16">
        
        {/* Section 1 */}
        <MergedContentSection
          title="What is an Embedding?"
          diagram={<Phase1EmbeddingsDiagrams variant="whatIsEmbedding" />}
          content={[
            {
              section: 'Definition',
              text: 'An embedding is a vector representation of text...'
            },
            {
              section: 'Why It Works',
              text: 'Similar meanings produce similar vectors because...'
            },
          ]}
        />

        {/* Section 2 */}
        <MergedContentSection
          title="Cosine Similarity"
          diagram={<Phase1EmbeddingsDiagrams variant="cosineSimilarity" />}
          content={[...]}
          reversed={true}
        />

        {/* Section 3 */}
        <MergedContentSection
          title="Vector Databases"
          diagram={<Phase1EmbeddingsDiagrams variant="vectorDBIndexing" />}
          content={[...]}
        />

        {/* Summary */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Takeaways</h3>
          <ul className="space-y-3 text-slate-700">
            <li>✅ Embeddings map text to vectors</li>
            <li>✅ Cosine similarity is the search metric</li>
            <li>✅ Vector DBs use approximate search for speed</li>
          </ul>
        </div>
      </div>
    </ContentPage>
  )
}
```

### Step 3: Test It

```bash
cd llm-docs
npm run dev
```

Visit: `http://localhost:3000/docs/phase-1-foundations/embeddings`

---

## Automated Integration Script

If you want to automate this, create a script:

**File:** `integrate-diagrams.js`

```javascript
const fs = require('fs')
const path = require('path')

const phases = [
  { 
    name: 'Phase1Embeddings', 
    source: '../Phase-1-Foundations/01.jsx',
    target: 'src/diagrams/Phase1Embeddings.tsx'
  },
  // ... add more
]

phases.forEach(phase => {
  const sourceContent = fs.readFileSync(phase.source, 'utf-8')
  
  // Add client marker and wrapper
  const wrappedContent = `'use client'\n\n${sourceContent}\n\nexport default function Diagram({ variant }) { /* ... */ }`
  
  fs.writeFileSync(phase.target, wrappedContent)
  console.log(`✅ Created ${phase.target}`)
})
```

Run:
```bash
node integrate-diagrams.js
```

---

## Mapping Diagrams to Sections

For each phase, identify which diagrams go where:

### Phase 1 (01.jsx → Embeddings)
- Token 0: `CardWhatIsEmbedding` → "What is an Embedding?"
- Token 1: `CardCosineSimilarity` → "Cosine Similarity"
- Token 2: `CardVectorDBIndexing` → "Vector Databases"

### Phase 2 (04-08.jsx → RAG Topics)
- 04.jsx → Chunking Strategies
- 05.jsx → Naive RAG
- 06.jsx → Advanced RAG
- 07.jsx → Reranking
- 08.jsx → Evaluation

**Tip:** Review each JSX file to identify card components, then map to content sections.

---

## Testing Diagrams

### Check TypeScript
```bash
npm run lint
```

### Check Rendering
Visit page in browser, inspect for:
- Diagram loads (no blank spaces)
- Text aligns properly
- Responsive on mobile
- Colors match theme

### Debug
Add temporary console.log in diagram component:
```tsx
export default function Phase1EmbeddingsDiagrams({ variant }) {
  console.log('Rendering variant:', variant)
  // ...
}
```

---

## Deploy After Integration

Once integrated locally and tested:

```bash
# Commit changes
git add -A
git commit -m "Integrate JSX diagrams"

# Deploy to Vercel
vercel
```

---

## Troubleshooting

### Diagrams not rendering?

Check:
1. File exists in `src/diagrams/`
2. Component marked `'use client'`
3. All imports present
4. Variant name matches exactly (case-sensitive)

### Styling issues?

- Ensure `tailwind` classes used (not inline styles from original)
- Check `THEME` object is properly defined
- Verify hex colors are correct

### TypeScript errors?

Add types:
```tsx
interface DiagramProps {
  variant?: 'whatIsEmbedding' | 'cosineSimilarity' | 'vectorDBIndexing'
}

export default function Phase1EmbeddingsDiagrams({ variant }: DiagramProps) {
  // ...
}
```

---

## Next: Add Content

After adding diagrams:

1. Create topic pages using `MergedContentSection`
2. Extract text from `.md` files
3. Match sections to diagrams
4. Add key takeaways

---

**Ready? Start with Phase 1! 🚀**
