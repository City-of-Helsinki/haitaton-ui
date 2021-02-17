import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Locale from '../../../common/components/locale/Locale';
import { HankeDataDraft } from '../../types/hanke';

import Table from './Table';
import './Hankelista.styles.scss';

type Props = {
  projectsData: HankeDataDraft[];
};

const HankeList: React.FC<Props> = ({ projectsData }) => {
  const { MAP, NEW_HANKE } = useLocalizedRoutes();

  // eslint-disable-next-line
  function MyCell(value: any) {
    const hasGeometry = value.cell.row.original.tilat?.onGeometrioita;
    if (hasGeometry) {
      return (
        <Link to={`${MAP.path}?hanke=${value.value}`}>{value.cell.row.original.hankeTunnus}</Link>
      );
    }
    return value.value;
  }

  const { t } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: t('hankeList:tableHeader:id'),
        id: 'id',
        accessor: 'hankeTunnus',
        Cell: MyCell,
      },
      {
        Header: t('hankeList:tableHeader:name'),
        id: 'name',
        accessor: 'nimi',
      },
      {
        Header: t('hankeList:tableHeader:step'),
        id: 'step',
        accessor: 'vaihe',
      },
      {
        Header: t('hankeList:tableHeader:startDate'),
        id: 'startDate',
        accessor: (data: HankeDataDraft) => {
          return data.alkuPvm && Date.parse(data.alkuPvm);
        },
      },
      {
        Header: t('hankeList:tableHeader:endDate'),
        id: 'endDate',
        accessor: (data: HankeDataDraft) => {
          return data.loppuPvm && Date.parse(data.loppuPvm);
        },
      },
    ],
    []
  );

  return (
    <div className="hankelista">
      <Text tag="h1" data-testid="HankeListPageHeader" styleAs="h2" spacing="s" weight="bold">
        {t('hankeList:pageHeader')}
      </Text>
      <div className="hankelista__inner">
        <Table columns={columns} data={projectsData || []} />
        <div className="hankelista__buttonWpr">
          <NavLink data-testid="toFormLink" to={NEW_HANKE.path} className="hankelista__hankeLink">
            <Locale id="header:hankeLink" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HankeList;
