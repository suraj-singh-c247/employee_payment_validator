import { memo } from "react"
import Button from "./Button"

function EmployeeForm(props) {
    const { setEmployeeData, setPaymentData, error, showFlagged, onFunc, onFileUpload } = props;

    return (
        <>
            <form className='mb-3' onSubmit={(e) => onFunc(e)}>
                <div className="mb-3">
                    <label for="employeeDataId" className="form-label">Upload Employee Data: </label>
                    <input id="employeeDataId" type="file" name='employeeData' accept=".xlsx, .xls, .ods" className="form-control" onChange={(e) => onFileUpload(e, setEmployeeData)} />
                    <p class="mt-1 fs-6 fw-light text-start" id="employeeDataId">You can upload files in the following formats: .xlsx, .xls, or .ods.</p>
                    {error.employeeData && !showFlagged && <p className="text-danger fw-bold py-3 text-start">{error.employeeData}</p>}
                </div>
                <div className="mb-3">
                    <label for="emloyeePaymentId" className="form-label">Upload Payment Data: </label>
                    <input id="emloyeePaymentId" type="file" name='paymentData' accept=".xlsx, .xls, .ods" className="form-control" onChange={(e) => onFileUpload(e, setPaymentData)} />
                    <p class="mt-1 fs-6 fw-light text-start" id="emloyeePaymentId">You can upload files in the following formats: .xlsx, .xls, or .ods.</p>
                    {error.paymentData && !showFlagged && <p className="text-danger fw-bold py-3 text-start">{error.paymentData}</p>}
                </div>
                <Button type={"submit"} className={"btn btn-primary"} btnText={"Submit"} />
            </form>
        </>
    )
}

export default memo(EmployeeForm)