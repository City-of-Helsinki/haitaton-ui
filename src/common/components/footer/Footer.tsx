import React from 'react';
import { Koros } from 'hds-react';
import './styles.scss';

const FooterComp: React.FC = () => {
  return (
    <footer className="footer">
      <Koros type="basic" />
      <p>&copy; Copyright 2020 &#8226; All rights reserved</p>
    </footer>
  );
};

export default FooterComp;
