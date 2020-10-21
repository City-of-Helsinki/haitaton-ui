import React from 'react';

import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher';

import HelLogoLink from '../helLogoLink/HelLogoLink';
import Nav from './nav/Nav';

import './styles.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__left">
        <HelLogoLink />

        <h2 className="header__navHeader">Haitaton 2.0</h2>
      </div>
      <Nav />
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
