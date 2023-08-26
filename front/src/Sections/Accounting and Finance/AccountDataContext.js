// AccountDataContext.js
import React, { createContext, useContext, useState } from 'react';

const AccountDataContext = createContext();

export function AccountDataProvider({ children }) {
  const [accountData, setAccountData] = useState([]);

  return (
    <AccountDataContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </AccountDataContext.Provider>
  );
}

export function useAccountData() {
  return useContext(AccountDataContext);
}
