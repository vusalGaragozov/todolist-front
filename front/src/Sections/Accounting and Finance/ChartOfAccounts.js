import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './custom-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx'; // Use the * as syntax


const columnMapping = {
    'Report': 'report',
    'Class': 'class',
    'Caption': 'caption',
    'FS Line': 'fsLine',
    'Currency': 'currency'
  };

function ChartOfAccounts() {
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [excelFile, setExcelFile] = useState(null); 

  const [newAccount, setNewAccount] = useState({
    report: '',
    class: '',
    caption: '',
    fsLine: '',
    currency: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/accounts');
        setAccountData(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`);
      setAccountData((prevData) =>
        prevData.filter((account) => account._id !== accountId)
      );
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value
    }));
  };

  const handleAddAccount = async () => {
    if (
      !newAccount.report ||
      !newAccount.class ||
      !newAccount.caption ||
      !newAccount.fsLine ||
      !newAccount.currency
    ) {
      console.log('All fields are required.');
      return;
    }
    try {
      const response = await axios.post('/api/accounts', newAccount);
      if (response.status === 201) {
        setAccountData((prevData) => [...prevData, newAccount]);
        setNewAccount({
          report: '',
          class: '',
          caption: '',
          fsLine: '',
          currency: ''
        });
      }
    } catch (error) {
      alert('Please fill in all fields.');
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setExcelFile(file);
  };

  const handleFileUpload = async () => {
   if (!excelFile) { 
    console.log('No file selected')
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const maxRow = Math.min(300, range.e.r); // Limit to the first 300 rows
      const maxCol = Math.min(49, range.e.c); // Limit to the first 50 columns

      const parsedData = XLSX.utils.sheet_to_json(worksheet, { range: { s: { r: 0, c: 0 }, e: { r: maxRow, c: maxCol } }, header: 1 });

      const [header, ...rows] = parsedData;
      const accountsToAdd = rows.map((row) => {
        const account = {};
        for (let i = 0; i < header.length; i++) {
          const columnName = header[i];
          if (columnMapping[columnName]) {
            account[columnMapping[columnName]] = row[i];
          }
        }
        return account;
      });

      try {
        const response = await axios.post('/api/accounts/batch', accountsToAdd);
        if (response.status === 201) {
          setAccountData((prevData) => [...prevData, ...accountsToAdd]);
        }
      } catch (error) {
        console.error('Error uploading accounts:', error);
      }
    };
    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Chart of Accounts</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Report</th>
              <th>Class</th>
              <th>Caption</th>
              <th>FS Line</th>
              <th>Currency</th>
              <th className="no-border"></th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((account) => (
              <tr
                key={account._id}
                className="account-row"
                onMouseEnter={() => {
                  const deleteCell = document.querySelector(`#delete-cell-${account._id}`);
                  deleteCell.style.visibility = 'visible';
                }}
                onMouseLeave={() => {
                  const deleteCell = document.querySelector(`#delete-cell-${account._id}`);
                  deleteCell.style.visibility = 'hidden';
                }}
              >
                <td>{account.report}</td>
                <td>{account.class}</td>
                <td>{account.caption}</td>
                <td>{account.fsLine}</td>
                <td>{account.currency}</td>
                <td
                  id={`delete-cell-${account._id}`}
                  className="delete-cell"
                  style={{
                    visibility: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',  // Use flexbox for centering
                    justifyContent: 'center',  // Center horizontally
                    alignItems: 'center',  // Center vertically

                  }}
                  onClick={() => handleDeleteAccount(account._id)}
                >
                 <FontAwesomeIcon icon={faMinus} color="red" size="lg" />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4>Add New Account</h4>
      <form className="mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label>Report</label>
              <input
                type="text"
                name="report"
                value={newAccount.report}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label>Class</label>
              <input
                type="text"
                name="class"
                value={newAccount.class}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Caption</label>
              <input
                type="text"
                name="caption"
                value={newAccount.caption}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label>FS Line</label>
              <input
                type="text"
                name="fsLine"
                value={newAccount.fsLine}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label>Currency</label>
              <input
                type="text"
                name="currency"
                value={newAccount.currency}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-12 mt-3">
            <div className="text-right">
              <button
                type="button"
                onClick={handleAddAccount}
                className="btn btn-primary"
              >
                Add Account
              </button>              
            </div>
          </div>
        </div>
      </form>
      <h4>Upload Accounts from Excel</h4>
      <form className="mt-4">
        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="form-group">
              <label>Upload Excel File</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelection}
                className="form-control-file"
              />
            </div>
            <button
        type="button"
        onClick={handleFileUpload}
        className="btn btn-primary"
      >
        Upload
      </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChartOfAccounts;
