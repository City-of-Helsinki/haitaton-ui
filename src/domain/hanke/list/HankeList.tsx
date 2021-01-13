import axios from 'axios';
import React from 'react';
import Moment from 'moment';
import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

import H1 from '../../../common/components/text/H1';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Locale from '../../../common/components/locale/Locale';
import { HankeData } from '../edit/types';

import Table from './Table';

import './Hankelista.styles.scss';

const getProjects = async () => {
  const { data } = await axios.get(`/api/hankkeet/`);
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
          return Moment(d.alkuPvm).local().format('DD.MM.YYYY');
        },
      },
      {
        Header: 'Lopetus',
        accessor: (d: HankeData) => {
          return Moment(d.alkuPvm).local().format('DD.MM.YYYY');
        },
      },
    ],

    []
  );
  return (
    <div className="hankelista">
      <H1 stylesAs="h2">{t('hankeList:pageHeader')}</H1>
      {isLoading && <p>ladataan</p>}
      <div className="hankelista__inner">
        <Table columns={columns} data={!isLoading || isError ? data : []} />
        <div className="hankelista__inner__buttonWpr">
          <NavLink
            to={FORM.path}
            className="hankelista__inner__buttonWpr__hankeLink"
            data-testid="hankeLink"
          >
            <Locale id="header:hankeLink" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Projects;
