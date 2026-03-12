import MedicineTable from "@/components/shared/TableMed";
import { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// ── Load Highcharts from CDN ──────────────────────────────────────────────────
function useHighcharts(onReady) {
  useEffect(() => {
    if (window.Highcharts) { onReady(window.Highcharts); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/highcharts/11.2.0/highcharts.js";
    s.onload = () => onReady(window.Highcharts);
    document.head.appendChild(s);
  }, []);
}

const DEPT_COLORS = ["#e84c3d","#f5a623","#6abf6a","#38b2ac","#805ad5","#ed64a6"];

const depts = [
  { name: "Medicine / Panchakarma", y: 38, color: DEPT_COLORS[0] },
  { name: "Surgery",                y: 22, color: DEPT_COLORS[1] },
  { name: "Gynecology",             y: 16, color: DEPT_COLORS[2] },
  { name: "Pediatrics",             y: 12, color: DEPT_COLORS[3] },
  { name: "Ophthalmology & ENT",    y:  8, color: DEPT_COLORS[4] },
  { name: "Other",                  y:  4, color: DEPT_COLORS[5] },
];

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-sm border border-white rounded-2xl shadow-sm p-5 relative ${className}`}>
    {children}
  </div>
);

// ── Card header row ───────────────────────────────────────────────────────────
const CardHeader = ({ title }) => (
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm font-bold text-gray-800 tracking-tight">{title}</span>
    <div className="flex gap-2 text-gray-400 text-sm cursor-pointer">
      <span>▦</span><span>⋮</span>
    </div>
  </div>
);

// ── 1. Highcharts Donut Pie ───────────────────────────────────────────────────
function DeptPieChart() {
  const ref = useRef(null);
  useHighcharts((HC) => {
    if (!ref.current) return;
    HC.chart(ref.current, {
      chart: { type:"pie", backgroundColor:"transparent", height:200, margin:[0,0,0,0], spacing:[4,4,4,4] },
      title: { text:null },
      credits: { enabled:false },
      tooltip: {
        pointFormat:"<b>{point.name}</b>: {point.y}%",
        backgroundColor:"#fff", borderRadius:10, borderWidth:0, shadow:true,
      },
      plotOptions: {
        pie: {
          allowPointSelect:true, cursor:"pointer",
          innerSize:"60%", borderWidth:3, borderColor:"#f8fafc",
          dataLabels:{ enabled:false },
          showInLegend:false,
          animation:{ duration:900 },
        },
      },
      series:[{ name:"Patients", colorByPoint:true, data: depts }],
    });
  });

  return (
    <div className="flex items-center gap-4">
      {/* donut */}
      <div className="relative flex-shrink-0 w-48">
        <div ref={ref} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-extrabold text-gray-800">Total</span>
          <span className="text-xs text-gray-400">Patients</span>
        </div>
      </div>
      {/* legend */}
      <div className="flex-1 flex flex-col gap-2">
        {depts.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="flex-1 text-xs text-gray-700 leading-tight">{d.name}</span>
            <span className="border-b border-dotted border-gray-300 w-4 mx-1" />
            <span className="text-xs font-bold text-gray-800 w-7 text-right">{d.y}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 2. Highcharts Grouped Bar ─────────────────────────────────────────────────
function MonthlyBarChart() {
  const ref = useRef(null);
  useHighcharts((HC) => {
    if (!ref.current) return;
    HC.chart(ref.current, {
      chart: { type:"column", backgroundColor:"transparent", height:210, spacing:[8,6,8,4] },
      title: { text:null },
      credits: { enabled:false },
      xAxis: {
        categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        labels:{ style:{ fontSize:"9px", color:"#9ca3af" } },
        lineColor:"#e5e7eb", tickColor:"transparent",
      },
      yAxis: {
        title:{ text:null },
        labels:{ style:{ fontSize:"9px", color:"#9ca3af" } },
        gridLineColor:"#f3f4f6", gridLineDashStyle:"Dash",
      },
      legend:{
        itemStyle:{ fontSize:"10px", fontWeight:"600", color:"#374151" },
        align:"right", verticalAlign:"top",
      },
      tooltip:{ shared:true, backgroundColor:"#fff", borderRadius:10, borderWidth:0, shadow:true, valueSuffix:" entries" },
      plotOptions:{ column:{ borderRadius:4, groupPadding:0.1, pointPadding:0.04, animation:{ duration:900 } } },
      series:[
        { name:"OPD",       color:"#f5a623", data:[120,145,162,180,200,175,190,210,195,220,240,260] },
        { name:"IPD",       color:"#38b2ac", data:[45,52,60,70,80,65,72,85,78,90,100,115] },
        { name:"Emergency", color:"#e84c3d", data:[20,18,25,22,30,28,32,29,35,31,38,42] },
      ],
    });
  });
  return <div ref={ref} className="w-full" />;
}

// ── 3. Sankey-style Flow ──────────────────────────────────────────────────────
function FlowChart() {
  const bands = [
    { color:"#6abf6a", t:8,  b:4,  mt:32, mb:21, et:60, eb:12 },
    { color:"#f5a623", t:32, b:21, mt:60, mb:40, et:60, eb:40 },
    { color:"#e84c3d", t:60, b:75, mt:60, mb:79, et:28, eb:88 },
  ];
  const w=400, h=130;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
      {bands.map((b,i)=>{
        const x1=w/2;
        const tp=`M0,${b.t*h/100} C${x1*.5},${b.t*h/100} ${x1*.5},${b.mt*h/100} ${x1},${b.mt*h/100} C${x1*1.5},${b.mt*h/100} ${x1*1.5},${b.et*h/100} ${w},${b.et*h/100}`;
        const bp=`M${w},${b.eb*h/100} C${x1*1.5},${b.eb*h/100} ${x1*1.5},${b.mb*h/100} ${x1},${b.mb*h/100} C${x1*.5},${b.mb*h/100} ${x1*.5},${b.b*h/100} 0,${b.b*h/100}`;
        return <path key={i} d={`${tp} L${bp} Z`} fill={b.color} opacity={0.55}/>;
      })}
    </svg>
  );
}

// ── 4. Trend data ─────────────────────────────────────────────────────────────
const trendData = [
  {x:0,dev:5,inv:8,bah:15},{x:1,dev:8,inv:12,bah:18},{x:2,dev:12,inv:15,bah:20},
  {x:3,dev:20,inv:20,bah:22},{x:4,dev:30,inv:28,bah:24},{x:5,dev:37,inv:35,bah:26},
  {x:6,dev:55,inv:42,bah:28},{x:7,dev:72,inv:52,bah:30},{x:8,dev:88,inv:62,bah:32},
  {x:9,dev:95,inv:68,bah:33},
];

// ── Sidebar icon ──────────────────────────────────────────────────────────────
const SidebarIcon = ({ active, children }) => (
  <div className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer text-base mx-auto my-1.5 transition-colors
    ${active ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-300"}`}>
    {children}
  </div>
);

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Report() {
  return (
    <div className="flex min-h-screen bg-slate-200 rounded-2xl p-2 font-sans text-gray-900 text-[13px]">

      {/* ── Sidebar ── */}
    

      {/* ── Main ── */}
      <main className="flex-1 p-6 overflow-y-auto ">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">Dashboard</h1>
            <p className="text-gray-400 text-xs mt-1">Jun 1 – Aug 31, 2024 ∨</p>
          </div>
          <div className="flex gap-12">
            {[
              { num:"7,052", badge:"$22.5M", label:"EOI Sent" },
              { num:"34",    badge:"$5.9M",  label:"New Requests" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tracking-tight leading-none">{s.num}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-gray-900 text-white rounded-md px-2 py-0.5 text-[11px] font-semibold">{s.badge}</span>
                  <span className="text-gray-400 text-xs">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* Card 1 — Pie */}
          <Card>
            <CardHeader title="Borrowers by Department" />
            <DeptPieChart />
          </Card>

          {/* Card 2 — Bar */}
          <Card>
            <CardHeader title="Monthly Entries (Jan – Dec)" />
            <MonthlyBarChart />
          </Card>
 

       {/* <Card className="w-90">
           <MedicineTable/>
       </Card> */}
   
        
      

        </div>
      </main>
    </div>
  );
}