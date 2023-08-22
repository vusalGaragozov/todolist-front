// ChartOfAccounts.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './custom-styles.css';

function ChartOfAccounts() {
  const [accountData, setAccountData] = useState([
    {
      report: 'Balance sheet',
      class: 'Assets',
      caption: 'Cash and cash equivalents',
      fsLine: 'Cash at bank-1',
      currency: 'AZN'
    },
    // Add more account data here...
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`);
      setAccountData((prevData) => prevData.filter((account) => account._id !== accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
      console.log(error)
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/accounts');
        setAccountData(response.data);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setIsLoading(false); // Set loading to false in case of error as well
      }
    }

    fetchData();
  }, []);
  const [newAccount, setNewAccount] = useState({
    report: '',
    class: '',
    caption: '',
    fsLine: '',
    currency: ''
  });

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

  return (
    <div className="container mt-5">
      <h2 className="text-center">Chart of Accounts</h2>
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
    key={account._id} // Assign a unique key using the account's _id
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
        style={{ visibility: 'hidden', cursor: 'pointer' }}
        onClick={() => handleDeleteAccount(account._id)}
      >
        Delete
      </td>
    </tr>
  ))}
</tbody>

      </table>

      <h3>Add New Account</h3>
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
    </div>
  );
}

export default ChartOfAccounts;
