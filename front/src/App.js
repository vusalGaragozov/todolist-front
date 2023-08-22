import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Sections/Navbar.js';
import Home from './Sections/home.js';
import TodoList from './Sections/Todolist.js';
import AccountingAndFinance from './Sections/Accounting and Finance/Accounting and Finance.js';
import Fambudget from './Sections/Fambudget.js';
import Register from './Sections/register.js'; // Fixed the import path
import Login from './Sections/login.js';
import { AuthProvider } from './Sections/AuthContext.js'; // Use AuthContext instead of AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/accountingandfinance" element={<AccountingAndFinance />} />
            <Route path="/fambudget" element={<Fambudget />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
