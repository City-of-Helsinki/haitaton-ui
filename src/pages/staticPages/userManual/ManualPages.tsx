import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Accordion, BreadcrumbListItem } from 'hds-react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import styles from './manualpages.module.scss';
import Puff from '..//Puff';
import useLocale from '../../../common/hooks/useLocale';
import HaittojenhallintaImg1 from './figures/haittojenhallintasuunnitelma_1.png';
import HaittojenhallintaImg2 from './figures/haittojenhallintasuunnitelma_2.png';
import JohtoselvitysImg1 from './figures/johtoselvitys.png';
import VaiheetImg1 from './figures/vaiheet.png';
import { BREADCRUMBS, useBreadcrumbs } from '../../../common/components/breadcrumbs/Breadcrumbs';

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

  const HaittojenhallintaImg1Component = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={HaittojenhallintaImg1} {...props} />
  );
  const HaittojenhallintaImg2Component = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={HaittojenhallintaImg2} {...props} />
  );
  const JohtoselvitysImg1Component = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={JohtoselvitysImg1} {...props} />
  );
  const VaiheetImg1Component = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={VaiheetImg1} {...props} />
  );

  const translationComponents = {
    p: <p />,
    br: <br />,
    ol: <ol />,
    ul: <ul />,
    li: <li />,
    Puff: <Puff />,
    a: <a />,
    Accordion: <Accordion language={locale} />,
    table: <table />,
    caption: <caption />,
    thead: <thead />,
    tbody: <tbody />,
    tr: <tr />,
    th: <th />,
    td: <td />,
    strong: <strong />,
    div: <div />,
    HaittojenhallintaImg1Component: <HaittojenhallintaImg1Component />,
    HaittojenhallintaImg2Component: <HaittojenhallintaImg2Component />,
    JohtoselvitysImg1Component: <JohtoselvitysImg1Component />,
    VaiheetImg1Component: <VaiheetImg1Component />,
    figure: <figure />,
    figcaption: <figcaption />,
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
