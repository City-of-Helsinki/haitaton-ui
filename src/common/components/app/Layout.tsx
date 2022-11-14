import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import App from '../../../domain/app/App';
import styles from './Layout.module.scss';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return (
    <App>
      <div className={styles.layoutContainer}>
        <Header />
        <div className={styles.pageContainer} role="main">
          {children}
        </div>
        <Footer />
      </div>
    </App>
  );
};

export default Layout;
