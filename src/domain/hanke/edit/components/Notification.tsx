import React, { useState } from 'react';
import { Notification, NotificationType } from 'hds-react';

type Props = {
  label: string;
  typeProps: NotificationType;
  testId?: string;
};

const NotificationComp: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  typeProps,
  testId = 'notification',
  children,
}) => {
  const [open, setOpen] = useState(true);

  if (open) {
    return (
      <Notification
        label={label}
        position="top-right"
        dismissible
        autoClose
        autoCloseDuration={2000}
        closeButtonLabelText="Close toast"
        onClose={() => setOpen(false)}
        type={typeProps}
        style={{ zIndex: 100 }}
        dataTestId={testId}
      >
        {children}
      </Notification>
    );
  }

  return null;
};

export default NotificationComp;
