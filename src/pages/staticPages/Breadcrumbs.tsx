import { Breadcrumb, BreadcrumbListItem } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';

export const BREADCRUMBS = {
  homePage: {
    title: 'Etusivu',
    path: 'routes:HOME:path',
  },
  tyoOhjeet: {
    title: 'workInstructions:main:header',
    path: 'routes:WORKINSTRUCTIONS:path',
  },
  cardsIndex: {
    title: 'routes:CARDS_INDEX:headerLabel',
    path: 'routes:CARDS_INDEX:path',
  },
  card: {
    title: 'workInstructions:cards',
    path: 'routes:CARD:path',
  },
  basicLevel: {
    title: 'workInstructions:cards:basicLevel',
    path: null,
  },
  additionalLevel: {
    title: 'workInstructions:cards:additionalLevel',
    path: null,
  },
  manual: {
    title: 'staticPages:manualPage:main:heading',
    path: null,
  },
};

type ContextType = {
  breadcrumbs: BreadcrumbListItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbListItem[]>>;
};

// use in child routes to set breadcrumbs
export function useBreadcrumbs() {
  return useOutletContext<ContextType>();
}

const Breadcrumbs: React.FC<React.PropsWithChildren<{ breadcrumbs: BreadcrumbListItem[] }>> = ({
  breadcrumbs,
}) => {
  const { t, i18n } = useTranslation();
  const translatedBreadcrumbs = [BREADCRUMBS.homePage, ...breadcrumbs].map((breadcrumb, i) => {
    return {
      title: t(breadcrumb.title),
      path:
        breadcrumb.path && i !== breadcrumbs.length
          ? `/${i18n.language}${t(breadcrumb.path)}`
          : null,
    };
  });

  return <Breadcrumb ariaLabel={t('common:components:breadcrumb')} list={translatedBreadcrumbs} />;
};

export default Breadcrumbs;
