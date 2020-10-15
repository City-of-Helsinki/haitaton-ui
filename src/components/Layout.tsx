import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
  }
`;

const Parent = styled('div')<{ isOpen: boolean }>`
  display: grid;
  grid-template-columns: ${({ isOpen }) => (isOpen ? `minmax(150px, 25%)` : '64px')} auto;
`;

const Navigation = styled.nav`
  background: blue;
  height: 100vh;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;
const ToggleNav = styled.button`
  margin-bottom: 0.5rem;
`;
const LinkWpr = styled.div`
  padding-bottom: 0.5rem;
`;
const NavLink = styled(Link)`
  margin-bottom: 0.5rem;
  color: white;
`;

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <GlobalStyle />
      <Parent isOpen={isOpen}>
        <Navigation>
          <ToggleNav onClick={() => setIsOpen((val) => !val)}>NAV</ToggleNav>
          <LinkWpr>
            <NavLink to="/">Home</NavLink>
          </LinkWpr>
          <LinkWpr>
            <NavLink to="/openlayer">Open Layers</NavLink>
          </LinkWpr>
          <LinkWpr>
            <NavLink to="/form">Form</NavLink>
          </LinkWpr>
        </Navigation>
        <Container>{children}</Container>
      </Parent>
    </>
  );
};

export default Layout;
