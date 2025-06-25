import { useState } from 'react'
import './App.css'
import * as XLSX from "xlsx";
function App() {
  const [employeeData, setEmployeeData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [error, setError] = useState("");
  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) {
      return
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryString = evt.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setter(data);
    };
    reader.onerror = (err) => {
      setError("Failed to read file");
      console.error("File reading error:", err);
    };

    reader.readAsBinaryString(file);
  }

  const handleSubmit = () => {
    if (!employeeData || !paymentData) {
      setError("Please upload both files.");
      return;
    }
    // employee hours formated data
    const [header, ...datarows] = employeeData;
    const formatedData = datarows.map((data) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = data[i]
      });
      return obj;
    })
    // employee hours payment data
    const [payheader, ...paydatarow] = paymentData;
    const payformatedData = paydatarow.map((data) => {
      const obj = {};
      payheader.forEach((key, i) => {
        obj[key] = data[i]
      });
      return obj;
    })

    const paymentMap = {};
    payformatedData.forEach((row) => {
      paymentMap[String(row["Employee ID"]).trim()] = row["Amount Paid"];
    });


    const flaggedRows = formatedData
      .map((row) => {
        const expected = row["Total Hours Worked"] * row["Hourly Rate"];
        const paid = paymentMap[String(row["Employee ID"]).trim()];

        let issue = null;
        if (paid === undefined) {
          issue = "No payment found";
        } else if (Math.abs(expected - paid) > 1) {
          issue = "Mismatch";
        }

        if (issue) {
          return {
            "Employee ID": String(row["Employee ID"]).trim(),
            "Employee Name": String(row["Employee Name"]).trim(),
            Expected: expected,
            Paid: paid,
            Issue: issue,
          };
        }

        return null; // No issue, skip
      })
      .filter((row) => row); // Remove nulls


    setFlagged(flaggedRows);
  }

 // Export flagged results
  const exportFlagged = () => {
    const ws = XLSX.utils.json_to_sheet(flagged);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flagged");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheet.xlsx");
  };
  return (
    <>
      <form className='mb-3'>
        <h2>Employee Payment Validator</h2>
        <div className="mb-3">
          <label className="form-label">Upload Employee Data: </label>
          <input type="file" accept=".xlsx, .xls, .ods" className="form-control" onChange={(e) => handleFileUpload(e, setEmployeeData)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Payment Data: </label>
          <input type="file" accept=".xlsx, .xls, .ods" className="form-control" onChange={(e) => handleFileUpload(e, setPaymentData)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        {error && <p className="text-danger">{error}</p>}
      </form>
      {
        flagged.length > 0 && (
          <div>
            <h3 className='mb-3'>Employee Results</h3>
            <button onClick={exportFlagged} className='btn btn-info mb-3'>Download Results</button>

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

                {flagged.length === 0 && <tr><td colSpan={5}>No payment found...</td></tr>}

              </tbody>
            </table>
          </div>
        )
      }
    </>
  )
}

export default App
