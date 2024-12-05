import { useState } from 'react';
import { Button, IconEnvelope, IconQuestionCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AlluStatus, Application } from '../../types/application';
import { validationSchema as johtoselvitysValidationSchema } from '../../../johtoselvitysTaydennys/validationSchema';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useIsInformationRequestFeatureEnabled from '../../taydennys/hooks/useIsInformationRequestFeatureEnabled';
import useSendTaydennysMutation from '../../taydennys/hooks/useSendTaydennys';

const validationSchemas = {
  CABLE_REPORT: johtoselvitysValidationSchema,
  EXCAVATION_NOTIFICATION: null,
};

export default function useSendTaydennys(application: Application) {
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
    <Button
      theme="coat"
      iconLeft={<IconEnvelope />}
      onClick={openSendTaydennysDialog}
      loadingText={t('common:buttons:sendingText')}
      isLoading={sendTaydennysMutation.isLoading}
    >
      {t('taydennys:buttons:sendTaydennys')}
    </Button>
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
