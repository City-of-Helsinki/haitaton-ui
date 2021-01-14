import React from 'react';
import format from 'date-fns/format';

import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

import H1 from '../../../common/components/text/H1';
import api from '../../../common/utils/api';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Locale from '../../../common/components/locale/Locale';
import { HankeData } from '../edit/types';

import Table from './Table';

import './Hankelista.styles.scss';

const getProjects = async () => {
  const data = await api.get(`/hankkeet/`);
  return data;
};
const useProject = () => useQuery(['project'], getProjects);
const Projects: React.FC = () => {
  const { FORM } = useLocalizedRoutes();
  const { isLoading, isError, data } = useProject();

  const { t } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: 'Tunnus',
        accessor: 'hankeTunnus',
      },
      {
        Header: 'Nimi',
        accessor: 'nimi',
      },
      {
        Header: 'Vaihe',
        accessor: 'vaihe',
      },
      {
        Header: 'Aloitus',
        accessor: (d: HankeData) => {
          return format(Date.parse(d.alkuPvm), 'dd.MM.yyyy');
        },
      },
      {
        Header: 'Lopetus',
        accessor: (d: HankeData) => {
          return format(Date.parse(d.loppuPvm), 'dd.MM.yyyy');
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
      {isLoading && <p>ladataan</p>}
      <div className="hankelista__inner">
        <Table
          columns={columns}
          data={(!isLoading || isError) && data && Array.isArray(data.data) ? data.data : []}
        />
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
