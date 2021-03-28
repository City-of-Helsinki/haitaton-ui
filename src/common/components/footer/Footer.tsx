import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from 'hds-react';
import styles from './Footer.module.scss';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';

const HaitatonFooter: React.FC = () => {
  const { HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY, REFERENCES } = useLocalizedRoutes();

  return (
    <Footer title="Haitaton Beta" className={styles.footer}>
      <Footer.Navigation variant="minimal">
        <Footer.Item>
          <Link to={HAITATON_INFO.path}>{HAITATON_INFO.label}</Link>
        </Footer.Item>
        <Footer.Item>
          <Link to={ACCESSIBILITY.path}>{ACCESSIBILITY.label}</Link>
        </Footer.Item>
        <Footer.Item>
          <Link to={PRIVACY_POLICY.path}>{PRIVACY_POLICY.label}</Link>
        </Footer.Item>
        <Footer.Item>
          <Link to={REFERENCES.path}>{REFERENCES.label}</Link>
        </Footer.Item>
      </Footer.Navigation>
      <Footer.Base copyrightHolder="Copyright" copyrightText="All rights reserved" />
    </Footer>
  );
};

export default HaitatonFooter;
