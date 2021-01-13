import React from 'react';
import { useLocation } from 'react-router-dom';
// import authService from '../authService';

const LoginCallback = () => {
  const location = useLocation();

  console.log(location);

  return <p>LoginCallback callback</p>;
};

export default LoginCallback;
