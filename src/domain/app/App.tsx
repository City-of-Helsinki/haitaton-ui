import React from 'react';
import Spinner from './Spinner';

type Props = {
  children: React.ReactNode;
};
const App: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Spinner />
      {children}
    </>
  );
};
export default App;
