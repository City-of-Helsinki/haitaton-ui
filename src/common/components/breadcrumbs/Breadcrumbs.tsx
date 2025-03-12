import React from 'react';
import { Box } from '@chakra-ui/react';
import { Breadcrumb, BreadcrumbListItem, Container } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';

type BreadcrumbName =
  | 'homePage'
  | 'omatHankkeet'
  | 'tyoOhjeet'
  | 'cardsIndex'
  | 'card'
  | 'basicLevel'
  | 'additionalLevel'
  | 'manual';

type Breadcrumb = BreadcrumbListItem & { skipTranslate?: boolean };

export const BREADCRUMBS: Record<BreadcrumbName, Breadcrumb> = {
  homePage: {
    title: 'common:components:header:frontPageLabel',
    path: 'routes:HOME:path',
  },
  omatHankkeet: {
    title: 'routes:HANKEPORTFOLIO:headerLabel',
    path: 'routes:HANKEPORTFOLIO:path',
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
    path: 'routes:MANUAL:path',
  },
  glossary: {
    title: 'staticPages:manualPage:glossary:heading',
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

const Breadcrumbs: React.FC<React.PropsWithChildren<{ breadcrumbs: Breadcrumb[] }>> = ({
  breadcrumbs,
}) => {
  const { t, i18n } = useTranslation();
  const translatedBreadcrumbs = [BREADCRUMBS.homePage, ...breadcrumbs].map((breadcrumb, i) => {
    return {
      title: breadcrumb.skipTranslate ? breadcrumb.title : t(breadcrumb.title),
      path:
        breadcrumb.path && i !== breadcrumbs.length
          ? breadcrumb.skipTranslate
            ? breadcrumb.path
            : `/${i18n.language}${t(breadcrumb.path)}`
          : null,
    };
  });

  return (
    <Box backgroundColor="var(--color-white)">
      <Container alignWithHeader>
        <Breadcrumb
          ariaLabel={t('common:components:breadcrumb:ariaLabel')}
          list={translatedBreadcrumbs}
          theme={{
            '--horizontal-margin-large': '0',
            '--horizontal-margin-medium': '0',
            '--horizontal-margin-small': '0',
            '--horizontal-margin-x-large': '0',
          }}
        />
      </Container>
    </Box>
  );
};

export default Breadcrumbs;
