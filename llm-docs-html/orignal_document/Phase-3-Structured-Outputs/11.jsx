import React from 'react';
import { 
  Database, Brain, MessageSquare, FileText, 
  Search, Cpu, Layers, AlertTriangle, 
  CheckCircle2, XCircle, RotateCcw, 
  ShieldAlert, Code2, TerminalSquare, 
  TableProperties, ArrowRightLeft, 
  Workflow, PlayCircle, ShieldCheck,
  Filter, Zap, User, Bot, ListTree,
  MessageCircleQuestion, HardDrive, RefreshCcw,
  Sparkles
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

// Card 1: Smart Schema Retrieval & Specification
const CardSchemaRetrieval = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={15} y1={50} x2={35} y2={50} />
      <Connection x1={35} y1={50} x2={60} y2={50} />
      <Connection x1={60} y1={50} x2={85} y2={50} />
    </SvgCanvas>

    <Node top={50} left={15} title="100+ Tables" subtitle="Full Enterprise DB" icon={HardDrive} type="secondary" width="w-[110px]" />
    <Node top={50} left={35} title="Vector Search" subtitle="Find table descriptions" icon={Search} type="primary" width="w-[120px]" />
    
    {/* Highlighted Schema Block */}
    <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] text-slate-300 p-3 rounded-xl border border-slate-700 shadow-lg text-[9px] font-mono w-[150px] z-10">
      <div className="text-[#41d8a0] font-bold border-b border-slate-600 pb-1 mb-1">TABLE: orders</div>
      <div>- <span className="text-white">amount</span> <span className="text-slate-500">(DECIMAL)</span></div>
      <div>- <span className="text-white">customer_id</span> <span className="text-slate-500">(INT)</span></div>
      <div className="text-slate-500 italic mt-1">// other columns omitted</div>
    </div>
    
    <Node top={50} left={85} title="Focused Context" subtitle="Fits perfectly in LLM window" icon={CheckCircle2} type="success" width="w-[120px]" />

    <Label top={20} left={50} text="Improvement 1 & 2: Never pass the whole DB schema!" icon={Filter} />
  </div>
);

// Card 2: Ambiguity Resolution
const CardAmbiguity = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={25} x2={50} y2={25} />
      <Connection x1={50} y1={25} x2={80} y2={25} dashed={true} color="#ef4444" />
      
      {/* Down to clarification */}
      <Connection x1={50} y1={25} x2={50} y2={55} />
      <Connection x1={50} y1={55} x2={20} y2={55} color="#d97706" />
      <Connection x1={20} y1={55} x2={20} y2={85} />
      <Connection x1={20} y1={85} x2={80} y2={85} color="#31a67a" />
    </SvgCanvas>

    <Node top={25} left={20} title='User: "Top customers"' icon={User} type="secondary" width="w-[140px]" />
    <Node top={25} left={50} title="Ambiguity Detector" subtitle='What does "Top" mean?' icon={MessageCircleQuestion} type="warning" width="w-[140px]" />
    <Node top={25} left={80} title="Hallucinated SQL" subtitle="Assumes top = recent" icon={XCircle} type="error" width="w-[130px]" />

    <Node top={55} left={20} title="Bot Asks User" subtitle='"Do you mean by Revenue or Order Count?"' icon={Bot} type="primary" width="w-[140px]" />
    <Node top={85} left={20} title='User: "By Revenue"' icon={User} type="secondary" width="w-[140px]" />
    <Node top={85} left={80} title="Accurate SQL" subtitle="ORDER BY SUM(amount)" icon={CheckCircle2} type="success" width="w-[140px]" />

    <Label top={70} left={50} text="Improvement 5: Human in the loop" />
  </div>
);

// Card 3: Query Validation & Retry Loop (Self-Healing)
const CardRetryLoop = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Main Flow */}
      <Connection x1={20} y1={50} x2={40} y2={50} />
      <Connection x1={40} y1={50} x2={60} y2={50} />
      <Connection x1={60} y1={50} x2={85} y2={50} />
      
      {/* Validation Failure Loop */}
      <path d="M 60 40 Q 50 15 40 40" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-red)" />
      
      {/* Execution Failure Loop */}
      <path d="M 85 40 Q 60 5 40 40" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-amber)" />
    </SvgCanvas>

    <Node top={50} left={20} title="Prompt" subtitle="Schema + Question" icon={FileText} type="secondary" width="w-[100px]" />
    
    <Node top={50} left={40} title="LLM Gen SQL" subtitle="Attempt 1" icon={Code2} type="primary" width="w-[110px]" />
    
    <Node top={50} left={60} title="Validator" subtitle="Checks Syntax & Safety" icon={ShieldCheck} type="secondary" width="w-[130px]" />
    
    <Node top={50} left={85} title="DB Execution" subtitle="Run query" icon={PlayCircle} type="success" width="w-[110px]" />

    {/* Labels for loops */}
    <Label top={20} left={50} text="Syntax Error: 'Unknown Table' -> Feed back to LLM" type="error" />
    <Label top={10} left={65} text="Runtime Error: 'Type Mismatch' -> Feed back to LLM" type="warning" />
    
    <div className="absolute top-[85%] left-[50%] -translate-x-1/2 w-[80%] bg-[#f8fafc] border border-slate-300 p-2 rounded-lg text-[10px] text-center shadow-sm text-slate-600">
      <span className="font-bold text-slate-800">Improvement 4:</span> Never fail on the first error. Catch the error string, append it to the prompt ("Fix this error: ..."), and try again (max 3 retries).
    </div>
  </div>
);

// Card 4: Post-Processing & Formatting
const CardPostProcessing = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={50} x2={45} y2={50} />
      <Connection x1={45} y1={50} x2={75} y2={50} />
    </SvgCanvas>

    <Node top={50} left={20} title="Raw DB Result" subtitle="[( 'Americas', 5200000 )]" icon={TableProperties} type="secondary" width="w-[150px]" />
    
    <Node top={50} left={45} title="Formatter Logic" subtitle="Add currency, format decimals" icon={Sparkles} type="primary" width="w-[140px]" />
    
    <Node top={50} left={75} title="Final Output" subtitle='"Americas: $5.2M"' icon={MessageSquare} type="success" width="w-[140px]" />

    <Label top={25} left={50} text="Improvement 7: Translate raw arrays back to Natural Language" />
  </div>
);

// Card 5: Full Advanced NL-to-SQL Pipeline
const CardFullPipeline = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Row 1: Left to Right */}
      <Connection x1={15} y1={15} x2={40} y2={15} />
      <Connection x1={40} y1={15} x2={65} y2={15} />
      <Connection x1={65} y1={15} x2={85} y2={15} />
      
      {/* Down to Row 2 */}
      <Connection x1={85} y1={15} x2={85} y2={45} arrow={false} />
      <Connection x1={85} y1={45} x2={75} y2={45} />
      
      {/* Row 2: Right to Left */}
      <Connection x1={75} y1={45} x2={50} y2={45} />
      <Connection x1={50} y1={45} x2={25} y2={45} />
      
      {/* Down to Row 3 */}
      <Connection x1={25} y1={45} x2={25} y2={75} arrow={false} />
      <Connection x1={25} y1={75} x2={35} y2={75} />
      
      {/* Row 3: Left to Right */}
      <Connection x1={35} y1={75} x2={60} y2={75} />
      <Connection x1={60} y1={75} x2={85} y2={75} />
    </SvgCanvas>

    {/* ROW 1 */}
    <Node top={15} left={15} title="1. User Question" icon={User} type="secondary" width="w-[120px]" />
    <Node top={15} left={40} title="2. Cache Check" subtitle="Skip if seen before" icon={RefreshCcw} type="dashed" width="w-[120px]" />
    <Node top={15} left={65} title="3. Retrieve Schema" subtitle="Vector search tables" icon={Search} type="primary" width="w-[120px]" />
    <Node top={15} left={85} title="4. Resolve Ambiguity" subtitle="Ask user if needed" icon={MessageCircleQuestion} type="warning" width="w-[130px]" />

    {/* ROW 2 */}
    <Node top={45} left={75} title="5. Build Prompt" subtitle="Schema + Domain Examples" icon={FileText} type="secondary" width="w-[150px]" />
    <Node top={45} left={50} title="6. Generate SQL" icon={Brain} type="primary" width="w-[120px]" />
    <Node top={45} left={25} title="7. Explain to User" subtitle="(Optional) Confirm Logic" icon={ListTree} type="dashed" width="w-[140px]" />

    {/* ROW 3 */}
    <Node top={75} left={35} title="8. Validate & Retry" subtitle="Syntax & Safety Loop" icon={ShieldCheck} type="warning" width="w-[140px]" />
    <Node top={75} left={60} title="9. Execute DB" subtitle="Run finalized query" icon={Database} type="primary" width="w-[120px]" />
    <Node top={75} left={85} title="10. Format Output" subtitle="To Natural Language" icon={CheckCircle2} type="success" width="w-[120px]" />

    <div className="absolute top-[92%] left-[50%] -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
      The Enterprise NL-to-SQL Architecture
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| Improving NL-to-SQL</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Transitioning from basic LLM SQL generation to robust, self-healing, enterprise-grade data pipelines.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Workflow size={16} /> Advanced Pipelines
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. Smart Schema Retrieval">
           <CardSchemaRetrieval />
         </Card>

         <Card title="02. Ambiguity Resolution (Human-in-Loop)">
           <CardAmbiguity />
         </Card>

         <Card title="03. The Self-Healing Validation Loop" tall={true}>
           <CardRetryLoop />
         </Card>

         <Card title="04. Formatting & Post-Processing" tall={true}>
            <CardPostProcessing />
        </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="05. The Complete Advanced Integration" xTall={true}>
            <CardFullPipeline />
        </Card>
      </div>

    </div>
  );
}