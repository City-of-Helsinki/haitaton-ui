import { Link } from 'react-router-dom';
import { Footer, Logo, LogoSize, logoFi, logoSv } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../hooks/useLocalizedRoutes';
import styles from './Footer.module.scss';

function HaitatonFooter({
  backgroundColor = 'var(--color-summer)',
}: Readonly<{ backgroundColor?: string }>) {
  const { t, i18n } = useTranslation();
  const { MANUAL, HAITATON_INFO, ACCESSIBILITY, PRIVACY_POLICY, COOKIE_CONSENT } =
    useLocalizedRoutes();
  const { HOME } = useLocalizedRoutes();
  const logoSrc = i18n.language === 'sv' ? logoSv : logoFi;

  return (
    <Footer
      title="Haitaton"
      theme={{
        '--footer-background': backgroundColor,
        '--footer-divider-color': 'var(--color-black-90)',
      }}
      className={styles.footer}
    >
      <Footer.Navigation aria-label={t('common:ariaLabels:footerNavigation')}>
        <Footer.Link as={Link} to={MANUAL.path} label={MANUAL.label} />
        <Footer.Link as={Link} to={HAITATON_INFO.path} label={HAITATON_INFO.label} />
        <Footer.Link as={Link} to={ACCESSIBILITY.path} label={ACCESSIBILITY.label} />
        <Footer.Link as={Link} to={PRIVACY_POLICY.path} label={PRIVACY_POLICY.label} />
        <Footer.Link as={Link} to={COOKIE_CONSENT.path} label={COOKIE_CONSENT.label} />
      </Footer.Navigation>
      <Footer.Base
        logo={<Logo src={logoSrc} size={LogoSize.Medium} alt={t('common:logoAlt')} />}
        logoHref={HOME.path}
        copyrightHolder="Helsingin kaupunki, OpenStreetMap contributors"
        backToTopLabel={t('common:components:footer:backToTop')}
      />
    </Footer>
  );
}

export default HaitatonFooter;
