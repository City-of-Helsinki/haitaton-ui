import React, { useState } from 'react';
import { Button, IconEnvelope, IconQuestionCircle, Link, Notification } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import { AlluStatus, Application } from '../../types/application';
import { validationSchema as johtoselvitysValidationSchema } from '../../../johtoselvitysTaydennys/validationSchema';
import { validationSchema as kaivuilmoitusValidationSchema } from '../../../kaivuilmoitusTaydennys/validationSchema';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useIsInformationRequestFeatureEnabled from '../../taydennys/hooks/useIsInformationRequestFeatureEnabled';
import useSendTaydennysMutation from '../../taydennys/hooks/useSendTaydennys';
import { isContactIn } from '../../utils';
import { SignedInUser } from '../../../hanke/hankeUsers/hankeUser';
import { Box } from '@chakra-ui/react';
import useTaydennysSendNotification from '../../taydennys/hooks/useTaydennysSendNotification';

const validationSchemas = {
  CABLE_REPORT: johtoselvitysValidationSchema,
  EXCAVATION_NOTIFICATION: kaivuilmoitusValidationSchema,
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
    (application.taydennys.muutokset.length > 0 || application.taydennys.liitteet.length > 0);
  const [showSendTaydennysDialog, setShowSendTaydennysDialog] = useState(false);
  const sendTaydennysMutation = useSendTaydennysMutation();
  const { showSendSuccess } = useTaydennysSendNotification();
  const isContact =
    application.taydennys && isContactIn(signedInUser, application.taydennys.applicationData);
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  function openSendTaydennysDialog() {
    setIsError(false);
    setShowSendTaydennysDialog(true);
  }

  function closeSendTaydennysDialog() {
    if (!isSending) {
      setIsError(false);
      setShowSendTaydennysDialog(false);
    }
  }

  function sendTaydennysHakemus() {
    if (application.taydennys?.id) {
      setIsSending(true);
      setIsError(false);
      sendTaydennysMutation.mutate(application.taydennys.id, {
        onSuccess() {
          setIsError(false);
          showSendSuccess();
          setIsSending(false);
          closeSendTaydennysDialog();
        },
        onError() {
          setIsSending(false);
          setIsError(true);
        },
      });
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
        disabled={isSending}
      >
        {t('taydennys:buttons:sendTaydennys')}
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

  const sendTaydennysDialog = (
    <ConfirmationDialog
      title={t('taydennys:sendDialog:title')}
      description={
        isError ? (
          <>
            {t('taydennys:sendDialog:description')}
            <Box paddingTop="var(--spacing-s)">
              <Notification
                type="error"
                size="small"
                label={t('taydennys:notifications:sendErrorLabel')}
              >
                <Trans i18nKey="taydennys:notifications:sendErrorText">
                  <p>
                    Lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteyttä
                    Haitattoman tekniseen tukeen sähköpostiosoitteessa
                    <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
                  </p>
                </Trans>
              </Notification>
            </Box>
          </>
        ) : (
          t('taydennys:sendDialog:description')
        )
      }
      showCloseButton
      isOpen={showSendTaydennysDialog}
      close={closeSendTaydennysDialog}
      mainAction={sendTaydennysHakemus}
      variant="primary"
      isLoading={isSending}
      loadingText={t('common:buttons:sendingText')}
      headerIcon={<IconQuestionCircle />}
      disabled={isSending}
    />
  );

  return { sendTaydennysButton, sendTaydennysDialog };
}
