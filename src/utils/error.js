 // validate file error
  const validateFileError = (employeeData, paymentData, setError) => {

    if (!employeeData || employeeData.length === 0) {
      setError({ employeeData: 'Please upload employee data file.' });
      return false
    }
    if (!paymentData || paymentData.length === 0) {
      setError({ paymentData: 'Please upload payment data file.' });
      return false
    }
    return true;
  }
  // validate column error
  const validateColumnError = (header, payheader, setColError) => {
    const requireEmpColumn = ["Employee ID", "Total Hours Worked", "Hourly Rate"];
    const missingColumn = requireEmpColumn.filter((col) => !header.includes(col));

    if (missingColumn.length > 0) {
      setColError(`Employee file is missing columns ${missingColumn.join(', ')}`);
      return false;
    }
    const requirePayColumn = ["Employee ID", "Amount Paid"];
    const missingPayColumn = requirePayColumn.filter((col) => !payheader.includes(col));

    if (missingPayColumn.length > 0) {
      setColError(`Employee payment file is missing columns ${missingPayColumn.join(', ')}`);
      return false;
    }
    return true;
  }

  export {validateFileError, validateColumnError}