import { useParams } from 'react-router-dom';
import { BREADCRUMBS, useBreadcrumbs } from '../Breadcrumbs';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { useEffect } from 'react';
import { BreadcrumbListItem } from 'hds-react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import styles from './manualpages.module.scss';

const ManualPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();
  const { CARD } = useLocalizedRoutes();

  useEffect(() => {
    const breadcrumb: BreadcrumbListItem = {
      title: `staticPages:manualPage:${id}:heading`,
      path: '',
    };

    const updateBreadcrumbs = () => {
      setBreadcrumbs([BREADCRUMBS.cardsIndex, breadcrumb]);
    };

    updateBreadcrumbs();
  }, [setBreadcrumbs, id, t, CARD.path]);

  if (!id) {
    return <div>{t('workInstructions:cards:notFound')}</div>;
  }

  const translationComponents = {
    p: <p />,
    br: <br />,
    ol: <ol style={{ listStylePosition: 'inside' }} />,
    ul: <ul style={{ listStylePosition: 'inside' }} />,
    li: <li />,
  };

  return (
    <>
      <MainHeading spacingBottom="xl">{t(`staticPages:manualPage:${id}:heading`)}</MainHeading>
      <div className={styles.content}>
        <Trans
          i18nKey={t(`staticPages:manualPage:${id}:content`)}
          components={translationComponents}
        />
      </div>
    </>
  );
};

export default ManualPage;
