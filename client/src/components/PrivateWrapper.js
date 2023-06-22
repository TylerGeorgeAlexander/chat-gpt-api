import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateWrapper = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateWrapper;
