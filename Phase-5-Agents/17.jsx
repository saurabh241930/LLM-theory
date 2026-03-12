import React from 'react';
import { 
  Brain, MessageSquare, Search, Layers, 
  CheckCircle2, XCircle, TerminalSquare, 
  User, Target, ArrowDown, Activity, 
  Wrench, RefreshCw, Network, GitBranch, 
  Clock, Database, Combine, ShieldCheck,
  Server, Route, PlayCircle, HardDrive, 
  History, AlertTriangle, Bug, Infinity, 
  ServerOff, FileWarning, Scissors, Code2
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
       <marker id="arrow-green" viewBox="0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
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

// Card 1: Agent Failure Categories (Overview)
const CardFailureCategories = () => (
  <div className="relative w-full h-full flex flex-col items-center p-4 pt-8">
    <div className="grid grid-cols-2 gap-3 w-[95%]">
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-lg shadow-sm flex items-start gap-2">
        <Infinity size={16} className="text-red-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">1. Infinite Loops</h4>
          <p className="text-[9px] text-slate-600 leading-tight">Calls same tool repeatedly. Fix: Set max_steps limit.</p>
        </div>
      </div>
      <div className="bg-[#fffbeb] border border-[#d97706] p-3 rounded-lg shadow-sm flex items-start gap-2">
        <Bug size={16} className="text-[#d97706] mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">2. Hallucinated Tools</h4>
          <p className="text-[9px] text-slate-600 leading-tight">Invents non-existent tools. Fix: Validate names.</p>
        </div>
      </div>
      <div className="bg-[#fffbeb] border border-[#d97706] p-3 rounded-lg shadow-sm flex items-start gap-2">
        <Route size={16} className="text-[#d97706] mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">3. Wrong Tool Selection</h4>
          <p className="text-[9px] text-slate-600 leading-tight">Uses valid tool for wrong task. Fix: Better descriptions.</p>
        </div>
      </div>
      <div className="bg-[#fffbeb] border border-[#d97706] p-3 rounded-lg shadow-sm flex items-start gap-2">
        <Code2 size={16} className="text-[#d97706] mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">4. Parameter Errors</h4>
          <p className="text-[9px] text-slate-600 leading-tight">Invalid JSON / Data types. Fix: JSON schemas.</p>
        </div>
      </div>
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-lg shadow-sm flex items-start gap-2">
        <ServerOff size={16} className="text-red-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">5. Real Tool Failures</h4>
          <p className="text-[9px] text-slate-600 leading-tight">API down/timeouts. Fix: Retries & graceful errors.</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg shadow-sm flex items-start gap-2">
        <History size={16} className="text-slate-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">6. Lost in Context</h4>
          <p className="text-[9px] text-slate-600 leading-tight">Forgets original goal. Fix: Summarize, pin goal.</p>
        </div>
      </div>
    </div>
    
    <div className="mt-3 bg-slate-50 border border-slate-300 p-3 rounded-lg shadow-sm flex items-start gap-2 w-[95%]">
      <FileWarning size={16} className="text-slate-500 mt-0.5 shrink-0" />
      <div>
        <h4 className="text-[11px] font-bold text-slate-800">7. Irrelevant Final Answer</h4>
        <p className="text-[9px] text-slate-600 leading-tight">Doesn't actually address the user's query. Fix: Relevance check before returning.</p>
      </div>
    </div>
  </div>
);

// Card 2: Infinite Loops & Circuit Breakers
const CardInfiniteLoops = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-[25%] -translate-x-1/2 text-xs font-bold text-[#ef4444] uppercase tracking-widest text-center">Problem: Infinite Loop</div>
    <div className="absolute top-[8%] left-[75%] -translate-x-1/2 text-xs font-bold text-[#31a67a] uppercase tracking-widest text-center">Solution: Circuit Breaker</div>
    <div className="absolute top-[15%] bottom-[5%] left-[50%] border-l-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      {/* Bad Loop */}
      <path d="M 25 45 Q 40 55 25 65" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
      <path d="M 25 65 Q 10 55 25 45" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
      
      {/* Good Loop */}
      <path d="M 75 35 Q 90 45 75 55" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 75 55 Q 60 45 75 35" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <Connection x1={75} y1={65} x2={75} y2={85} color="#ef4444" dashed={true} />
    </SvgCanvas>

    {/* Bad side */}
    <Node top={40} left={25} title="LLM Agent" icon={Brain} type="secondary" width="w-[100px]" />
    <Node top={70} left={25} title="Call: Weather" subtitle='"Need more detail"' icon={Wrench} type="warning" width="w-[100px]" />
    <Label top={55} left={25} text="Loops Forever" icon={Infinity} type="error" />

    {/* Good side */}
    <Node top={30} left={75} title="LLM Agent" icon={Brain} type="secondary" width="w-[100px]" />
    <Node top={60} left={75} title="Call: Weather" subtitle='"Need more detail"' icon={Wrench} type="warning" width="w-[100px]" />
    
    <div className="absolute top-[80%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-[#ffe4e6] border-2 border-[#f43f5e] p-2 rounded-xl text-center z-10 font-bold text-red-600 text-[10px] w-[140px] shadow-lg">
      <ShieldCheck size={16} className="mx-auto mb-1" />
      MAX_STEPS = 5<br/><span className="text-[9px] font-normal">Force Exit & Return Error</span>
    </div>
  </div>
);

// Card 3: Hallucinations & Param Errors (Self-Healing)
const CardSelfHealing = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={50} x2={40} y2={50} />
      <Connection x1={40} y1={50} x2={60} y2={50} />
      <Connection x1={60} y1={50} x2={85} y2={50} color="#31a67a" />
      
      {/* Feedback Loop */}
      <path d="M 60 40 Q 50 15 40 40" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-amber)" />
    </SvgCanvas>

    <Node top={50} left={20} title="LLM Agent" icon={Brain} type="primary" width="w-[100px]" />
    
    <Node top={50} left={40} title="Output JSON" subtitle='{"fn": "get_stock"}' icon={Code2} type="warning" width="w-[120px]" />
    
    <Node top={50} left={60} title="Validator Node" subtitle="Checks Schema & Names" icon={ShieldCheck} type="secondary" width="w-[140px]" />
    
    <Node top={50} left={85} title="Execute Tool" icon={PlayCircle} type="success" width="w-[100px]" />

    <Label top={20} left={50} text="Error: 'get_stock' doesn't exist. Try 'search_web'." type="warning" />
    <Label top={65} left={73} text="Valid! Pass." type="success" />

    <div className="absolute top-[85%] left-[50%] -translate-x-1/2 w-[85%] bg-[#f8fafc] border border-slate-300 p-2 rounded-lg text-[10px] text-center shadow-sm text-slate-600">
      <span className="font-bold text-slate-800">Self-Correction:</span> Instead of crashing, catch schema/name errors and feed them back to the LLM as an Observation. The LLM will usually fix its own mistake!
    </div>
  </div>
);

// Card 4: Real World API Failures
const CardAPIFailures = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={50} x2={50} y2={50} />
      
      {/* Crash connection */}
      <Connection x1={50} y1={50} x2={80} y2={50} color="#ef4444" dashed={true} />
      
      {/* Error Feedback */}
      <path d="M 50 65 Q 35 85 20 65" fill="none" stroke="#d97706" strokeWidth="2" markerEnd="url(#arrow-amber)" />
      
      {/* Fallback */}
      <Connection x1={50} y1={35} x2={80} y2={20} color="#31a67a" />
    </SvgCanvas>

    <Node top={50} left={20} title="LLM Agent" subtitle="Calls Weather API" icon={Brain} type="primary" width="w-[130px]" />
    
    <Node top={50} left={50} title="Tool Execution" subtitle="Try / Catch Block" icon={Wrench} type="secondary" width="w-[130px]" />
    
    <Node top={50} left={80} title="Primary API" subtitle="503 Server Offline" icon={ServerOff} type="error" width="w-[130px]" />

    <Node top={20} left={80} title="Fallback API" subtitle="Secondary Service" icon={Database} type="success" width="w-[130px]" />

    <Label top={40} left={65} text="CRASH!" type="error" />
    <Label top={25} left={65} text="Auto-failover" type="success" />
    <Label top={85} left={35} text="Or Return: 'Observation: API is down. Apologize to user.'" type="warning" />
  </div>
);

// Card 5: Lost in Context (Memory Management)
const CardContextManagement = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={25} y1={50} x2={50} y2={50} />
      <Connection x1={50} y1={50} x2={75} y2={50} />
    </SvgCanvas>

    {/* Left: Bloated History */}
    <div className="absolute top-[50%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[140px] flex flex-col gap-1 z-10">
      <div className="bg-slate-100 border border-slate-300 p-1 text-[8px] rounded opacity-50">User: find laptop</div>
      <div className="bg-slate-100 border border-slate-300 p-1 text-[8px] rounded opacity-60">Tool: search amazon</div>
      <div className="bg-slate-100 border border-slate-300 p-1 text-[8px] rounded opacity-70">Obs: found 10...</div>
      <div className="bg-slate-100 border border-slate-300 p-1 text-[8px] rounded opacity-80">Tool: search bestbuy</div>
      <div className="bg-slate-100 border border-slate-300 p-1 text-[8px] rounded opacity-90">Obs: found 5...</div>
      <div className="bg-red-50 border border-red-200 text-red-600 font-bold p-1 text-[9px] rounded text-center">Tokens Overflowing!</div>
    </div>

    <Node top={50} left={50} title="Summarizer" subtitle="Every 5 steps" icon={Scissors} type="primary" width="w-[110px]" />
    
    {/* Right: Clean Context */}
    <div className="absolute top-[50%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-[150px] bg-white border-2 border-[#31a67a] p-3 rounded-xl shadow-md z-10">
      <div className="text-[10px] font-bold text-[#1f7351] border-b border-[#a6f0d4] pb-1 mb-1 flex items-center gap-1"><Target size={12}/> PINNED GOAL</div>
      <div className="text-[9px] text-slate-700 mb-2">Find best laptop</div>
      
      <div className="text-[10px] font-bold text-[#1f7351] border-b border-[#a6f0d4] pb-1 mb-1">SUMMARY</div>
      <div className="text-[9px] text-slate-700">Checked Amazon & BestBuy. Comparing prices now.</div>
    </div>

    <Label top={20} left={50} text="Failure 6: Agents forget the goal in long chats" icon={AlertTriangle} type="warning" />
  </div>
);


// --- MAIN APP LAYOUT ---
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
             Visual Dev Guides <span className="text-slate-400 font-normal">| Agent Failures</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: How to build robust, production-ready AI agents by anticipating, catching, and recovering from inevitable failures.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <ShieldCheck size={16} /> Error Recovery
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. The 7 Agent Failure Modes" tall={true}>
           <CardFailureCategories />
         </Card>

         <Card title="02. Infinite Loops & Circuit Breakers" tall={true}>
           <CardInfiniteLoops />
         </Card>

         <div className="lg:col-span-2">
            <Card title="03. Hallucinations & Param Errors (Self-Healing Loop)" tall={false}>
                <CardSelfHealing />
            </Card>
         </div>

         <Card title="04. Real World API Failures">
            <CardAPIFailures />
         </Card>

         <Card title="05. Lost in Context (Memory Overflow)">
            <CardContextManagement />
        </Card>
      </main>

    </div>
  );
}