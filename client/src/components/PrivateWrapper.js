import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateWrapper = ({ children, isLoggedIn, authToken }) => {
  return isLoggedIn && authToken ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateWrapper;
