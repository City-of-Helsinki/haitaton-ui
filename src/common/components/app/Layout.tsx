import React from 'react';

import Header from '../header/Header';
import Footer from '../footer/Footer';

import './layout.styles.scss';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pageContainer">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
