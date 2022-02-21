import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import HankeListPage from '../../pages/HankeListPage';
import MapPage from '../../pages/MapPage';
import HankePortfolioPage from '../../pages/HankePortfolioPage';
import NewHankePage from '../../pages/NewHankePage';
import EditHankePage from '../../pages/EditHankePage';
import HomePage from '../../pages/HomePage';
import InfoPage from '../../pages/staticPages/InfoPage';
import AccessibilityPage from '../../pages/staticPages/AccessibilityPage';
import ReferencesPage from '../../pages/staticPages/ReferencesPage';
import PrivacyPolicyPage from '../../pages/staticPages/PrivacyPolicyPage';
import NewHakemusPage from '../../pages/NewHakemusPage';

const LocaleRoutes = () => {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path={t('routes:HOME:path')} element={<HomePage />} />
      <Route path={t('routes:NEW_HANKE:path')} element={<NewHankePage />} />
      <Route path={t('routes:EDIT_HANKE:path')} element={<EditHankePage />} />
      <Route path={t('routes:PROJECTS:path')} element={<HankeListPage />} />
      <Route path={t('routes:HANKEPORTFOLIO:path')} element={<HankePortfolioPage />} />
      <Route path={t('routes:MAP:path')} element={<MapPage />} />
      <Route path={t('routes:HAITATON_INFO:path')} element={<InfoPage />} />
      <Route path={t('routes:HAKEMUS:path')} element={<NewHakemusPage />} />
      <Route path={t('routes:ACCESSIBILITY:path')} element={<AccessibilityPage />} />
      <Route path={t('routes:REFERENCES:path')} element={<ReferencesPage />} />
      <Route path={t('routes:PRIVACY_POLICY:path')} element={<PrivacyPolicyPage />} />
    </Routes>
  );
};

export default LocaleRoutes;
