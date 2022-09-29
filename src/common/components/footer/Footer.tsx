import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from 'hds-react';
import styles from './Footer.module.scss';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';

const HaitatonFooter: React.FC = () => {
  const { HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY, REFERENCES } = useLocalizedRoutes();

  return (
    <Footer title="Haitaton" className={styles.footer}>
      <Footer.Navigation variant="minimal" navigationAriaLabel="Haitaton tietosivut">
        <Footer.Item as={Link} to={HAITATON_INFO.path} label={HAITATON_INFO.label} />
        <Footer.Item as={Link} to={ACCESSIBILITY.path} label={ACCESSIBILITY.label} />
        <Footer.Item as={Link} to={PRIVACY_POLICY.path} label={PRIVACY_POLICY.label} />
        <Footer.Item as={Link} to={REFERENCES.path} label={REFERENCES.label} />
      </Footer.Navigation>
      <Footer.Base copyrightHolder="Copyright" copyrightText="All rights reserved" />
    </Footer>
  );
};

export default HaitatonFooter;
