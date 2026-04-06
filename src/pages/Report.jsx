import { Baby, Building, Eye, Flower, Microscope, Pill, PillBottleIcon, TrendingUp, TrendingDown, CalendarDays, Loader2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import Footer from "@/components/shared/Footer";

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

// ── Helper to process raw API data ───────────────────────────────────────────

// ── Helper to process raw API data ───────────────────────────────────────────
function processReportData(rawData) {
  const years = {};

  rawData.forEach((item) => {
    // Extract year and month from timestamp (format: MM/DD/YYYY HH:MM:SS)
    const timestamp = item.timestamp || "";
    const datePart = timestamp.split(" ")[0] || "";
    const dateParts = datePart.split("/");
    
    if (dateParts.length < 3) return;

    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[0]) - 1; // 0-indexed month

    // Only add valid years (ignore 2006, 2-digit years like 26, etc.)
    if (isNaN(year) || year < 2020 || year > 2030) return;

    if (!years[year]) {
      years[year] = {
        totalPatients: 0, totalMale: 0, totalFemale: 0,
        opdMonthly: Array(12).fill(0), ipdMonthly: Array(12).fill(0), emgMonthly: Array(12).fill(0),
        depts: [
          { name: "Medicine / Panchakarma", y: 0, color: "#e84c3d" },
          { name: "Surgery", y: 0, color: "#f5a623" },
          { name: "Gynecology", y: 0, color: "#6abf6a" },
          { name: "Pediatrics", y: 0, color: "#38b2ac" },
          { name: "Ophthalmology & ENT", y: 0, color: "#805ad5" },
          { name: "Other", y: 0, color: "#ed64a6" },
        ],
        genderByDeptMap: {}, // Intermediate map for gender splitting
        conditionsMap: {
          medicine: {}, surgery: {}, gynecology: {}, pediatrics: {}, ent: {}
        }
      };
    }

    const yData = years[year];
    yData.totalPatients++;

    // Gender counts
    const gender = item.gender?.toLowerCase();
    if (gender === "male") yData.totalMale++;
    else if (gender === "female") yData.totalFemale++;

    // Monthly data (using total as OPD since distinction is missing)
    if (month >= 0 && month < 12) yData.opdMonthly[month]++;

    // Department & Condition Mapping
    const deptFields = [
      { field: "medicinePanchakarma", name: "Medicine / Panchakarma", id: "medicine" },
      { field: "surgery", name: "Surgery", id: "surgery" },
      { field: "gynecology", name: "Gynecology", id: "gynecology" },
      { field: "pediatrics", name: "Pediatrics", id: "pediatrics" },
      { field: "ophthalmologyEnt", name: "Ophthalmology & ENT", id: "ent" },
    ];

    let foundDept = false;
    deptFields.forEach((df) => {
      if (item[df.field]) {
        foundDept = true;
        const d = yData.depts.find(dept => dept.name === df.name);
        if (d) d.y++;

        // Tracking conditions
        const condition = item[df.field];
        if (condition) {
          yData.conditionsMap[df.id][condition] = (yData.conditionsMap[df.id][condition] || 0) + 1;
        }

        // Tracking gender by dept
        if (!yData.genderByDeptMap[df.name]) yData.genderByDeptMap[df.name] = { male: 0, female: 0 };
        if (gender === "male") yData.genderByDeptMap[df.name].male++;
        else if (gender === "female") yData.genderByDeptMap[df.name].female++;
      }
    });

    if (!foundDept) {
      const other = yData.depts.find(dept => dept.name === "Other");
      if (other) other.y++;
    }
  });

  // Final transformation for Highcharts (percentages/arrays)
  Object.keys(years).forEach((y) => {
    const yData = years[y];
    const total = yData.totalPatients || 1;

    // Convert depts to percentages
    yData.depts.forEach(d => {
      d.y = parseFloat(((d.y / total) * 100).toFixed(1));
    });

    // Convert genderByDeptMap to array
    yData.genderByDept = Object.keys(yData.genderByDeptMap).map(catName => {
      const counts = yData.genderByDeptMap[catName];
      const deptTotal = (counts.male + counts.female) || 1;
      return {
        category: catName,
        male: Math.round((counts.male / deptTotal) * 100),
        female: Math.round((counts.female / deptTotal) * 100)
      };
    });

    // Convert conditionsMap to arrays of { name, value }
    yData.conditions = {};
    Object.keys(yData.conditionsMap).forEach(deptId => {
      yData.conditions[deptId] = Object.keys(yData.conditionsMap[deptId]).map(condName => ({
        name: condName,
        value: yData.conditionsMap[deptId][condName]
      }));
    });
  });

  return years;
}

const DEPT_CATEGORY_META = [
  { id: "medicine", title: "Medicine / Panchakarma", icon: <PillBottleIcon />, color: "#6366F1", lightColor: "#EEF2FF" },
  { id: "surgery", title: "Surgery", icon: <Microscope />, color: "#F59E0B", lightColor: "#FFFBEB" },
  { id: "gynecology", title: "Gynecology", icon: <Flower />, color: "#EC4899", lightColor: "#FDF2F8" },
  { id: "pediatrics", title: "Pediatrics", icon: <Baby />, color: "#10B981", lightColor: "#ECFDF5" },
  { id: "ent", title: "Ophthalmology & ENT", icon: <Eye />, color: "#0EA5E9", lightColor: "#F0F9FF" },
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

// ── Growth Badge ─────────────────────────────────────────────────────────────
function GrowthBadge({ current, previous }) {
  if (!previous) return null;
  const pct = (((current - previous) / previous) * 100).toFixed(1);
  const positive = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {positive ? "+" : ""}{pct}%
    </span>
  );
}

// ── 1. Dept Pie Chart ─────────────────────────────────────────────────────────
function DeptPieChart({ depts }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useHighcharts((HC) => {
    if (!ref.current) return;
    try {
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
    } catch (e) {
      console.warn("Highcharts destroy error (DeptPieChart):", e);
    }
    
    instanceRef.current = HC.chart(ref.current, {
      chart: { type: "pie", backgroundColor: "transparent", height: 200, margin: [0, 0, 0, 0], spacing: [4, 4, 4, 4] },
      title: { text: null },
      credits: { enabled: false },
      tooltip: { pointFormat: "<b>{point.name}</b>: {point.y}%", backgroundColor: "#fff", borderRadius: 10, borderWidth: 0, shadow: true },
      plotOptions: {
        pie: { allowPointSelect: true, cursor: "pointer", innerSize: "60%", borderWidth: 3, borderColor: "#f8fafc", dataLabels: { enabled: false }, showInLegend: false, animation: { duration: 900 } },
      },
      series: [{ name: "Patients", colorByPoint: true, data: depts }],
    });
  });

  useEffect(() => {
    if (!ref.current || !window.Highcharts) return;
    try {
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
    } catch (e) {
      // already destroyed
    }
    
    instanceRef.current = window.Highcharts.chart(ref.current, {
      chart: { type: "pie", backgroundColor: "transparent", height: 200, margin: [0, 0, 0, 0], spacing: [4, 4, 4, 4] },
      title: { text: null },
      credits: { enabled: false },
      tooltip: { pointFormat: "<b>{point.name}</b>: {point.y}%", backgroundColor: "#fff", borderRadius: 10, borderWidth: 0, shadow: true },
      plotOptions: {
        pie: { allowPointSelect: true, cursor: "pointer", innerSize: "60%", borderWidth: 3, borderColor: "#f8fafc", dataLabels: { enabled: false }, showInLegend: false, animation: { duration: 700 } },
      },
      series: [{ name: "Patients", colorByPoint: true, data: depts }],
    });
  }, [depts]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0 w-48">
        <div ref={ref} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-extrabold text-gray-800">Total</span>
          <span className="text-xs text-gray-400">Patients</span>
        </div>
      </div>
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

// ── 2. Monthly Bar Chart ──────────────────────────────────────────────────────
function MonthlyBarChart({ opd, ipd, emg }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  const renderChart = (HC) => {
    if (!ref.current) return;
    try {
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
    } catch (e) {
      console.warn("Highcharts destroy error (MonthlyBarChart):", e);
    }
    
    instanceRef.current = HC.chart(ref.current, {
      chart: { type: "column", backgroundColor: "transparent", height: 210, spacing: [8, 6, 8, 4] },
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { fontSize: "9px", color: "#9ca3af" } },
        lineColor: "#e5e7eb", tickColor: "transparent",
      },
      yAxis: { title: { text: null }, labels: { style: { fontSize: "9px", color: "#9ca3af" } }, gridLineColor: "#f3f4f6", gridLineDashStyle: "Dash" },
      legend: { itemStyle: { fontSize: "10px", fontWeight: "600", color: "#374151" }, align: "right", verticalAlign: "top" },
      tooltip: { shared: true, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0, shadow: true, valueSuffix: " entries" },
      plotOptions: { column: { borderRadius: 4, groupPadding: 0.1, pointPadding: 0.04, animation: { duration: 700 } } },
      series: [
        { name: "OPD", color: "#f5a623", data: opd },
        { name: "IPD", color: "#38b2ac", data: ipd },
        { name: "Emergency", color: "#e84c3d", data: emg },
      ],
    });
  };

  useHighcharts(renderChart);
  useEffect(() => { if (window.Highcharts) renderChart(window.Highcharts); }, [opd, ipd, emg]);

  return <div ref={ref} className="w-full" />;
}

// ── 3. Gender Bar Chart ───────────────────────────────────────────────────────
function GenderBarChart({ genderData, maleTotal, femaleTotal }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const malePercent = Math.round((maleTotal / (maleTotal + femaleTotal)) * 100);
  const femalePercent = 100 - malePercent;

  const buildSeries = (filter) => {
    const series = [];
    if (filter === "All" || filter === "Male")
      series.push({ name: "Male", data: genderData.map((d) => d.male), color: "#3B82F6", borderRadius: 6, borderWidth: 0 });
    if (filter === "All" || filter === "Female")
      series.push({ name: "Female", data: genderData.map((d) => d.female), color: "#EC4899", borderRadius: 6, borderWidth: 0 });
    return series;
  };

  const renderChart = (HC, filter) => {
    if (!chartRef.current) return;
    try {
      if (chartInstanceRef.current && typeof chartInstanceRef.current.destroy === "function") {
        chartInstanceRef.current.destroy();
      }
    } catch (e) {
      console.warn("Highcharts destroy error (GenderBarChart):", e);
    }
    
    chartInstanceRef.current = HC.chart(chartRef.current, {
      chart: { type: "bar", backgroundColor: "transparent", animation: { duration: 600 }, spacing: [10, 10, 10, 10], height: 260 },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: true, align: "right", verticalAlign: "top", itemStyle: { color: "#6B7280", fontWeight: "500", fontSize: "11px" }, symbolRadius: 4, symbolWidth: 10, symbolHeight: 10 },
      xAxis: { categories: genderData.map((d) => d.category), lineColor: "#F3F4F6", tickColor: "transparent", labels: { style: { color: "#6B7280", fontSize: "10px", fontWeight: "500" } } },
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
      series: buildSeries(filter),
    });
  };

  useHighcharts((HC) => renderChart(HC, activeFilter));

  useEffect(() => {
    if (!window.Highcharts) return;
    renderChart(window.Highcharts, activeFilter);
  }, [activeFilter, genderData]);

  return (
    <div>
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start mb-3 w-fit">
        {["All", "Male", "Female"].map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-blue-500 text-base">♂</span>
            <span className="text-xs font-semibold text-blue-500">Male</span>
          </div>
          <p className="text-xl font-bold text-blue-700">{malePercent}%</p>
          <p className="text-xs text-blue-400 mt-0.5">{maleTotal.toLocaleString()} pts</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-pink-500 text-base">♀</span>
            <span className="text-xs font-semibold text-pink-500">Female</span>
          </div>
          <p className="text-xl font-bold text-pink-600">{femalePercent}%</p>
          <p className="text-xs text-pink-400 mt-0.5">{femaleTotal.toLocaleString()} pts</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-400 mb-1">Ratio</p>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-pink-500 rounded-full" style={{ width: `${malePercent}%` }} />
          </div>
          <p className="text-xs text-gray-600 mt-1 font-semibold">{malePercent}:{femalePercent}</p>
        </div>
      </div>
      <div ref={chartRef} style={{ height: "260px", width: "100%" }} />
    </div>
  );
}

// ── 4. Category Chart ──────────────────────────────────────────────────────────
function CategoryChart({ category, isVisible }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !chartRef.current || !window.Highcharts) return;
    const H = window.Highcharts;
    const sorted = [...category.data].sort((a, b) => b.value - a.value);
    
    try {
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
    } catch (e) {
      console.warn("Highcharts destroy error (CategoryChart):", e);
    }

    instanceRef.current = H.chart(chartRef.current, {
      chart: { type: "bar", backgroundColor: "transparent", style: { fontFamily: "'Outfit', sans-serif" }, animation: { duration: 700 }, spacing: [0, 10, 0, 0], height: Math.max(300, sorted.length * 38 + 40) },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: { categories: sorted.map((d) => d.name), lineWidth: 0, tickWidth: 0, labels: { style: { color: "#64748B", fontSize: "12px", fontWeight: "500" }, align: "right" } },
      yAxis: { min: 0, title: { text: null }, gridLineColor: "#F1F5F9", gridLineDashStyle: "Dash", labels: { style: { color: "#94A3B8", fontSize: "11px" } } },
      tooltip: {
        backgroundColor: "#1E293B", borderWidth: 0, borderRadius: 8, shadow: false,
        formatter: function () { return `<span style="color:#94A3B8;font-size:11px">${this.key}</span><br/><b style="color:#F8FAFC;font-size:15px">${this.y} patients</b>`; },
      },
      plotOptions: {
        bar: {
          borderRadius: 5, borderWidth: 0,
          dataLabels: { enabled: true, format: "{y}", style: { fontSize: "11px", fontWeight: "600", color: "#475569", textOutline: "none" } },
          color: { linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 }, stops: [[0, category.color + "99"], [1, category.color]] },
          states: { hover: { color: category.color, brightness: 0.1 } },
          pointPadding: 0.08, groupPadding: 0.05,
        },
      },
      series: [{ name: "Patients", data: sorted.map((d) => d.value) }],
    });
    return () => {
      try {
        if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
          instanceRef.current.destroy();
          instanceRef.current = null;
        }
      } catch (e) {
        // already destroyed
      }
    };
  }, [isVisible, category]);

  const total = category.data.reduce((s, d) => s + d.value, 0);
  const topCondition = [...category.data].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}>
      <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${category.lightColor}, white)` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: category.color + "18" }}>{category.icon}</div>
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
              <p className="text-sm font-semibold text-gray-700 leading-tight mt-0.5 truncate" title={topCondition?.name || "N/A"}>
                {topCondition?.name || "No records"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-1">
          {[...category.data].sort((a, b) => b.value - a.value).slice(0, 5).map((d, i) => (
            <div key={d.name} className="h-1.5 rounded-full flex-1" style={{ background: category.color, opacity: 1 - i * 0.15 }} title={d.name} />
          ))}
          <div className="h-1.5 rounded-full" style={{ background: "#E2E8F0", width: `${(category.data.length - 5) * 12}px` }} />
        </div>
      </div>
      <div className="px-2 pb-4"><div ref={chartRef} /></div>
    </div>
  );
}

// ── 5. Medical Conditions Dashboard ──────────────────────────────────────────
function MedicalConditionsDashboard({ conditions, isPrinting }) {
  const [visibleCharts, setVisibleCharts] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const catRefs = useRef({});

  // Reset visible charts when conditions change (year change)
  useEffect(() => { setVisibleCharts(new Set()); }, [conditions]);

  // Force all charts visible during printing
  useEffect(() => {
    if (isPrinting) {
      const allIds = DEPT_CATEGORY_META.map(m => m.id);
      setVisibleCharts(new Set(allIds));
    }
  }, [isPrinting]);

  const CATEGORIES = useMemo(() =>
    DEPT_CATEGORY_META.map((m) => ({ ...m, data: conditions[m.id] || [] })),
    [conditions]
  );

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
  }, [CATEGORIES]);

  const totalPatients = CATEGORIES.flatMap((c) => c.data).reduce((s, d) => s + d.value, 0);
  const totalConditions = CATEGORIES.flatMap((c) => c.data).length;
  const filtered = activeTab === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === activeTab);

  return (
    <div className="mt-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="px-6 md:px-10 pt-8 pb-7 rounded-2xl" style={{ background: "linear-gradient(135deg, #0d3a2d 0%, #0d3a2d 60%, #1a2e26 100%)" }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Patient Analytics Dashboard</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Disease Condition{" "}
              <span style={{ background: "linear-gradient(90deg, #818CF8, #C084FC, #FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Overview Report</span>
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
        <div className="flex gap-2 mt-7 flex-wrap">
          <button onClick={() => setActiveTab("all")}
            className="px-4 py-1.5 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold transition-all duration-200"
            style={{ background: activeTab === "all" ? "#6366F1" : "white", color: activeTab === "all" ? "#fff" : "gray", border: `1px solid ${activeTab === "all" ? "#6366F1" : "#334155"}` }}
          ><Building /> All Departments</button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className="px-4 flex items-center justify-center gap-2 cursor-pointer shadow-black bg-white py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: activeTab === cat.id ? cat.color : "white", color: activeTab === cat.id ? "#fff" : "gray", border: `1px solid ${activeTab === cat.id ? cat.color : "#334155"}` }}
            >{cat.icon} {cat.title}</button>
          ))}
        </div>
      </div>
      <div className="py-6">
        <div className={`grid gap-6 ${activeTab === "all" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {filtered.map((cat) => (
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

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Report() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({}); 
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);
  const Base_URL = import.meta.env.VITE_BACKEND_API_URL;

  const handleDownloadPDF = async () => {
    if (!reportRef.current || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Small delay to ensure any layout shifts/chart force-renders resolve
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#e2e8f0", 
        windowWidth: 1400, 
        onclone: (clonedDoc) => {
          // html2canvas crashes on OKLCH colors (Tailwind v4 default). 
          // We convert them to hex in the cloned document.
          const elements = clonedDoc.querySelectorAll('*');
          for (const el of elements) {
            const style = window.getComputedStyle(el);
            const colorProps = ['backgroundColor', 'color', 'borderColor', 'fill', 'stroke', 'textDecorationColor', 'textShadow'];
            
            for (const prop of colorProps) {
              if (style[prop] && style[prop].includes('oklch')) {
                if (prop === 'fill' || prop === 'stroke' || prop === 'color') el.style[prop] = '#1e293b';
                else el.style[prop] = '#f1f5f9';
              }
            }
            if (style.boxShadow && style.boxShadow.includes('oklch')) {
              el.style.boxShadow = 'none'; // Easiest fix for shadow parser crashing
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2] // Native scale
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`AyurAI_Report_${selectedYear}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Base_URL}/api/csv/recivedData`, {
          // Optional: add token if required
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const processed = processReportData(response.data);
          setDashboardData(processed);

          const years = Object.keys(processed).map(Number).sort();
          setAvailableYears(years);

          // Re-select year if current selection isn't in available years
          if (!years.includes(selectedYear)) {
            setSelectedYear(years[years.length - 1]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
        setError("Could not load real-time analytics. Please check your connection.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = (selectedYear ? dashboardData[selectedYear] : null) || Object.values(dashboardData)[0];
  if (!data) {
    if (loading) return (
      <div className="flex h-[80vh] items-center justify-center bg-slate-200 rounded-2xl p-2 font-sans text-gray-900 text-[13px]">
           <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
    return <div className="flex items-center justify-center p-20 text-gray-500">No data available. Please upload a CSV first.</div>;
  }

  const prevData = dashboardData[selectedYear - 1];

  const malePercent = data.totalPatients > 0 ? Math.round((data.totalMale / data.totalPatients) * 100) : 0;
  const femalePercent = 100 - malePercent;

  const totalOPD = data.opdMonthly.reduce((a, b) => a + b, 0);
  const totalIPD = data.ipdMonthly.reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen bg-slate-200 rounded-2xl p-2 font-sans text-gray-900 text-[13px]">
      <main ref={reportRef} className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight leading-none">Report</h1>
              <p className="text-gray-400 text-xs mt-1">Annual statistics — fiscal year {selectedYear}</p>
            </div>
            {loading && <Loader2 className="animate-spin text-emerald-600" size={24} />}
            {error && <p className="text-amber-600 text-[10px] font-medium bg-amber-50 px-2 py-1 rounded-lg">{error}</p>}
          </div>

          <div className="flex items-center gap-4">
            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 shadow-sm border ${
                isDownloading 
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                : "bg-white text-gray-800 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
              }`}
            >
              {isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isDownloading ? "Generating PDF..." : "Download Report"}
            </button>

            {/* Year Selector */}
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2.5">
              <CalendarDays size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-gray-500 mr-1">Year</span>
              <div className="flex gap-1">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${selectedYear === y
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                  >{y}</button>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* KPI Header Stats */}
          <div className="flex gap-8 flex-wrap">
            {[
              { num: data.totalPatients.toLocaleString(), badge: `${malePercent}% M`, label: "Total Patients", prev: prevData?.totalPatients },
              { num: totalOPD.toLocaleString(), badge: "OPD", label: "Annual OPD", prev: prevData ? prevData.opdMonthly.reduce((a, b) => a + b, 0) : null },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tracking-tight leading-none">{s.num}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-gray-900 text-white rounded-md px-2 py-0.5 text-[11px] font-semibold">{s.badge}</span>
                  <span className="text-gray-400 text-xs">{s.label}</span>
                  {s.prev && <GrowthBadge current={parseInt(s.num.replace(/,/g, ""))} previous={s.prev} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Patients", value: data.totalPatients.toLocaleString(), prev: prevData?.totalPatients, color: "bg-indigo-50 border-indigo-100", text: "text-indigo-700", sub: "text-indigo-400" },
            { label: "Male Patients", value: data.totalMale.toLocaleString(), prev: prevData?.totalMale, color: "bg-blue-50 border-blue-100", text: "text-blue-700", sub: "text-blue-400" },
            { label: "Female Patients", value: data.totalFemale.toLocaleString(), prev: prevData?.totalFemale, color: "bg-pink-50 border-pink-100", text: "text-pink-700", sub: "text-pink-400" },
            { label: "Annual OPD", value: totalOPD.toLocaleString(), prev: prevData ? prevData.opdMonthly.reduce((a, b) => a + b, 0) : null, color: "bg-amber-50 border-amber-100", text: "text-amber-700", sub: "text-amber-400" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl border p-4 ${kpi.color}`}>
              <p className={`text-xs font-semibold mb-1 ${kpi.sub}`}>{kpi.label}</p>
              <p className={`text-2xl font-extrabold ${kpi.text}`}>{kpi.value}</p>
              {kpi.prev && (
                <GrowthBadge current={parseInt(kpi.value.replace(/,/g, ""))} previous={kpi.prev} />
              )}
            </div>
          ))}
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Patients by Department" />
            <DeptPieChart depts={data.depts} />
          </Card>

          <Card>
            <CardHeader title={`Monthly Entries — ${selectedYear}`} />
            <MonthlyBarChart opd={data.opdMonthly} ipd={data.ipdMonthly} emg={data.emgMonthly} />
          </Card>

          <Card className="col-span-2">
            <CardHeader title="Patient Gender Distribution by Department" />
            <GenderBarChart
              genderData={data.genderByDept}
              maleTotal={data.totalMale}
              femaleTotal={data.totalFemale}
            />
          </Card>
        </div>

        {/* Disease Conditions Dashboard */}
        <MedicalConditionsDashboard conditions={data.conditions} isPrinting={isDownloading} />

      <Footer/>
      </main>
    </div>
  );
}