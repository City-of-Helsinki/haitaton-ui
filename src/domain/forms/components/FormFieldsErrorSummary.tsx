import { Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';

type Props = {
  notificationLabel: string;
  children: React.ReactNode;
};

export default function FormFieldsErrorSummary({ notificationLabel, children }: Readonly<Props>) {
  return (
    <Notification label={notificationLabel} type="alert">
      <Box as="ul" marginLeft="var(--spacing-m)">
        {children}
      </Box>
    </Notification>
  );
}
