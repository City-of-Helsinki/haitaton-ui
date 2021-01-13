// import React from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../authService';

const Login = () => {
  const location = useLocation();

  console.log(location);

  if (location.pathname === '/login') {
    authService.login();
  }

  return null;
};

export default Login;
