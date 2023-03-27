import React from 'react';
import Container from '../../../../common/components/container/Container';
import styles from './HankeInformationView.module.scss';

function InformationViewContainer({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  return <article className={styles.informationViewContainer}>{children}</article>;
}

function InformationViewHeader({
  backgroundColor,
  children,
}: {
  backgroundColor: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <header style={{ backgroundColor }} className={styles.headerContainer}>
      <Container>{children}</Container>
    </header>
  );
}

function InformationViewHeaderButtons({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <div className={styles.buttonContainer}>{children}</div>;
}

function InformationViewContentContainer({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className={styles.contentContainerOut}>
      <Container className={styles.contentContainerIn}>{children}</Container>
    </div>
  );
}

function InformationViewMainContent({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <div className={styles.mainContent}>{children}</div>;
}

function InformationViewSidebar({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  return <div className={styles.sideBar}>{children}</div>;
}

export {
  InformationViewContainer,
  InformationViewHeader,
  InformationViewHeaderButtons,
  InformationViewContentContainer,
  InformationViewMainContent,
  InformationViewSidebar,
};
