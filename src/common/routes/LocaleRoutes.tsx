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
import Johtoselvitys from '../../pages/Johtoselvitys';
import useUser from '../../domain/auth/useUser';
import PrivateRoute from './PrivateRoute';
import MapAndListPage from '../../pages/MapAndListPage';
import FullPageMapPage from '../../pages/FullPageMapPage';
import HankePage from '../../pages/HankePage';
import ApplicationPage from '../../pages/ApplicationPage';
import EditJohtoselvitysPage from '../../pages/EditJohtoselvitysPage';
import NotFoundPage from '../../pages/staticPages/404Page';
import ManualPage from '../../pages/staticPages/ManualPage';

const LocaleRoutes = () => {
  const { t } = useTranslation();
  const { isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route path={t('routes:HOME:path')} element={<HomePage />} />
      <Route
        path={`${t('routes:NEW_HANKE:path')}/`}
        element={<PrivateRoute element={<NewHankePage />} />}
      />
      <Route
        path={`${t('routes:EDIT_HANKE:path')}/`}
        element={<PrivateRoute element={<EditHankePage />} />}
      />
      <Route
        path={t('routes:HANKEPORTFOLIO:path')}
        element={<PrivateRoute element={<HankePortfolioPage />} />}
      />
      <Route path={t('routes:HANKE:path')} element={<PrivateRoute element={<HankePage />} />} />
      <Route path={t('routes:HAITATON_INFO:path')} element={<InfoPage />} />
      <Route
        path={t('routes:JOHTOSELVITYSHAKEMUS:path')}
        element={<PrivateRoute element={<Johtoselvitys />} />}
      />
      <Route
        path={t('routes:EDIT_JOHTOSELVITYSHAKEMUS:path')}
        element={<PrivateRoute element={<EditJohtoselvitysPage />} />}
      />
      <Route
        path={t('routes:HAKEMUS:path')}
        element={<PrivateRoute element={<ApplicationPage />} />}
      />
      <Route path={t('routes:FULL_PAGE_MAP:path')} element={<FullPageMapPage />} />
      <Route path={t('routes:PUBLIC_HANKKEET:path')} element={<MapAndListPage />}>
        <Route element={<MapPage />} index />
        <Route path={t('routes:PUBLIC_HANKKEET_MAP:path')} element={<MapPage />} />
        <Route path={t('routes:PUBLIC_HANKKEET_LIST:path')} element={<HankeListPage />} />
      </Route>
      <Route path={t('routes:ACCESSIBILITY:path')} element={<AccessibilityPage />} />
      <Route path={t('routes:REFERENCES:path')} element={<ReferencesPage />} />
      <Route path={t('routes:PRIVACY_POLICY:path')} element={<PrivacyPolicyPage />} />
      <Route path={t('routes:MANUAL:path')} element={<ManualPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default LocaleRoutes;
