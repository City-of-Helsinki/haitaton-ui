import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';
import { HankeDataDraft } from '../../types/hanke';

type Props = {
  hankeData?: HankeDataDraft;
};

const HankeView: React.FC<Props> = ({ hankeData }) => {
  const { t } = useTranslation();

  return (
    <article>
      <header>
        <Text tag="h1" styleAs="h1" weight="bold">
          {hankeData?.nimi}
        </Text>
        <Text tag="h2" styleAs="h3" weight="bold">
          {hankeData?.hankeTunnus}
        </Text>
        <Text tag="p" styleAs="body-s" weight="bold">
          {t('hankePortfolio:labels:oikeudet')}:
        </Text>
      </header>
    </article>
  );
};

export default HankeView;
