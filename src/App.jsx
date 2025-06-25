import { useState } from 'react'
import './App.css'
import * as XLSX from "xlsx";
import EmployeeResult from './components/EmployeeResult';
import EmployeeForm from './components/EmployeeForm';
import Button from './components/Button';
import { templateEmployeeData, templatePayment } from './utils/TemplateEmployee';
import { validateColumnError, validateFileError } from './utils/error';
function App() {
  const [employeeData, setEmployeeData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [error, setError] = useState({ employeeData: '', paymentData: '' });
  const [colError, setColError] = useState('');
  const [showFlagged, setShowFlagged] = useState(false)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setColError('')
    setError({});
    if (!validateFileError(employeeData, paymentData, setError)) return;

    const [header, ...datarows] = employeeData;
    const [payheader, ...paydatarow] = paymentData;

    if (!validateColumnError(header, payheader, setColError)) return;
    // employee hours formated data   
    const formatedData = datarows.map((data) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = data[i]
      });
      return obj;
    })
    // employee hours payment data

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

    setShowFlagged(true)
    setFlagged(flaggedRows);
  }


  return (
    <>
      <h2>Employee Payment Validator</h2>
      <div className="d-flex align-items-center gap-3">
        <Button type={"button"} onFunc={templateEmployeeData} btnText={"Template Employee File"} className='btn btn-info mb-3' />
        <Button type={"button"} onFunc={templatePayment} btnText={"Template Payment File"} className='btn btn-info mb-3' />
      </div>
      <EmployeeForm setEmployeeData={setEmployeeData} setPaymentData={setPaymentData} error={error} showFlagged={showFlagged} onFunc={handleSubmit} onFileUpload={handleFileUpload} />

      {colError && !showFlagged && <p className="text-danger fw-bold py-3">{colError}</p>}
      <EmployeeResult flagged={flagged} />

      {flagged.length === 0 && showFlagged && <p className='text-center fw-bold fs-3'>No Mismatch found...</p>}

    </>
  )
}

export default App
