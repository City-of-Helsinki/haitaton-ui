import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../common/components/text/Text';

const FinishedForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Text tag="h2" spacing="s" weight="bold">
      {t('hankeForm:finishedForm:header')}
    </Text>
  );
};
export default FinishedForm;
