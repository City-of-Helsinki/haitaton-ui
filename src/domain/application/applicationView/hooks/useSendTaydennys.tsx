import { useState } from 'react';
import { Button, IconEnvelope, IconQuestionCircle, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AlluStatus, Application } from '../../types/application';
import { validationSchema as johtoselvitysValidationSchema } from '../../../johtoselvitysTaydennys/validationSchema';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useIsInformationRequestFeatureEnabled from '../../taydennys/hooks/useIsInformationRequestFeatureEnabled';
import useSendTaydennysMutation from '../../taydennys/hooks/useSendTaydennys';
import { isContactIn } from '../../utils';
import { SignedInUser } from '../../../hanke/hankeUsers/hankeUser';

const validationSchemas = {
  CABLE_REPORT: johtoselvitysValidationSchema,
  EXCAVATION_NOTIFICATION: null,
};

export default function useSendTaydennys(
  application: Application,
  signedInUser: SignedInUser | undefined,
) {
  const { t } = useTranslation();
  const informationRequestFeatureEnabled = useIsInformationRequestFeatureEnabled();
  const taydennysValidationSchema = validationSchemas[application.applicationType];
  const isTaydennysValid = taydennysValidationSchema?.isValidSync(application.taydennys);
  const showSendTaydennysButton =
    informationRequestFeatureEnabled &&
    application.alluStatus === AlluStatus.WAITING_INFORMATION &&
    isTaydennysValid &&
    application.taydennys &&
    application.taydennys.muutokset.length > 0;
  const [showSendTaydennysDialog, setShowSendTaydennysDialog] = useState(false);
  const sendTaydennysMutation = useSendTaydennysMutation();
  const isContact =
    application.taydennys && isContactIn(signedInUser, application.taydennys.applicationData);
  const disableSendButton = Boolean(!isContact);

  function openSendTaydennysDialog() {
    setShowSendTaydennysDialog(true);
  }

  function closeSendTaydennysDialog() {
    setShowSendTaydennysDialog(false);
  }

  function sendTaydennysHakemus() {
    if (application.taydennys?.id) {
      sendTaydennysMutation.mutate(application.taydennys.id);
      closeSendTaydennysDialog();
    }
  }

  const sendTaydennysButton = showSendTaydennysButton ? (
    <>
      <Button
        theme="coat"
        iconLeft={<IconEnvelope />}
        onClick={openSendTaydennysDialog}
        loadingText={t('common:buttons:sendingText')}
        isLoading={sendTaydennysMutation.isLoading}
        disabled={disableSendButton}
      >
        {t('taydennys:buttons:sendTaydennys')}
      </Button>
      {disableSendButton && (
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

  const sendTaydennysDialog = (
    <ConfirmationDialog
      title={t('taydennys:sendDialog:title')}
      description={t('taydennys:sendDialog:description')}
      showCloseButton
      isOpen={showSendTaydennysDialog}
      close={closeSendTaydennysDialog}
      mainAction={sendTaydennysHakemus}
      variant="primary"
      headerIcon={<IconQuestionCircle />}
    />
  );

  return { sendTaydennysButton, sendTaydennysDialog };
}
