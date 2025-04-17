import { Notification, NotificationSize } from 'hds-react';
import { MuutosilmoitusSent } from '../types';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type Props = {
  sent: MuutosilmoitusSent;
};

export default function MuutosilmoitusNotification({ sent }: Readonly<Props>) {
  const { t } = useTranslation();
  const formattedSentDate =
    sent &&
    format(sent, 'd.M.yyyy HH:mm', {
      locale: fi,
    });

  return (
    <Notification
      type="alert"
      label={t('muutosilmoitus:notification:label')}
      size={NotificationSize.Small}
    >
      {formattedSentDate === null
        ? t('muutosilmoitus:notification:createdText')
        : t('muutosilmoitus:notification:sentText', { date: formattedSentDate })}
    </Notification>
  );
}
