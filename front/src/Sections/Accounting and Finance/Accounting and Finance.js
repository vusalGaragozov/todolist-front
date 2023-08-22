import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './custom-styles.css'; // Import your custom CSS file
import ChartOfAccounts from './ChartOfAccounts';


function AccountingAndFinance() {
  const [activeMenu, setActiveMenu] = useState(parseInt(localStorage.getItem('activeMenuIndex')) || null);

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
  };

  useEffect(() => {
    localStorage.setItem('activeMenuIndex', activeMenu);
  }, [activeMenu]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="vertical-nav p-3">
            <h2 className="text-center-fin.menu"></h2>
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
                        <li key={subIndex} className="submenu-item">{subItem}</li>
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
          {activeMenu === 3 && <ChartOfAccounts />}
        </div>
      </div>
    </div>
  );
}

export default AccountingAndFinance;
