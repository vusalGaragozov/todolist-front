import React, { useState, useEffect } from 'react';

function SalesTransaction({ fsLineValues, refreshSalesTransaction, setRefreshSalesTransaction  }) {
  const [selectedFsLine, setSelectedFsLine] = useState('');



  useEffect(() => {
    // You can fetch additional data or perform any actions here
    // This effect will be triggered whenever refreshSalesTransaction changes

    // For example, you might want to reset selectedFsLine
    setSelectedFsLine('');
  }, [refreshSalesTransaction]);

  return (
    <div>
      <h2>Sales Transaction</h2>
      <form>
        <div className="form-group">
          <label>Select FS Line</label>
          <select
            className="form-control"
            value={selectedFsLine}
            onChange={(e) => setSelectedFsLine(e.target.value)}
          >
            <option value="">Select FS Line</option>
            {fsLineValues.map((fsLine, index) => (
              <option key={index} value={fsLine}>
                {fsLine}
              </option>
            ))}
          </select>
        </div>
        {/* Add other form fields here */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setRefreshSalesTransaction(true)}
        >
          Refresh Sales Transaction
        </button>
      </form>
    </div>
  );
}

export default SalesTransaction;
