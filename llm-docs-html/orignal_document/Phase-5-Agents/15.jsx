import React from 'react';
import { 
  Brain, MessageSquare, FileText, 
  Search, Cpu, Layers, AlertTriangle, 
  CheckCircle2, XCircle, RotateCcw, 
  TerminalSquare, Workflow, Filter, Zap, 
  User, Bot, Sparkles, Target, Scale, 
  ArrowDown, Activity, BookOpen, AlertCircle,
  Eye, Wrench, RefreshCw, ShoppingCart,
  Code2, GitMerge, ArrowRightLeft
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

// Card 1: The ReAct Loop (Reason + Act)
const CardTheLoop = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={25} x2={45} y2={25} />
      
      {/* The Core Loop */}
      <Connection x1={50} y1={35} x2={80} y2={50} />
      <Connection x1={80} y1={60} x2={50} y2={75} />
      <Connection x1={50} y1={75} x2={50} y2={35} color="#31a67a" dashed={true} />
      
      {/* Exit to Final Answer */}
      <Connection x1={40} y1={25} x2={20} y2={75} color="#31a67a" />
    </SvgCanvas>

    <Node top={25} left={20} title='User Task' subtitle='"Weather tomorrow?"' icon={User} type="secondary" width="w-[120px]" />
    
    <Node top={25} left={50} title="1. THOUGHT (Reason)" subtitle='"I need to call the API..."' icon={Brain} type="primary" width="w-[150px]" />
    
    <Node top={55} left={80} title="2. ACTION (Tool)" subtitle='get_weather("NYC")' icon={Wrench} type="warning" width="w-[130px]" />
    
    <Node top={85} left={50} title="3. OBSERVATION" subtitle='"High 72, Sunny"' icon={Eye} type="secondary" width="w-[140px]" />
    
    <Node top={85} left={20} title="FINAL ANSWER" subtitle='"Tomorrow is sunny!"' icon={CheckCircle2} type="success" width="w-[130px]" />

    <Label top={55} left={50} text="REPEAT UNTIL DONE" icon={RefreshCw} />
  </div>
);

// Card 2: Simple FC vs ReAct
const CardComparison = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Simple Function Calling</div>
    <div className="absolute top-[48%] left-4 text-xs font-bold text-[#31a67a] uppercase tracking-widest">ReAct (Iterative)</div>
    <div className="absolute top-[42%] left-[5%] right-[5%] border-t-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      {/* Simple FC */}
      <Connection x1={15} y1={25} x2={40} y2={25} />
      <Connection x1={40} y1={25} x2={65} y2={25} />
      <Connection x1={65} y1={25} x2={85} y2={25} />
      
      {/* ReAct */}
      <Connection x1={15} y1={75} x2={35} y2={75} />
      <path d="M 35 70 C 50 50, 70 50, 85 70" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 85 80 C 70 100, 50 100, 35 80" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <Connection x1={35} y1={75} x2={15} y2={75} color="#31a67a" />
    </SvgCanvas>

    {/* Simple */}
    <Node top={25} left={15} title="Query" icon={MessageSquare} type="secondary" width="w-[90px]" />
    <Node top={25} left={40} title="LLM Calls Tool" icon={Brain} type="primary" width="w-[120px]" />
    <Node top={25} left={65} title="Tool Executes" icon={Wrench} type="secondary" width="w-[120px]" />
    <Node top={25} left={85} title="Done" subtitle="Fails if multi-step" icon={XCircle} type="error" width="w-[90px]" />

    {/* ReAct */}
    <Node top={75} left={15} title="Query / Answer" icon={ArrowRightLeft} type="success" width="w-[120px]" />
    <Node top={75} left={35} title="LLM Reasons" subtitle="Plans next move" icon={Brain} type="primary" width="w-[120px]" />
    <Node top={75} left={85} title="Multiple Tools" subtitle="Executes & Returns" icon={Layers} type="warning" width="w-[130px]" />
    
    <Label top={58} left={60} text="Act 1, 2, 3..." />
    <Label top={92} left={60} text="Observe 1, 2, 3..." />
  </div>
);

// Card 3: Real ReAct Agent Example (Shopping)
const CardAgentExample = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Row 1 -> Row 2 */}
      <Connection x1={20} y1={25} x2={50} y2={25} />
      <Connection x1={50} y1={25} x2={80} y2={25} />
      <Connection x1={80} y1={25} x2={80} y2={45} arrow={false} />
      <Connection x1={80} y1={45} x2={20} y2={45} arrow={false} />
      <Connection x1={20} y1={45} x2={20} y2={55} />
      
      {/* Row 2 -> Row 3 */}
      <Connection x1={20} y1={55} x2={50} y2={55} />
      <Connection x1={50} y1={55} x2={80} y2={55} />
      <Connection x1={80} y1={55} x2={80} y2={75} arrow={false} />
      <Connection x1={80} y1={75} x2={20} y2={75} arrow={false} />
      <Connection x1={20} y1={75} x2={20} y2={85} />

      {/* Row 3 -> Final */}
      <Connection x1={20} y1={85} x2={50} y2={85} />
      <Connection x1={50} y1={85} x2={80} y2={85} />
    </SvgCanvas>

    <div className="absolute top-[8%] left-[50%] -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Task: "Is XPS 13 cheaper on Amazon or BestBuy? Add to cart."</div>

    {/* ROW 1: Amazon */}
    <Node top={25} left={20} title="1. THOUGHT" subtitle='"Find Amazon price"' icon={Brain} type="primary" width="w-[130px]" />
    <Node top={25} left={50} title="2. ACTION" subtitle="search_amazon()" icon={Search} type="warning" width="w-[130px]" />
    <Node top={25} left={80} title="3. OBSERVE" subtitle='"$999 on Amazon"' icon={Eye} type="secondary" width="w-[130px]" />

    {/* ROW 2: BestBuy */}
    <Node top={55} left={20} title="4. THOUGHT" subtitle='"Now find BestBuy"' icon={Brain} type="primary" width="w-[130px]" />
    <Node top={55} left={50} title="5. ACTION" subtitle="search_bestbuy()" icon={Search} type="warning" width="w-[130px]" />
    <Node top={55} left={80} title="6. OBSERVE" subtitle='"$899 on BestBuy"' icon={Eye} type="secondary" width="w-[130px]" />

    {/* ROW 3: Cart & Final */}
    <Node top={85} left={20} title="7. THOUGHT" subtitle='"BestBuy is cheaper"' icon={Brain} type="primary" width="w-[130px]" />
    <Node top={85} left={50} title="8. ACTION" subtitle="add_to_cart(bestbuy)" icon={ShoppingCart} type="warning" width="w-[130px]" />
    <Node top={85} left={80} title="FINAL ANSWER" subtitle='"Added to BestBuy!"' icon={CheckCircle2} type="success" width="w-[130px]" />
  </div>
);

// Card 4: Prompt Template Structure
const CardTemplate = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center">
    <div className="w-[90%] bg-[#1e293b] rounded-xl p-4 shadow-lg border border-slate-700 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
        <Code2 size={16} className="text-[#41d8a0]" />
        <span className="text-white font-bold text-xs">ReAct Prompt Template</span>
      </div>

      {/* Code Block */}
      <pre className="text-[10px] sm:text-xs font-mono text-slate-300 leading-relaxed">
<span className="text-slate-400">You are an AI that solves problems step-by-step.</span><br/><br/>
<span className="text-purple-300">Available tools:</span> <span className="text-yellow-300">{"{tools_list}"}</span><br/><br/>
<span className="text-slate-400">Use this exact format:</span><br/>
<span className="text-blue-400 font-bold">Thought:</span> [What do you need to do?]<br/>
<span className="text-blue-400 font-bold">Action:</span> [Tool name]<br/>
<span className="text-blue-400 font-bold">Action Input:</span> [JSON parameters]<br/>
<span className="text-blue-400 font-bold">Observation:</span> [System will provide this]<br/>
<span className="text-slate-500 italic">... (repeat as needed)</span><br/><br/>
<span className="text-green-400 font-bold">Final Answer:</span> [Your actual response to user]<br/><br/>
<span className="text-purple-300">Begin! User:</span> <span className="text-yellow-300">{"{user_query}"}</span>
      </pre>

      {/* Pointers */}
      <div className="absolute bottom-[40px] right-4 bg-slate-800 text-slate-200 text-[9px] px-2 py-1 rounded border border-slate-600 flex items-center gap-1">
        <AlertTriangle size={12} className="text-amber-500"/> Forces strict parsing
      </div>
    </div>
  </div>
);

// Card 5: Pitfalls & Best Practices
const CardBestPractices = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
    
    <div className="grid grid-cols-2 gap-4 w-[90%] z-10">
      
      {/* Bad Practice 1 */}
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#fda4af] pb-1">
          <XCircle size={14} className="text-red-500"/> Bad: Infinite Loops
        </div>
        <div className="text-[10px] text-slate-700 leading-tight bg-white p-1 rounded mt-1">
          LLM keeps calling wrong tools over and over.
        </div>
        <div className="text-[9px] text-red-600 mt-1 font-bold">Fix: Set max_steps = 10.</div>
      </div>

      {/* Good Practice 1 */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#a6f0d4] pb-1">
          <CheckCircle2 size={14} className="text-[#31a67a]"/> Good: Explicit Thoughts
        </div>
        <div className="text-[10px] text-slate-700 leading-tight bg-white p-1 rounded mt-1">
          "I need X, then I will do Y."
        </div>
        <div className="text-[9px] text-green-700 mt-1 font-bold">Writing it out helps LLM reasoning.</div>
      </div>

      {/* Bad Practice 2 */}
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#fda4af] pb-1">
          <XCircle size={14} className="text-red-500"/> Bad: Unnecessary Tools
        </div>
        <div className="text-[10px] text-slate-700 leading-tight bg-white p-1 rounded mt-1">
          Calling `calculator` for 2+2.
        </div>
        <div className="text-[9px] text-red-600 mt-1 font-bold">Fix: Teach LLM what it can do itself.</div>
      </div>

      {/* Good Practice 2 */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#a6f0d4] pb-1">
          <CheckCircle2 size={14} className="text-[#31a67a]"/> Good: Error Recovery
        </div>
        <div className="text-[10px] text-slate-700 leading-tight bg-white p-1 rounded mt-1">
          Observation: "Tool failed." -{'>'} LLM tries again.
        </div>
        <div className="text-[9px] text-green-700 mt-1 font-bold">Feed errors back as Observations.</div>
      </div>

    </div>

    <div className="bg-slate-800 text-white px-6 py-2 rounded-lg text-xs w-[90%] text-center shadow-md flex items-center justify-center gap-2">
      <GitMerge size={16} className="text-[#41d8a0]" /> ReAct makes Agents autonomous problem solvers.
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| ReAct Agents</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Upgrading from simple function calling to autonomous Agents that Reason, Act, and Observe in a continuous loop.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Workflow size={16} /> Agent Patterns
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. The ReAct Loop">
           <CardTheLoop />
         </Card>

         <Card title="02. Simple FC vs ReAct (Iterative)">
           <CardComparison />
         </Card>

         <div className="lg:col-span-2">
            <Card title="03. Real-World Example: Multi-Step Shopping Agent" xTall={true}>
                <CardAgentExample />
            </Card>
         </div>

         <Card title="04. The Core Prompt Template" tall={false}>
            <CardTemplate />
         </Card>

         <Card title="05. Pitfalls & Best Practices" tall={false}>
            <CardBestPractices />
        </Card>
      </main>

    </div>
  );
}