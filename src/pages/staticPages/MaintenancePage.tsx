import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { Header, Logo, logoFi, logoSv } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import Footer from '../../common/components/footer/Footer';
import AccessibilityPage from './AccessibilityPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import ManualPage from './ManualPage';
import InfoPage from './InfoPage';
import { LANGUAGES, Language } from '../../common/types/language';
import { getMatchingRouteKey } from '../../common/hooks/useLocalizedRoutes';
import useLocale from '../../common/hooks/useLocale';
import styles from './MaintenancePage.module.scss';
import maintenanceImage from '../../assets/images/1_Kivinokka-Kalasaatama00001.png';

const languageLabels = {
  fi: 'Suomi',
  en: 'English',
  sv: 'Svenska',
};

function MaintenanceView() {
  const { t } = useTranslation();

  return (
    <article className={styles.maintenanceContent}>
      <div>
        <h1 className={styles.maintenanceHeading}>{t('serviceMaintenance:label')}</h1>
        <p className={styles.maintenanceText}>{t('serviceMaintenance:text')}</p>
      </div>
      <div className={styles.maintenanceContent__imageContainer}>
        <img
          src={maintenanceImage}
          alt={t('serviceMaintenance:imageAltText')}
          className={styles.maintenanceContent__image}
          width={500}
          height={690}
        />
        <p>{t('serviceMaintenance:imageLabel')}</p>
      </div>
    </article>
  );
}

function LocaleRoutes() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path={t('routes:ACCESSIBILITY:path')} element={<AccessibilityPage />} />
      <Route path={t('routes:HAITATON_INFO:path')} element={<InfoPage />} />
      <Route path={t('routes:PRIVACY_POLICY:path')} element={<PrivacyPolicyPage />} />
      <Route path={t('routes:MANUAL:path')} element={<ManualPage />} />
      <Route path="*" element={<MaintenanceView />} />
    </Routes>
  );
}

function MaintenanceHeader() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const logoSrc = i18n.language === 'sv' ? logoSv : logoFi;

  async function setLanguage(lang: string) {
    const routeKey = getMatchingRouteKey(i18n, i18n.language as Language, location.pathname);
    await i18n.changeLanguage(lang);
    const path = lang + t(`routes:${routeKey}.path`);
    navigate(path);
  }

  return (
    <Header
      languages={$enum(LANGUAGES).map((lang) => ({
        label: languageLabels[lang],
        value: lang,
        isPrimary: true,
      }))}
      onDidChangeLanguage={setLanguage}
      defaultLanguage={i18n.language}
    >
      <Header.ActionBar
        title="Haitaton"
        titleHref="/"
        logoHref="/"
        frontPageLabel={t('common:components:header:frontPageLabel')}
        logo={<Logo src={logoSrc} alt={t('common:logoAlt')} />}
        menuButtonAriaLabel={t('common:ariaLabels:menuToggle')}
      >
        <Header.LanguageSelector />
      </Header.ActionBar>
    </Header>
  );
}

export default function MaintenancePage() {
  const currentLocale = useLocale();

  return (
    <Router>
      <div className={styles.pageContainer}>
        <MaintenanceHeader />

        <div className={styles.pageContainer__in}>
          <Routes>
            {Object.values(LANGUAGES).map((locale) => (
              <Route path={`/${locale}/*`} element={<LocaleRoutes />} key={locale} />
            ))}
            <Route path="*" element={<Navigate to={`/${currentLocale}`} />} />
          </Routes>
        </div>

        <Footer backgroundColor="var(--color-white)" />
      </div>
    </Router>
  );
}
