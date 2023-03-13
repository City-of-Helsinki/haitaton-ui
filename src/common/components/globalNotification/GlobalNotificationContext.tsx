import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { NotificationProps } from 'hds-react';

type GlobalNotificationProviderProps = {
  children: ReactNode;
};

type NotificationOptions = NotificationProps & {
  message: string;
};

type NotificationContextProps = {
  isOpen: boolean;
  options?: NotificationOptions;
  setNotification: (open: boolean, options?: NotificationOptions) => void;
};

const GlobalNotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function GlobalNotificationProvider({ children }: GlobalNotificationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationOptions, setNotificationOptions] = useState<NotificationOptions | undefined>(
    undefined
  );

  const setNotification = useCallback((open: boolean, options?: NotificationOptions) => {
    setIsOpen(open);
    setNotificationOptions(options);
  }, []);

  const value = {
    isOpen,
    options: notificationOptions,
    setNotification,
  };

  return (
    <GlobalNotificationContext.Provider value={value}>
      {children}
    </GlobalNotificationContext.Provider>
  );
}

export function useGlobalNotification() {
  const context = useContext(GlobalNotificationContext);

  if (context === undefined) {
    throw new Error('useGlobalNotification must be used within a GlobalNotificationProvider');
  }

  return context;
}
