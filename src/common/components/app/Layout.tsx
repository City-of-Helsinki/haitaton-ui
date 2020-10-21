import React from 'react';
import styled from 'styled-components';

import Header from '../header/Header';
import Footer from '../footer/Footer';

const Container = styled.div`
  position: relative;
`;
type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
