import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import H1 from '../../../common/components/text/H1';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Locale from '../../../common/components/locale/Locale';
import { HankeDataDraft } from '../../types/hanke';

import Table from './Table';
import './Hankelista.styles.scss';

type Props = {
  initialData: HankeDataDraft[];
};

const Projects: React.FC<Props> = ({ initialData }) => {
  const { FORM } = useLocalizedRoutes();

  const { t } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: t('hankeList:tableHeader:id'),
        accessor: 'hankeTunnus',
      },
      {
        Header: t('hankeList:tableHeader:name'),
        accessor: 'nimi',
      },
      {
        Header: t('hankeList:tableHeader:step'),
        accessor: 'vaihe',
      },
      {
        Header: t('hankeList:tableHeader:startDate'),
        accessor: (data: HankeDataDraft) => {
          return data.alkuPvm && Date.parse(data.alkuPvm);
        },
      },
      {
        Header: t('hankeList:tableHeader:endDate'),
        accessor: (data: HankeDataDraft) => {
          return data.loppuPvm && Date.parse(data.loppuPvm);
        },
      },
    ],
    []
  );
  return (
    <div className="hankelista">
      <H1 stylesAs="h2" data-testid="HankeListPageHeader">
        {t('hankeList:pageHeader')}
      </H1>
      <div className="hankelista__inner">
        <Table columns={columns} data={initialData || []} />
        <div className="hankelista__buttonWpr">
          <NavLink data-testid="toFormLink" to={FORM.path} className="hankelista__hankeLink">
            <Locale id="header:hankeLink" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Projects;
