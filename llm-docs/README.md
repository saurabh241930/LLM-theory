# LLM Theory Documentation Site

A Next.js-based interactive documentation site combining markdown content with React diagrams for comprehensive LLM/AI engineering interview preparation.

## 📁 Project Structure

```
llm-docs/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page with phase overview
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── not-found.tsx               # 404 page
│   │   └── docs/
│   │       ├── page.tsx                # Docs home (future)
│   │       ├── math-foundations/
│   │       │   ├── page.tsx            # Math foundations landing
│   │       │   ├── linear-algebra/
│   │       │   ├── probability/
│   │       │   ├── calculus/
│   │       │   ├── info-theory/
│   │       │   └── qa/
│   │       ├── phase-1-foundations/
│   │       │   ├── page.tsx            # Phase 1 landing
│   │       │   ├── embeddings/
│   │       │   ├── tokenization/
│   │       │   ├── prompting/
│   │       │   └── qa/
│   │       ├── phase-2-rag/
│   │       ├── phase-3-structured-outputs/
│   │       ├── phase-4-fine-tuning/
│   │       └── phase-5-agents/
│   ├── components/
│   │   ├── Navbar.tsx                  # Top navigation bar
│   │   ├── Sidebar.tsx                 # Left sidebar with topic navigation
│   │   ├── ContentPage.tsx             # Generic content page wrapper
│   │   ├── MergedContentSection.tsx    # Component merging text + diagram
│   │   └── layouts/
│   │       └── RootLayoutClient.tsx    # Client-side layout orchestration
│   ├── diagrams/
│   │   ├── Phase1Embeddings.tsx        # Phase 1 diagram exports
│   │   ├── Phase2RAG.tsx               # Phase 2 diagram exports
│   │   └── ... (more phases)
│   └── lib/
│       └── markdown.ts                 # Markdown loading utilities
├── public/                             # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd llm-docs
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## 📝 How to Add Content

### Adding a New Topic Page

1. **Create the directory structure:**
   ```bash
   mkdir -p src/app/docs/phase-X-name/topic-name
   ```

2. **Create the page component** (`src/app/docs/phase-X/topic-name/page.tsx`):
   ```tsx
   'use client'
   import ContentPage from '@/components/ContentPage'
   import MergedContentSection from '@/components/MergedContentSection'
   import DiagramComponent from '@/diagrams/PhaseXDiagrams'

   export default function TopicPage() {
     return (
       <ContentPage
         title="Topic Title"
         breadcrumb={[
           { label: 'Phase Name', href: '/docs/phase-x' },
           { label: 'Topic', href: '#' },
         ]}
       >
         <MergedContentSection
           title="Section Title"
           diagram={<DiagramComponent variant="sectionName" />}
           content={[
             {
               section: 'Definition',
               text: 'Your markdown content here...'
             },
             // More sections
           ]}
         />
       </ContentPage>
     )
   }
   ```

### Importing Diagrams

The diagram system is modular:

1. **Create diagram file** (`src/diagrams/PhaseXDiagrams.tsx`):
   ```tsx
   'use client'
   
   export interface DiagramProps {
     variant?: string
   }
   
   export default function PhaseXDiagrams({ variant }: DiagramProps) {
     // Return appropriate diagram based on variant
     // Can import actual JSX diagram components here
   }
   ```

2. **Import original JSX diagrams** from parent directory:
   ```tsx
   // In src/diagrams/Phase1Embeddings.tsx
   // You can dynamically import the 01.jsx file from ../../../Phase-1-Foundations/
   
   const CardWhatIsEmbedding = require('../../../Phase-1-Foundations/01.jsx').CardWhatIsEmbedding
   ```

## 🎨 Styling

The site uses:
- **Tailwind CSS** for component styling
- **Custom color scheme** (primary: #41d8a0, secondary: #2e9e73)
- **Responsive design** (mobile-first)
- **Dark mode ready** (setup in tailwind.config.ts)

## 📊 Merging Content & Diagrams

The `MergedContentSection` component handles the layout:

```tsx
<MergedContentSection
  title="Main Section Title"
  diagram={<DiagramComponent />}
  content={[
    { section: 'Subsection', text: 'Paragraph text...' },
    { section: 'Another', text: 'More text...' }
  ]}
  reversed={false}  // Set true to swap diagram/text positions
/>
```

**Key Features:**
- Responsive grid (1 col mobile, 2 col desktop)
- Side-by-side diagram and text
- Reversible layout (diagram on left or right)
- Markdown-aware text rendering

## 🧭 Navigation Structure

### Sidebar
- Auto-expands relevant phase based on current page
- Collapsible sections on mobile
- Direct links to all topics
- Auto-highlights current page

### Navbar
- Logo + branding
- Top-level navigation links
- Mobile menu toggle

## 🔧 Adding Original JSX Diagrams

To use the actual diagram components from the parent structure:

1. **Copy the diagram JSX into `/src/diagrams/`** or reference directly
2. **Wrap in variant-based conditional:**
   ```tsx
   export default function Phase1Diagrams({ variant }) {
     if (variant === 'whatIsEmbedding') {
       return <CardWhatIsEmbedding />
     }
     if (variant === 'cosineSimilarity') {
       return <CardCosineSimilarity />
     }
     // ... more variants
   }
   ```

3. **Use in content pages** with variant prop:
   ```tsx
   <DiagramComponent variant="whatIsEmbedding" />
   ```

## 📱 Responsive Design

- **Mobile:** Single column, collapsible sidebar, touch-friendly
- **Tablet:** Sidebar visible, content in main area
- **Desktop:** Full sidebar + main content
- **Large screens:** Constrained max-width (5xl) for readability

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The project is a standard Next.js app, compatible with:
- Netlify
- GitHub Pages (static export)
- AWS Amplify
- Docker

## 📋 Roadmap

- [ ] Import actual JSX diagram components
- [ ] Add search functionality
- [ ] Add dark mode toggle
- [ ] Add PDF export
- [ ] Add progress tracking
- [ ] Add quiz system
- [ ] Add code sandboxes for examples
- [ ] Add interactive visualizations
- [ ] Add feedback/suggestions system

## 🛠️ Common Tasks

### Update Sidebar Navigation
Edit `src/components/Sidebar.tsx` - `sidebarItems` array

### Change Color Scheme
Edit `tailwind.config.ts` - extend colors section

### Add New Phase
1. Create directory in `src/app/docs/phase-X-name/`
2. Add to `Sidebar.tsx` sidebarItems
3. Create landing page + topic pages

### Modify Markdown Parsing
Edit `src/lib/markdown.ts` for custom parsing logic

## 📚 Content Guidelines

- **Title:** Clear, descriptive heading
- **Breadcrumbs:** Guide users through hierarchy
- **Diagrams:** Always on one side, text on other
- **Text:** 2-3 sentences per subsection max
- **Examples:** Real, practical use cases
- **Formatting:** Bold for emphasis, code for technical terms

## 🤝 Contributing

To add:
1. Create feature branch
2. Add content/features following structure
3. Test responsiveness
4. Commit with clear message
5. Open PR

## 📄 License

This documentation is part of the LLM Theory study materials.

## 🆘 Support

For issues or questions:
- Check existing pages for patterns
- Review Tailwind + Next.js docs
- Ensure TypeScript types are correct
- Test in multiple browsers

---

**Happy learning! 🚀**
