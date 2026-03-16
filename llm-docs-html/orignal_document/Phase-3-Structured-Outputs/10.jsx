import React from 'react';
import { 
  Database, Brain, MessageSquare, FileText, 
  Search, Cpu, Layers, AlertTriangle, 
  CheckCircle2, XCircle, RotateCcw, 
  ShieldAlert, Code2, TerminalSquare, 
  TableProperties, ArrowRightLeft, 
  Workflow, PlayCircle, ShieldCheck
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

// Card 1: What is NL-to-SQL?
const CardWhatIsNL2SQL = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={50} x2={45} y2={50} />
      <Connection x1={45} y1={50} x2={75} y2={50} />
      
      {/* Return flow visual */}
      <path d="M 75 65 Q 47.5 85 20 65" fill="none" stroke="#31a67a" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />
    </SvgCanvas>

    <Node top={50} left={20} title='User: "Revenue in Q4?"' icon={MessageSquare} type="secondary" width="w-[140px]" />
    
    <Node top={50} left={47.5} title="LLM Translator" subtitle="Converts English to Code" icon={Brain} type="primary" width="w-[140px]" />
    
    <Node top={50} left={80} title="SQL Database" subtitle="Executes Query" icon={Database} type="secondary" width="w-[130px]" />

    <Label top={40} left={32} text="Natural Language" />
    <Label top={40} left={65} text="SELECT SUM(rev)..." icon={Code2} />
    <Label top={85} left={47.5} text="Returns Data: '$2.1M'" icon={CheckCircle2} type="success" />
  </div>
);

// Card 2: The Full NL-to-SQL Pipeline
const CardPipeline = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Top Row */}
      <Connection x1={15} y1={25} x2={45} y2={25} />
      <Connection x1={45} y1={25} x2={75} y2={25} />
      <Connection x1={75} y1={25} x2={85} y2={25} arrow={false} />
      
      {/* Down connecting line */}
      <Connection x1={85} y1={25} x2={85} y2={75} arrow={false} />
      <Connection x1={85} y1={75} x2={75} y2={75} />
      
      {/* Bottom Row */}
      <Connection x1={75} y1={75} x2={45} y2={75} />
      <Connection x1={45} y1={75} x2={15} y2={75} />
    </SvgCanvas>

    {/* Row 1 */}
    <Node top={25} left={15} title="1. User Question" subtitle='"Orders in March?"' icon={MessageSquare} type="secondary" width="w-[120px]" />
    <Node top={25} left={45} title="2. Retrieve Schema" subtitle="Find relevant tables" icon={Search} type="primary" width="w-[130px]" />
    <Node top={25} left={75} title="3. Build Prompt" subtitle="Schema + Examples" icon={FileText} type="secondary" width="w-[130px]" />

    {/* Row 2 */}
    <Node top={75} left={75} title="4. LLM Generates SQL" subtitle="SELECT COUNT(*)..." icon={Code2} type="primary" width="w-[140px]" />
    <Node top={75} left={45} title="5. Validate & Execute" subtitle="Check safety, run on DB" icon={PlayCircle} type="secondary" width="w-[140px]" />
    <Node top={75} left={15} title="6. Format Result" subtitle='"42 orders"' icon={CheckCircle2} type="success" width="w-[120px]" />
  </div>
);

// Card 3: Schema Retrieval (For Large DBs)
const CardSchemaRetrieval = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Problem: 100+ Tables (Too Big)</div>
    <div className="absolute top-[48%] left-[5%] right-[5%] border-t-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      <Connection x1={20} y1={25} x2={50} y2={25} />
      <Connection x1={50} y1={25} x2={50} y2={45} />
      
      {/* Branching */}
      <Connection x1={50} y1={45} x2={30} y2={75} color="#31a67a" />
      <Connection x1={50} y1={45} x2={70} y2={75} color="#ef4444" />
    </SvgCanvas>

    <Node top={25} left={20} title='"Revenue by region"' icon={MessageSquare} type="secondary" width="w-[140px]" />
    <Node top={25} left={50} title="Embed & Search" subtitle="Vector match vs Tables" icon={Search} type="primary" width="w-[140px]" />
    
    <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[10px] bg-white px-2 py-1 rounded border border-slate-200 shadow-sm z-20 font-bold">
      Semantic Match
    </div>

    <Node top={75} left={30} title="Table: 'sales'" subtitle="Cols: amount, region\n[0.85 similarity]" icon={TableProperties} type="success" width="w-[140px]" />
    <Node top={75} left={70} title="Table: 'logs'" subtitle="Cols: time, error_msg\n[0.12 similarity]" icon={TableProperties} type="error" width="w-[140px]" />

    <Label top={92} left={30} text="Pass to LLM Context ✅" />
    <Label top={92} left={70} text="Ignore ❌" type="error" />
  </div>
);

// Card 4: The Self-Healing Error Loop
const CardErrorLoop = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Initial Attempt */}
      <Connection x1={20} y1={50} x2={50} y2={20} />
      <Connection x1={50} y1={20} x2={80} y2={50} />
      
      {/* Error Feedback Loop */}
      <Connection x1={80} y1={50} x2={50} y2={80} color="#ef4444" />
      <Connection x1={50} y1={80} x2={20} y2={50} color="#ef4444" />
      
      {/* Success Exit */}
      <Connection x1={80} y1={50} x2={90} y2={50} color="#31a67a" />
    </SvgCanvas>

    <Node top={50} left={20} title="LLM Agent" subtitle="Generates SQL" icon={Brain} type="primary" width="w-[120px]" />
    
    <Node top={20} left={50} title="Try: SELECT revenu..." subtitle="Typo in column name" icon={Code2} type="warning" width="w-[150px]" />
    
    <Node top={50} left={80} title="SQL Database" subtitle="Executes Query" icon={Database} type="secondary" width="w-[120px]" />
    
    <Node top={80} left={50} title="SQLError Caught" subtitle='"Unknown column revenu"' icon={AlertTriangle} type="error" width="w-[150px]" />

    <Label top={50} left={50} text="RETRY LOOP (Self-Healing)" icon={RotateCcw} />
    
    <div className="absolute top-[40%] right-[-5%] bg-[#e6fcf5] text-[#2e9e73] border border-[#31a67a] px-2 py-1 rounded text-[10px] font-bold">
      Success!
    </div>
  </div>
);

// Card 5: Security & Validation
const CardValidation = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      <Connection x1={20} y1={50} x2={45} y2={50} />
      
      {/* Pass */}
      <Connection x1={45} y1={50} x2={75} y2={30} color="#31a67a" />
      {/* Fail */}
      <Connection x1={45} y1={50} x2={75} y2={70} color="#ef4444" />
    </SvgCanvas>

    <Node top={50} left={20} title="Raw LLM Output" subtitle="Unchecked SQL Query" icon={TerminalSquare} type="secondary" width="w-[140px]" />
    
    <Node top={50} left={45} title="Query Validator" subtitle="Checks rules & syntax" icon={ShieldCheck} type="primary" width="w-[140px]" />
    
    <Node top={30} left={75} title="SELECT * FROM..." subtitle="Safe -> Execute" icon={Database} type="success" width="w-[150px]" />
    
    <Node top={70} left={75} title="DROP TABLE users" subtitle="Dangerous -> Blocked" icon={ShieldAlert} type="error" width="w-[150px]" />

    <div className="absolute top-[85%] left-[50%] -translate-x-1/2 w-[80%] bg-[#f8fafc] border border-slate-300 p-3 rounded-lg text-[10px] text-center shadow-sm">
      <span className="font-bold text-slate-800">Best Practices:</span> Never trust LLM output directly. Always validate table names, column names, and explicitly block dangerous keywords (DROP, DELETE, UPDATE, INSERT).
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| NL-to-SQL</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Translating natural language questions directly into executable SQL queries safely and accurately.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <Database size={16} /> Database Agents
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. What is NL-to-SQL?">
           <CardWhatIsNL2SQL />
         </Card>

         <Card title="02. The Full Pipeline">
           <CardPipeline />
         </Card>

         <Card title="03. Schema Retrieval (Large DBs)" tall={true}>
           <CardSchemaRetrieval />
         </Card>

         <Card title="04. The Self-Healing Error Loop" tall={true}>
            <CardErrorLoop />
        </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="05. Security & Query Validation" tall={false}>
            <CardValidation />
        </Card>
      </div>

    </div>
  );
}