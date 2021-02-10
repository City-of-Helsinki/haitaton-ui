import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';

import './layout.styles.scss';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <ConfirmationDialog />
      <div className="pageContainer" role="main">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
