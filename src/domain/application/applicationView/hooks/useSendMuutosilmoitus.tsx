import React, { useState } from 'react';
import { Button, IconEnvelope, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AlluStatus, Application } from '../../types/application';
import { validationSchema as johtoselvitysValidationSchema } from '../../../johtoselvitysTaydennys/validationSchema';
import { validationSchema as kaivuilmoitusValidationSchema } from '../../../kaivuilmoitusTaydennys/validationSchema';
import { isContactIn } from '../../utils';
import { SignedInUser } from '../../../hanke/hankeUsers/hankeUser';
import ApplicationSendDialog from '../../components/ApplicationSendDialog';

const validationSchemas = {
  CABLE_REPORT: johtoselvitysValidationSchema,
  EXCAVATION_NOTIFICATION: kaivuilmoitusValidationSchema,
};

export default function useSendMuutosilmoitus(
  application: Application,
  signedInUser: SignedInUser | undefined,
) {
  const { t } = useTranslation();
  const validationSchema = validationSchemas[application.applicationType];
  const isValid = validationSchema?.isValidSync(application.muutosilmoitus);
  const showSendButton =
    (application.alluStatus === AlluStatus.DECISION ||
      application.alluStatus === AlluStatus.OPERATIONAL_CONDITION) &&
    isValid &&
    application.muutosilmoitus &&
    application.muutosilmoitus.sent == null &&
    application.muutosilmoitus.muutokset.length >
      0; /* TODO when muutosilmoitus have attachments add this or-clause: || application.muutosilmoitus.liitteet.length > 0*/
  const [showSendDialog, setShowSendDialog] = useState(false);
  const isContact =
    application.muutosilmoitus &&
    isContactIn(signedInUser, application.muutosilmoitus.applicationData);

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog() {
    setShowSendDialog(false);
  }

  const sendButton = showSendButton ? (
    <>
      <Button
        theme="coat"
        iconLeft={<IconEnvelope />}
        onClick={openSendDialog}
        disabled={showSendButton && !isContact}
      >
        {t('muutosilmoitus:buttons:sendMuutosilmoitus')}
      </Button>
      {!isContact && (
        <Notification
          size="small"
          style={{ marginTop: 'var(--spacing-xs)' }}
          type="info"
          label={t('hakemus:notifications:sendApplicationDisabled')}
        >
          {t('hakemus:notifications:sendApplicationDisabled')}
        </Notification>
      )}
    </>
  ) : null;

  const sendDialog = (
    <ApplicationSendDialog
      application={application}
      muutosilmoitus={application.muutosilmoitus}
      isOpen={showSendDialog}
      onClose={closeSendDialog}
    />
  );

  return { sendMuutosilmoitusButton: sendButton, sendMuutosilmoitusDialog: sendDialog };
}
