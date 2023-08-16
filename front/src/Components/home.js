import React, { useContext } from 'react'; // Import AuthContext

import { AuthContext } from './AuthContext.js';

const Home = () => {
  const { user } = useContext(AuthContext); // Access the user from AuthContext

  return (
    <div className="container">
      <h2>Welcome to the Todo App</h2>
      {user ? (
        <p>You are logged in as {user.username}</p>
      ) : (
        <p>Please register or login to access the todo list.</p>
      )}
    </div>
  );
};

export default Home;
