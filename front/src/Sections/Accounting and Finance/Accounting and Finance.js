import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './custom-styles.css'; // Import your custom CSS file
import ChartOfAccounts from './ChartOfAccounts';
import SalesTransaction from './SalesTransaction'; // Import the SalesTransaction component
import { AccountDataProvider } from './AccountDataContext'; // Import the AccountDataProvider and useAccountData


function AccountingAndFinance() {
  const [activeMenu, setActiveMenu] = useState(parseInt(localStorage.getItem('activeMenuIndex')) || null);
  const [activeSubmenu, setActiveSubmenu] = useState(null); // Add state for active submenu
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Add loggedInUserId state
  const [fsLineValues, setFsLineValues] = useState([]); // Add state for FS Line values
  const [refreshSalesTransaction, setRefreshSalesTransaction] = useState(false); // Add this state


  

  const menuItems = [
    {
      label: 'Record transaction',
      subItems: ['Sales transaction', 'Cash receipt', 'Expense recognition', 'Inventory/service purchase']
    },
    {
      label: 'Financial statements',
      subItems: ['Balance Sheet', 'Income Statement', 'Cash Flow']
    },
    {
      label: 'Dashboards',
      subItems: []
    },
    {
      label: 'Accounts',
      subItems: []
    },
    {
      label: 'Settings',
      subItems: []
    }
  ];

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubmenu(null); // Reset active submenu when main menu item is clicked
  };
  

  const handleSubmenuClick = (submenuIndex) => {
    setActiveSubmenu(submenuIndex);
  };



  useEffect(() => {
    async function fetchLoggedInUserId() {
      try {
        // Fetch the logged-in user's ID from your authentication system
        const response = await axios.get('/api/accounts');
        setLoggedInUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }

    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    async function fetchAccountData() {
      try {
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }

    if (loggedInUserId) {
      fetchAccountData();
    }
  }, [loggedInUserId]);
  
  useEffect(() => {
    async function fetchFsLineValues() {
      try {
        const response = await axios.get('/api/fs-line-values'); // Replace with your API endpoint
        setFsLineValues(response.data);
      } catch (error) {
        console.error('Error fetching FS Line values:', error);
      }
    }

    fetchFsLineValues();
  }, []);

 return (
  <AccountDataProvider>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="vertical-nav p-3">
            <ul className="nav flex-column">
              {menuItems.map((menuItem, index) => (
                <li key={index} className={`nav-item ${activeMenu === index ? 'active' : ''}`}>
                  <span
                    className={`nav-link custom-menu-item ${activeMenu === index ? 'active' : ''}`}
                    onClick={() => handleMenuClick(index)}
                  >
                    {menuItem.label}
                  </span>
                  {activeMenu === index && (
                    <ul className="submenu pl-3">
                      {menuItem.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className={`submenu-item ${activeSubmenu === subIndex ? 'active' : ''}`}
                          onClick={() => handleSubmenuClick(subIndex)}
                           style={{ cursor: 'pointer',
                           backgroundColor: activeSubmenu === subIndex ? 'lightgray' : 'transparent', }} // Add cursor style
                           
                        >
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          {/* Content for the selected menu */}
          {activeSubmenu === 0 && (
          <SalesTransaction fsLineValues={fsLineValues} refreshSalesTransaction={refreshSalesTransaction} setRefreshSalesTransaction={setRefreshSalesTransaction}
          />
        )}
        {activeMenu === 3 && <ChartOfAccounts setRefreshSalesTransaction={setRefreshSalesTransaction} />}

        </div>
      </div>
    </div>
    </AccountDataProvider>
  );
}

export default AccountingAndFinance;
