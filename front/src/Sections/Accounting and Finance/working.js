return (
    <div className="container mt-5">
      <h2 className="text-center">Chart of Accounts</h2>
  
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Delete</th>
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
                <td>
                  <FontAwesomeIcon
                    icon={faMinus}
                    color="red"
                    size="lg"
                    onClick={() => handleDeleteAccount(account._id)}
                  />
                </td>
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
  
      <div className="collapsible-section">
        <h4
          className="collapsible-header"
          onClick={() => setShowAddAccount(!showAddAccount)}
        >
          Add New Account
        </h4>
        {showAddAccount && (
          <div className="collapsible-content">
            {/* Form inputs */}
            {/* ... Your form inputs code ... */}
          </div>
        )}
      </div>
  
      <div className="collapsible-section">
        <h4
          className="collapsible-header"
          onClick={() => setShowUploadExcel(!showUploadExcel)}
        >
          Upload Excel File
        </h4>
        {showUploadExcel && (
          <div className="collapsible-content">
            {/* Upload form and button */}
            {/* ... Your upload form and button code ... */}
          </div>
        )}
      </div>
    </div>
  );
  