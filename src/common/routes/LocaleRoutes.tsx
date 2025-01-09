import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import HankeListPage from '../../pages/HankeListPage';
import MapPage from '../../pages/MapPage';
import HankePortfolioPage from '../../pages/HankePortfolioPage';
import EditHankePage from '../../pages/EditHankePage';
import HomePage from '../../pages/HomePage';
import InfoPage from '../../pages/staticPages/InfoPage';
import AccessibilityPage from '../../pages/staticPages/AccessibilityPage';
import ReferencesPage from '../../pages/staticPages/ReferencesPage';
import PrivacyPolicyPage from '../../pages/staticPages/PrivacyPolicyPage';
import Johtoselvitys from '../../pages/Johtoselvitys';
import PrivateRoute from './PrivateRoute';
import MapAndListPage from '../../pages/MapAndListPage';
import FullPageMapPage from '../../pages/FullPageMapPage';
import HankePage from '../../pages/HankePage';
import ApplicationPage from '../../pages/ApplicationPage';
import EditJohtoselvitysPage from '../../pages/EditJohtoselvitysPage';
import NotFoundPage from '../../pages/staticPages/404Page';
import ManualPage from '../../pages/staticPages/ManualPage';
import AccessRightsPage from '../../pages/AccessRightsPage';
import UserIdentify from '../../domain/auth/components/UserIdentify';
import EditUserPage from '../../pages/EditUserPage';
import NewKaivuilmoitusPage from '../../pages/NewKaivuilmoitusPage';
import EditKaivuilmoitusPage from '../../pages/EditKaivuilmoitusPage';
import EditJohtoselvitysTaydennysPage from '../../pages/EditJohtoselvitysTaydennysPage';
import EditKaivuilmoitusTaydennysPage from '../../pages/EditKaivuilmoitusTaydennysPage';

const LocaleRoutes = () => {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path={t('routes:HOME:path')} element={<HomePage />} />
      <Route
        path={`${t('routes:EDIT_HANKE:path')}/`}
        element={<PrivateRoute element={<EditHankePage />} />}
      />
      <Route
        path={t('routes:HANKEPORTFOLIO:path')}
        element={<PrivateRoute element={<HankePortfolioPage />} />}
      />
      <Route path={t('routes:HANKE:path')} element={<PrivateRoute element={<HankePage />} />} />
      <Route
        path={t('routes:ACCESS_RIGHTS:path')}
        element={<PrivateRoute element={<AccessRightsPage />} />}
      />
      <Route
        path={t('routes:EDIT_USER:path')}
        element={<PrivateRoute element={<EditUserPage />} />}
      />
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
        path={t('routes:EDIT_JOHTOSELVITYSTAYDENNYS:path')}
        element={<PrivateRoute element={<EditJohtoselvitysTaydennysPage />} />}
      />
      <Route
        path={t('routes:KAIVUILMOITUSHAKEMUS:path')}
        element={<PrivateRoute element={<NewKaivuilmoitusPage />} />}
      />
      <Route
        path={t('routes:EDIT_KAIVUILMOITUSHAKEMUS:path')}
        element={<PrivateRoute element={<EditKaivuilmoitusPage />} />}
      />
      <Route
        path={t('routes:EDIT_KAIVUILMOITUSTAYDENNYS:path')}
        element={<PrivateRoute element={<EditKaivuilmoitusTaydennysPage />} />}
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
      <Route path={t('routes:IDENTIFY_USER:path')} element={<UserIdentify />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default LocaleRoutes;
