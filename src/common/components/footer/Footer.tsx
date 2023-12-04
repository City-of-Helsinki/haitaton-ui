import { Link } from 'react-router-dom';
import { Footer, Logo, logoFi, logoSv } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';

function HaitatonFooter() {
  const { t, i18n } = useTranslation();
  const { MANUAL, HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY } = useLocalizedRoutes();
  const { HOME } = useLocalizedRoutes();
  const logoSrc = i18n.language === 'sv' ? logoSv : logoFi;

  return (
    <Footer
      title="Haitaton"
      theme={{
        '--footer-background': 'var(--color-summer)',
        '--footer-divider-color': 'var(--color-black-90)',
      }}
    >
      <Footer.Navigation ariaLabel={t('common:ariaLabels:footerNavigation')}>
        <Footer.Link as={Link} to={MANUAL.path} label={MANUAL.label} />
        <Footer.Link as={Link} to={HAITATON_INFO.path} label={HAITATON_INFO.label} />
        <Footer.Link as={Link} to={ACCESSIBILITY.path} label={ACCESSIBILITY.label} />
        <Footer.Link as={Link} to={PRIVACY_POLICY.path} label={PRIVACY_POLICY.label} />
      </Footer.Navigation>
      <Footer.Base
        logo={<Logo src={logoSrc} size="medium" alt="Helsingin kaupunki" />}
        logoHref={HOME.path}
        copyrightHolder="Helsingin kaupunki, OpenStreetMap contributors"
        backToTopLabel={t('common:components:footer:backToTop')}
      />
    </Footer>
  );
}

export default HaitatonFooter;
