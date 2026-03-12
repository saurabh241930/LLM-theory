import React from 'react';
import { 
  Brain, MessageSquare, FileText, 
  Search, Cpu, AlertTriangle, 
  CheckCircle2, XCircle, FileQuestion,
  Combine, Sparkles, Zap, 
  ArrowDownUp, Target, HelpCircle, 
  Wrench, CloudRain, Code2, ServerCog, 
  Mail, Box, RotateCcw, TerminalSquare,
  Network
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
  line: "#64748b"
};

// --- CORE UI COMPONENTS ---

const Card = ({ title, children, tall = false, xTall = false }) => (
  <div className={`relative ${THEME.cardBg} rounded-2xl shadow-sm border ${THEME.cardBorder} overflow-hidden flex flex-col items-center w-full ${xTall ? 'h-[650px]' : tall ? 'h-[500px]' : 'h-[400px]'} mb-6 hover:shadow-md transition-shadow`}>
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
    </defs>
    {children}
  </svg>
);

const Connection = ({ x1, y1, x2, y2, dashed = false, arrow = true, color = THEME.line }) => {
  let marker = "none";
  if (arrow) {
    if (color === '#ef4444') marker = "url(#arrow-red)";
    else if (color === '#31a67a') marker = "url(#arrow-green)";
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

// Card 1: What is Function Calling?
const CardWhatIsFC = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Without Functions (Isolated)</div>
    <div className="absolute top-[48%] left-4 text-xs font-bold text-[#31a67a] uppercase tracking-widest">With Functions (Connected)</div>
    <div className="absolute top-[42%] left-[5%] right-[5%] border-t-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      {/* Top Flow */}
      <Connection x1={20} y1={25} x2={45} y2={25} />
      <Connection x1={45} y1={25} x2={75} y2={25} color="#ef4444" />
      
      {/* Bottom Flow */}
      <Connection x1={15} y1={75} x2={35} y2={75} />
      <Connection x1={35} y1={75} x2={55} y2={75} />
      <Connection x1={55} y1={75} x2={80} y2={75} color="#31a67a" />
      
      {/* API Loop */}
      <path d="M 35 65 Q 45 50 55 65" fill="none" stroke="#31a67a" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />
    </SvgCanvas>

    {/* Without FC */}
    <Node top={25} left={20} title='"Weather in NYC?"' icon={CloudRain} type="secondary" width="w-[120px]" />
    <Node top={25} left={45} title="LLM (Isolated)" subtitle="No live data access" icon={Brain} type="secondary" width="w-[120px]" />
    <Node top={25} left={75} title="Failure" subtitle='"I do not know..."' icon={XCircle} type="error" width="w-[120px]" />

    {/* With FC */}
    <Node top={75} left={15} title='"Weather in NYC?"' icon={CloudRain} type="secondary" width="w-[110px]" />
    <Node top={75} left={35} title="LLM decides to Call" subtitle='{fn: "get_weather"}' icon={TerminalSquare} type="primary" width="w-[120px]" />
    <Node top={52} left={45} title="Weather API" subtitle="Returns: '72°F'" icon={ServerCog} type="dashed" width="w-[110px]" />
    <Node top={75} left={55} title="LLM gets result" subtitle="Reads 72°F" icon={Brain} type="primary" width="w-[110px]" />
    <Node top={75} left={80} title="Final Answer" subtitle='"It is 72°F today!"' icon={CheckCircle2} type="success" width="w-[120px]" />
  </div>
);

// Card 2: The Schema (JSON structure)
const CardSchema = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center">
    <div className="w-[90%] bg-[#1e293b] rounded-xl p-4 shadow-lg border border-slate-700 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
        <Code2 size={16} className="text-[#41d8a0]" />
        <span className="text-white font-bold text-xs">Function Schema Definition</span>
        <span className="ml-auto text-slate-500 text-[9px] uppercase tracking-wider">Required for LLM</span>
      </div>

      {/* Code Block */}
      <pre className="text-[10px] sm:text-xs font-mono text-slate-300 leading-relaxed">
<span className="text-yellow-300">{"{"}</span><br/>
&nbsp;&nbsp;<span className="text-blue-400">"name"</span>: <span className="text-green-400">"get_weather"</span>,<br/>
&nbsp;&nbsp;<span className="text-blue-400">"description"</span>: <span className="text-green-400">"Get current weather for a city"</span>,<br/>
&nbsp;&nbsp;<span className="text-blue-400">"parameters"</span>: <span className="text-purple-300">{"{"}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"type"</span>: <span className="text-green-400">"object"</span>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"properties"</span>: <span className="text-yellow-300">{"{"}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"city"</span>: <span className="text-purple-300">{"{"}</span> <span className="text-blue-400">"type"</span>: <span className="text-green-400">"string"</span> <span className="text-purple-300">{"}"}</span>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"units"</span>: <span className="text-purple-300">{"{"}</span> <span className="text-blue-400">"enum"</span>: [<span className="text-green-400">"celsius"</span>, <span className="text-green-400">"fahrenheit"</span>] <span className="text-purple-300">{"}"}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">{"}"}</span>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">"required"</span>: [<span className="text-green-400">"city"</span>] <span className="text-slate-500">// Must be provided!</span><br/>
&nbsp;&nbsp;<span className="text-purple-300">{"}"}</span><br/>
<span className="text-yellow-300">{"}"}</span>
      </pre>

      {/* Pointers */}
      <div className="absolute top-[35px] right-4 bg-slate-800 text-slate-200 text-[9px] px-2 py-1 rounded border border-slate-600">
        Tell LLM <b>what</b> it does
      </div>
      <div className="absolute bottom-[25px] right-4 bg-slate-800 text-slate-200 text-[9px] px-2 py-1 rounded border border-slate-600">
        Tell LLM <b>what it needs</b>
      </div>
    </div>
  </div>
);

// Card 3: The Function Calling Loop
const CardTheLoop = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Cycle arrows */}
      <Connection x1={20} y1={25} x2={45} y2={25} />
      <Connection x1={45} y1={25} x2={75} y2={25} />
      
      <Connection x1={75} y1={25} x2={75} y2={75} />
      
      <Connection x1={75} y1={75} x2={45} y2={75} />
      <Connection x1={45} y1={75} x2={20} y2={75} />
    </SvgCanvas>

    <Node top={25} left={20} title="1. User Query" subtitle='"Weather in NYC?"' icon={MessageSquare} type="secondary" width="w-[120px]" />
    
    <Node top={25} left={45} title="2. LLM + Schema" subtitle="Reads available tools" icon={Brain} type="primary" width="w-[120px]" />
    
    <Node top={25} left={75} title="3. Tool Call Output" subtitle='{fn: "weather", city: "NYC"}' icon={TerminalSquare} type="warning" width="w-[140px]" />
    
    <Node top={75} left={75} title="4. Execute API" subtitle="System calls the actual API" icon={ServerCog} type="secondary" width="w-[140px]" />
    
    <Node top={75} left={45} title="5. Result to LLM" subtitle="Feeds '72°F' back into context" icon={RotateCcw} type="primary" width="w-[140px]" />
    
    <Node top={75} left={20} title="6. Final Answer" subtitle='"It is 72°F in NYC"' icon={CheckCircle2} type="success" width="w-[120px]" />
    
    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm z-20">
      The Loop
    </div>
  </div>
);

// Card 4: Real-World Example (Customer Support Agent)
const CardAgentExample = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={20} x2={50} y2={20} />
      
      {/* LLM to Tools */}
      <Connection x1={50} y1={30} x2={80} y2={20} dashed={true} />
      <Connection x1={50} y1={35} x2={80} y2={45} dashed={true} />
      <Connection x1={50} y1={40} x2={80} y2={70} dashed={true} />
      <Connection x1={50} y1={45} x2={80} y2={95} dashed={true} />
      
      {/* Tools back to LLM */}
      <path d="M 80 20 Q 65 25 50 30" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 80 45 Q 65 40 50 35" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 80 70 Q 65 55 50 40" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 80 95 Q 65 70 50 45" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />

      {/* Final Output */}
      <Connection x1={50} y1={80} x2={20} y2={80} color="#31a67a" />
    </SvgCanvas>

    <Node top={20} left={20} title='User' subtitle='"I want to return #123"' icon={MessageSquare} type="secondary" width="w-[110px]" />
    
    <Node top={50} left={50} title="Agent Orchestrator" subtitle="Reasons & loops 4 times" icon={Network} type="primary" width="w-[140px] h-[80px]" />
    
    <Node top={20} left={80} title="1. query_order()" subtitle="Result: Laptop, $1200" icon={Search} type="secondary" width="w-[130px]" />
    <Node top={45} left={80} title="2. check_policy()" subtitle="Result: Allowed (30 days)" icon={FileText} type="secondary" width="w-[130px]" />
    <Node top={70} left={80} title="3. init_return()" subtitle="Result: RET-999 generated" icon={Box} type="secondary" width="w-[130px]" />
    <Node top={95} left={80} title="4. send_email()" subtitle="Result: Success" icon={Mail} type="secondary" width="w-[130px]" />

    <Node top={80} left={20} title="Final Reply" subtitle='"Approved! Email sent."' icon={CheckCircle2} type="success" width="w-[120px]" />
  </div>
);

// Card 5: Pitfalls & Best Practices
const CardBestPractices = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
    
    <div className="grid grid-cols-2 gap-4 w-[90%] z-10">
      
      {/* Bad Practice 1 */}
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#fda4af] pb-1">
          <XCircle size={14} className="text-red-500"/> Bad: Vague Descriptions
        </div>
        <div className="text-[10px] text-slate-700 leading-tight font-mono bg-white p-1 rounded mt-1">
          "description": "Get data"
        </div>
        <div className="text-[9px] text-red-600 mt-1">LLM won't know when to use this!</div>
      </div>

      {/* Good Practice 1 */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#a6f0d4] pb-1">
          <CheckCircle2 size={14} className="text-[#31a67a]"/> Good: Specific Intents
        </div>
        <div className="text-[10px] text-slate-700 leading-tight font-mono bg-white p-1 rounded mt-1">
          "desc": "Get current weather conditions..."
        </div>
        <div className="text-[9px] text-green-700 mt-1">Guides the LLM's reasoning precisely.</div>
      </div>

      {/* Bad Practice 2 */}
      <div className="bg-[#ffe4e6] border border-[#f43f5e] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#fda4af] pb-1">
          <XCircle size={14} className="text-red-500"/> Bad: Missing Required
        </div>
        <div className="text-[10px] text-slate-700 leading-tight font-mono bg-white p-1 rounded mt-1">
          No "required" array defined.
        </div>
        <div className="text-[9px] text-red-600 mt-1">LLM might call API without a city!</div>
      </div>

      {/* Good Practice 2 */}
      <div className="bg-[#e6fcf5] border border-[#31a67a] p-3 rounded-xl shadow-sm">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-2 mb-1 border-b border-[#a6f0d4] pb-1">
          <CheckCircle2 size={14} className="text-[#31a67a]"/> Good: Enforce Schema
        </div>
        <div className="text-[10px] text-slate-700 leading-tight font-mono bg-white p-1 rounded mt-1">
          "required": ["city", "units"]
        </div>
        <div className="text-[9px] text-green-700 mt-1">Guarantees API gets needed arguments.</div>
      </div>

    </div>

    <div className="bg-slate-800 text-white px-6 py-2 rounded-lg text-xs w-[90%] text-center shadow-md">
      <span className="font-bold text-[#41d8a0]">Golden Rule:</span> Never expose schema details to the end-user. Handle failures (like API downtime) gracefully in your code.
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| Function Calling</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Giving LLMs the ability to trigger external APIs, query databases, and act as autonomous agents using strict JSON schemas.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Wrench size={16} /> Tool Use & Agents
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. What is Function Calling?">
           <CardWhatIsFC />
         </Card>

         <Card title="02. The Function Schema (JSON)">
           <CardSchema />
         </Card>

         <Card title="03. The Function Calling Loop" tall={true}>
           <CardTheLoop />
         </Card>

         <Card title="04. Real-World Agent Example" tall={true}>
            <CardAgentExample />
        </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="05. Common Pitfalls & Best Practices" tall={false}>
            <CardBestPractices />
        </Card>
      </div>

    </div>
  );
}