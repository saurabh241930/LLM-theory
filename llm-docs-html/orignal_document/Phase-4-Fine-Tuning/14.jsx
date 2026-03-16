import React from 'react';
import { 
  Brain, MessageSquare, FileText, 
  Search, Cpu, Layers, AlertTriangle, 
  CheckCircle2, XCircle, RotateCcw, 
  TerminalSquare, Workflow, Filter, Zap, 
  User, Bot, Sparkles, Target, Scale, 
  ArrowDown, Activity, BookOpen, AlertCircle,
  ThumbsUp, ListOrdered, HeartHandshake,
  FastForward, Coins, Clock
} from 'lucide-react';

// --- STYLING CONSTANTS (ByteByteGo Aesthetic) ---
const THEME = {
  cardBg: "bg-white",
  cardBorder: "border-slate-200",
  titleBg: "bg-[#41d8a0]",
  titleBorder: "border-[#2e9e73]",
  primaryNode: "bg-[#a6f0d4] border-[#31a67a] text-slate-900",
  secondaryNode: "bg-white border-slate-300 text-slate-700 shadow-sm",
  dashedNode: "bg-[#f8fafc] border-slate-400 border-dashed text-slate-700",
  errorNode: "bg-[#ffe4e6] border-[#f43f5e] text-slate-900",
  warningNode: "bg-[#fef3c7] border-[#d97706] text-slate-900",
  successNode: "bg-[#e6fcf5] border-[#31a67a] text-[#1f7351]",
  line: "#64748b"
};

// --- CORE UI COMPONENTS ---

const Card = ({ title, children, tall = false, xTall = false }) => (
  <div className={`relative ${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.cardBorder} overflow-hidden flex flex-col items-center w-full ${xTall ? 'h-[750px]' : tall ? 'h-[500px]' : 'h-[400px]'} mb-6 hover:shadow-md transition-shadow`}>
    <div className={`mt-5 ${THEME.titleBg} text-slate-900 font-extrabold text-lg py-2 px-6 rounded-xl border-2 ${THEME.titleBorder} w-[85%] text-center z-20 shadow-sm tracking-tight`}>
      {title}
    </div>
    <div className="absolute inset-0 top-[60px] w-full p-4 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const Node = ({ top, left, title, subtitle, icon: Icon, type = "primary", className = "", width = "w-[130px]" }) => {
  const styleClass = THEME[`${type}Node`] || THEME.primaryNode;
  return (
    <div 
      className={`absolute z-10 flex flex-col items-center justify-center p-2 rounded-lg border-2 ${width} text-center transition-transform hover:scale-105 ${styleClass} ${className}`}
      style={{ top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)' }}
    >
      {Icon && <Icon className="mb-1 opacity-80" size={18} strokeWidth={2} />}
      <span className="text-[11px] font-bold leading-tight">{title}</span>
      {subtitle && <span className="text-[9px] opacity-80 mt-1 leading-tight whitespace-pre-line">{subtitle}</span>}
    </div>
  );
};

const Label = ({ top, left, text, icon: Icon, type="default", width="w-auto" }) => (
  <div 
    className={`absolute z-20 flex flex-col items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-slate-200 ${width} ${type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : type === 'success' ? 'bg-[#e6fcf5] text-[#2e9e73] border-[#31a67a]' : type === 'warning' ? 'bg-[#fef3c7] text-[#d97706] border-[#f59e0b]' : 'bg-white text-slate-700'}`}
    style={{ top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)' }}
  >
    {Icon && <Icon size={14} className={`mb-1 ${type === 'error' ? 'text-red-500' : type === 'warning' ? 'text-[#d97706]' : 'text-[#2e9e73]'}`} />}
    {text}
  </div>
);

const SvgCanvas = ({ children }) => (
  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
    <defs>
       <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill={THEME.line} />
       </marker>
       <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
       </marker>
       <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill="#31a67a" />
       </marker>
       <marker id="arrow-amber" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
         <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
       </marker>
    </defs>
    {children}
  </svg>
);

const Connection = ({ x1, y1, x2, y2, dashed = false, arrow = true, color = THEME.line }) => {
  let marker = "none";
  if (arrow) {
    if (color === '#ef4444') marker = "url(#arrow-red)";
    else if (color === '#31a67a') marker = "url(#arrow-green)";
    else if (color === '#d97706') marker = "url(#arrow-amber)";
    else marker = "url(#arrow)";
  }
  return (
    <line 
      x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} 
      stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5,5" : "none"} 
      markerEnd={marker} 
    />
  );
};

// --- SPECIFIC DIAGRAM CARDS ---

// Card 1: The Alignment Problem & Quality Progression
const CardProgression = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={25} y1={50} x2={50} y2={50} />
      <Connection x1={50} y1={50} x2={75} y2={50} />
    </SvgCanvas>

    <Node top={50} left={25} title="Pre-Trained Base" subtitle="Performance: 30-50%\nHallucinates, Toxic" icon={AlertCircle} type="error" width="w-[140px]" />
    
    <Node top={50} left={50} title="Instruction Tuned" subtitle="Performance: 70-80%\nFollows basic rules" icon={TerminalSquare} type="primary" width="w-[140px]" />
    
    <Node top={50} left={75} title="RLHF / DPO Aligned" subtitle="Performance: 90%+\nHelpful & Harmless" icon={HeartHandshake} type="success" width="w-[140px]" />

    <Label top={25} left={50} text="The Alignment Problem: Pre-trained models aren't built to be helpful!" />
  </div>
);

// Card 2: Instruction Tuning
const CardInstructTuning = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={25} y1={50} x2={50} y2={50} />
      <Connection x1={50} y1={50} x2={80} y2={50} />
    </SvgCanvas>

    <div className="absolute top-[50%] left-[25%] -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-300 p-3 rounded-xl border border-slate-700 shadow-lg text-[9px] font-mono w-[160px] z-10">
      <div className="text-[#41d8a0] font-bold border-b border-slate-600 pb-1 mb-1">Dataset: Alpaca/ShareGPT</div>
      <div><span className="text-white">Input:</span> "Summarize this..."</div>
      <div className="mt-1"><span className="text-white">Output:</span> "Here is a 3-sentence summary..."</div>
      <div className="text-slate-500 italic mt-1">// 50k-500k examples</div>
    </div>

    <Node top={50} left={50} title="Supervised Fine-Tuning" subtitle="Learn formatting" icon={Brain} type="primary" width="w-[140px]" />
    
    <Node top={50} left={80} title="Instruct Model" subtitle="No longer random text" icon={CheckCircle2} type="success" width="w-[130px]" />

    <Label top={25} left={50} text="Technique 1: Teach the model HOW to answer" icon={BookOpen} />
  </div>
);

// Card 3: RLHF Pipeline
const CardRLHF = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Down center */}
      <Connection x1={50} y1={12} x2={50} y2={25} />
      <Connection x1={50} y1={38} x2={50} y2={50} />
      <Connection x1={50} y1={65} x2={50} y2={78} />
      
      {/* Human Ranking Side Loop */}
      <path d="M 50 32 C 80 32, 80 57, 50 57" fill="none" stroke="#31a67a" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />
    </SvgCanvas>

    <div className="absolute top-[12%] left-[25%] -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase w-[120px] text-right">Step 1: Generate</div>
    <Node top={12} left={50} title="Prompt: 'Write a poem'" subtitle="LLM generates 3 options" icon={MessageSquare} type="secondary" width="w-[160px]" />
    
    <div className="absolute top-[32%] left-[25%] -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase w-[120px] text-right">Step 2: Human Rank</div>
    <Node top={32} left={50} title="Human Annotators" subtitle="Rank: 1st, 2nd, 3rd best" icon={ListOrdered} type="warning" width="w-[160px]" />
    <Label top={45} left={75} text="Learns Preferences" icon={ThumbsUp} type="success" />

    <div className="absolute top-[57%] left-[25%] -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase w-[120px] text-right">Step 3: Reward Model</div>
    <Node top={57} left={50} title="Train Reward Model" subtitle="Predicts human score (0-1)" icon={Target} type="primary" width="w-[160px]" />
    
    <div className="absolute top-[82%] left-[25%] -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase w-[120px] text-right">Step 4: RL Training</div>
    <Node top={82} left={50} title="PPO Optimization" subtitle="Maximize the Reward Score" icon={Activity} type="success" width="w-[160px]" />
    
    <div className="absolute top-[92%] left-[50%] -translate-x-1/2 text-[9px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
      Expensive & Slow: Costs $100K+, takes weeks.
    </div>
  </div>
);

// Card 4: DPO (Direct Preference Optimization)
const CardDPO = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Branch out */}
      <Connection x1={20} y1={50} x2={40} y2={30} />
      <Connection x1={20} y1={50} x2={40} y2={70} />
      
      {/* Merge in */}
      <Connection x1={40} y1={30} x2={65} y2={50} color="#31a67a" />
      <Connection x1={40} y1={70} x2={65} y2={50} color="#ef4444" />
      
      <Connection x1={65} y1={50} x2={85} y2={50} />
    </SvgCanvas>

    <Node top={50} left={20} title="Prompt" icon={MessageSquare} type="secondary" width="w-[80px]" />
    
    <Node top={30} left={40} title="Response A" subtitle="Chosen (Better)" icon={CheckCircle2} type="success" width="w-[110px]" />
    <Node top={70} left={40} title="Response B" subtitle="Rejected (Worse)" icon={XCircle} type="error" width="w-[110px]" />
    
    <Node top={50} left={65} title="DPO Math" subtitle="Directly update weights\n(No reward model!)" icon={Scale} type="primary" width="w-[130px]" />
    
    <Node top={50} left={85} title="Aligned LLM" icon={Sparkles} type="success" width="w-[100px]" />

    <Label top={20} left={65} text="Technique 3: Skip the Reward Model entirely" icon={FastForward} />
  </div>
);

// Card 5: RLHF vs DPO Comparison
const CardComparison = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-[90%] grid grid-cols-2 gap-4 z-10">
      
      {/* RLHF */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-slate-800 text-sm mb-2 border-b pb-2 flex items-center justify-center gap-2">
           RLHF
        </h4>
        <ul className="space-y-3 text-xs text-slate-700 text-left">
          <li className="flex items-center gap-2"><Layers size={14} className="text-blue-500"/> <strong>Stages:</strong> 3 Complex stages</li>
          <li className="flex items-center gap-2"><Clock size={14} className="text-red-500"/> <strong>Time:</strong> 2-4 Weeks</li>
          <li className="flex items-center gap-2"><Coins size={14} className="text-amber-500"/> <strong>Cost:</strong> $100K+</li>
          <li className="flex items-center gap-2"><Target size={14} className="text-green-500"/> <strong>Result:</strong> Gold Standard (ChatGPT)</li>
        </ul>
      </div>

      {/* DPO */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-4 rounded-xl shadow-sm text-center transform scale-105">
        <h4 className="font-extrabold text-[#1f7351] text-sm mb-2 border-b border-[#a6f0d4] pb-2 flex items-center justify-center gap-2">
           DPO (Modern Trend)
        </h4>
        <ul className="space-y-3 text-xs text-[#2a5d48] text-left">
          <li className="flex items-center gap-2"><FastForward size={14} className="text-[#31a67a]"/> <strong>Stages:</strong> 1 Direct fine-tune</li>
          <li className="flex items-center gap-2"><Clock size={14} className="text-green-600"/> <strong>Time:</strong> 2-5 Days</li>
          <li className="flex items-center gap-2"><Coins size={14} className="text-green-600"/> <strong>Cost:</strong> ~$10K</li>
          <li className="flex items-center gap-2"><Target size={14} className="text-green-600"/> <strong>Result:</strong> Near identical quality</li>
        </ul>
      </div>

    </div>
  </div>
);


// --- MAIN APP LAYOUT ---
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
             Visual Dev Guides <span className="text-slate-400 font-normal">| Model Alignment</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Teaching raw LLMs to be Helpful, Harmless, and Honest using Instruction Tuning, RLHF, and DPO.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <HeartHandshake size={16} /> Human Alignment
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <div className="lg:col-span-2">
           <Card title="01. The Alignment Quality Progression" tall={false}>
             <CardProgression />
           </Card>
         </div>

         <Card title="02. Instruction Tuning (Supervised)">
           <CardInstructTuning />
         </Card>

         <Card title="04. DPO (Direct Preference Optimization)">
           <CardDPO />
         </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
        <Card title="03. The RLHF Pipeline (4 Steps)" xTall={true}>
            <CardRLHF />
        </Card>
        
        <Card title="05. RLHF vs DPO (The Paradigm Shift)" xTall={true}>
            <CardComparison />
        </Card>
      </div>

    </div>
  );
}