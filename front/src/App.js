import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar.js';
import Home from './Components/home.js';
import TodoList from './Components/Todolist.js';
import Stafflist from './Components/Stafflist.js';
import Fambudget from './Components/Fambudget.js';
import Register from './Components/register.js'; // Fixed the import path
import Login from './Components/login.js';
import { AuthProvider } from './Components/AuthContext.js'; // Use AuthContext instead of AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/stafflist" element={<Stafflist />} />
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
