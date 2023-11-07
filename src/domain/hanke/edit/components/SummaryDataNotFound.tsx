import { Box } from '@chakra-ui/react';
import { IconInfoCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';

const SummaryDataNotFound = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" width="max-content" mb="var(--spacing-m)">
      <IconInfoCircle size="s" />
      <p
        style={{
          marginLeft: '8px',
          marginTop: '4px',
          fontWeight: 500,
        }}
      >
        {t('hankeForm:hankkeenYhteenvetoForm:dataNotFound')}
      </p>
    </Box>
  );
};

export default SummaryDataNotFound;
