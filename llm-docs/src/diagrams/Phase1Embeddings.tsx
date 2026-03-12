'use client';

import React from 'react';
import { 
  Search, Database, FileText, Zap, Layers 
} from 'lucide-react';

const THEME = {
  cardBg: "bg-white",
  cardBorder: "border-slate-200",
  titleBg: "bg-[#41d8a0]",
  titleBorder: "border-[#2e9e73]",
  primaryNode: "bg-[#a6f0d4] border-[#31a67a] text-slate-900",
  errorNode: "bg-[#ffe4e6] border-[#f43f5e] text-slate-900",
  line: "#64748b"
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={`relative ${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.cardBorder} overflow-hidden flex flex-col items-center w-full h-[400px] hover:shadow-md transition-shadow`}>
    <div className={`mt-5 ${THEME.titleBg} text-slate-900 font-extrabold text-lg py-2 px-6 rounded-xl border-2 ${THEME.titleBorder} w-[85%] text-center z-20 shadow-sm tracking-tight`}>
      {title}
    </div>
    <div className="absolute inset-0 top-[60px] w-full p-4 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const Node = ({ top, left, title, subtitle, icon: Icon, type = "primary" }: any) => {
  const styleClass = THEME[`${type}Node` as keyof typeof THEME] || THEME.primaryNode;
  return (
    <div 
      className={`absolute z-10 flex flex-col items-center justify-center p-2 rounded-lg border-2 w-[120px] text-center transition-transform hover:scale-105 ${styleClass}`}
      style={{ top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)' }}
    >
      {Icon && <Icon className="mb-1 opacity-80" size={20} strokeWidth={2} />}
      <span className="text-[11px] font-bold leading-tight">{title}</span>
      {subtitle && <span className="text-[9px] opacity-80 mt-1 leading-tight">{subtitle}</span>}
    </div>
  );
};

const SvgCanvas = ({ children }: { children: React.ReactNode }) => (
  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
    <defs>
       <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill={THEME.line} />
       </marker>
    </defs>
    {children}
  </svg>
);

const Connection = ({ x1, y1, x2, y2 }: any) => (
  <line 
    x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} 
    stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" 
  />
);

const CardWhatIsEmbedding = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1="25" y1="50" x2="45" y2="50" />
      <Connection x1="55" y1="50" x2="75" y2="50" />
    </SvgCanvas>
    <Node top="50" left="15" title="Raw Text" subtitle="'The cat'" icon={FileText} />
    <Node top="50" left="50" title="Embedding" subtitle="Dense [0.8...]" icon={Zap} type="primary" />
    <Node top="50" left="85" title="Vector Space" subtitle="High-Dim" icon={Layers} type="primary" />
  </div>
);

const CardSearchComparison = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1="30" y1="30" x2="30" y2="50" />
      <Connection x1="70" y1="30" x2="70" y2="50" />
    </SvgCanvas>
    <div className="absolute top-[10%] left-[15%] z-20 text-center">
      <div className="text-sm font-bold text-red-600">Keyword</div>
      <div className="text-xs text-slate-600">Exact matches</div>
    </div>
    <div className="absolute top-[10%] right-[15%] z-20 text-center">
      <div className="text-sm font-bold text-green-600">Semantic</div>
      <div className="text-xs text-slate-600">Similar meaning</div>
    </div>
    <Node top="70" left="30" title="'cat'" subtitle="Only exact" icon={Search} type="errorNode" />
    <Node top="70" left="70" title="'feline'" subtitle="Also found" icon={Search} type="primary" />
  </div>
);

const CardCosineMath = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-sm font-mono bg-slate-100 p-3 rounded-lg mb-4 font-bold">
        cos(θ) = (A·B) / (||A|| × ||B||)
      </div>
      <div className="text-xs text-slate-600 mt-4 space-y-2">
        <div className="font-semibold">Range: -1 to 1</div>
        <div>1.0 = identical</div>
        <div>0.0 = unrelated</div>
        <div className="text-green-600 pt-2">Measures angle, not distance</div>
      </div>
    </div>
  </div>
);

const CardVectorDB = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1="30" y1="30" x2="30" y2="55" />
      <Connection x1="70" y1="30" x2="70" y2="55" />
    </SvgCanvas>
    <Node top="15" left="30" title="Naive" subtitle="O(n)" icon={Search} type="errorNode" />
    <Node top="15" left="70" title="Indexed" subtitle="O(log n)" icon={Zap} type="primary" />
    <Node top="70" left="30" title="Compare ALL" subtitle="1M vectors" icon={Database} type="errorNode" />
    <Node top="70" left="70" title="HNSW/IVF" subtitle="Skip 99%" icon={Database} type="primary" />
  </div>
);

interface DiagramProps {
  variant?: 'whatIsEmbedding' | 'search' | 'cosineSimilarity' | 'vectorDB';
}

export default function EmbeddingsDiagram({ variant = 'whatIsEmbedding' }: DiagramProps) {
  const renderDiagram = () => {
    switch (variant) {
      case 'whatIsEmbedding':
        return <CardWhatIsEmbedding />;
      case 'search':
        return <CardSearchComparison />;
      case 'cosineSimilarity':
        return <CardCosineMath />;
      case 'vectorDB':
        return <CardVectorDB />;
      default:
        return <CardWhatIsEmbedding />;
    }
  };

  return (
    <Card title={`Embeddings: ${variant}`}>
      {renderDiagram()}
    </Card>
  );
}
