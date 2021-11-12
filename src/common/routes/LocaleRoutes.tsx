import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Route, Routes, useParams, useLocation } from 'react-router-dom';
import { Language } from '../types/language';
import HankeListPage from '../../pages/HankeListPage';
import MapPage from '../../pages/MapPage';
import NewHankePage from '../../pages/NewHankePage';
import EditHankePage from '../../pages/EditHankePage';
import HomePage from '../../pages/HomePage';
import InfoPage from '../../pages/staticPages/InfoPage';
import AccessibilityPage from '../../pages/staticPages/AccessibilityPage';
import ReferencesPage from '../../pages/staticPages/ReferencesPage';
import PrivacyPolicyPage from '../../pages/staticPages/PrivacyPolicyPage';
import {
  useLocalizedRoutes,
  getRouteLocalization,
  getMatchingRouteKey,
} from '../hooks/useLocalizedRoutes';

const LocaleRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale: localeParam } = useParams();
  const useTranslationResponse = useTranslation();
  const {
    HOME,
    NEW_HANKE,
    EDIT_HANKE,
    PROJECTS,
    MAP,
    HAITATON_INFO,
    ACCESSIBILITY,
    REFERENCES,
    PRIVACY_POLICY,
  } = useLocalizedRoutes();

  const { i18n } = useTranslationResponse;
  const { language: currentLocale } = i18n;

  // Update language when route param changes
  React.useEffect(() => {
    i18n.changeLanguage(localeParam || 'fi');
  }, [i18n, localeParam]);

  // Redirect when user changes langauge
  React.useEffect(() => {
    // return if nothing changed
    if (currentLocale === localeParam || localeParam === undefined) return;
    i18n.changeLanguage(currentLocale);
    const redirectPath = getRouteLocalization({
      useTranslationResponse,
      route: getMatchingRouteKey(i18n, localeParam as Language, location.pathname),
      name: 'path',
    });

    navigate(redirectPath);
  }, [currentLocale, localeParam]);

  return (
    <Routes>
      <Route path={HOME.path} element={<HomePage />} />
      <Route path={NEW_HANKE.path} element={<NewHankePage />} />
      <Route path={EDIT_HANKE.path} element={<EditHankePage />} />
      <Route path={PROJECTS.path} element={<HankeListPage />} />
      <Route path={MAP.path} element={<MapPage />} />
      <Route path={HAITATON_INFO.path} element={<InfoPage />} />
      <Route path={ACCESSIBILITY.path} element={<AccessibilityPage />} />
      <Route path={REFERENCES.path} element={<ReferencesPage />} />
      <Route path={PRIVACY_POLICY.path} element={<PrivacyPolicyPage />} />
    </Routes>
  );
};

export default LocaleRoutes;
