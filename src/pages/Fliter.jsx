import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, Loader2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/shared/Footer";

// ─── Table View ────────────────────────────────────────────────────────────────
function TableView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Base_URL = import.meta.env.VITE_BACKEND_API_URL;

  // New API Filters
  const [apiFilters, setApiFilters] = useState({
    villageName: "",
    patientName: "",
    gender: "",
    age: "",
    wardArea: "",
    occupation: "",
    educationLevel: "",
    studentName: "",
    studentRollNumber: "",
    date: "",
    distanceFromHospital: "",
    vargClass: "",
    medicinePanchakarma: "",
    surgery: "",
    gynecology: "",
    pediatrics: "",
    ophthalmologyEnt: "",
    otherHealthIssues: ""
  });

  const [sortCol, setSortCol] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 30;
  const [hasSearched, setHasSearched] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFileName, setExportFileName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key]) {
          params.append(key, apiFilters[key]);
        }
      });
      
      const response = await axios.get(`${Base_URL}/api/csv/filter?${params.toString()}`);
      if (response.data && Array.isArray(response.data)) {
        // Process conditions
        const processedData = response.data.map((item) => {
          const conditions = [];
          const fieldsToCheck = [
            "medicinePanchakarma", "surgery", "gynecology", 
            "pediatrics", "ophthalmologyEnt", "neurologicalPhysiotherapy", "otherHealthIssues"
          ];
          fieldsToCheck.forEach(field => {
            if (item[field] && typeof item[field] === "string" && item[field].toLowerCase() !== "null" && item[field].trim() !== "") {
               const parts = item[field].split(/[\/,]/);
               parts.forEach(p => {
                  const trimmed = p.trim();
                  if (trimmed && !conditions.includes(trimmed)) conditions.push(trimmed);
               });
            }
          });

          return {
            ...item,
            conditions: conditions,
            formattedDate: item.timestamp ? item.timestamp.split(" ")[0] : (item.date || "N/A"),
            patientName: item.patientName || "Unknown",
            studentName: item.studentName || "N/A",
            rollNo: item.studentRollNumber || "N/A",
            village: item.villageName || "N/A",
            ward: item.wardArea || "N/A",
          };
        });
        setData(processedData);
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch filter data:", err);
      setError("Could not load health camp data.");
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let rows = [...data].sort((a, b) => {
      let av = a[sortCol] || "";
      let bv = b[sortCol] || "";
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [data, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  const sort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };
  const arrow = (col) => sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const allOnPageChecked = pageData.length > 0 && pageData.every((r) => selected.includes(r.id));
  const toggleAll = (checked) => setSelected(checked ? pageData.map((r) => r.id) : []);
  const toggleOne = (id, checked) =>
    setSelected((s) => checked ? [...s, id] : s.filter((x) => x !== id));

  const clearFilters = () => {
    setApiFilters({
      villageName: "", patientName: "", gender: "", age: "",
      wardArea: "", occupation: "", educationLevel: "", studentName: "",
      studentRollNumber: "", date: "", distanceFromHospital: "", vargClass: "",
      medicinePanchakarma: "", surgery: "", gynecology: "", pediatrics: "",
      ophthalmologyEnt: "", otherHealthIssues: ""
    });
    setData([]);
    setHasSearched(false);
    setPage(1);
  };

  const openExportModal = () => {
    if (!filtered || filtered.length === 0) return;
    setExportFileName(`Health_Camp_Records_${new Date().toISOString().split('T')[0]}`);
    setShowExportModal(true);
  };

  const confirmExport = () => {
    if (!filtered || filtered.length === 0) return;

    const headers = [
      "HC ID", "Date", "Patient", "Age", "Gender", "Mobile", "Village", "Ward",
      "Medicine/Panchakarma", "Panchakarma", "Surgery", "Gynecology",
      "Pediatrics", "Ophthalmology/ENT", "Neurological/Physiotherapy",
      "Other Health Issues", "Heard About DMAMCHRC", "How Heard",
      "Education", "Occupation", "Student Name", "Roll No."
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    filtered.forEach(row => {
      const values = [
        row.id,
        row.timestamp || row.formattedDate,
        row.patientName,
        row.age,
        row.gender,
        row.mobileNumber,
        row.village,
        row.ward,
        row.medicinePanchakarma,
        row.panchakarma,
        row.surgery,
        row.gynecology,
        row.pediatrics,
        row.ophthalmologyEnt,
        row.neurologicalPhysiotherapy,
        row.otherHealthIssues,
        row.heardAboutDmamchrc,
        row.howHeardAboutDmamchrc,
        row.educationLevel,
        row.occupation,
        row.studentName,
        row.rollNo
      ].map(val => {
        const strVal = (val === null || val === undefined) ? "" : String(val);
        const escapedVal = strVal.replace(/"/g, '""');
        return `"${escapedVal}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const finalFileName = exportFileName.trim() ? (exportFileName.trim().toLowerCase().endsWith('.csv') ? exportFileName.trim() : `${exportFileName.trim()}.csv`) : `Health_Camp_Records.csv`;
    link.setAttribute("download", finalFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const SortTh = ({ col, children, className = "" }) => (
    <TableHead
      onClick={() => sort(col)}
      className={`cursor-pointer text-gray-900 select-none whitespace-nowrap hover:bg-gray-100 transition-colors bg-white ${className}`}
    >
      {children}{arrow(col)}
    </TableHead>
  );

  return (
    <>
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Export Records</h3>
              <p className="text-sm text-gray-500 mt-1">Provide a custom name for the exported CSV file.</p>
            </div>
            <Input
              value={exportFileName}
              onChange={(e) => setExportFileName(e.target.value)}
              placeholder="e.g. Health_Camp_Data"
              autoFocus
              className="focus-visible:ring-emerald-500 text-gray-900 bg-white border-gray-300"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setShowExportModal(false)} className="border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</Button>
              <Button onClick={confirmExport} className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm">Save & Download</Button>
            </div>
          </div>
        </div>
      )}
      <Card className="bg-white border border-gray-200 shadow-none rounded-xl relative z-10 w-full">
        <CardHeader className="pb-4 bg-white rounded-t-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-lg text-gray-900">Health Camp Records</CardTitle>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading data..." : `${filtered.length} entries found`}
            </p>
          </div>
          {selected.length > 0 && (
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
              {selected.length} selected
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <Input
              placeholder="Village Name"
              value={apiFilters.villageName}
              onChange={(e) => setApiFilters({ ...apiFilters, villageName: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            <Input
              placeholder="Patient Name"
              value={apiFilters.patientName}
              onChange={(e) => setApiFilters({ ...apiFilters, patientName: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            
            <Select value={apiFilters.gender || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, gender: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Gender</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Transgender">Transgender</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Age"
              type="number"
              value={apiFilters.age}
              onChange={(e) => setApiFilters({ ...apiFilters, age: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            <Input
              placeholder="Ward Area"
              value={apiFilters.wardArea}
              onChange={(e) => setApiFilters({ ...apiFilters, wardArea: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            
            <Select value={apiFilters.occupation || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, occupation: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Occupation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Occupation</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Homemaker">Homemaker</SelectItem>
                <SelectItem value="Private Job">Private Job</SelectItem>
                <SelectItem value="Government Job">Government Job</SelectItem>
                <SelectItem value="Business/self Employed">Business/self Employed</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={apiFilters.educationLevel || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, educationLevel: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Education Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Education Level</SelectItem>
                <SelectItem value="Illiterate">Illiterate</SelectItem>
                <SelectItem value="Upto 10th standard">Upto 10th standard</SelectItem>
                <SelectItem value="HSC">HSC</SelectItem>
                <SelectItem value="Graduate">Graduate</SelectItem>
                <SelectItem value="Postgraduate and above">Postgraduate and above</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Student Name"
              value={apiFilters.studentName}
              onChange={(e) => setApiFilters({ ...apiFilters, studentName: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            <Input
              placeholder="Student Roll No"
              value={apiFilters.studentRollNumber}
              onChange={(e) => setApiFilters({ ...apiFilters, studentRollNumber: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            <Input
              type="date"
              placeholder="Date"
              value={apiFilters.date}
              onChange={(e) => setApiFilters({ ...apiFilters, date: e.target.value })}
              className="bg-white border-gray-200 text-gray-500 focus-visible:ring-gray-300"
            />
            <Input
              placeholder="Distance From Hospital"
              value={apiFilters.distanceFromHospital}
              onChange={(e) => setApiFilters({ ...apiFilters, distanceFromHospital: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
            <Input
              placeholder="Varg/Class"
              value={apiFilters.vargClass}
              onChange={(e) => setApiFilters({ ...apiFilters, vargClass: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />

            <Select value={apiFilters.medicinePanchakarma || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, medicinePanchakarma: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Medicine / Panchakarma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Medicine/Panchakarma</SelectItem>
                <SelectItem value="Diabetes">Diabetes</SelectItem>
                <SelectItem value="Hypertention">Hypertention</SelectItem>
                <SelectItem value="Asthama">Asthama</SelectItem>
                <SelectItem value="Heart disease">Heart disease</SelectItem>
                <SelectItem value="Paralysis">Paralysis</SelectItem>
                <SelectItem value="Breathlesness,Weakness">Breathlesness,Weakness</SelectItem>
                <SelectItem value="Skin Disease">Skin Disease</SelectItem>
                <SelectItem value="Obesity">Obesity</SelectItem>
                <SelectItem value="Acidity/Hyper Acidity">Acidity/Hyper Acidity</SelectItem>
                <SelectItem value="Arthritis/knee pain/Back pain">Arthritis/knee pain/Back pain</SelectItem>
                <SelectItem value="Thyroid">Thyroid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={apiFilters.surgery || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, surgery: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Surgery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Surgery</SelectItem>
                <SelectItem value="Urine Disorder">Urine Disorder</SelectItem>
                <SelectItem value="Hernia">Hernia</SelectItem>
                <SelectItem value="Hydrocele">Hydrocele</SelectItem>
                <SelectItem value="Cyst">Cyst</SelectItem>
                <SelectItem value="Kidney Stone">Kidney Stone</SelectItem>
                <SelectItem value="Piles/Haemorrhoids">Piles/Haemorrhoids</SelectItem>
                <SelectItem value="Fistula">Fistula</SelectItem>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Diabetic Wounds, Venous Ulcers">Diabetic Wounds, Venous Ulcers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={apiFilters.gynecology || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, gynecology: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Gynecology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Gynecology</SelectItem>
                <SelectItem value="Menstrual Disorder">Menstrual Disorder</SelectItem>
                <SelectItem value="Abnormal vaginal bleeding">Abnormal vaginal bleeding</SelectItem>
                <SelectItem value="Uterine Prolapse">Uterine Prolapse</SelectItem>
                <SelectItem value="Infertility">Infertility</SelectItem>
                <SelectItem value="White Discharge">White Discharge</SelectItem>
                <SelectItem value="Cyst in a breast">Cyst in a breast</SelectItem>
                <SelectItem value="PCOD">PCOD</SelectItem>
                <SelectItem value="ANC">ANC</SelectItem>
              </SelectContent>
            </Select>

            <Select value={apiFilters.pediatrics || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, pediatrics: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Pediatrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Pediatrics</SelectItem>
                <SelectItem value="Allergic Rhinitis">Allergic Rhinitis</SelectItem>
                <SelectItem value="Malnourish Children">Malnourish Children</SelectItem>
                <SelectItem value="Difficulty in Speech to child">Difficulty in Speech to child</SelectItem>
                <SelectItem value="Convulsions">Convulsions</SelectItem>
                <SelectItem value="Not gaining weight">Not gaining weight</SelectItem>
                <SelectItem value="Cerebral Palsy">Cerebral Palsy</SelectItem>
                <SelectItem value="Obesity in Children">Obesity in Children</SelectItem>
                <SelectItem value="Mentally Deficient">Mentally Deficient</SelectItem>
                <SelectItem value="Other:">Other:</SelectItem>
              </SelectContent>
            </Select>

            <Select value={apiFilters.ophthalmologyEnt || undefined} onValueChange={(val) => setApiFilters({ ...apiFilters, ophthalmologyEnt: val === "all" ? "" : val })}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300">
                <SelectValue placeholder="Ophthalmology & ENT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Ophthalmology & ENT</SelectItem>
                <SelectItem value="Diminished Vision">Diminished Vision</SelectItem>
                <SelectItem value="Discharge from eye">Discharge from eye</SelectItem>
                <SelectItem value="Sqint">Sqint</SelectItem>
                <SelectItem value="Pterygium">Pterygium</SelectItem>
                <SelectItem value="Ear discharge">Ear discharge</SelectItem>
                <SelectItem value="DNS">DNS</SelectItem>
                <SelectItem value="Migraine">Migraine</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Any other health issues"
              value={apiFilters.otherHealthIssues}
              onChange={(e) => setApiFilters({ ...apiFilters, otherHealthIssues: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-gray-300"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={openExportModal}
              disabled={filtered.length === 0}
              className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <Download className="w-4 h-4 mr-2" /> Export Excel/CSV
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-white border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
            <Button
              onClick={() => { setPage(1); fetchData(); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" /> Apply Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white rounded-b-xl relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="p-10 text-center text-red-500 font-medium">
             {error}
          </div>
        )}

        {/* Scrollable container for the table */}
        <div className="overflow-x-auto overflow-y-hidden border-t border-gray-100">
          <Table className="w-full min-w-max">
            <TableHeader>
              <TableRow className="bg-gray-50 text-black border-none">
                <TableHead className="w-10 bg-gray-50 sticky left-0 z-20 shadow-[1px_0_0_#f3f4f6]">
                  <Checkbox
                    checked={allOnPageChecked}
                    onCheckedChange={toggleAll}
                    className="border-gray-300 bg-white"
                  />
                </TableHead>
                <SortTh col="id" className="min-w-[120px]">HC ID</SortTh>
                <SortTh col="timestamp" className="min-w-[140px]">Date</SortTh>
                <SortTh col="patientName" className="min-w-[180px]">Patient</SortTh>
                <SortTh col="age" className="min-w-[80px]">Age</SortTh>
                <SortTh col="gender" className="min-w-[100px]">Gender</SortTh>
                <SortTh col="mobileNumber" className="min-w-[130px]">Mobile</SortTh>
                <SortTh col="village" className="min-w-[150px]">Village</SortTh>
                <SortTh col="ward" className="min-w-[150px]">Ward</SortTh>
                <SortTh col="medicinePanchakarma" className="min-w-[160px]">Medicine / Panchakarma</SortTh>
                <SortTh col="panchakarma" className="min-w-[120px]">Panchakarma</SortTh>
                <SortTh col="surgery" className="min-w-[120px]">Surgery</SortTh>
                <SortTh col="gynecology" className="min-w-[120px]">Gynecology</SortTh>
                <SortTh col="pediatrics" className="min-w-[120px]">Pediatrics</SortTh>
                <SortTh col="ophthalmologyEnt" className="min-w-[150px]">Ophthalmology/ENT</SortTh>
                <SortTh col="neurologicalPhysiotherapy" className="min-w-[180px]">Neurological/Physiotherapy</SortTh>
                <SortTh col="otherHealthIssues" className="min-w-[160px]">Other Health Issues</SortTh>
                <SortTh col="heardAboutDmamchrc" className="min-w-[160px]">Heard About DMAMCHRC?</SortTh>
                <SortTh col="howHeardAboutDmamchrc" className="min-w-[180px]">How Heard About DMAMCHRC</SortTh>
                <SortTh col="educationLevel" className="min-w-[160px]">Education</SortTh>
                <SortTh col="occupation" className="min-w-[140px]">Occupation</SortTh>
                <SortTh col="studentName" className="min-w-[180px]">Student</SortTh>
                <SortTh col="rollNo" className="min-w-[100px]">Roll No.</SortTh>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && !error && (!hasSearched ? (
                <TableRow>
                  <TableCell colSpan={23} className="text-center py-16 text-gray-500 bg-white border-b-0">
                    <div className="flex flex-col items-start ml-20  justify-center">
                       <Search className="w-10 h-10 mb-3 opacity-20 ml-40 text-emerald-600" />
                       <p className="text-lg font-medium text-gray-700 ml-20 mb-1">Apply filters to view records</p>
                       <p className="text-sm">Set your search criteria above and click 'Apply Filters' to fetch data.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={23} className="text-center py-12 text-gray-400 bg-white border-b-0">
                    <div className="flex flex-col items-center justify-center">
                       <Search className="w-8 h-8 mb-2 opacity-20" />
                       <p>No records found matching your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pageData.map((r) => (
                <TableRow
                  key={r.id}
                  className="bg-white hover:bg-slate-50 transition-colors border-b border-gray-100"
                >
                  <TableCell className="bg-white sticky left-0 z-10 shadow-[1px_0_0_#f3f4f6]">
                    <Checkbox
                      checked={selected.includes(r.id)}
                      onCheckedChange={(checked) => toggleOne(r.id, checked)}
                      className="border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600 text-xs">
                     <span title={r.id}>{r.id?.slice(0, 8)}...</span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                     {r.timestamp?.replace(" ", " at ") || r.formattedDate}
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium whitespace-nowrap">{r.patientName}</TableCell>
                  <TableCell className="text-gray-600">{r.age}{r.age ? 'y' : ''}</TableCell>
                  <TableCell className="text-gray-600">{r.gender}</TableCell>
                  <TableCell className="text-gray-600 font-mono text-xs">{r.mobileNumber || "N/A"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[150px]" title={r.village}>{r.village}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[150px]" title={r.ward}>{r.ward}</TableCell>
                  
                  <TableCell className="text-gray-600 truncate max-w-[160px]" title={r.medicinePanchakarma}>{r.medicinePanchakarma || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[120px]" title={r.panchakarma}>{r.panchakarma || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[120px]" title={r.surgery}>{r.surgery || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[120px]" title={r.gynecology}>{r.gynecology || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[120px]" title={r.pediatrics}>{r.pediatrics || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[150px]" title={r.ophthalmologyEnt}>{r.ophthalmologyEnt || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[180px]" title={r.neurologicalPhysiotherapy}>{r.neurologicalPhysiotherapy || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[160px]" title={r.otherHealthIssues}>{r.otherHealthIssues || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[160px]" title={r.heardAboutDmamchrc}>{r.heardAboutDmamchrc || "-"}</TableCell>
                  <TableCell className="text-gray-600 truncate max-w-[180px]" title={r.howHeardAboutDmamchrc}>{r.howHeardAboutDmamchrc || "-"}</TableCell>
                  
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">{r.educationLevel || "N/A"}</TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">{r.occupation || "N/A"}</TableCell>
                  <TableCell className="text-gray-800 whitespace-nowrap">{r.studentName}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{r.rollNo}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
          <span className="text-sm font-medium text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
              Previous
            </Button>
            <div className="hidden sm:flex gap-1">
               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                 let p = i + 1;
                 // Center logic for pagination if lots of pages
                 if (totalPages > 5 && page > 3) {
                    p = page - 3 + i + (page + 2 > totalPages ? totalPages - page - 2 : 0);
                 }
                 return p > 0 && p <= totalPages ? (
                 <Button
                   key={p}
                   size="sm"
                   onClick={() => setPage(p)}
                   className={
                     page === p
                       ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-sm"
                       : "bg-white border text-gray-600 hover:bg-gray-50 border-white hover:border-gray-200"
                   }
                 >
                   {p}
                 </Button>
               ) : null;
               })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    <Footer/>
    </>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function Filter() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <TableView />
      </div>
    </div>
  );
}