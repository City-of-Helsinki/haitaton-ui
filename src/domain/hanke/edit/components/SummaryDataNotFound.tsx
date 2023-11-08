import { Box } from '@chakra-ui/react';
import { IconInfoCircle } from 'hds-react';

const SummaryDataNotFound: React.FC<{ info: string }> = ({ info }) => {
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
        {info}
      </p>
    </Box>
  );
};

export default SummaryDataNotFound;
