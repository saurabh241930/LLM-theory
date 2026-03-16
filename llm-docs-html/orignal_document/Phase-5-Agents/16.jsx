import React from 'react';
import { 
  Brain, MessageSquare, Search, Layers, 
  CheckCircle2, XCircle, TerminalSquare, 
  Workflow, User, Target, ArrowDown, Activity, 
  Wrench, RefreshCw, Network, GitBranch, 
  Clock, Database, Combine, ShieldCheck,
  SplitSquareHorizontal, Users, FastForward,
  Server, Route, PlayCircle, HardDrive, History
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

// Card 1: LangChain vs LangGraph
const CardChainVsGraph = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-[25%] -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">LangChain<br/><span className="text-[9px] lowercase font-normal">Linear Pipeline</span></div>
    <div className="absolute top-[8%] left-[75%] -translate-x-1/2 text-xs font-bold text-[#31a67a] uppercase tracking-widest text-center">LangGraph<br/><span className="text-[9px] lowercase font-normal">Stateful & Cyclic</span></div>
    <div className="absolute top-[15%] bottom-[5%] left-[50%] border-l-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      {/* LangChain (Linear) */}
      <Connection x1={25} y1={25} x2={25} y2={45} />
      <Connection x1={25} y1={45} x2={25} y2={70} />
      
      {/* LangGraph (Cyclic) */}
      <Connection x1={75} y1={25} x2={75} y2={45} />
      <path d="M 75 55 Q 95 60 75 70" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 75 70 Q 55 60 75 45" fill="none" stroke="#31a67a" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />
      <Connection x1={75} y1={75} x2={75} y2={90} />
    </SvgCanvas>

    {/* LangChain */}
    <Node top={25} left={25} title="Instruction" icon={FastForward} type="secondary" width="w-[120px]" />
    <Node top={45} left={25} title="Process" icon={Layers} type="secondary" width="w-[120px]" />
    <Node top={70} left={25} title="Output" subtitle="Fails if multi-step" icon={CheckCircle2} type="warning" width="w-[120px]" />

    {/* LangGraph */}
    <Node top={25} left={75} title="Start State" icon={Database} type="primary" width="w-[120px]" />
    <Node top={45} left={75} title="LLM Agent" icon={Brain} type="primary" width="w-[120px]" />
    <Node top={75} left={75} title="Tool Execution" subtitle="Updates State" icon={Wrench} type="warning" width="w-[120px]" />
    <Node top={93} left={75} title="Final Output" icon={CheckCircle2} type="success" width="w-[120px]" />

    <Label top={60} left={50} text="Loops until done!" icon={RefreshCw} type="success" />
  </div>
);

// Card 2: LangGraph Basics (Nodes & Edges)
const CardLangGraphBasics = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={15} y1={50} x2={35} y2={50} />
      
      {/* Conditional Edge to Tool */}
      <path d="M 45 40 Q 60 25 75 40" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      
      {/* Edge back to LLM */}
      <path d="M 75 60 Q 60 75 45 60" fill="none" stroke="#31a67a" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />
      
      {/* Conditional Edge to End */}
      <Connection x1={45} y1={50} x2={85} y2={50} />
    </SvgCanvas>

    <Node top={50} left={15} title="START" subtitle="User Query" icon={PlayCircle} type="secondary" width="w-[100px]" />
    
    <Node top={50} left={40} title="Node: LLM Step" subtitle="Decide Action" icon={Brain} type="primary" width="w-[130px]" />
    
    <Node top={50} left={85} title="END" subtitle="Final Answer" icon={CheckCircle2} type="success" width="w-[100px]" />
    
    <Node top={25} left={60} title="Node: Tools" subtitle="Execute & Observe" icon={Wrench} type="warning" width="w-[140px]" />

    <Label top={20} left={45} text="Conditional Edge (Needs Tool)" />
    <Label top={70} left={60} text="Unconditional Edge (Loop Back)" type="success" />
    <Label top={45} left={65} text="Conditional Edge (Done)" />
  </div>
);

// Card 3: Multi-Agent Architecture (Supervisor Pattern)
const CardSupervisorPattern = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Top to Supervisor */}
      <Connection x1={50} y1={15} x2={50} y2={28} />
      
      {/* Supervisor to Specialists */}
      <Connection x1={50} y1={38} x2={20} y2={55} />
      <Connection x1={50} y1={38} x2={50} y2={55} />
      <Connection x1={50} y1={38} x2={80} y2={55} />

      {/* Specialists to Combine */}
      <Connection x1={20} y1={65} x2={50} y2={82} color="#31a67a" dashed={true} />
      <Connection x1={50} y1={65} x2={50} y2={82} color="#31a67a" dashed={true} />
      <Connection x1={80} y1={65} x2={50} y2={82} color="#31a67a" dashed={true} />
    </SvgCanvas>

    <Node top={10} left={50} title="User Query" icon={MessageSquare} type="secondary" width="w-[120px]" />
    
    <Node top={33} left={50} title="Supervisor Agent" subtitle="Routes to specialist" icon={Route} type="primary" width="w-[150px]" />
    
    <Node top={60} left={20} title="Research Agent" subtitle="Web Search Tool" icon={Search} type="warning" width="w-[130px]" />
    <Node top={60} left={50} title="Coding Agent" subtitle="Python REPL Tool" icon={TerminalSquare} type="warning" width="w-[130px]" />
    <Node top={60} left={80} title="Analysis Agent" subtitle="Data processing" icon={Activity} type="warning" width="w-[130px]" />

    <Node top={88} left={50} title="Combine Results" subtitle="Final Output to User" icon={Combine} type="success" width="w-[150px]" />

    <Label top={20} left={65} text="Architecture 1" icon={Users} />
  </div>
);

// Card 4: Multi-Agent Example (Collaborative Research)
const CardCollaborative = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={15} y1={25} x2={15} y2={50} />
      <Connection x1={15} y1={50} x2={40} y2={50} />
      <Connection x1={40} y1={50} x2={65} y2={50} />
      <Connection x1={65} y1={50} x2={85} y2={50} />
      <Connection x1={85} y1={50} x2={85} y2={75} color="#31a67a" />
    </SvgCanvas>

    <div className="absolute top-[8%] left-[50%] -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Task: "Research Python async/await and summarize"</div>

    <Node top={20} left={15} title="Supervisor" subtitle='"Requires Research -> Synth -> Quality"' icon={User} type="secondary" width="w-[140px]" />
    
    <Node top={50} left={15} title="1. Researcher" subtitle="Uses Web Search" icon={Search} type="primary" width="w-[130px]" />
    
    <Node top={50} left={40} title="2. Synthesizer" subtitle="Structures the data" icon={Layers} type="primary" width="w-[130px]" />
    
    <Node top={50} left={65} title="3. Quality QA" subtitle="Fact-checks summary" icon={ShieldCheck} type="primary" width="w-[130px]" />
    
    <Node top={50} left={85} title="Supervisor" subtitle="Returns to User" icon={CheckCircle2} type="success" width="w-[120px]" />

    <Label top={40} left={50} text="Collaborative Hand-offs" icon={GitBranch} />
  </div>
);

// Card 5: Memory in Multi-Agent Systems
const CardMemoryTypes = () => (
  <div className="relative w-full h-full flex flex-col justify-center items-center">
    
    <div className="w-[95%] grid grid-cols-3 gap-4 z-10">
      
      {/* Short Term */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-slate-800 text-sm mb-2 border-b pb-2 flex items-center justify-center gap-2">
          <Clock size={16} className="text-blue-500"/> Short-Term
        </h4>
        <p className="text-[10px] text-slate-600 mb-2 font-bold">Current Conversation State</p>
        <ul className="text-[9px] text-slate-500 text-left space-y-1 list-disc pl-3">
          <li>Updates every step</li>
          <li>Passed between nodes</li>
          <li>E.g., message history array</li>
        </ul>
      </div>

      {/* Long Term */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-[#1f7351] text-sm mb-2 border-b border-[#a6f0d4] pb-2 flex items-center justify-center gap-2">
          <History size={16} className="text-[#31a67a]"/> Long-Term
        </h4>
        <p className="text-[10px] text-[#2a5d48] mb-2 font-bold">Historical Information</p>
        <ul className="text-[9px] text-[#2a5d48] text-left space-y-1 list-disc pl-3">
          <li>Persistent across chats</li>
          <li>Stored in Vector DB</li>
          <li>E.g., user preferences</li>
        </ul>
      </div>

      {/* Shared */}
      <div className="bg-[#fffbeb] border border-[#d97706] p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-[#92400e] text-sm mb-2 border-b border-[#fde68a] pb-2 flex items-center justify-center gap-2">
          <Network size={16} className="text-[#d97706]"/> Shared Memory
        </h4>
        <p className="text-[10px] text-[#78350f] mb-2 font-bold">Between Agents</p>
        <ul className="text-[9px] text-[#78350f] text-left space-y-1 list-disc pl-3">
          <li>Global accessible state</li>
          <li>Both read/write capability</li>
          <li>E.g., shared tool cache</li>
        </ul>
      </div>

    </div>

    <div className="mt-6 bg-slate-800 text-white px-6 py-3 rounded-lg text-xs font-bold w-[95%] text-center shadow-md">
      Without robust memory, agents get stuck in infinite loops or hallucinate previous steps!
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| LangGraph & Multi-Agent</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Transitioning from linear chains to stateful, cyclic graphs using LangGraph, and orchestrating multiple specialist agents.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Network size={16} /> Agent Architectures
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. LangChain vs LangGraph">
           <CardChainVsGraph />
         </Card>

         <Card title="02. LangGraph Basics (Nodes & Edges)">
           <CardLangGraphBasics />
         </Card>

         <Card title="03. Multi-Agent: Supervisor Pattern" tall={true}>
           <CardSupervisorPattern />
         </Card>

         <Card title="04. Multi-Agent: Collaborative Pattern" tall={true}>
            <CardCollaborative />
        </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="05. Memory Systems for Agents" tall={false}>
            <CardMemoryTypes />
        </Card>
      </div>

    </div>
  );
}