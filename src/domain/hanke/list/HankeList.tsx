import React from 'react';
import { useTranslation } from 'react-i18next';
import makeData from './makeData';

import H1 from '../../../common/components/text/H1';

import Table from './Table';

import './Hankelista.styles.scss';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const columns = React.useMemo(
    () => [
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Visits',
        accessor: 'visits',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
      },
    ],

    []
  );

  const data = React.useMemo(() => makeData(20), []);

  return (
    <div className="hankelista">
      <H1 stylesAs="h2">{t('hankeList:pageHeader')}</H1>
      <div className="hankelista__inner">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Projects;
