import React from 'react';
import { NavLink } from 'react-router-dom';

import './nav.scss';

const Nav: React.FC = () => {
  return (
    <nav className="nav">
      <ul className="nav__listWpr">
        <li>
          <NavLink exact to="/" activeClassName="nav__active" className="nav__link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/openlayer" activeClassName="nav__active" className="nav__link">
            Open Layers
          </NavLink>
        </li>
        <li>
          <NavLink to="/form" activeClassName="nav__active" className="nav__link">
            Form
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
