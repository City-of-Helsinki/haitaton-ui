import React from 'react';
import { useQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';
import HankePortfolioComponent from './HankePortfolioComponent';
import { usePermissionsByHanke } from '../hankeUsers/hooks/useUserRightsForHanke';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import Breadcrumbs, { BREADCRUMBS } from '../../../common/components/breadcrumbs/Breadcrumbs';

const getHankkeet = async () => {
  const { data } = await api.get<HankeData[]>(`/hankkeet`, {
    params: {
      geometry: true,
    },
  });
  return data;
};

const useHankeList = () => useQuery<HankeData[]>(['project'], getHankkeet);

const HankePortfolioContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data: hankkeet, isError, isLoading } = useHankeList();
  const { data: signedInUserByHanke } = usePermissionsByHanke();
  const userData = signedInUserByHanke ?? {};

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (isError) {
    return <ErrorLoadingText />;
  }

  // Add header to fix Axe "page-has-heading-one"-error
  return hankkeet ? (
    <>
      <Breadcrumbs breadcrumbs={[BREADCRUMBS.omatHankkeet]} />
      <HankePortfolioComponent hankkeet={hankkeet} signedInUserByHanke={userData} />
    </>
  ) : (
    <></>
  );
};

export default HankePortfolioContainer;
