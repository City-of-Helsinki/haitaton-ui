import React from 'react';
import { Link } from 'react-router-dom';
import { Koros, Logo } from 'hds-react';
import styles from './Footer.module.scss';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import Text from '../text/Text';

const FooterComp: React.FC = () => {
  const { HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY, REFERENCES } = useLocalizedRoutes();

  return (
    <footer className={styles.footer} role="contentinfo">
      <Koros type="basic" style={{ fill: 'var(--color-summer)' }} />
      <div className={styles.container}>
        <div className={styles.logo}>
          <div>
            <Logo size="medium" />
          </div>
          <div>
            <Text tag="h3" weight="bold" styleAs="h6" spacing="2-xs">
              Haitaton Beta
            </Text>
          </div>
        </div>
        <div className={styles.linkContainer}>
          <div>
            <Link to={HAITATON_INFO.path}>{HAITATON_INFO.label}</Link>
          </div>
          <div>
            <Link to={ACCESSIBILITY.path}>{ACCESSIBILITY.label}</Link>
          </div>
          <div>
            <Link to={PRIVACY_POLICY.path}>{PRIVACY_POLICY.label}</Link>
          </div>
          <div>
            <Link to={REFERENCES.path}>{REFERENCES.label}</Link>
          </div>
        </div>
        <p>&copy; Copyright 2020 &#8226; All rights reserved</p>
      </div>
    </footer>
  );
};

export default FooterComp;
