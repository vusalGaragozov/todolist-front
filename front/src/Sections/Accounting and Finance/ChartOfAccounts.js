import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './custom-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx'; // Use the * as syntax
import { AuthContext } from '../AuthContext.js'; //


const columnMapping = {
    'Report': 'report',
    'Class': 'accountClass',
    'Caption': 'caption',
    'FS Line': 'fsLine',
    'Currency': 'currency'
  };

function ChartOfAccounts() {
    const { user } = useContext(AuthContext);
const loggedInUserId = user._id;
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [excelFile, setExcelFile] = useState(null); 

  const [newAccount, setNewAccount] = useState({
    report: '',
    accountClass: '',
    caption: '',
    fsLine: '',
    currency: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/accounts');
        const userAccounts = response.data.filter(account => account.userId === loggedInUserId);
        setAccountData(userAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [loggedInUserId]);
  

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
      !newAccount.accountClass ||
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
          accountClass: '',
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
      console.log('No file selected');
      return;
    }
    console.log('Uploading file:', excelFile);
    const formData = new FormData();
    formData.append('file', excelFile);
  
    console.log('Request payload:', formData); // Log the FormData object

  
    const reader = new FileReader();
    reader.onload = async (e) => {
      console.log('File read successfully'); // Add this console log
  
      const data = new Uint8Array(e.target.result);
      console.log('Raw data:', data); // Add this console log
  
      const workbook = XLSX.read(data, { type: 'array' });
      console.log('Workbook:', workbook); // Add this console log
  
      const sheetName = workbook.SheetNames[0];
      console.log('Sheet name:', sheetName); // Add this console log
  
      const worksheet = workbook.Sheets[sheetName];
      console.log('Worksheet:', worksheet); // Add this console log
  
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      console.log('Range:', range); // Add this console log
  
      const maxRow = Math.min(300, range.e.r);
      const maxCol = Math.min(49, range.e.c);
  
      const parsedData = XLSX.utils.sheet_to_json(worksheet, {
        range: { s: { r: 0, c: 0 }, e: { r: maxRow, c: maxCol } },
        header: 1
      });
      console.log('Parsed data:', parsedData); // Add this console log
  
      const [header, ...rows] = parsedData;
      console.log('Header:', header); // Add this console log
      console.log('Rows:', rows); // Add this console log
  
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
  
      console.log('Accounts to add:', accountsToAdd); // Add this console log
  
      try {

        const response = await axios.post('/api/accounts/batch', accountsToAdd);
        if (response.status === 201) {
          setAccountData((prevData) => [...prevData, ...accountsToAdd]);
        }
      } catch (error) {
        console.error('Error uploading accounts:', error);
        if (error.response) {
            console.log('Error response data:', error.response.data);
            console.log('Error response status:', error.response.status);
            console.log('Error response headers:', error.response.headers);
          }
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
                <td>{account.accountClass}</td>
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
                name="accountClass"
                value={newAccount.accountClass}
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
