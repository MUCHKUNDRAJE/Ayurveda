import MedicineTable from "@/components/shared/TableMed";
import { Baby, Building, Eye, Flower, Microscope, Pill, PillBottleIcon, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";

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

// ── YEAR-WISE DATA SHEET ──────────────────────────────────────────────────────
// Each year key contains all statistics for that year
const YEAR_DATA = {
  2022: {
    totalPatients: 6840,
    totalMale: 3980,
    totalFemale: 2860,
    opdMonthly:   [88, 102, 118, 130, 145, 132, 140, 158, 148, 165, 178, 195],
    ipdMonthly:   [30, 38,  44,  52,  60,  48,  55,  62,  58, 68,  74,  88],
    emgMonthly:   [14, 12,  18,  16,  22,  20,  24,  21,  26, 22,  28,  30],
    depts: [
      { name: "Medicine / Panchakarma", y: 35, color: "#e84c3d" },
      { name: "Surgery",                y: 24, color: "#f5a623" },
      { name: "Gynecology",             y: 18, color: "#6abf6a" },
      { name: "Pediatrics",             y: 11, color: "#38b2ac" },
      { name: "Ophthalmology & ENT",    y:  8, color: "#805ad5" },
      { name: "Other",                  y:  4, color: "#ed64a6" },
    ],
    genderByDept: [
      { category: "Medicine / Panchakarma", male: 58, female: 42 },
      { category: "Surgery",                male: 71, female: 29 },
      { category: "Gynecology",             male: 18, female: 82 },
      { category: "Pediatrics",             male: 50, female: 50 },
      { category: "Ophthalmology & ENT",    male: 60, female: 40 },
      { category: "Other",                  male: 52, female: 48 },
    ],
    conditions: {
      medicine:   [{ name: "Diabetes", value: 112 }, { name: "Hypertension", value: 98 }, { name: "Asthma", value: 70 }, { name: "Heart Disease", value: 55 }, { name: "Paralysis", value: 30 }, { name: "Breathlessness", value: 60 }, { name: "Skin Disease", value: 78 }, { name: "Obesity", value: 65 }, { name: "Acidity", value: 88 }, { name: "Arthritis", value: 102 }, { name: "Thyroid", value: 48 }],
      surgery:    [{ name: "Urine Disorder", value: 38 }, { name: "Hernia", value: 50 }, { name: "Hydrocele", value: 28 }, { name: "Cyst", value: 22 }, { name: "Kidney Stone", value: 74 }, { name: "Piles", value: 60 }, { name: "Fistula", value: 35 }, { name: "Corn", value: 14 }, { name: "Diabetic Wounds", value: 44 }],
      gynecology: [{ name: "Menstrual Disorder", value: 85 }, { name: "Abnormal Vaginal Bleeding", value: 54 }, { name: "Uterine Prolapse", value: 32 }, { name: "Infertility", value: 72 }, { name: "White Discharge", value: 62 }, { name: "Cyst in Breast", value: 42 }, { name: "PCOD", value: 96 }, { name: "ANC", value: 78 }],
      pediatrics: [{ name: "Allergic Rhinitis", value: 66 }, { name: "Malnourish Children", value: 44 }, { name: "Difficulty in Speech", value: 25 }, { name: "Convulsions", value: 20 }, { name: "Not Gaining Weight", value: 55 }, { name: "Cerebral Palsy", value: 14 }, { name: "Obesity in Children", value: 35 }, { name: "Mentally Deficient", value: 18 }, { name: "Other", value: 28 }],
      ent:        [{ name: "Diminished Vision", value: 70 }, { name: "Discharge from Eye", value: 42 }, { name: "Sqint", value: 30 }, { name: "Pterygium", value: 22 }, { name: "Ear Discharge", value: 50 }, { name: "DNS", value: 35 }, { name: "Migraine", value: 60 }],
    },
  },
  2023: {
    totalPatients: 7850,
    totalMale: 4520,
    totalFemale: 3330,
    opdMonthly:   [105, 125, 143, 162, 178, 155, 168, 188, 172, 198, 215, 238],
    ipdMonthly:   [38,  47,  54,  63,  72,  59,  65,  76,  70,  82,  90, 104],
    emgMonthly:   [17,  15,  22,  19,  27,  24,  29,  25,  31,  27,  34,  38],
    depts: [
      { name: "Medicine / Panchakarma", y: 36, color: "#e84c3d" },
      { name: "Surgery",                y: 23, color: "#f5a623" },
      { name: "Gynecology",             y: 17, color: "#6abf6a" },
      { name: "Pediatrics",             y: 12, color: "#38b2ac" },
      { name: "Ophthalmology & ENT",    y:  8, color: "#805ad5" },
      { name: "Other",                  y:  4, color: "#ed64a6" },
    ],
    genderByDept: [
      { category: "Medicine / Panchakarma", male: 56, female: 44 },
      { category: "Surgery",                male: 70, female: 30 },
      { category: "Gynecology",             male: 19, female: 81 },
      { category: "Pediatrics",             male: 49, female: 51 },
      { category: "Ophthalmology & ENT",    male: 58, female: 42 },
      { category: "Other",                  male: 51, female: 49 },
    ],
    conditions: {
      medicine:   [{ name: "Diabetes", value: 128 }, { name: "Hypertension", value: 106 }, { name: "Asthma", value: 79 }, { name: "Heart Disease", value: 60 }, { name: "Paralysis", value: 35 }, { name: "Breathlessness", value: 67 }, { name: "Skin Disease", value: 86 }, { name: "Obesity", value: 74 }, { name: "Acidity", value: 99 }, { name: "Arthritis", value: 116 }, { name: "Thyroid", value: 53 }],
      surgery:    [{ name: "Urine Disorder", value: 43 }, { name: "Hernia", value: 57 }, { name: "Hydrocele", value: 31 }, { name: "Cyst", value: 25 }, { name: "Kidney Stone", value: 83 }, { name: "Piles", value: 67 }, { name: "Fistula", value: 39 }, { name: "Corn", value: 17 }, { name: "Diabetic Wounds", value: 50 }],
      gynecology: [{ name: "Menstrual Disorder", value: 94 }, { name: "Abnormal Vaginal Bleeding", value: 61 }, { name: "Uterine Prolapse", value: 37 }, { name: "Infertility", value: 81 }, { name: "White Discharge", value: 69 }, { name: "Cyst in Breast", value: 48 }, { name: "PCOD", value: 107 }, { name: "ANC", value: 86 }],
      pediatrics: [{ name: "Allergic Rhinitis", value: 74 }, { name: "Malnourish Children", value: 50 }, { name: "Difficulty in Speech", value: 28 }, { name: "Convulsions", value: 24 }, { name: "Not Gaining Weight", value: 62 }, { name: "Cerebral Palsy", value: 16 }, { name: "Obesity in Children", value: 40 }, { name: "Mentally Deficient", value: 20 }, { name: "Other", value: 32 }],
      ent:        [{ name: "Diminished Vision", value: 79 }, { name: "Discharge from Eye", value: 47 }, { name: "Sqint", value: 34 }, { name: "Pterygium", value: 26 }, { name: "Ear Discharge", value: 56 }, { name: "DNS", value: 39 }, { name: "Migraine", value: 67 }],
    },
  },
  2024: {
    totalPatients: 8460,
    totalMale: 4820,
    totalFemale: 3640,
    opdMonthly:   [120, 145, 162, 180, 200, 175, 190, 210, 195, 220, 240, 260],
    ipdMonthly:   [45,  52,  60,  70,  80,  65,  72,  85,  78,  90, 100, 115],
    emgMonthly:   [20,  18,  25,  22,  30,  28,  32,  29,  35,  31,  38,  42],
    depts: [
      { name: "Medicine / Panchakarma", y: 38, color: "#e84c3d" },
      { name: "Surgery",                y: 22, color: "#f5a623" },
      { name: "Gynecology",             y: 16, color: "#6abf6a" },
      { name: "Pediatrics",             y: 12, color: "#38b2ac" },
      { name: "Ophthalmology & ENT",    y:  8, color: "#805ad5" },
      { name: "Other",                  y:  4, color: "#ed64a6" },
    ],
    genderByDept: [
      { category: "Medicine / Panchakarma", male: 55, female: 45 },
      { category: "Surgery",                male: 68, female: 32 },
      { category: "Gynecology",             male: 20, female: 80 },
      { category: "Pediatrics",             male: 48, female: 52 },
      { category: "Ophthalmology & ENT",    male: 57, female: 43 },
      { category: "Other",                  male: 50, female: 50 },
    ],
    conditions: {
      medicine:   [{ name: "Diabetes", value: 142 }, { name: "Hypertension", value: 118 }, { name: "Asthma", value: 87 }, { name: "Heart Disease", value: 64 }, { name: "Paralysis", value: 39 }, { name: "Breathlessness", value: 73 }, { name: "Skin Disease", value: 95 }, { name: "Obesity", value: 81 }, { name: "Acidity", value: 109 }, { name: "Arthritis", value: 126 }, { name: "Thyroid", value: 58 }],
      surgery:    [{ name: "Urine Disorder", value: 47 }, { name: "Hernia", value: 62 }, { name: "Hydrocele", value: 34 }, { name: "Cyst", value: 28 }, { name: "Kidney Stone", value: 91 }, { name: "Piles", value: 74 }, { name: "Fistula", value: 43 }, { name: "Corn", value: 19 }, { name: "Diabetic Wounds", value: 55 }],
      gynecology: [{ name: "Menstrual Disorder", value: 103 }, { name: "Abnormal Vaginal Bleeding", value: 67 }, { name: "Uterine Prolapse", value: 41 }, { name: "Infertility", value: 89 }, { name: "White Discharge", value: 76 }, { name: "Cyst in Breast", value: 53 }, { name: "PCOD", value: 118 }, { name: "ANC", value: 94 }],
      pediatrics: [{ name: "Allergic Rhinitis", value: 82 }, { name: "Malnourish Children", value: 56 }, { name: "Difficulty in Speech", value: 31 }, { name: "Convulsions", value: 27 }, { name: "Not Gaining Weight", value: 69 }, { name: "Cerebral Palsy", value: 18 }, { name: "Obesity in Children", value: 44 }, { name: "Mentally Deficient", value: 22 }, { name: "Other", value: 35 }],
      ent:        [{ name: "Diminished Vision", value: 88 }, { name: "Discharge from Eye", value: 52 }, { name: "Sqint", value: 37 }, { name: "Pterygium", value: 29 }, { name: "Ear Discharge", value: 61 }, { name: "DNS", value: 43 }, { name: "Migraine", value: 74 }],
    },
  },
  2025: {
    totalPatients: 9320,
    totalMale: 5190,
    totalFemale: 4130,
    opdMonthly:   [138, 162, 185, 204, 226, 198, 215, 240, 222, 248, 272, 295],
    ipdMonthly:   [52,  61,  70,  82,  94,  76,  84,  98,  90, 106, 118, 134],
    emgMonthly:   [23,  21,  29,  26,  35,  32,  38,  33,  41,  36,  44,  49],
    depts: [
      { name: "Medicine / Panchakarma", y: 37, color: "#e84c3d" },
      { name: "Surgery",                y: 21, color: "#f5a623" },
      { name: "Gynecology",             y: 17, color: "#6abf6a" },
      { name: "Pediatrics",             y: 13, color: "#38b2ac" },
      { name: "Ophthalmology & ENT",    y:  8, color: "#805ad5" },
      { name: "Other",                  y:  4, color: "#ed64a6" },
    ],
    genderByDept: [
      { category: "Medicine / Panchakarma", male: 54, female: 46 },
      { category: "Surgery",                male: 66, female: 34 },
      { category: "Gynecology",             male: 21, female: 79 },
      { category: "Pediatrics",             male: 47, female: 53 },
      { category: "Ophthalmology & ENT",    male: 55, female: 45 },
      { category: "Other",                  male: 49, female: 51 },
    ],
    conditions: {
      medicine:   [{ name: "Diabetes", value: 158 }, { name: "Hypertension", value: 132 }, { name: "Asthma", value: 98 }, { name: "Heart Disease", value: 72 }, { name: "Paralysis", value: 44 }, { name: "Breathlessness", value: 82 }, { name: "Skin Disease", value: 108 }, { name: "Obesity", value: 94 }, { name: "Acidity", value: 122 }, { name: "Arthritis", value: 140 }, { name: "Thyroid", value: 66 }],
      surgery:    [{ name: "Urine Disorder", value: 53 }, { name: "Hernia", value: 70 }, { name: "Hydrocele", value: 39 }, { name: "Cyst", value: 33 }, { name: "Kidney Stone", value: 104 }, { name: "Piles", value: 85 }, { name: "Fistula", value: 49 }, { name: "Corn", value: 23 }, { name: "Diabetic Wounds", value: 62 }],
      gynecology: [{ name: "Menstrual Disorder", value: 116 }, { name: "Abnormal Vaginal Bleeding", value: 76 }, { name: "Uterine Prolapse", value: 47 }, { name: "Infertility", value: 101 }, { name: "White Discharge", value: 86 }, { name: "Cyst in Breast", value: 61 }, { name: "PCOD", value: 133 }, { name: "ANC", value: 108 }],
      pediatrics: [{ name: "Allergic Rhinitis", value: 93 }, { name: "Malnourish Children", value: 64 }, { name: "Difficulty in Speech", value: 36 }, { name: "Convulsions", value: 31 }, { name: "Not Gaining Weight", value: 78 }, { name: "Cerebral Palsy", value: 21 }, { name: "Obesity in Children", value: 52 }, { name: "Mentally Deficient", value: 26 }, { name: "Other", value: 41 }],
      ent:        [{ name: "Diminished Vision", value: 100 }, { name: "Discharge from Eye", value: 59 }, { name: "Sqint", value: 43 }, { name: "Pterygium", value: 33 }, { name: "Ear Discharge", value: 70 }, { name: "DNS", value: 50 }, { name: "Migraine", value: 85 }],
    },
  },
  2026: {
    totalPatients: 4880,
    totalMale: 2720,
    totalFemale: 2160,
    opdMonthly:   [148, 172, 198, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ipdMonthly:   [56,  65,  76, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    emgMonthly:   [25,  23,  32, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    depts: [
      { name: "Medicine / Panchakarma", y: 38, color: "#e84c3d" },
      { name: "Surgery",                y: 20, color: "#f5a623" },
      { name: "Gynecology",             y: 18, color: "#6abf6a" },
      { name: "Pediatrics",             y: 13, color: "#38b2ac" },
      { name: "Ophthalmology & ENT",    y:  7, color: "#805ad5" },
      { name: "Other",                  y:  4, color: "#ed64a6" },
    ],
    genderByDept: [
      { category: "Medicine / Panchakarma", male: 53, female: 47 },
      { category: "Surgery",                male: 65, female: 35 },
      { category: "Gynecology",             male: 22, female: 78 },
      { category: "Pediatrics",             male: 46, female: 54 },
      { category: "Ophthalmology & ENT",    male: 54, female: 46 },
      { category: "Other",                  male: 48, female: 52 },
    ],
    conditions: {
      medicine:   [{ name: "Diabetes", value: 82 }, { name: "Hypertension", value: 70 }, { name: "Asthma", value: 52 }, { name: "Heart Disease", value: 38 }, { name: "Paralysis", value: 23 }, { name: "Breathlessness", value: 43 }, { name: "Skin Disease", value: 57 }, { name: "Obesity", value: 49 }, { name: "Acidity", value: 64 }, { name: "Arthritis", value: 74 }, { name: "Thyroid", value: 35 }],
      surgery:    [{ name: "Urine Disorder", value: 28 }, { name: "Hernia", value: 37 }, { name: "Hydrocele", value: 21 }, { name: "Cyst", value: 17 }, { name: "Kidney Stone", value: 55 }, { name: "Piles", value: 44 }, { name: "Fistula", value: 26 }, { name: "Corn", value: 12 }, { name: "Diabetic Wounds", value: 33 }],
      gynecology: [{ name: "Menstrual Disorder", value: 61 }, { name: "Abnormal Vaginal Bleeding", value: 40 }, { name: "Uterine Prolapse", value: 25 }, { name: "Infertility", value: 53 }, { name: "White Discharge", value: 45 }, { name: "Cyst in Breast", value: 32 }, { name: "PCOD", value: 70 }, { name: "ANC", value: 57 }],
      pediatrics: [{ name: "Allergic Rhinitis", value: 49 }, { name: "Malnourish Children", value: 34 }, { name: "Difficulty in Speech", value: 19 }, { name: "Convulsions", value: 16 }, { name: "Not Gaining Weight", value: 41 }, { name: "Cerebral Palsy", value: 11 }, { name: "Obesity in Children", value: 27 }, { name: "Mentally Deficient", value: 14 }, { name: "Other", value: 22 }],
      ent:        [{ name: "Diminished Vision", value: 53 }, { name: "Discharge from Eye", value: 31 }, { name: "Sqint", value: 23 }, { name: "Pterygium", value: 17 }, { name: "Ear Discharge", value: 37 }, { name: "DNS", value: 26 }, { name: "Migraine", value: 45 }],
    },
  },
};

const AVAILABLE_YEARS = Object.keys(YEAR_DATA).map(Number).sort();
const DEPT_CATEGORY_META = [
  { id: "medicine",   title: "Medicine / Panchakarma", icon: <PillBottleIcon />, color: "#6366F1", lightColor: "#EEF2FF" },
  { id: "surgery",    title: "Surgery",                icon: <Microscope />,     color: "#F59E0B", lightColor: "#FFFBEB" },
  { id: "gynecology", title: "Gynecology",             icon: <Flower />,         color: "#EC4899", lightColor: "#FDF2F8" },
  { id: "pediatrics", title: "Pediatrics",             icon: <Baby />,           color: "#10B981", lightColor: "#ECFDF5" },
  { id: "ent",        title: "Ophthalmology & ENT",    icon: <Eye />,            color: "#0EA5E9", lightColor: "#F0F9FF" },
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
    if (instanceRef.current) { instanceRef.current.destroy(); }
    instanceRef.current = HC.chart(ref.current, {
      chart: { type: "pie", backgroundColor: "transparent", height: 200, margin: [0,0,0,0], spacing: [4,4,4,4] },
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
    if (instanceRef.current) { instanceRef.current.destroy(); }
    instanceRef.current = window.Highcharts.chart(ref.current, {
      chart: { type: "pie", backgroundColor: "transparent", height: 200, margin: [0,0,0,0], spacing: [4,4,4,4] },
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
    if (instanceRef.current) { instanceRef.current.destroy(); }
    instanceRef.current = HC.chart(ref.current, {
      chart: { type: "column", backgroundColor: "transparent", height: 210, spacing: [8,6,8,4] },
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        labels: { style: { fontSize: "9px", color: "#9ca3af" } },
        lineColor: "#e5e7eb", tickColor: "transparent",
      },
      yAxis: { title: { text: null }, labels: { style: { fontSize: "9px", color: "#9ca3af" } }, gridLineColor: "#f3f4f6", gridLineDashStyle: "Dash" },
      legend: { itemStyle: { fontSize: "10px", fontWeight: "600", color: "#374151" }, align: "right", verticalAlign: "top" },
      tooltip: { shared: true, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0, shadow: true, valueSuffix: " entries" },
      plotOptions: { column: { borderRadius: 4, groupPadding: 0.1, pointPadding: 0.04, animation: { duration: 700 } } },
      series: [
        { name: "OPD",       color: "#f5a623", data: opd },
        { name: "IPD",       color: "#38b2ac", data: ipd },
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
      series.push({ name: "Male",   data: genderData.map((d) => d.male),   color: "#3B82F6", borderRadius: 6, borderWidth: 0 });
    if (filter === "All" || filter === "Female")
      series.push({ name: "Female", data: genderData.map((d) => d.female), color: "#EC4899", borderRadius: 6, borderWidth: 0 });
    return series;
  };

  const renderChart = (HC, filter) => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) { chartInstanceRef.current.destroy(); }
    chartInstanceRef.current = HC.chart(chartRef.current, {
      chart: { type: "bar", backgroundColor: "transparent", animation: { duration: 600 }, spacing: [10,10,10,10], height: 260 },
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
    if (instanceRef.current) instanceRef.current.destroy();
    instanceRef.current = H.chart(chartRef.current, {
      chart: { type: "bar", backgroundColor: "transparent", style: { fontFamily: "'Outfit', sans-serif" }, animation: { duration: 700 }, spacing: [0,10,0,0], height: Math.max(300, sorted.length * 38 + 40) },
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
    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
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
              <p className="text-sm font-semibold text-gray-700 leading-tight mt-0.5 truncate" title={topCondition.name}>{topCondition.name}</p>
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
function MedicalConditionsDashboard({ conditions }) {
  const [visibleCharts, setVisibleCharts] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const catRefs = useRef({});

  // Reset visible charts when conditions change (year change)
  useEffect(() => { setVisibleCharts(new Set()); }, [conditions]);

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
              { label: "Conditions",     value: totalConditions,                 color: "#34D399" },
              { label: "Departments",    value: CATEGORIES.length,               color: "#FB7185" },
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
  const currentYear = new Date().getFullYear();
  const defaultYear = AVAILABLE_YEARS.includes(currentYear) ? currentYear : AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1];
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const data = YEAR_DATA[selectedYear];
  const prevData = YEAR_DATA[selectedYear - 1];

  const malePercent = Math.round((data.totalMale / data.totalPatients) * 100);
  const femalePercent = 100 - malePercent;

  const totalOPD = data.opdMonthly.reduce((a, b) => a + b, 0);
  const totalIPD = data.ipdMonthly.reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen bg-slate-200 rounded-2xl p-2 font-sans text-gray-900 text-[13px]">
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">Report</h1>
            <p className="text-gray-400 text-xs mt-1">Annual statistics — fiscal year {selectedYear}</p>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2.5">
              <CalendarDays size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-gray-500 mr-1">Year</span>
              <div className="flex gap-1">
                {AVAILABLE_YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      selectedYear === y
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >{y}</button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Header Stats */}
          <div className="flex gap-8 flex-wrap">
            {[
              { num: data.totalPatients.toLocaleString(), badge: `${malePercent}% M`, label: "Total Patients", prev: prevData?.totalPatients },
              { num: totalOPD.toLocaleString(),           badge: "OPD",               label: "Annual OPD",     prev: prevData ? prevData.opdMonthly.reduce((a,b)=>a+b,0) : null },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tracking-tight leading-none">{s.num}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-gray-900 text-white rounded-md px-2 py-0.5 text-[11px] font-semibold">{s.badge}</span>
                  <span className="text-gray-400 text-xs">{s.label}</span>
                  {s.prev && <GrowthBadge current={parseInt(s.num.replace(/,/g,""))} previous={s.prev} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Patients",  value: data.totalPatients.toLocaleString(), prev: prevData?.totalPatients,  color: "bg-indigo-50 border-indigo-100", text: "text-indigo-700", sub: "text-indigo-400" },
            { label: "Male Patients",   value: data.totalMale.toLocaleString(),     prev: prevData?.totalMale,      color: "bg-blue-50 border-blue-100",    text: "text-blue-700",   sub: "text-blue-400"   },
            { label: "Female Patients", value: data.totalFemale.toLocaleString(),   prev: prevData?.totalFemale,    color: "bg-pink-50 border-pink-100",    text: "text-pink-700",   sub: "text-pink-400"   },
            { label: "Annual OPD",      value: totalOPD.toLocaleString(),           prev: prevData ? prevData.opdMonthly.reduce((a,b)=>a+b,0) : null, color: "bg-amber-50 border-amber-100", text: "text-amber-700", sub: "text-amber-400" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl border p-4 ${kpi.color}`}>
              <p className={`text-xs font-semibold mb-1 ${kpi.sub}`}>{kpi.label}</p>
              <p className={`text-2xl font-extrabold ${kpi.text}`}>{kpi.value}</p>
              {kpi.prev && (
                <GrowthBadge current={parseInt(kpi.value.replace(/,/g,""))} previous={kpi.prev} />
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
        <MedicalConditionsDashboard conditions={data.conditions} />

      </main>
    </div>
  );
}