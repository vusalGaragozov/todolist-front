import React from 'react';

const MenuItem = ({ label, isActive, onClick }) => {
  return (
    <li>
      <span className={`menu-item ${isActive ? 'active' : ''}`} onClick={onClick}>
        {label}
      </span>
    </li>
  );
};

export default MenuItem;
