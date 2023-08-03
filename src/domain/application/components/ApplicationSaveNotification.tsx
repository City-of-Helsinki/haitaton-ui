import React from 'react';
import { Link, Notification } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  saveSuccess: boolean;
  onClose: () => void;
};

function ApplicationSaveNotification({ saveSuccess, onClose }: Props) {
  const { t } = useTranslation();

  if (saveSuccess) {
    return (
      <Notification
        position="top-right"
        dismissible
        autoClose
        autoCloseDuration={5000}
        label={t('hakemus:notifications:saveSuccessLabel')}
        type="success"
        closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
        onClose={onClose}
      >
        {t('hakemus:notifications:saveSuccessText')}
      </Notification>
    );
  }

  const saveErrorText = (
    <Trans i18nKey="hakemus:notifications:saveErrorText">
      <p>
        Hakemuksen tallentaminen epäonnistui. Yritä myöhemmin uudelleen tai ota yhteyttä Haitattoman
        tekniseen tukeen sähköpostiosoitteessa
        <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
      </p>
    </Trans>
  );

  return (
    <Notification
      position="top-right"
      dismissible
      label={t('hakemus:notifications:saveErrorLabel')}
      type="error"
      closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
      onClose={onClose}
    >
      {saveErrorText}
    </Notification>
  );
}

export default ApplicationSaveNotification;
