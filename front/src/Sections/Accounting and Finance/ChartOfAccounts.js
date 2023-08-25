import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './custom-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { AuthContext } from '../AuthContext.js'; //
import { Modal, Button } from 'react-bootstrap';



function ChartOfAccounts() {
  const { user } = useContext(AuthContext);
  const loggedInUserId = user._id;
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showUploadExcel, setShowUploadExcel] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadExcelModal, setShowUploadExcelModal] = useState(false);

  const handleAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);}

  const [newAccount, setNewAccount] = useState({
    report: '',
    accountClass: '',
    caption: '',
    fsLine: '',
    currency: ''
  });
  
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDeleteSelectedAccounts = async () => {
    try {
      await Promise.all(selectedAccounts.map(async (accountId) => {
        await axios.delete(`/api/accounts/${accountId}`);
      }));
  
      setAccountData((prevData) =>
        prevData.filter((account) => !selectedAccounts.includes(account._id))
      );
  
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Error deleting selected accounts:', error);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Please choose a file.');
      return;
    }
  
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        // Filter out empty rows
        const validRows = rows.filter(row => {
          return row['Report'] && row['Class'] && row['Caption'] && row['FS Line'] && row['Currency'];
        });
  
        try {
          const response = await axios.post('/api/upload-accounts', { accounts: validRows });
          if (response.status === 201) {
            const updatedResponse = await axios.get('/api/accounts');
            const userAccounts = updatedResponse.data.filter(account => account.userId === loggedInUserId);
            setAccountData(userAccounts);
          }
        } catch (error) {
          console.error('Error uploading accounts:', error);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  
  
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

  const handleSelectAccount = (accountId) => {
    setSelectedAccounts((prevSelectedAccounts) => {
      if (prevSelectedAccounts.includes(accountId)) {
        return prevSelectedAccounts.filter((id) => id !== accountId);
      } else {
        return [...prevSelectedAccounts, accountId];
      }
    });
  };
  
  

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
        // Fetch the updated account data
        try {
          const response = await axios.get('/api/accounts');
          const userAccounts = response.data.filter(account => account.userId === loggedInUserId);
          setAccountData(userAccounts);
        } catch (error) {
          console.error('Error fetching updated accounts:', error);
        }
  
        setNewAccount({
          report: '',
          accountClass: '',
          caption: '',
          fsLine: '',
          currency: ''
        }
        
        );
      }
    } catch (error) {
      alert('Please fill in all fields.');
    }
  };


  return (
    <div className="container mt-5">
      <h2 className="text-center">Chart of Accounts</h2>
      {/* Basket-like delete icon */}
      <div className="text-right mb-2">
      <div className="icons-container  text-end">
         {/* Excel upload icon */}
         <FontAwesomeIcon
          icon={faFileExcel}
          color="blue"
          size="lg"
          onClick={() => setShowUploadExcelModal(true)}
          style={{ cursor: 'pointer', marginRight: '6px' }}
        />
        <FontAwesomeIcon
          icon={faPlus}
          color="green"
          size="lg"
          onClick={handleAddModalToggle}
          style={{ cursor: 'pointer', marginRight: '5px' }}
        />
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="red"
          size="lg"
          onClick={handleDeleteSelectedAccounts}
          style={{ cursor: 'pointer' }}
        />
      </div>
      </div>
  
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
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((account) => (
              <tr
                key={account._id}
                className={`account-row ${
                  selectedAccounts.includes(account._id) ? 'selected' : ''
                }`}
              >
                <td>{account.report}</td>
                <td>{account.accountClass}</td>
                <td>{account.caption}</td>
                <td>{account.fsLine}</td>
                <td>{account.currency}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account._id)}
                    onChange={() => handleSelectAccount(account._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {/* Add New Account Modal */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
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
              <div className="modal-buttons">
               
              </div>
            </form>
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAccount}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Excel Upload Modal */}
      <Modal show={showUploadExcelModal} onHide={() => setShowUploadExcelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Excel File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="text-end mb-3">
             
              <div className="input-group">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="form-control"
                  id="excelFile"
                  onChange={handleFileSelect}
                />
                <label className="input-group-text" htmlFor="excelFile">
                  <FontAwesomeIcon icon={faFileExcel} />
                </label>
              </div>
            </div>
            <div className="modal-buttons d-flex justify-content-end">
              {/* Cancel button */}
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setShowUploadExcelModal(false)}
              >
                Cancel
              </button>
              {/* Upload button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default ChartOfAccounts;
