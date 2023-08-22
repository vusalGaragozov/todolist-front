import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext.js';
import { API_URL } from '../config.js';

const Navbar = () => {
  const { user, setAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(API_URL + '/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setAuthenticated(false);
        window.location.href = '/login';
      } else {
        throw new Error('Error logging out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          My App
        </Link>
        <div className="collapse navbar-collapse justify-content-between">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/todolist">
                Todo List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/accountingandfinance">
                Accounting and Finance
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fambudget">
                Family Budget
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
            {user && window.location.pathname !== '/login' && window.location.pathname !== '/register' && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
