import React from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../../domain/auth/useUser';

type Props = {
  element: JSX.Element;
};

const PrivateRoute: React.FC<React.PropsWithChildren<Props>> = ({ element }) => {
  const { data: user } = useUser();

  if (!user?.profile) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
