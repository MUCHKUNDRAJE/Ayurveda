import React, { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, X, MapPin, User, Activity, 
  Users, Calendar, Filter, Download, ChevronLeft, ChevronRight, Hash, GraduationCap, ClipboardList, DatabaseZap
} from "lucide-react";
import * as XLSX from "xlsx";

// ─── Data Source (17 People) ───────────────────────────────────────────────────
const dummyData = [
  { id:"HC-017", rollNo:"2023501", student:"Snehal Raut", village:"Zari", patient:"Keshavrao Jha", age:68, gender:"Male", conditions:["Cataract","Hypertension"], date:"2026-03-17", doctor:"Dr. Joshi", status:"Pending" },
  { id:"HC-016", rollNo:"2023488", student:"Yash Deshmukh", village:"Parsodi", patient:"Shaila Taneja", age:42, gender:"Female", conditions:["Back pain","Anemia"], date:"2026-03-16", doctor:"Dr. Mehta", status:"Completed" },
  { id:"HC-015", rollNo:"2023450", student:"Rohan Gokhale", village:"Bori", patient:"Vikas Meshram", age:55, gender:"Male", conditions:["Diabetes","Foot Ulcer"], date:"2026-03-15", doctor:"Dr. Rane", status:"Follow-up" },
  { id:"HC-014", rollNo:"2023432", student:"Tanvi Kadam", village:"Kalmeshwar", patient:"Laxmi Bai", age:30, gender:"Female", conditions:["Thyroid","PCOD"], date:"2026-03-14", doctor:"Dr. Kulkarni", status:"Completed" },
  { id:"HC-013", rollNo:"2023420", student:"Sahil Wankhede", village:"Gumgaon", patient:"Baba Sheikh", age:60, gender:"Male", conditions:["Asthma","Weakness"], date:"2026-03-13", doctor:"Dr. Joshi", status:"Pending" },
  { id:"HC-012", rollNo:"2023412", student:"Manish Tomar", village:"Koradi", patient:"Raju Mishra", age:65, gender:"Male", conditions:["Hernia","Urine Disorder"], date:"2026-03-12", doctor:"Dr. Kulkarni", status:"Completed" },
  { id:"HC-011", rollNo:"2023389", student:"Divya Kulkarni", village:"Hudkeshwar", patient:"Anita Raut", age:50, gender:"Female", conditions:["Arthritis","Weakness"], date:"2026-03-11", doctor:"Dr. Rane", status:"Follow-up" },
  { id:"HC-010", rollNo:"2023345", student:"Kiran Bhosale", village:"Pratap Nagar", patient:"Mohan Das", age:10, gender:"Male", conditions:["Malnourish","Cerebral Palsy"], date:"2026-03-10", doctor:"Dr. Joshi", status:"Completed" },
  { id:"HC-009", rollNo:"2023301", student:"Rekha Joshi", village:"Mankapur", patient:"Savita Boro", age:22, gender:"Female", conditions:["Infertility","White Discharge"], date:"2026-03-09", doctor:"Dr. Mehta", status:"Pending" },
  { id:"HC-008", rollNo:"2023267", student:"Suresh Yadav", village:"Wathoda", patient:"Dinesh More", age:48, gender:"Male", conditions:["Acidity","Skin Disease"], date:"2026-03-08", doctor:"Dr. Rane", status:"Completed" },
  { id:"HC-007", rollNo:"2023234", student:"Pooja Nair", village:"Besa", patient:"Kavita Shah", age:38, gender:"Female", conditions:["Vision","Migraine"], date:"2026-03-07", doctor:"Dr. Kulkarni", status:"Follow-up" },
  { id:"HC-006", rollNo:"2023198", student:"Vikram Singh", village:"Somalwada", patient:"Arjun Patil", age:70, gender:"Male", conditions:["Piles","Kidney Stone"], date:"2026-03-06", doctor:"Dr. Joshi", status:"Completed" },
  { id:"HC-005", rollNo:"2023156", student:"Anjali Desai", village:"Nandanvan", patient:"Lata Verma", age:28, gender:"Female", conditions:["Obesity","Thyroid"], date:"2026-03-05", doctor:"Dr. Mehta", status:"Pending" },
  { id:"HC-004", rollNo:"2023112", student:"Amit Verma", village:"Kamptee", patient:"Suresh Rao", age:55, gender:"Male", conditions:["Paralysis","Asthama"], date:"2026-03-04", doctor:"Dr. Rane", status:"Follow-up" },
  { id:"HC-003", rollNo:"2023078", student:"Neha Tiwari", village:"Butibori", patient:"Meena Bai", age:33, gender:"Female", conditions:["PCOD","Disorder"], date:"2026-03-03", doctor:"Dr. Kulkarni", status:"Completed" },
  { id:"HC-002", rollNo:"2023045", student:"Rahul Patil", village:"Hingna", patient:"Ramesh Kumar", age:62, gender:"Male", conditions:["Hypertension","Heart disease"], date:"2026-03-02", doctor:"Dr. Joshi", status:"Pending" },
  { id:"HC-001", rollNo:"2023001", student:"Priya Sharma", village:"Wanadongri", patient:"Sunita Devi", age:45, gender:"Female", conditions:["Diabetes","Arthritis"], date:"2026-03-01", doctor:"Dr. Rane", status:"Completed" },
];

const statusClass = {
  Completed: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  "Follow-up": "bg-blue-100 text-blue-800 border-blue-200",
};

export default function PatientPortal() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [villageFilter, setVillageFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const options = useMemo(() => ({
    villages: ["All", ...new Set(dummyData.map(d => d.village))],
    doctors: ["All", ...new Set(dummyData.map(d => d.doctor))],
    conditions: ["All", ...new Set(dummyData.flatMap(d => d.conditions || []))],
  }), []);

  // ─── Search & Filter Logic ───
  const filteredData = useMemo(() => {
    return dummyData.filter(item => {
      const q = search.toLowerCase();
      // Improved multi-field search logic
      const matchesSearch = !search || 
        item.id.toLowerCase().includes(q) || 
        item.patient.toLowerCase().includes(q) || 
        item.student.toLowerCase().includes(q) ||
        item.rollNo.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesVillage = villageFilter === "All" || item.village === villageFilter;
      const matchesDoctor = doctorFilter === "All" || item.doctor === doctorFilter;
      const matchesGender = genderFilter === "All" || item.gender === genderFilter;
      const matchesCondition = conditionFilter === "All" || item.conditions.includes(conditionFilter);
      const matchesDate = !dateFilter || item.date === dateFilter;
      const matchesAge = (!ageMin || item.age >= parseInt(ageMin)) && (!ageMax || item.age <= parseInt(ageMax));

      return matchesSearch && matchesStatus && matchesVillage && matchesDoctor && 
             matchesGender && matchesCondition && matchesAge && matchesDate;
    });
  }, [search, statusFilter, villageFilter, doctorFilter, genderFilter, conditionFilter, ageMin, ageMax, dateFilter]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const resetFilters = () => {
    setSearch(""); setStatusFilter("All"); setVillageFilter("All"); setDoctorFilter("All");
    setGenderFilter("All"); setConditionFilter("All"); setAgeMin(""); setAgeMax(""); 
    setDateFilter(""); setCurrentPage(1);
  };

  const handleExportExcel = () => {
  // 1. Prepare and format the data for Excel
  const excelData = filteredData.map((item) => ({
    "HC ID": item.id,
    "Roll No": item.rollNo,
    "Student Name": item.student,
    "Patient Name": item.patient,
    "Village": item.village,
    "Gender": item.gender,
    "Age": item.age,
    "Conditions": item.conditions.join(", "), // Flatten the array into a string
    "Doctor": item.doctor,
    "Visit Date": item.date,
    "Status": item.status,
  }));

  // 2. Create the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

  // 3. Trigger the download
  XLSX.writeFile(workbook, `HealthCamp_Records_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card className="max-w-[1550px] mx-auto shadow-sm border-gray-200 bg-white">
        <CardHeader className="space-y-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-6 h-6 text-blue-600" /> Patient Analytics Portal
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">{filteredData.length} active records based on filters</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportExcel} 
                variant="outline" 
                className="h-9 px-4 text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 active:scale-95 flex items-center gap-2 font-medium shadow-sm"
              >
                <Download className="w-4 h-4" /> 
                Export Excel
              </Button>
              <Button onClick={resetFilters} variant="destructive" className="h-9 bg-black hover:bg-gray-800">
                <X className="w-4 h-4 mr-2" /> Reset All
              </Button>
            </div>
          </div>

          {/* ─── FILTERS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-4  gap-x-12 gap-y-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <Search className="w-3 h-3"/> Search Patient (HC ID / Name / Roll No)
              </label>
              <Input 
                placeholder="Search..." 
                value={search} 
                onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} 
                className="text-gray-900 border-gray-200 h-10 bg-white placeholder:text-gray-400" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <MapPin className="w-3 h-3"/> Village
              </label>
              <Select value={villageFilter} onValueChange={(v) => {setVillageFilter(v); setCurrentPage(1);}}>
                <SelectTrigger className="text-gray-900 border-gray-200 h-10 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">{options.villages.map(v => <SelectItem key={v} value={v} className="text-gray-900">{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <Users className="w-3 h-3"/> Gender
              </label>
              <Select value={genderFilter} onValueChange={(v) => {setGenderFilter(v); setCurrentPage(1);}}>
                <SelectTrigger className="text-gray-900 border-gray-200 h-10 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">{["All", "Male", "Female"].map(g => <SelectItem key={g} value={g} className="text-gray-900">{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3"/> Age Range
              </label>
              <div className="flex gap-2 items-center">
                <Input placeholder="Min" value={ageMin} onChange={e => {setAgeMin(e.target.value); setCurrentPage(1);}} className="text-gray-900 border-gray-200 h-10 bg-white" />
                <span className="text-gray-300">-</span>
                <Input placeholder="Max" value={ageMax} onChange={e => {setAgeMax(e.target.value); setCurrentPage(1);}} className="text-gray-900 border-gray-200 h-10 bg-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-2">
                <Activity className="w-3 h-3"/> Condition
              </label>
              <Select value={conditionFilter} onValueChange={(v) => {setConditionFilter(v); setCurrentPage(1);}}>
                <SelectTrigger className="text-blue-900 border-blue-100 h-10 bg-blue-50/50 font-medium"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent className="bg-white">{options.conditions.map(c => <SelectItem key={c} value={c} className="text-gray-900">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <User className="w-3 h-3"/> Consulting Doctor
              </label>
              <Select value={doctorFilter} onValueChange={(v) => {setDoctorFilter(v); setCurrentPage(1);}}>
                <SelectTrigger className="text-gray-900 border-gray-200 h-10 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">{options.doctors.map(d => <SelectItem key={d} value={d} className="text-gray-900">{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3"/> Visit Date
              </label>
              <Input type="date" value={dateFilter} onChange={e => {setDateFilter(e.target.value); setCurrentPage(1);}} className="text-gray-900 border-gray-200 h-10 bg-white" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <ClipboardList className="w-3 h-3"/> Status
              </label>
              <Select value={statusFilter} onValueChange={(v) => {setStatusFilter(v); setCurrentPage(1);}}>
                <SelectTrigger className="text-gray-900 border-gray-200 h-10 bg-white"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent className="bg-white">{["All", "Completed", "Pending", "Follow-up"].map(s => <SelectItem key={s} value={s} className="text-gray-900">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 h-10"><Hash className="w-3 h-3 inline mr-1"/> HC ID</TableHead>
                  <TableHead className="font-bold text-gray-700">Roll No.</TableHead>
                  <TableHead className="font-bold text-gray-700">Student</TableHead>
                  <TableHead className="font-bold text-gray-700">Patient Name</TableHead>
                  <TableHead className="font-bold text-gray-700">Village</TableHead>
                  <TableHead className="font-bold text-gray-700">Gender</TableHead>
                  <TableHead className="font-bold text-gray-700">Age</TableHead>
                  <TableHead className="font-bold text-gray-700">Conditions</TableHead>
                  <TableHead className="font-bold text-gray-700">Doctor</TableHead>
                  <TableHead className="font-bold text-gray-700">Date</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50 border-b border-gray-100 h-12">
                      <TableCell className="font-bold text-blue-600">{row.id}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] font-mono">{row.rollNo}</TableCell>
                      <TableCell className="text-gray-700 text-sm whitespace-nowrap">{row.student}</TableCell>
                      <TableCell className="font-semibold text-gray-900 whitespace-nowrap">{row.patient}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{row.village}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{row.gender}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{row.age}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 min-w-[180px]">
                          {row.conditions.map(c => (
                            <Badge key={c} variant="secondary" className="text-[10px] bg-gray-100 text-gray-700 border-none px-1.5 py-0 font-normal whitespace-nowrap">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm whitespace-nowrap">{row.doctor}</TableCell>
                      <TableCell className="text-gray-400 text-xs">{row.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${statusClass[row.status]} px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-none`}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  /* ─── IMPROVED "NO DATA FOUND" STATE ─── */
                  <TableRow>
                    <TableCell colSpan={11} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-gray-50 p-6 rounded-full">
                          <DatabaseZap className="w-12 h-12 text-gray-300" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-gray-900">No matching records found</h3>
                          <p className="text-sm text-gray-500 max-w-[300px] mx-auto">
                            We couldn't find any patients matching your current filters. Try adjusting your search or clearing all filters.
                          </p>
                        </div>
                        <Button 
                          onClick={resetFilters} 
                          variant="outline" 
                          className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ─── PAGINATION ─── */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <p className="text-xs text-gray-400 font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="h-8 bg-white border-gray-200 text-gray-600 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1"/> Prev
              </Button>
              <div className="flex gap-1 mx-2">
                {Array.from({length: totalPages}).map((_, i) => (
                  <Button 
                    key={i} 
                    onClick={() => setCurrentPage(i+1)} 
                    className={`h-8 w-8 p-0 text-xs font-bold transition-all ${currentPage === i+1 ? "bg-black text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                  >
                    {i+1}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages || filteredData.length === 0} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="h-8 bg-white border-gray-200 text-gray-600 shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4 ml-1"/>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}