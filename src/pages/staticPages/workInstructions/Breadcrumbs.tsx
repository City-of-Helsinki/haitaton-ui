import { Breadcrumb, BreadcrumbListItem } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const BREADCRUMBS = {
  homePage: {
    title: 'Etusivu',
    path: '/',
  },
  tyoOhjeet: {
    title: 'routes:WORKINSTRUCTIONS:headerLabel',
    path: 'routes:WORKINSTRUCTIONS:path',
  },
  cardsIndex: {
    title: 'routes:CARDS_INDEX:headerLabel',
    path: 'routes:CARDS_INDEX:path',
  },
  card1: {
    title: 'workInstructions:cards:1:header',
    path: null,
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
  console.log(breadcrumbs);
  const translatedBreadcrumbs = [BREADCRUMBS.homePage, ...breadcrumbs].map((breadcrumb, i) => {
    return {
      title: t(breadcrumb.title),
      path:
        breadcrumb.path && i !== breadcrumbs.length - 1
          ? `/${i18n.language}${t(breadcrumb.path)}`
          : null,
    };
  });
  console.log('t', translatedBreadcrumbs);

  return <Breadcrumb ariaLabel={t('workInstructions:breadcrumb')} list={translatedBreadcrumbs} />;
};

export default Breadcrumbs;
