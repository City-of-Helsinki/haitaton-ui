import { Breadcrumb, BreadcrumbListItem } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
};

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

  return <Breadcrumb ariaLabel={t('workInstructions:breadcrumb')} list={translatedBreadcrumbs} />;
};

export default Breadcrumbs;
