import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const conditions = [
  { id: 1, name: "Diabetes" ,no:"34" },
  { id: 2, name: "Hypertension",no:"34" },
  { id: 3, name: "Asthama",no:"34" },
  { id: 4, name: "Heart Disease",no:"34" },
  { id: 5, name: "Paralysis" ,no:"34"},
  { id: 6, name: "Breathlessness / Weakness",no:"34" },
  { id: 7, name: "Skin Disease",no:"34" },
  { id: 8, name: "Obesity" ,no:"34" },
  { id: 9, name: "Acidity / Hyper Acidity",no:"34" },
  { id: 10, name: "Arthritis / Knee Pain / Back Pain",no:"34" },
  { id: 11, name: "Thyroid",no:"34" },
];

export default function MedicineTable() {
  return (
    <div className="p-1 max-w-xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">No.</TableHead>
            <TableHead>Medicine</TableHead>
            <TableHead>Panchakarma</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conditions.map((condition) => (
            <TableRow key={condition.id}>
              <TableCell>{condition.id}</TableCell>
              <TableCell>{condition.name}</TableCell>
               <TableCell>{condition.no}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}