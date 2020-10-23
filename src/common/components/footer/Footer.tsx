import React from 'react';
import { Koros } from 'hds-react';
import './Footer.styles.scss';

const FooterComp: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__wpr" />
      <p>&copy; Copyright 2020 &#8226; All rights reserved</p>
      <Koros type="basic" />
    </footer>
  );
};

export default FooterComp;
