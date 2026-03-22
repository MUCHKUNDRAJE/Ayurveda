import MedicineTable from "@/components/shared/TableMed";
import { Baby, Building, Eye, Flower, Microscope, Pill, PillBottleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

// ── Gender data for bar chart ─────────────────────────────────────────────────
const GENDER_DATA = [
  { category: "Medicine / Panchakarma", male: 55, female: 45 },
  { category: "Surgery",                male: 68, female: 32 },
  { category: "Gynecology",             male: 20, female: 80 },
  { category: "Pediatrics",             male: 48, female: 52 },
  { category: "Ophthalmology & ENT",    male: 57, female: 43 },
  { category: "Other",                  male: 50, female: 50 },
];

const SUMMARY = {
  totalMale: 4820,
  totalFemale: 3640,
  malePercent: 57,
  femalePercent: 43,
};

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

// ── 2. Highcharts Grouped Bar (Monthly) ───────────────────────────────────────
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

// ── 3. Gender Bar Chart (Male vs Female) ──────────────────────────────────────
function GenderBarChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Male", "Female"];

  useHighcharts((HC) => {
    if (!chartRef.current) return;

    const maleColor = "#3B82F6";
    const femaleColor = "#EC4899";

    const series = [];
    if (activeFilter === "All" || activeFilter === "Male") {
      series.push({
        name: "Male",
        data: GENDER_DATA.map((d) => d.male),
        color: maleColor,
        borderRadius: 6,
        borderWidth: 0,
      });
    }
    if (activeFilter === "All" || activeFilter === "Female") {
      series.push({
        name: "Female",
        data: GENDER_DATA.map((d) => d.female),
        color: femaleColor,
        borderRadius: 6,
        borderWidth: 0,
      });
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = HC.chart(chartRef.current, {
      chart: {
        type: "bar",
        backgroundColor: "transparent",
        animation: { duration: 600 },
        spacing: [10, 10, 10, 10],
        height: 260,
      },
      title: { text: null },
      credits: { enabled: false },
      legend: {
        enabled: true,
        align: "right",
        verticalAlign: "top",
        itemStyle: { color: "#6B7280", fontWeight: "500", fontSize: "11px" },
        symbolRadius: 4,
        symbolWidth: 10,
        symbolHeight: 10,
      },
      xAxis: {
        categories: GENDER_DATA.map((d) => d.category),
        lineColor: "#F3F4F6",
        tickColor: "transparent",
        labels: { style: { color: "#6B7280", fontSize: "10px", fontWeight: "500" } },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: { text: null },
        gridLineColor: "#F3F4F6",
        gridLineDashStyle: "Dash",
        labels: {
          format: "{value}%",
          style: { color: "#9CA3AF", fontSize: "10px" },
        },
        tickAmount: 6,
      },
      tooltip: {
        shared: true,
        backgroundColor: "#111827",
        borderWidth: 0,
        borderRadius: 10,
        shadow: false,
        style: { color: "#F9FAFB", fontSize: "12px" },
        formatter: function () {
          let s = `<b style="font-size:13px;color:#F9FAFB">${this.x}</b><br/>`;
          this.points.forEach((p) => {
            const icon = p.series.name === "Male" ? "♂" : "♀";
            s += `<span style="color:${p.color}">${icon} ${p.series.name}</span>: <b>${p.y}%</b><br/>`;
          });
          return s;
        },
      },
      plotOptions: {
        bar: {
          grouping: true,
          groupPadding: 0.12,
          pointPadding: 0.08,
          dataLabels: {
            enabled: true,
            format: "{y}%",
            style: { fontSize: "10px", fontWeight: "600", color: "#374151", textOutline: "none" },
          },
        },
        series: { animation: { duration: 700 } },
      },
      series,
    });
  });

  // Re-render chart when filter changes
  useEffect(() => {
    if (!chartRef.current || !window.Highcharts) return;
    const HC = window.Highcharts;
    const maleColor = "#3B82F6";
    const femaleColor = "#EC4899";
    const series = [];
    if (activeFilter === "All" || activeFilter === "Male") {
      series.push({ name: "Male", data: GENDER_DATA.map((d) => d.male), color: maleColor, borderRadius: 6, borderWidth: 0 });
    }
    if (activeFilter === "All" || activeFilter === "Female") {
      series.push({ name: "Female", data: GENDER_DATA.map((d) => d.female), color: femaleColor, borderRadius: 6, borderWidth: 0 });
    }
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = HC.chart(chartRef.current, {
      chart: { type: "bar", backgroundColor: "transparent", animation: { duration: 600 }, spacing: [10,10,10,10], height: 260 },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: true, align: "right", verticalAlign: "top", itemStyle: { color: "#6B7280", fontWeight: "500", fontSize: "11px" }, symbolRadius: 4, symbolWidth: 10, symbolHeight: 10 },
      xAxis: { categories: GENDER_DATA.map((d) => d.category), lineColor: "#F3F4F6", tickColor: "transparent", labels: { style: { color: "#6B7280", fontSize: "10px", fontWeight: "500" } } },
      yAxis: { min: 0, max: 100, title: { text: null }, gridLineColor: "#F3F4F6", gridLineDashStyle: "Dash", labels: { format: "{value}%", style: { color: "#9CA3AF", fontSize: "10px" } }, tickAmount: 6 },
      tooltip: {
        shared: true, backgroundColor: "#111827", borderWidth: 0, borderRadius: 10, shadow: false,
        style: { color: "#F9FAFB", fontSize: "12px" },
        formatter: function () {
          let s = `<b style="font-size:13px;color:#F9FAFB">${this.x}</b><br/>`;
          this.points.forEach((p) => {
            const icon = p.series.name === "Male" ? "♂" : "♀";
            s += `<span style="color:${p.color}">${icon} ${p.series.name}</span>: <b>${p.y}%</b><br/>`;
          });
          return s;
        },
      },
      plotOptions: { bar: { grouping: true, groupPadding: 0.12, pointPadding: 0.08, dataLabels: { enabled: true, format: "{y}%", style: { fontSize: "10px", fontWeight: "600", color: "#374151", textOutline: "none" } } }, series: { animation: { duration: 700 } } },
      series,
    });
  }, [activeFilter]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start mb-3 w-fit">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-blue-500 text-base">♂</span>
            <span className="text-xs font-semibold text-blue-500">Male</span>
          </div>
          <p className="text-xl font-bold text-blue-700">{SUMMARY.malePercent}%</p>
          <p className="text-xs text-blue-400 mt-0.5">{SUMMARY.totalMale.toLocaleString()} pts</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-pink-500 text-base">♀</span>
            <span className="text-xs font-semibold text-pink-500">Female</span>
          </div>
          <p className="text-xl font-bold text-pink-600">{SUMMARY.femalePercent}%</p>
          <p className="text-xs text-pink-400 mt-0.5">{SUMMARY.totalFemale.toLocaleString()} pts</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-400 mb-1">Ratio</p>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full" style={{ width: `${SUMMARY.malePercent}%` }} />
          </div>
          <p className="text-xs text-gray-600 mt-1 font-semibold">{SUMMARY.malePercent}:{SUMMARY.femalePercent}</p>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ height: "260px", width: "100%" }} />
    </div>
  );
}

// ── 4. Medical Conditions Dashboard data ────────────────────────────────────
const CATEGORIES = [
  {
    id: "medicine",
    title: "Medicine / Panchakarma",
    icon: <PillBottleIcon/>,
    color: "#6366F1",
    lightColor: "#EEF2FF",
    data: [
      { name: "Diabetes", value: 142 },
      { name: "Hypertension", value: 118 },
      { name: "Asthama", value: 87 },
      { name: "Heart Disease", value: 64 },
      { name: "Paralysis", value: 39 },
      { name: "Breathlessness / Weakness", value: 73 },
      { name: "Skin Disease", value: 95 },
      { name: "Obesity", value: 81 },
      { name: "Acidity / Hyper Acidity", value: 109 },
      { name: "Arthritis / Knee / Back Pain", value: 126 },
      { name: "Thyroid", value: 58 },
    ],
  },
  {
    id: "surgery",
    title: "Surgery",
    icon:<Microscope/>,
    color: "#F59E0B",
    lightColor: "#FFFBEB",
    data: [
      { name: "Urine Disorder", value: 47 },
      { name: "Hernia", value: 62 },
      { name: "Hydrocele", value: 34 },
      { name: "Cyst", value: 28 },
      { name: "Kidney Stone", value: 91 },
      { name: "Piles / Haemorrhoids", value: 74 },
      { name: "Fistula", value: 43 },
      { name: "Corn", value: 19 },
      { name: "Diabetic Wounds / Venous Ulcers", value: 55 },
    ],
  },
  {
    id: "gynecology",
    title: "Gynecology",
    icon:<Flower/>,
    color: "#EC4899",
    lightColor: "#FDF2F8",
    data: [
      { name: "Menstrual Disorder", value: 103 },
      { name: "Abnormal Vaginal Bleeding", value: 67 },
      { name: "Uterine Prolapse", value: 41 },
      { name: "Infertility", value: 89 },
      { name: "White Discharge", value: 76 },
      { name: "Cyst in a Breast", value: 53 },
      { name: "PCOD", value: 118 },
      { name: "ANC", value: 94 },
    ],
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    icon: <Baby/>,
    color: "#10B981",
    lightColor: "#ECFDF5",
    data: [
      { name: "Allergic Rhinitis", value: 82 },
      { name: "Malnourish Children", value: 56 },
      { name: "Difficulty in Speech", value: 31 },
      { name: "Convulsions", value: 27 },
      { name: "Not Gaining Weight", value: 69 },
      { name: "Cerebral Palsy", value: 18 },
      { name: "Obesity in Children", value: 44 },
      { name: "Mentally Deficient", value: 22 },
      { name: "Other", value: 35 },
    ],
  },
  {
    id: "ent",
    title: "Ophthalmology & ENT",
    icon: <Eye/>,
    color: "#0EA5E9",
    lightColor: "#F0F9FF",
    data: [
      { name: "Diminished Vision", value: 88 },
      { name: "Discharge from Eye", value: 52 },
      { name: "Sqint", value: 37 },
      { name: "Pterygium", value: 29 },
      { name: "Ear Discharge", value: 61 },
      { name: "DNS", value: 43 },
      { name: "Migraine", value: 74 },
    ],
  },
];

function CategoryChart({ category, isVisible }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !chartRef.current || !window.Highcharts) return;
    const H = window.Highcharts;
    const sorted = [...category.data].sort((a, b) => b.value - a.value);
    instanceRef.current = H.chart(chartRef.current, {
      chart: {
        type: "bar",
        backgroundColor: "transparent",
        style: { fontFamily: "'Outfit', sans-serif" },
        animation: { duration: 700 },
        spacing: [0, 10, 0, 0],
        height: Math.max(300, sorted.length * 38 + 40),
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: sorted.map((d) => d.name),
        lineWidth: 0,
        tickWidth: 0,
        labels: { style: { color: "#64748B", fontSize: "12px", fontWeight: "500" }, align: "right" },
      },
      yAxis: {
        min: 0,
        title: { text: null },
        gridLineColor: "#F1F5F9",
        gridLineDashStyle: "Dash",
        labels: { style: { color: "#94A3B8", fontSize: "11px" } },
      },
      tooltip: {
        backgroundColor: "#1E293B",
        borderWidth: 0,
        borderRadius: 8,
        shadow: false,
        formatter: function () {
          return `<span style="color:#94A3B8;font-size:11px">${this.key}</span><br/><b style="color:#F8FAFC;font-size:15px">${this.y} patients</b>`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{y}",
            style: { fontSize: "11px", fontWeight: "600", color: "#475569", textOutline: "none" },
          },
          color: {
            linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
            stops: [[0, category.color + "99"], [1, category.color]],
          },
          states: { hover: { color: category.color, brightness: 0.1 } },
          pointPadding: 0.08,
          groupPadding: 0.05,
        },
      },
      series: [{ name: "Patients", data: sorted.map((d) => d.value) }],
    });
    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [isVisible, category]);

  const total = category.data.reduce((s, d) => s + d.value, 0);
  const topCondition = [...category.data].sort((a, b) => b.value - a.value)[0];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}
    >
      {/* Card Header */}
      <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${category.lightColor}, white)` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: category.color + "18" }}>
              {category.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base leading-tight">{category.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{category.data.length} conditions tracked</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Total</p>
              <p className="text-xl font-bold" style={{ color: category.color }}>{total.toLocaleString()}</p>
            </div>
            <div className="w-px h-10 self-center" style={{ background: category.color + "30" }} />
            <div className="text-right max-w-[140px]">
              <p className="text-xs text-gray-400 font-medium">Top Condition</p>
              <p className="text-sm font-semibold text-gray-700 leading-tight mt-0.5 truncate" title={topCondition.name}>{topCondition.name}</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 flex gap-1">
          {[...category.data].sort((a, b) => b.value - a.value).slice(0, 5).map((d, i) => (
            <div key={d.name} className="h-1.5 rounded-full flex-1" style={{ background: category.color, opacity: 1 - i * 0.15 }} title={d.name} />
          ))}
          <div className="h-1.5 rounded-full" style={{ background: "#E2E8F0", width: `${(category.data.length - 5) * 12}px` }} />
        </div>
      </div>
      {/* Chart */}
      <div className="px-2 pb-4">
        <div ref={chartRef} />
      </div>
    </div>
  );
}

function MedicalConditionsDashboard() {
  const [visibleCharts, setVisibleCharts] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const catRefs = useRef({});

  useEffect(() => {
    const observers = [];
    CATEGORIES.forEach((cat) => {
      const el = catRefs.current[cat.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisibleCharts((prev) => new Set([...prev, cat.id])); },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const totalPatients = CATEGORIES.flatMap((c) => c.data).reduce((s, d) => s + d.value, 0);
  const totalConditions = CATEGORIES.flatMap((c) => c.data).length;
  const filtered = activeTab === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === activeTab);

  return (
    <div className="mt-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Hero Header */}
      <div
        className="px-6 md:px-10 pt-8 pb-7 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #0d3a2d 0%, #0d3a2d 60%, #1a2e26 100%)" }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Patient Analytics Dashboard</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Disease Condition{" "}
              <span style={{ background: "linear-gradient(90deg, #818CF8, #C084FC, #FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Overview Report
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-xs max-w-lg">Patient distribution across all medical departments and specializations. Sorted by case volume.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "Total Patients", value: totalPatients.toLocaleString(), color: "#818CF8" },
              { label: "Conditions", value: totalConditions, color: "#34D399" },
              { label: "Departments", value: CATEGORIES.length, color: "#FB7185" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-7 flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className="px-4 py-1.5 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold transition-all duration-200"
            style={{ background: activeTab === "all" ? "#6366F1" : "white", color: activeTab === "all" ? "#fff" : "gray", border: `1px solid ${activeTab === "all" ? "#6366F1" : "#334155"}` }}
          >
            <Building/>
            All Departments
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-4 flex items-center justify-center gap-2 cursor-pointer shadow-black  bg-white py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: activeTab === cat.id ? cat.color : "white", color: activeTab === cat.id ? "#fff" : "gray", border: `1px solid ${activeTab === cat.id ? cat.color : "#334155"}` }}
            
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="py-6">
        <div className={`grid gap-6 ${activeTab === "all" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {activeTab === "all"
            ? filtered.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl p-4 shadow" ref={(el) => (catRefs.current[cat.id] = el)}>
                  <CategoryChart category={cat} isVisible={visibleCharts.has(cat.id)} />
                </div>
              ))
            : filtered.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl p-4 shadow" ref={(el) => (catRefs.current[cat.id] = el)}>
                  <CategoryChart category={cat} isVisible={visibleCharts.has(cat.id)} />
                </div>
              ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Data reflects patient intake records. Values represent case counts per condition.</p>
        </div>
      </div>
    </div>
  );
}

// ── 4. Sankey-style Flow ──────────────────────────────────────────────────────
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

// ── 5. Trend data ─────────────────────────────────────────────────────────────
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

      {/* ── Main ── */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">Report</h1>
            <p className="text-gray-400 text-xs mt-1">Jan 1 – Feb 31, 2026 ∨</p>
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

          {/* Card 2 — Monthly Bar */}
          <Card>
            <CardHeader title="Monthly Entries (Jan – Dec)" />
            <MonthlyBarChart />
          </Card>

          {/* Card 3 — Gender Bar Chart */}
          <Card className="col-span-2">
            <CardHeader title="Patient Gender Distribution by Department" />
            <GenderBarChart />
          </Card>

        </div>

        {/* Disease Conditions Dashboard */}
        <MedicalConditionsDashboard />
      </main>
    </div>
  );
}