import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { HankeDataDraft } from '../../types/hanke';

type Props = {
  projectsData: HankeDataDraft[];
};

const HankePortfolio: React.FC<Props> = ({ projectsData }) => {
  const { MAP, NEW_HANKE } = useLocalizedRoutes();
  const { t } = useTranslation();
  console.log('Log projectsData');
  console.log(projectsData);
  console.log('Log MAP');
  console.log(MAP);
  console.log('Log NEW_HANKE');
  console.log(NEW_HANKE);

  return (
    <>
      <h1>Hankesalkku</h1>
      <div>
        <Text
          tag="h1"
          data-testid="HankePortfolioPageHeader"
          styleAs="h2"
          spacing="s"
          weight="bold"
        >
          {t('hankePortfolio:pageHeader')}
        </Text>
        <p>{MAP.path}</p>
        <p>{NEW_HANKE.path}</p>
      </div>
    </>
  );
};

export default HankePortfolio;
