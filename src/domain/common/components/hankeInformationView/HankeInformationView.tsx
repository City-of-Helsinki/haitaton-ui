import React from 'react';
import clsx from 'clsx';
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
    <header
      style={{ backgroundColor }}
      className={clsx(styles.headerContainer, styles.paddingLeft)}
    >
      {children}
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
  hideSideBar = false,
}: {
  children: React.ReactNode | React.ReactNode[];
  hideSideBar?: boolean;
}) {
  return (
    <div
      className={clsx(styles.contentContainer, {
        [styles.contentContainer__hideSideBar]: hideSideBar,
      })}
    >
      {children}
    </div>
  );
}

function InformationViewMainContent({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) {
  return <div className={clsx(styles.mainContent, styles.paddingLeft, className)}>{children}</div>;
}

function InformationViewSidebar({
  children,
  testId,
}: {
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
}) {
  return (
    <div className={styles.sideBar} data-testid={testId}>
      {children}
    </div>
  );
}

export {
  InformationViewContainer,
  InformationViewHeader,
  InformationViewHeaderButtons,
  InformationViewContentContainer,
  InformationViewMainContent,
  InformationViewSidebar,
};
