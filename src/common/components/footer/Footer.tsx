import React from 'react';
import { Link } from 'react-router-dom';
import { Footer, LogoLanguage } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';

function HaitatonFooter() {
  const { t, i18n } = useTranslation();
  const { MANUAL, HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY } = useLocalizedRoutes();

  return (
    <Footer title="Haitaton" logoLanguage={i18n.language as LogoLanguage}>
      <Footer.Navigation
        variant="minimal"
        navigationAriaLabel={t('common:ariaLabels:footerNavigation')}
      >
        <Footer.Item as={Link} to={MANUAL.path} label={MANUAL.label} />
        <Footer.Item as={Link} to={HAITATON_INFO.path} label={HAITATON_INFO.label} />
        <Footer.Item as={Link} to={ACCESSIBILITY.path} label={ACCESSIBILITY.label} />
        <Footer.Item as={Link} to={PRIVACY_POLICY.path} label={PRIVACY_POLICY.label} />
      </Footer.Navigation>
      <Footer.Base copyrightHolder="Helsingin kaupunki" />
    </Footer>
  );
}

export default HaitatonFooter;
