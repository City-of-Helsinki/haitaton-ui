import React from 'react';
import { Flex } from '@chakra-ui/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { usePermissionsByHanke } from '../hankeUsers/hooks/useUserRightsForHanke';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import Breadcrumbs, { BREADCRUMBS } from '../../../common/components/breadcrumbs/Breadcrumbs';
import useHankkeet from '../hooks/useHankkeet';

const HankePortfolioContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { data: hankkeet, isError, isLoading } = useHankkeet();
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
