import { ReactNode } from 'react';
import { Link, Notification } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';

export function InvitationSuccessNotification({
  children,
  onClose,
}: Readonly<{
  children: ReactNode;
  onClose: () => void;
}>) {
  const { t } = useTranslation();
  return (
    <Notification
      position="top-right"
      dismissible
      autoClose
      autoCloseDuration={4000}
      type="success"
      label={t('hankeUsers:notifications:invitationSentSuccessLabel')}
      closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
      onClose={onClose}
    >
      {children}
    </Notification>
  );
}

export function InvitationErrorNotification({ onClose }: Readonly<{ onClose: () => void }>) {
  const { t } = useTranslation();

  return (
    <Notification
      position="top-right"
      dismissible
      type="error"
      label={t('hankeUsers:notifications:invitationSentErrorLabel')}
      closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
      onClose={onClose}
    >
      <Trans i18nKey="hankeUsers:notifications:invitationSentErrorText">
        <p>
          Kutsulinkin lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteyttä
          Haitattoman tekniseen tukeen sähköpostiosoitteessa
          <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
        </p>
      </Trans>
    </Notification>
  );
}
