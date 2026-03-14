import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const dummyData = [
  { id:"HC-001", rollNo:"2023001", student:"Priya Sharma", phone:"9876543210", email:"priya@student.edu", village:"Wanadongri", ward:"Ward 5", patient:"Sunita Devi", age:45, patientPhone:"9845001234", edu:"Upto 10th standard", gender:"Female", occ:"Homemaker", heardAbout:"Yes", howHear:["Social Media"], conditions:["Diabetes","Arthritis/knee pain/Back pain"], date:"2026-03-01", doctor:"Dr. Rane", status:"Completed" },
  { id:"HC-002", rollNo:"2023045", student:"Rahul Patil", phone:"9123456789", email:"rahul@student.edu", village:"Hingna", ward:"Ward 2", patient:"Ramesh Kumar", age:62, patientPhone:"9812345678", edu:"Graduate", gender:"Male", occ:"Retired", heardAbout:"Yes", howHear:["Health Camp"], conditions:["Hypertension","Heart disease"], date:"2026-03-02", doctor:"Dr. Joshi", status:"Pending" },
  { id:"HC-003", rollNo:"2023078", student:"Neha Tiwari", phone:"9765432100", email:"neha@student.edu", village:"Butibori", ward:"Ward 9", patient:"Meena Bai", age:33, patientPhone:"9823456789", edu:"HSC", gender:"Female", occ:"Homemaker", heardAbout:"Yes", howHear:["Referred by Doctor"], conditions:["PCOD","Menstrual Disorder"], date:"2026-03-03", doctor:"Dr. Kulkarni", status:"Completed" },
  { id:"HC-004", rollNo:"2023112", student:"Amit Verma", phone:"9654321098", email:"amit@student.edu", village:"Kamptee", ward:"Ward 3", patient:"Suresh Rao", age:55, patientPhone:"9867890123", edu:"Postgraduate and above", gender:"Male", occ:"Government Job", heardAbout:"Yes", howHear:["Newspaper"], conditions:["Paralysis","Asthama"], date:"2026-03-04", doctor:"Dr. Rane", status:"Follow-up" },
  { id:"HC-005", rollNo:"2023156", student:"Anjali Desai", phone:"9543219876", email:"anjali@student.edu", village:"Nandanvan", ward:"Ward 7", patient:"Lata Verma", age:28, patientPhone:"9898765432", edu:"Graduate", gender:"Female", occ:"Private Job", heardAbout:"No", howHear:["Friends/Family"], conditions:["Obesity","Thyroid"], date:"2026-03-05", doctor:"Dr. Mehta", status:"Pending" },
  { id:"HC-006", rollNo:"2023198", student:"Vikram Singh", phone:"9432198765", email:"vikram@student.edu", village:"Somalwada", ward:"Ward 1", patient:"Arjun Patil", age:70, patientPhone:"9877654321", edu:"Illiterate", gender:"Male", occ:"Unemployed", heardAbout:"Yes", howHear:["Flex boards/Posters"], conditions:["Piles/Haemorrhoids","Kidney Stone"], date:"2026-03-06", doctor:"Dr. Joshi", status:"Completed" },
  { id:"HC-007", rollNo:"2023234", student:"Pooja Nair", phone:"9321987654", email:"pooja@student.edu", village:"Besa", ward:"Ward 12", patient:"Kavita Shah", age:38, patientPhone:"9856341200", edu:"HSC", gender:"Female", occ:"Business/self Employed", heardAbout:"Yes", howHear:["Social Media"], conditions:["Diminished Vision","Migraine"], date:"2026-03-07", doctor:"Dr. Kulkarni", status:"Follow-up" },
  { id:"HC-008", rollNo:"2023267", student:"Suresh Yadav", phone:"9210987643", email:"suresh@student.edu", village:"Wathoda", ward:"Ward 6", patient:"Dinesh More", age:48, patientPhone:"9834560987", edu:"Upto 10th standard", gender:"Male", occ:"Student", heardAbout:"Yes", howHear:["Health Camp"], conditions:["Acidity/Hyper Acidity","Skin Disease"], date:"2026-03-08", doctor:"Dr. Rane", status:"Completed" },
  { id:"HC-009", rollNo:"2023301", student:"Rekha Joshi", phone:"9109876532", email:"rekha@student.edu", village:"Mankapur", ward:"Ward 4", patient:"Savita Boro", age:22, patientPhone:"9812009876", edu:"Graduate", gender:"Female", occ:"Homemaker", heardAbout:"No", howHear:["Referred by Doctor"], conditions:["Infertility","White Discharge"], date:"2026-03-09", doctor:"Dr. Mehta", status:"Pending" },
  { id:"HC-010", rollNo:"2023345", student:"Kiran Bhosale", phone:"9000876543", email:"kiran@student.edu", village:"Pratap Nagar", ward:"Ward 8", patient:"Mohan Das", age:10, patientPhone:"9845670123", edu:"Illiterate", gender:"Male", occ:"Student", heardAbout:"Yes", howHear:["Friends/Family"], conditions:["Malnourish Children","Cerebral Palsy"], date:"2026-03-10", doctor:"Dr. Joshi", status:"Completed" },
  { id:"HC-011", rollNo:"2023389", student:"Divya Kulkarni", phone:"8888776655", email:"divya@student.edu", village:"Hudkeshwar", ward:"Ward 11", patient:"Anita Raut", age:50, patientPhone:"9871234560", edu:"Postgraduate and above", gender:"Female", occ:"Government Job", heardAbout:"Yes", howHear:["Newspaper"], conditions:["Arthritis/knee pain/Back pain","Breathlesness, Weakness"], date:"2026-03-11", doctor:"Dr. Rane", status:"Follow-up" },
  { id:"HC-012", rollNo:"2023412", student:"Manish Tomar", phone:"8777665544", email:"manish@student.edu", village:"Koradi", ward:"Ward 10", patient:"Raju Mishra", age:65, patientPhone:"9854321098", edu:"Upto 10th standard", gender:"Male", occ:"Retired", heardAbout:"Yes", howHear:["Social Media"], conditions:["Hernia","Urine Disorder"], date:"2026-03-12", doctor:"Dr. Kulkarni", status:"Completed" },
];

const statusClass = {
  Completed:   "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50",
  Pending:     "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50",
  "Follow-up": "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50",
};

// ─── Table View ────────────────────────────────────────────────────────────────
function TableView() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [sortCol, setSortCol]           = useState("date");
  const [sortDir, setSortDir]           = useState("desc");
  const [selected, setSelected]         = useState([]);
  const [page, setPage]                 = useState(1);
  const perPage = 8;

  const doctors = ["All", ...Array.from(new Set(dummyData.map((d) => d.doctor)))];

  const filtered = useMemo(() => {
    let rows = dummyData.filter((r) => {
      const q = search.toLowerCase();
      if (q && ![r.id, r.student, r.patient, r.rollNo].some((v) => v.toLowerCase().includes(q))) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (doctorFilter !== "All" && r.doctor !== doctorFilter) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [search, statusFilter, doctorFilter, dateFrom, dateTo, sortCol, sortDir]);

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
    setSearch(""); setStatusFilter("All"); setDateFrom(""); setDateTo(""); setDoctorFilter("All"); setPage(1);
  };

  const SortTh = ({ col, children }) => (
    <TableHead
      onClick={() => sort(col)}
      className="cursor-pointer text-gray-900 select-none whitespace-nowrap hover:text-gray-900 transition-colors bg-white"
    >
      {children}{arrow(col)}
    </TableHead>
  );

  return (
    <Card className="bg-white border border-gray-200 shadow-none rounded-xl">
      <CardHeader className="pb-4 bg-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900">Health Camp Records</CardTitle>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} entries found</p>
          </div>
          {selected.length > 0 && (
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
              {selected.length} selected
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ID, student, patient…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="w-auto bg-white border-gray-200 text-gray-700 focus-visible:ring-gray-300"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="w-auto bg-white border-gray-200 text-gray-700 focus-visible:ring-gray-300"
          />

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] bg-white border-gray-200 text-gray-700 focus:ring-gray-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {["All", "Completed", "Pending", "Follow-up"].map((s) => (
                <SelectItem key={s} value={s} className="text-gray-700 focus:bg-gray-50">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={doctorFilter} onValueChange={(v) => { setDoctorFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200 text-gray-700 focus:ring-gray-300">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {doctors.map((d) => (
                <SelectItem key={d} value={d} className="text-gray-700 focus:bg-gray-50">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="bg-white border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white rounded-b-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader >
              <TableRow className="bg-gray-50 text-black border-y border-gray-100">
                <TableHead className="w-10 bg-gray-50">
                  <Checkbox
                    checked={allOnPageChecked}
                    onCheckedChange={toggleAll}
                    className="border-gray-300"
                  />
                </TableHead>
                <SortTh col="id">HC ID</SortTh>
                <SortTh col="rollNo">Roll No.</SortTh>
                <SortTh col="student">Student</SortTh>
                <SortTh col="patient">Patient</SortTh>
                <SortTh col="village">Village</SortTh>
                <SortTh col="gender">Gender</SortTh>
                <SortTh col="age">Age</SortTh>
                <TableHead className="bg-white">Conditions</TableHead>
                <SortTh col="doctor">Doctor</SortTh>
                <SortTh col="date">Date</SortTh>
                <SortTh col="status">Status</SortTh>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-10 text-gray-400 bg-white">
                    No records found
                  </TableCell>
                </TableRow>
              ) : pageData.map((r) => (
                <TableRow
                  key={r.id}
                  className="bg-white hover:bg-gray-50/70 border-b border-gray-100 transition-colors"
                >
                  <TableCell className="bg-transparent">
                    <Checkbox
                      checked={selected.includes(r.id)}
                      onCheckedChange={(checked) => toggleOne(r.id, checked)}
                      className="border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">{r.id}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-400">{r.rollNo}</TableCell>
                  <TableCell className="text-gray-800">{r.student}</TableCell>
                  <TableCell className="text-gray-800">{r.patient}</TableCell>
                  <TableCell className="text-gray-400 text-xs">{r.village}</TableCell>
                  <TableCell className="text-xs text-gray-600">{r.gender}</TableCell>
                  <TableCell className="text-xs text-gray-600">{r.age}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {r.conditions.slice(0, 2).map((c) => (
                        <Badge
                          key={c}
                          className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"
                        >
                          {c}
                        </Badge>
                      ))}
                      {r.conditions.length > 2 && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-white text-gray-400 border border-gray-200 hover:bg-white">
                          +{r.conditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{r.doctor}</TableCell>
                  <TableCell className="text-xs text-gray-400">{r.date}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-medium ${statusClass[r.status]}`}>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white rounded-b-xl">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
              ←
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="sm"
                onClick={() => setPage(p)}
                className={
                  page === p
                    ? "bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
              →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function Filter() {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <TableView />
      </div>
    </div>
  );
}