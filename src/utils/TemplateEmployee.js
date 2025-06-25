import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const templateEmployeeData = () => {
    const data = [
        {
            "Employee ID": 101,
            "Employee Name": "Demo1",
            "Total Hours Worked": 120,
            "Hourly Rate": 10,
        },
        {
            "Employee ID": 102,
            "Employee Name": "Demo2",
            "Total Hours Worked": 150,
            "Hourly Rate": 20,
        }
    ]
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flagged");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheet.xlsx");
}

export const templatePayment = () => {
    const data = [
        {
            "Employee ID": 101,
            "Amount Paid": 1200,
        },
        {
            "Employee ID": 101,
            "Amount Paid": 3000,
        },
    ]
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flagged");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheet.xlsx");
}