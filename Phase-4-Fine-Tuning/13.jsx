import React from 'react';
import { 
  Server, Cpu, Coins, Brain, Merge, Combine, 
  ArrowDown, MonitorSmartphone, CheckCircle2, 
  XCircle, AlertTriangle, Settings, Zap, Target, 
  SlidersHorizontal, Layers, TerminalSquare, 
  Wrench, Activity, HardDrive, PlayCircle, Database
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

// Card 1: The Problem (Full FT vs PEFT)
const CardFullVsPEFT = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-[8%] left-[25%] -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Full Fine-Tuning</div>
    <div className="absolute top-[8%] left-[75%] -translate-x-1/2 text-xs font-bold text-[#31a67a] uppercase tracking-widest text-center">PEFT (Parameter-Efficient)</div>
    <div className="absolute top-[15%] bottom-[5%] left-[50%] border-l-2 border-dashed border-slate-200"></div>

    <SvgCanvas>
      <Connection x1={25} y1={25} x2={25} y2={45} color="#ef4444" />
      <Connection x1={25} y1={45} x2={25} y2={70} color="#ef4444" />
      
      <Connection x1={75} y1={25} x2={75} y2={45} color="#31a67a" />
      <Connection x1={75} y1={45} x2={75} y2={70} color="#31a67a" />
    </SvgCanvas>

    {/* Full FT */}
    <Node top={25} left={25} title="Train ALL Weights" subtitle="e.g. 175B Parameters" icon={Database} type="secondary" width="w-[140px]" />
    <Node top={45} left={25} title="Massive GPU Cluster" subtitle="100+ GPUs, 700GB RAM" icon={Server} type="error" width="w-[150px]" />
    <Node top={70} left={25} title="$1M+ Cost" subtitle="Not Practical for anyone" icon={XCircle} type="error" width="w-[150px]" />

    {/* PEFT */}
    <Node top={25} left={75} title="Train SUBSET Only" subtitle="e.g. 3.7M Parameters (0.001%)" icon={Layers} type="secondary" width="w-[160px]" />
    <Node top={45} left={75} title="Single GPU" subtitle="1 GPU, 50GB RAM" icon={Cpu} type="success" width="w-[140px]" />
    <Node top={70} left={75} title="$100 - $500 Cost" subtitle="90% as good as Full FT" icon={CheckCircle2} type="success" width="w-[140px]" />
  </div>
);

// Card 2: LoRA Architecture
const CardLoRA = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Main path */}
      <Connection x1={50} y1={10} x2={50} y2={20} />
      
      {/* Split */}
      <path d="M 50 20 L 30 20 L 30 35" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 50 20 L 70 20 L 70 35" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      
      {/* LoRA Path A -> B */}
      <Connection x1={70} y1={45} x2={70} y2={60} />
      
      {/* Merge Path */}
      <path d="M 30 75 L 30 90 L 45 90" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 70 70 L 70 90 L 55 90" fill="none" stroke={THEME.line} strokeWidth="2" markerEnd="url(#arrow)" />
    </SvgCanvas>

    <Node top={10} left={50} title="Input Tokens" type="secondary" width="w-[100px]" />

    {/* Left (Original) */}
    <div className="absolute top-[55%] left-[30%] -translate-x-1/2 -translate-y-1/2 bg-slate-100 border border-slate-300 p-4 rounded-xl text-center shadow-sm w-[140px] h-[100px] flex flex-col justify-center">
      <div className="font-bold text-slate-700">W (Frozen)</div>
      <div className="text-[10px] text-slate-500 mt-1">1000 × 1000</div>
      <div className="text-[9px] text-slate-400 mt-1 font-bold bg-white rounded py-1 px-2 border border-slate-200">1,000,000 params</div>
    </div>

    {/* Right (LoRA) */}
    <div className="absolute top-[40%] left-[70%] -translate-x-1/2 -translate-y-1/2 bg-[#e6fcf5] border border-[#31a67a] p-2 rounded-lg text-center shadow-sm w-[100px] h-[40px] flex flex-col justify-center z-10">
      <div className="font-bold text-[#1f7351] text-xs">Matrix A</div>
      <div className="text-[9px] text-[#2a5d48]">1000 × 8</div>
    </div>
    
    <div className="absolute top-[65%] left-[70%] -translate-x-1/2 -translate-y-1/2 bg-[#e6fcf5] border border-[#31a67a] p-2 rounded-lg text-center shadow-sm w-[100px] h-[40px] flex flex-col justify-center z-10">
      <div className="font-bold text-[#1f7351] text-xs">Matrix B</div>
      <div className="text-[9px] text-[#2a5d48]">8 × 1000</div>
    </div>

    <Label top={52.5} left={85} text="ΔW Update" icon={Zap} type="success" />
    <Label top={65} left={85} text="16k params" />

    <Node top={90} left={50} title="Output + Merge" icon={Combine} type="primary" width="w-[140px]" />
  </div>
);

// Card 3: What is QLoRA?
const CardQLoRA = () => (
  <div className="relative w-full h-full flex flex-col justify-center items-center">
    
    <div className="w-[90%] mb-6 z-10 flex justify-between items-end border-b border-slate-200 pb-4">
      {/* Precision blocks showing shrink */}
      <div className="flex flex-col items-center">
        <div className="bg-slate-200 w-24 h-24 rounded border border-slate-400 flex items-center justify-center font-bold text-slate-600 text-xs">Float32<br/>(4 Bytes)</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-slate-300 w-16 h-16 rounded border border-slate-400 flex items-center justify-center font-bold text-slate-700 text-xs">Float16<br/>(2 Bytes)</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-slate-400 w-12 h-12 rounded border border-slate-500 flex items-center justify-center font-bold text-slate-800 text-[10px] text-center">Int8<br/>(1 Byte)</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#41d8a0] w-8 h-8 rounded border border-[#2e9e73] flex items-center justify-center font-bold text-white text-[8px] shadow-lg shadow-[#a6f0d4]">Int4</div>
      </div>
    </div>

    <div className="w-[90%] grid grid-cols-2 gap-4 z-10">
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-slate-800 text-sm mb-2 border-b pb-1">Standard Llama-7B</h4>
        <div className="text-xl font-black text-red-500 mb-1">56 GB</div>
        <div className="text-xs text-slate-500">GPU RAM needed</div>
        <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-100 rounded p-1">Requires Server</div>
      </div>

      <div className="bg-[#e6fcf5] border border-[#31a67a] p-4 rounded-xl shadow-sm text-center">
        <h4 className="font-extrabold text-[#1f7351] text-sm mb-2 border-b border-[#a6f0d4] pb-1">QLoRA Llama-7B</h4>
        <div className="text-xl font-black text-[#2e9e73] mb-1">7 GB</div>
        <div className="text-xs text-[#2a5d48]">GPU RAM needed</div>
        <div className="mt-2 text-[10px] font-bold text-blue-600 uppercase bg-blue-100 rounded p-1 flex items-center justify-center gap-1"><MonitorSmartphone size={12}/> Fits RTX 4090!</div>
      </div>
    </div>

    <Label top={20} left={50} text="Quantization compresses the base model weights" icon={Settings} />
  </div>
);

// Card 4: Hardware Decision Tree
const CardDecisionTree = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Node 1 to branches */}
      <Connection x1={20} y1={20} x2={20} y2={45} />
      <Connection x1={20} y1={20} x2={50} y2={20} dashed={true} />
      
      {/* Node 2 to branches */}
      <Connection x1={50} y1={20} x2={50} y2={45} />
      <Connection x1={50} y1={20} x2={80} y2={20} dashed={true} />

      {/* Node 3 to branches */}
      <Connection x1={80} y1={20} x2={80} y2={45} />
      <Connection x1={80} y1={20} x2={80} y2={70} dashed={true} />
      <Connection x1={80} y1={70} x2={50} y2={70} dashed={true} />
    </SvgCanvas>

    {/* Level 1 */}
    <Node top={20} left={20} title="$1M+ Budget?" subtitle="100+ GPU Cluster" icon={Coins} type="secondary" width="w-[130px] z-20" />
    <Label top={32} left={20} text="YES" />
    <Node top={45} left={20} title="Full Fine-Tune" subtitle="Max Accuracy (95%)" icon={Database} type="primary" width="w-[130px] z-20" />
    <Label top={20} left={35} text="NO" type="warning" />

    {/* Level 2 */}
    <Node top={20} left={50} title="24GB+ VRAM?" subtitle="RTX 4090 / A100" icon={HardDrive} type="secondary" width="w-[130px] z-20" />
    <Label top={32} left={50} text="YES" />
    <Node top={45} left={50} title="LoRA" subtitle="Rank=16/32" icon={Layers} type="success" width="w-[130px] z-20" />
    <Label top={20} left={65} text="NO" type="warning" />

    {/* Level 3 */}
    <Node top={20} left={80} title="16GB+ VRAM?" subtitle="RTX 4070/3080" icon={Cpu} type="secondary" width="w-[130px] z-20" />
    <Label top={32} left={80} text="YES" />
    <Node top={45} left={80} title="QLoRA" subtitle="Int4 Quantized" icon={Settings} type="success" width="w-[130px] z-20" />
    
    {/* Final Fallback */}
    <Label top={45} left={65} text="NO" type="error" />
    <Node top={70} left={50} title="Use Cloud API / Prompting" icon={TerminalSquare} type="error" width="w-[180px] z-20" />
  </div>
);

// Card 5: End-to-End Pipeline (Custom Chatbot)
const CardFullPipeline = () => (
  <div className="relative w-full h-full">
    <SvgCanvas>
      {/* Row 1: Left to Right */}
      <Connection x1={20} y1={25} x2={50} y2={25} />
      <Connection x1={50} y1={25} x2={80} y2={25} />
      
      {/* Down to Row 2 */}
      <Connection x1={80} y1={25} x2={80} y2={75} />
      
      {/* Row 2: Right to Left */}
      <Connection x1={80} y1={75} x2={50} y2={75} />
      <Connection x1={50} y1={75} x2={20} y2={75} />
    </SvgCanvas>

    {/* ROW 1 */}
    <Node top={25} left={20} title="1. Setup" subtitle="RTX 4090 + Unsloth\n500 QA Examples" icon={Settings} type="secondary" width="w-[140px]" />
    <Node top={25} left={50} title="2. Load Base Model" subtitle="Quantize to Int4\n(Uses 16GB RAM)" icon={HardDrive} type="primary" width="w-[140px]" />
    <Node top={25} left={80} title="3. Train LoRA" subtitle="Rank 16, Batch 4\nTakes ~2 Hours" icon={Activity} type="warning" width="w-[140px]" />

    {/* ROW 2 */}
    <Node top={75} left={80} title="4. Evaluate" subtitle="Test held-out set\nCheck loss drop" icon={Target} type="secondary" width="w-[140px]" />
    <Node top={75} left={50} title="5. Merge Weights" subtitle="Write ΔW to Base W\nCreates 1 model" icon={Merge} type="primary" width="w-[140px]" />
    <Node top={75} left={20} title="6. Deploy" subtitle="Inference Ready\nCustom Support Bot" icon={PlayCircle} type="success" width="w-[140px]" />

    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md border border-slate-600">
      Total Cost: $0 (Your PC) | Total Time: 3 Hours
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
             Visual Dev Guides <span className="text-slate-400 font-normal">| Fine-Tuning</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Phase 1 Theory: Overcoming the $1M barrier of Full Fine-Tuning using PEFT, LoRA (Low-Rank Adaptation), and QLoRA.
          </p>
        </div>
        <div className="bg-slate-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-md flex items-center gap-2">
          <SlidersHorizontal size={16} /> PEFT & LoRA
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
         <Card title="01. The Problem: Full vs PEFT">
           <CardFullVsPEFT />
         </Card>

         <Card title="02. How LoRA Works (Architecture)">
           <CardLoRA />
         </Card>

         <Card title="03. What is QLoRA? (Quantization)" tall={true}>
           <CardQLoRA />
         </Card>

         <Card title="04. The Hardware Decision Tree" tall={true}>
            <CardDecisionTree />
        </Card>
      </main>

      <div className="max-w-7xl mx-auto mt-6">
        <Card title="05. End-to-End Custom Chatbot (QLoRA Pipeline)" tall={false}>
            <CardFullPipeline />
        </Card>
      </div>

    </div>
  );
}