import React from 'react';
import { 
  Database, Brain, MessageSquare, FileText, 
  Search, Cpu, Layers, AlertTriangle, 
  CheckCircle2, XCircle, RotateCcw, 
  TerminalSquare, Workflow, Filter, Zap, 
  User, Bot, MessageCircleQuestion, 
  Sparkles, Settings, GitBranch, DollarSign, 
  Clock, Target, Scale, Wrench, ArrowDown,
  Activity, BookOpen, AlertCircle, ArrowRightLeft,
  Code2
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
  <div className={`relative ${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.cardBorder} overflow-hidden flex flex-col items-center w-full ${xTall ? 'h-[700px]' : tall ? 'h-[500px]' : 'h-[400px]'} mb-6 hover:shadow-md transition-shadow`}>
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

// Card 1: The Three Levers
const CardTheThreeLevers = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4">
    <div className="grid grid-cols-3 gap-4 w-full h-[80%] z-10">
      
      {/* Prompting */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-400"></div>
        <TerminalSquare size={32} className="text-blue-500 mb-2 mt-2" />
        <h3 className="font-extrabold text-sm mb-1 text-slate-800">1. Prompting</h3>
        <p className="text-[10px] text-slate-500 mb-4 h-8">Best for simple tasks & zero/few-shot learning.</p>
        <div className="w-full space-y-2 text-[10px] text-left">
          <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Cost</span><span className="font-bold text-green-600">Free ($0)</span></div>
          <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Speed</span><span className="font-bold text-blue-600">Minutes</span></div>
          <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Solves</span><span className="font-bold text-slate-700">Guidance</span></div>
        </div>
      </div>

      {/* RAG */}
      <div className="bg-[#e6fcf5] border-2 border-[#31a67a] rounded-xl p-4 flex flex-col items-center text-center shadow-md relative overflow-hidden transform scale-105">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#31a67a]"></div>
        <Search size={32} className="text-[#31a67a] mb-2 mt-2" />
        <h3 className="font-extrabold text-sm mb-1 text-slate-900">2. RAG</h3>
        <p className="text-[10px] text-slate-600 mb-4 h-8">Best for knowledge-heavy, external & live data.</p>
        <div className="w-full space-y-2 text-[10px] text-left">
          <div className="flex justify-between border-b border-[#a6f0d4] pb-1"><span className="text-slate-500">Cost</span><span className="font-bold text-amber-600">Moderate</span></div>
          <div className="flex justify-between border-b border-[#a6f0d4] pb-1"><span className="text-slate-500">Speed</span><span className="font-bold text-indigo-600">Days</span></div>
          <div className="flex justify-between border-b border-[#a6f0d4] pb-1"><span className="text-slate-500">Solves</span><span className="font-bold text-slate-800">Knowledge</span></div>
        </div>
      </div>

      {/* Fine-Tuning */}
      <div className="bg-[#fffbeb] border-2 border-[#d97706] rounded-xl p-4 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#d97706]"></div>
        <Brain size={32} className="text-[#d97706] mb-2 mt-2" />
        <h3 className="font-extrabold text-sm mb-1 text-slate-800">3. Fine-Tuning</h3>
        <p className="text-[10px] text-slate-500 mb-4 h-8">Best for behavior change, strict style & formatting.</p>
        <div className="w-full space-y-2 text-[10px] text-left">
          <div className="flex justify-between border-b border-[#fde68a] pb-1"><span className="text-slate-400">Cost</span><span className="font-bold text-red-600">High ($$$)</span></div>
          <div className="flex justify-between border-b border-[#fde68a] pb-1"><span className="text-slate-400">Speed</span><span className="font-bold text-red-500">Weeks</span></div>
          <div className="flex justify-between border-b border-[#fde68a] pb-1"><span className="text-slate-400">Solves</span><span className="font-bold text-slate-700">Behavior</span></div>
        </div>
      </div>

    </div>
  </div>
);

// Card 2: The Decision Tree
const CardDecisionTree = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Start to Knowledge */}
      <Connection x1={50} y1={15} x2={50} y2={30} />
      
      {/* Knowledge Split */}
      <Connection x1={50} y1={30} x2={80} y2={30} dashed={true} />
      <Connection x1={50} y1={30} x2={50} y2={55} />
      
      {/* Behavior Split */}
      <Connection x1={50} y1={55} x2={80} y2={55} dashed={true} />
      <Connection x1={50} y1={55} x2={50} y2={80} />
      
      {/* Prompting Split */}
      <Connection x1={50} y1={80} x2={80} y2={80} dashed={true} />
      <Connection x1={50} y1={80} x2={50} y2={95} color="#ef4444" />
    </SvgCanvas>

    <Node top={15} left={50} title="START" icon={ArrowDown} type="secondary" width="w-[100px] z-20" />
    
    {/* Question 1: Knowledge */}
    <Node top={30} left={50} title="Lack Knowledge?" subtitle="Domain specific data" icon={BookOpen} type="secondary" width="w-[130px] z-20" />
    <Label top={22} left={65} text="YES" />
    <Node top={30} left={80} title="Use RAG" subtitle="Adds knowledge" icon={Search} type="success" width="w-[120px] z-20" />
    <Label top={42} left={50} text="NO" type="warning" />

    {/* Question 2: Behavior */}
    <Node top={55} left={50} title="Lack Style/Behavior?" subtitle="Specific tone/format" icon={Activity} type="secondary" width="w-[130px] z-20" />
    <Label top={47} left={65} text="YES" />
    <Node top={55} left={80} title="Fine-Tune" subtitle="Teaches behavior" icon={Brain} type="warning" width="w-[120px] z-20" />
    <Label top={67} left={50} text="NO" type="warning" />

    {/* Question 3: Prompting Check */}
    <Node top={80} left={50} title="Solvable via Prompt?" subtitle="Few-shot examples" icon={MessageSquare} type="secondary" width="w-[130px] z-20" />
    <Label top={72} left={65} text="YES" />
    <Node top={80} left={80} title="Prompting" subtitle="Fastest/Cheapest" icon={TerminalSquare} type="primary" width="w-[120px] z-20" />
    
    <Label top={88} left={50} text="NO" type="error" />
    <Label top={95} left={50} text="Fine-Tune (Last Resort)" type="error" />
  </div>
);

// Card 3: The Common Mistake (Expectation vs Reality)
const CardTheMistake = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-[25%] -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Expectation</div>
    <div className="absolute top-[8%] left-[75%] -translate-x-1/2 text-xs font-bold text-[#31a67a] uppercase tracking-widest text-center">Reality</div>
    <div className="absolute top-[15%] bottom-[5%] left-[50%] border-l-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      {/* Expectation Flow */}
      <Connection x1={25} y1={25} x2={25} y2={75} color="#ef4444" />
      
      {/* Reality Flow (Stepped) */}
      <Connection x1={75} y1={25} x2={75} y2={45} color="#31a67a" />
      <Connection x1={75} y1={45} x2={75} y2={75} color="#d97706" />
    </SvgCanvas>

    {/* Expectation */}
    <Node top={25} left={25} title='"I need AI"' icon={User} type="secondary" width="w-[120px]" />
    <Node top={50} left={25} title="Skip Basics" subtitle="Waste $1000s" icon={AlertCircle} type="error" width="w-[120px]" />
    <Node top={75} left={25} title="Fine-Tune Directly" subtitle="Expensive & Slow" icon={Brain} type="error" width="w-[130px]" />

    {/* Reality Pyramid */}
    <Node top={25} left={75} title="1. Try Prompting" subtitle="Solves ~80% of issues" icon={TerminalSquare} type="primary" width="w-[180px]" />
    <Node top={45} left={75} title="2. Try RAG" subtitle="Solves ~15% of issues" icon={Search} type="success" width="w-[140px]" />
    <Node top={75} left={75} title="3. Fine-Tune" subtitle="The remaining ~5%" icon={Brain} type="warning" width="w-[110px]" />

    <Label top={90} left={75} text="Treat Fine-Tuning as a Last Resort!" icon={AlertTriangle} type="warning" />
  </div>
);

// Card 4: Real-World Example Scenarios
const CardScenarios = () => (
  <div className="relative w-full h-full flex flex-col justify-center items-center space-y-4 px-4">
    
    {/* Support Chatbot */}
    <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
      <div className="w-[45%]">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><MessageSquare size={14} className="text-blue-500"/> Support Chatbot</h4>
        <p className="text-[9px] text-slate-500 mt-1">Answer questions based on 10,000 company FAQs.</p>
      </div>
      <div className="w-[15%] text-center">
        <ArrowRightLeft size={16} className="text-slate-300 mx-auto" />
      </div>
      <div className="w-[40%] flex flex-col gap-1">
        <span className="bg-[#e6fcf5] text-[#1f7351] border border-[#a6f0d4] text-[9px] font-bold px-2 py-1 rounded text-center">RAG (External Knowledge)</span>
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-2 py-1 rounded text-center">+ Prompt (Tone)</span>
      </div>
    </div>

    {/* Medical Classification */}
    <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
      <div className="w-[45%]">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><Activity size={14} className="text-red-500"/> Medical Triage</h4>
        <p className="text-[9px] text-slate-500 mt-1">Classify reports based on strict, specific hospital behaviors.</p>
      </div>
      <div className="w-[15%] text-center">
        <ArrowRightLeft size={16} className="text-slate-300 mx-auto" />
      </div>
      <div className="w-[40%] flex flex-col gap-1">
        <span className="bg-[#fffbeb] text-[#b45309] border border-[#fde68a] text-[9px] font-bold px-2 py-1 rounded text-center">Fine-Tune (Strict Behavior)</span>
        <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] px-2 py-1 rounded text-center line-through">Skip RAG</span>
      </div>
    </div>

    {/* Code Gen */}
    <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
      <div className="w-[45%]">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><Code2 size={14} className="text-slate-700"/> Code Generation</h4>
        <p className="text-[9px] text-slate-500 mt-1">Write Python using proprietary internal APIs & company style.</p>
      </div>
      <div className="w-[15%] text-center">
        <ArrowRightLeft size={16} className="text-slate-300 mx-auto" />
      </div>
      <div className="w-[40%] flex flex-col gap-1">
        <span className="bg-[#e6fcf5] text-[#1f7351] border border-[#a6f0d4] text-[9px] font-bold px-2 py-1 rounded text-center">RAG (Docs / API limits)</span>
        <span className="bg-[#fffbeb] text-[#b45309] border border-[#fde68a] text-[9px] font-bold px-2 py-1 rounded text-center">+ Fine-Tune (Coding Style)</span>
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| Prompt vs RAG vs Fine-Tune</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Choosing the right lever to improve your LLM outputs based on cost, speed, knowledge, and behavioral needs.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Wrench size={16} /> Strategy & Architecture
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <div className="lg:col-span-2">
           <Card title="01. The Three Improvement Levers" tall={false}>
             <CardTheThreeLevers />
           </Card>
         </div>

         <Card title="02. The Architecture Decision Tree" tall={true}>
           <CardDecisionTree />
         </Card>

         <Card title="03. The Common Mistake" tall={true}>
           <CardTheMistake />
         </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="04. Real-World Decision Examples" tall={false}>
            <CardScenarios />
        </Card>
      </div>

    </div>
  );
}