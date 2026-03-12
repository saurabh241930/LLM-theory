'use client';

import ContentPage from '@/components/ContentPage';
import MergedContentSection from '@/components/MergedContentSection';
import EmbeddingsDiagram from '@/diagrams/Phase1Embeddings';

export default function EmbeddingsPage() {
  return (
    <ContentPage
      title="01. Embeddings & Vector Search"
      breadcrumb={[
        { label: 'Phases', href: '/#phases' },
        { label: 'Phase 1', href: '/docs/phase-1-foundations' },
        { label: 'Embeddings' }
      ]}
    >
      {/* Section 1: What is an Embedding */}
      <MergedContentSection
        title="What is an Embedding?"
        diagram={<EmbeddingsDiagram variant="whatIsEmbedding" />}
        content={[
          {
            section: 'Definition',
            text: 'An embedding is a dense numerical representation of meaning. Instead of storing raw text like "The cat sat on the mat", we store numbers: [0.21, -0.45, 0.89, ..., 0.12]. Each position (dimension) captures some aspect of semantic meaning.'
          },
          {
            section: 'Key Insight',
            text: 'Similar meanings produce similar vectors that are close together in high-dimensional space. This is the foundation for semantic search.'
          }
        ]}
      />

      {/* Section 2: Why Embeddings Matter */}
      <MergedContentSection
        title="Why Embeddings Matter: Search Comparison"
        diagram={<EmbeddingsDiagram variant="search" />}
        content={[
          {
            section: 'Traditional Keyword Search (Bad)',
            text: 'Query: "cat" matches only documents with exact word "cat". Problem: Misses "feline" and "animal" which are semantically related but use different words.'
          },
          {
            section: 'Embedding Search (Good)',
            text: 'Convert query to embedding, then find most similar document embeddings. "cat" → [0.8, 0.2, 0.5] will match "feline" → [0.77, 0.19, 0.48] because vectors are close in space.'
          }
        ]}
        reversed={true}
      />

      {/* Section 3: Cosine Similarity Math */}
      <MergedContentSection
        title="The Math: Cosine Similarity"
        diagram={<EmbeddingsDiagram variant="cosineSimilarity" />}
        content={[
          {
            section: 'Formula',
            text: 'cosine_similarity(A, B) = (A · B) / (||A|| × ||B||) where · denotes dot product and ||A|| is the magnitude (length) of vector A.'
          },
          {
            section: 'Interpretation',
            text: 'Result is a number between -1 and 1. A value of 1.0 means vectors point in identical direction (identical meaning). 0.5 is moderate similarity. 0.0 means vectors are orthogonal (unrelated). Why cosine? It measures angle between vectors, not distance, so magnitude doesn\'t matter.'
          }
        ]}
      />

      {/* Section 4: Vector Database Indexing */}
      <MergedContentSection
        title="How Vector Databases Are Fast: Indexing"
        diagram={<EmbeddingsDiagram variant="vectorDB" />}
        content={[
          {
            section: 'Naive Approach (Slow)',
            text: 'For each query, calculate cosine_similarity against every single document in the database. If you have 1 million documents, you do 1 million similarity calculations. Time complexity: O(n) - becomes prohibitively slow at scale.'
          },
          {
            section: 'Vector DB Approach (Fast)',
            text: 'Use spatial indexing algorithms (HNSW = Hierarchical Navigable Small World, IVF = Inverted File) to partition vector space into clusters. Query vector only checks nearby clusters, skipping 99% of irrelevant vectors. Time complexity: O(log n) - orders of magnitude faster. Popular DBs: Pinecone (managed), Weaviate, Chroma (local), pgvector (Postgres), Milvus.'
          }
        ]}
        reversed={true}
      />

      {/* Section 5: Embedding Models */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 my-12">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Embedding Models: Converting Text to Vectors</h3>
        <p className="text-slate-700 mb-4">
          You need an embedding model to convert text → vectors. Popular options:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border border-slate-200">
            <div className="font-semibold text-slate-900">OpenAI text-embedding-3-small</div>
            <div className="text-sm text-slate-600">512-dim, fast, general purpose, low cost</div>
          </div>
          <div className="bg-white p-4 rounded border border-slate-200">
            <div className="font-semibold text-slate-900">Sentence-BERT</div>
            <div className="text-sm text-slate-600">384-768 dim, free, local inference</div>
          </div>
          <div className="bg-white p-4 rounded border border-slate-200">
            <div className="font-semibold text-slate-900">BGE (BAAI)</div>
            <div className="text-sm text-slate-600">768-dim, strong performance, open-source</div>
          </div>
          <div className="bg-white p-4 rounded border border-slate-200">
            <div className="font-semibold text-slate-900">Voyage AI</div>
            <div className="text-sm text-slate-600">Specialized for code, long documents</div>
          </div>
        </div>
      </div>

      {/* Common Pitfalls */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 my-12">
        <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Common Pitfalls</h3>
        <ul className="space-y-3 text-red-800">
          <li><strong>Wrong embedding model:</strong> Using general embeddings for legal/medical domain. Solution: Use domain-specific fine-tuned embeddings.</li>
          <li><strong>Embedding too-long documents:</strong> Model has max length, chunks get truncated. Solution: Chunk BEFORE embedding.</li>
          <li><strong>Trusting cosine similarity alone:</strong> Two vectors can be close but semantically different. Solution: Use reranking with cross-encoders to validate.</li>
          <li><strong>Stale embeddings:</strong> You retrain your embedding model but old vectors remain in DB. Solution: Re-embed everything when you upgrade models.</li>
        </ul>
      </div>

      {/* End-to-End Example */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 my-12 border-l-4 border-blue-500">
        <h3 className="text-xl font-bold text-blue-900 mb-4">🎯 End-to-End Example: Law Firm RAG</h3>
        <div className="space-y-3 text-blue-800">
          <div>
            <strong>Indexing Phase (offline, once):</strong>
            <ul className="ml-6 mt-1 text-sm space-y-1">
              <li>• Load 10,000 legal documents</li>
              <li>• Split into chunks (300 tokens each)</li>
              <li>• Convert each chunk to embedding using OpenAI API</li>
              <li>• Store vectors + metadata in Pinecone</li>
            </ul>
          </div>
          <div>
            <strong>Retrieval Phase (runtime, per user query):</strong>
            <ul className="ml-6 mt-1 text-sm space-y-1">
              <li>• User asks: "What are penalties for contract breach?"</li>
              <li>• Convert query to embedding</li>
              <li>• Vector DB finds top-5 most similar document chunks</li>
              <li>• Return chunks + pass to LLM: "Answer based on these docs..."</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-8 my-12 border-l-4 border-teal-500">
        <h3 className="text-xl font-bold text-teal-900 mb-4">✅ Key Takeaways</h3>
        <ul className="space-y-2 text-teal-800">
          <li>✅ <strong>Embeddings</strong> = dense numerical vectors = semantics as numbers</li>
          <li>✅ <strong>Cosine similarity</strong> measures how semantically related two vectors are (angle-based, not distance-based)</li>
          <li>✅ <strong>Vector DBs</strong> use spatial indexing (HNSW, IVF) for O(log n) search instead of O(n)</li>
          <li>✅ <strong>Embedding quality</strong> depends on model choice - select based on domain and cost</li>
          <li>✅ <strong>Embeddings are foundational</strong> for RAG, semantic search, and vector-based retrieval</li>
        </ul>
      </div>
    </ContentPage>
  );
}
