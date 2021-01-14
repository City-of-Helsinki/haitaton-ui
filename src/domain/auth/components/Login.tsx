import { useLocation } from 'react-router-dom';
import authService from '../authService';
import { LOGIN_PATH } from '../constants';

const Login = () => {
  const location = useLocation();

  if (location.pathname === LOGIN_PATH) {
    authService.login();
  }

  return null;
};

export default Login;
