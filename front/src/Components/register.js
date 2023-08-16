import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.js';
import {API_URL} from "../config.js"

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
      
    try {
      console.log('Sending registration request:', { username, password });
  
      const response = await axios.post(
        `${API_URL}/register`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log('Registration response:', response.data);
  
      setIsRegistered(true);
      setUsername('');
      setPassword('');
      setUser(response.data.user);
    } catch (error){ setError(error.response.data.error);
      console.error('Registration error:', error);
      setError('Failed to register');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2>Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {isRegistered && <div className="alert alert-success">Registration successful!</div>}
          {!isRegistered && (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
