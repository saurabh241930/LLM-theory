import fs from 'fs'
import path from 'path'

/**
 * Load markdown file content from the parent LLM-theory directory
 */
export function loadMarkdownFile(relativePath: string): { content: string; exists: boolean } {
  try {
    // Navigate up from [llm-docs/src/lib] to [LLM-theory]
    const filePath = path.join(process.cwd(), '..', relativePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    return { content, exists: true }
  } catch (error) {
    console.error(`Failed to load markdown: ${relativePath}`, error)
    return { content: '', exists: false }
  }
}

/**
 * Convert markdown to HTML for display
 */
export function parseMarkdownToHtml(markdown: string): string {
  // Basic markdown parsing - for better support, use remark or marked library
  let html = markdown
    .replace(/^### (.*?)$/gm, '<h3 class="prose h3">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="prose h2">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="prose h1">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^```(.*?)```/gms, '<pre><code>$1</code></pre>')

  return `<article class="prose">${html}</article>`
}

/**
 * Extract title from markdown content
 */
export function extractMarkdownTitle(content: string): string {
  const match = content.match(/^# (.*?)$/m)
  return match ? match[1] : 'Untitled'
}
