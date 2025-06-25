import { memo } from "react"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Button from "./Button";
function EmployeeResult({ flagged }) {

    const exportFlagged = () => {
        const ws = XLSX.utils.json_to_sheet(flagged);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Flagged");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheet.xlsx");
    }

    return (<>  {
        flagged.length > 0 && (
            <div>
                <h3 className='mb-3'>Employee Results</h3>
                <Button type={"button"} onFunc={exportFlagged} btnText={"Download Results"} className='btn btn-info mb-3' />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Employee Name</th>
                            <th scope="col">Expected</th>
                            <th scope="col">Paid</th>
                            <th scope="col">Issue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flagged.map((row, i) => (
                            <tr key={i}>
                                <td>{row["Employee ID"]}</td>
                                <td>{row["Employee Name"]}</td>
                                <td>{row.Expected}</td>
                                <td>{row.Paid}</td>
                                <td>{row.Issue}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        )
    }
    </>)
}

export default memo(EmployeeResult)