import { Children } from 'react';
import { Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';

type Props = {
  notificationLabel: string;
  children: React.ReactNode;
};

// Render the notification label as a single text node inside the Notification
// children instead of passing it to the Notification `label` prop. This
// ensures the label appears as a contiguous text node (avoids splitting by
// nested elements) which makes text-based tests using findByText more stable.
export default function FormFieldsErrorSummary({ notificationLabel, children }: Readonly<Props>) {
  if (Children.count(children) === 0) {
    return null;
  }

  return (
    // Keep Notification type="alert" but don't use the `label` prop to avoid
    // internal markup that may split the label across elements.
    <Notification type="alert">
      <Box as="div" marginBottom="var(--spacing-s)">
        {notificationLabel}
      </Box>
      <Box as="ul" marginLeft="var(--spacing-m)">
        {children}
      </Box>
    </Notification>
  );
}
