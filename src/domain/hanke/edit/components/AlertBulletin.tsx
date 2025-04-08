import { Box } from '@chakra-ui/react';
import { IconAlertCircle, IconSize } from 'hds-react';

/** Combine alert icon with a text. */
const AlertBulletin: React.FC<{ info: string }> = ({ info }) => {
  return (
    <Box display="flex" alignItems="center" width="max-content" mb="var(--spacing-m)">
      <IconAlertCircle size={IconSize.Small} />
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

export default AlertBulletin;
