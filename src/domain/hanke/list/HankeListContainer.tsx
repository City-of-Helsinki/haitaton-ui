import React from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle, LoadingSpinner } from 'hds-react';

import HankeListComponent from './HankeListComponent';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';

const getHankkeet = async () => {
  const { data } = await api.get<HankeData[]>(`/public-hankkeet`);
  return data;
};

const useHankeList = () => useQuery<HankeData[]>(['public-projects'], getHankkeet);

const HankeListContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data, isLoading, isError } = useHankeList();
  const { t } = useTranslation();

  if (data) {
    data.sort((a, b) => {
      return a.id - b.id;
    });
  }

  if (isLoading) {
    return <LoadingSpinner small style={{ marginTop: 'var(--spacing-xl)' }} />;
  }
  if (isError) {
    return (
      <p style={{ marginTop: 'var(--spacing-xs)' }}>
        <IconAlertCircle size="xs" style={{ marginRight: 'var(--spacing-xs)' }} />
        {`${t('common:components:errorLoadingInfo:textTop')} ${t(
          'common:components:errorLoadingInfo:textBottom',
        )}`}
      </p>
    );
  }
  if (data) {
    return <HankeListComponent projectsData={data} />;
  }
  return <></>;
};

export default HankeListContainer;
