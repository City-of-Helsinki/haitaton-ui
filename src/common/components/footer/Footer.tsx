import React from 'react';
import { Koros } from 'hds-react';
import './styles.scss';

const FooterComp: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; Copyright 2020 &#8226; All rights reserved</p>
      <Koros type="basic" />
    </footer>
  );
};

export default FooterComp;
