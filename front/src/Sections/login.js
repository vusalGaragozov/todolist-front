import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.js';
import {API_URL} from "../config.js"


const Login = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
      }, { withCredentials: true });

      setUser(response.data.user);
      setAuthenticated(true);

      // Store user info and authenticated status in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('authenticated', 'true');

      setUsername('');
      setPassword('');
      navigate('/');
    } catch (error) {
      setError('Wrong password');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
