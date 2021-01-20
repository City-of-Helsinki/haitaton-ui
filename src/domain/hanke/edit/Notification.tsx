import React from 'react';
import { Notification, NotificationType } from 'hds-react';

type Props = {
  label: string;
  typeProps: NotificationType;
};

const NotificationComp: React.FC<Props> = ({ label, typeProps, children }) => {
  return (
    <Notification
      label={label}
      position="top-right"
      dismissible
      autoClose
      autoCloseDuration={3000}
      closeButtonLabelText="Close toast"
      type={typeProps}
      style={{ zIndex: 100 }}
    >
      {children}
    </Notification>
  );
};

export default NotificationComp;
