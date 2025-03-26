import { useParams } from 'react-router-dom';
import { BREADCRUMBS, useBreadcrumbs } from '../Breadcrumbs';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Accordion, BreadcrumbListItem } from 'hds-react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import styles from './manualpages.module.scss';
import Puff from '../workInstructions/cards/Puff';
import useLocale from '../../../common/hooks/useLocale';

const ManualPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();
  const locale = useLocale();

  // sorry for hard-coded values here, a better way would have required a lot of effort =(
  const isAsioinninKulkuSubPage = [
    'hankkeenPerustaminen',
    'hakemuksienTekeminen',
    'tyonSeuranta',
    'taydennyspyynto',
    'muutosilmoitus',
    'johtoselvitys',
  ].includes(id);

  const isHaittaindeksitSubPage = ['laskentaperiaatteet', 'laatiminen'].includes(id);
  const isYhteyshenkilotSubPage = ['kutsunSaaminen', 'kayttooikeustasot'].includes(id);

  useEffect(() => {
    const breadcrumbs: BreadcrumbListItem[] = [BREADCRUMBS.manual];

    const breadcrumb: BreadcrumbListItem = {
      title: `staticPages:manualPage:${id}:heading`,
      path: '',
    };

    if (isAsioinninKulkuSubPage || isHaittaindeksitSubPage || isYhteyshenkilotSubPage) {
      if (isAsioinninKulkuSubPage) {
        breadcrumbs.push({
          title: `staticPages:manualPage:asioinninKulku:heading`,
          path: `${t('routes:MANUAL:path')}/asioinninKulku`,
        });
      } else if (isHaittaindeksitSubPage) {
        breadcrumbs.push({
          title: `staticPages:manualPage:haittaindeksit:heading`,
          path: `${t('routes:MANUAL:path')}/haittaindeksit`,
        });
      } else if (isYhteyshenkilotSubPage) {
        breadcrumbs.push({
          title: `staticPages:manualPage:yhteyshenkilot:heading`,
          path: `${t('routes:MANUAL:path')}/yhteyshenkilot`,
        });
      }
    }

    breadcrumbs.push(breadcrumb);

    const updateBreadcrumbs = () => {
      setBreadcrumbs(breadcrumbs);
    };

    updateBreadcrumbs();
  }, [
    setBreadcrumbs,
    id,
    t,
    isAsioinninKulkuSubPage,
    isHaittaindeksitSubPage,
    isYhteyshenkilotSubPage,
  ]);

  if (!id) {
    return <div>{t('workInstructions:cards:notFound')}</div>;
  }

  const translationComponents = {
    p: <p />,
    br: <br />,
    ol: <ol style={{ listStylePosition: 'inside' }} />,
    ul: <ul style={{ listStylePosition: 'inside' }} />,
    li: <li />,
    Puff: <Puff />,
    a: <a />,
    Accordion: <Accordion language={locale} />,
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
