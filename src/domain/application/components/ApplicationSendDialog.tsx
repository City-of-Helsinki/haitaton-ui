import {
  Button,
  Dialog,
  IconCheck,
  IconQuestionCircle,
  Link,
  LoadingSpinner,
  Notification,
  ToggleButton,
} from 'hds-react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Application,
  ApplicationSendData,
  JohtoselvitysData,
  KaivuilmoitusData,
  PaperDecisionReceiver,
} from '../types/application';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendSchema } from '../yupSchemas';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import Text from '../../../common/components/text/Text';
import TextInput from '../../../common/components/textInput/TextInput';
import { useFeatureFlags } from '../../../common/components/featureFlags/FeatureFlagsContext';
import useSendApplication from '../hooks/useSendApplication';
import useApplicationSendNotification from '../hooks/useApplicationSendNotification';
import { KaivuilmoitusMuutosilmoitusFormValues } from '../../kaivuilmoitusMuutosilmoitus/types';
import { Muutosilmoitus } from '../muutosilmoitus/types';

type Props = {
  application: Application;
  muutosilmoitus?:
    | KaivuilmoitusMuutosilmoitusFormValues
    | Muutosilmoitus<KaivuilmoitusData | JohtoselvitysData>
    | null;
  isOpen: boolean;
  onClose: (id?: number | null) => void;
};

/**
 * A dialog for sending an application or muutosilmoitus to Allu.
 *
 * @param application
 * @param muutosilmoitus
 * @param isOpen
 * @param onClose
 * @constructor
 */
const ApplicationSendDialog: React.FC<Props> = ({
  application,
  muutosilmoitus,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { applicationType } = application;
  const { id, applicationData } = muutosilmoitus ?? application;
  const isMuutosilmoitus = muutosilmoitus != null;
  const features = useFeatureFlags();
  const [showPaperDecision, setShowPaperDecision] = React.useState(
    applicationData.paperDecisionReceiver != null,
  );
  const formContext = useForm<ApplicationSendData>({
    resolver: yupResolver(sendSchema),
    defaultValues: {
      orderPaperDecision: applicationData.paperDecisionReceiver != null,
      paperDecisionReceiver: applicationData.paperDecisionReceiver,
    },
  });

  const { handleSubmit, formState, register, setValue } = formContext;
  const isConfirmButtonEnabled = formState.isValid;
  const dialogTitle = isMuutosilmoitus
    ? t('muutosilmoitus:sendDialog:title')
    : t('hakemus:sendDialog:title');
  const paperDecisionFeatureEnabled =
    applicationType === 'EXCAVATION_NOTIFICATION' || features.cableReportPaperDecision;

  const applicationSendMutation = useSendApplication({ isMuutosilmoitus: isMuutosilmoitus });
  const { showSendSuccess } = useApplicationSendNotification(isMuutosilmoitus);

  async function submitForm(sendData: ApplicationSendData) {
    const paperDecisionReceiver = sendData.orderPaperDecision
      ? (sendData.paperDecisionReceiver as PaperDecisionReceiver)
      : null;
    applicationSendMutation.mutate(
      {
        id: isMuutosilmoitus ? (muutosilmoitus.id! as string) : (id as number),
        paperDecisionReceiver: paperDecisionReceiver,
      },
      {
        onSuccess(data) {
          showSendSuccess();
          onClose(data.id);
        },
      },
    );
  }

  function handleOrderPaperDecisionChange() {
    const newValue = !showPaperDecision;
    setValue('orderPaperDecision', newValue, {
      shouldDirty: true,
    });
    setShowPaperDecision(newValue);
  }

  function handleClose() {
    if (!applicationSendMutation.isLoading) {
      applicationSendMutation.reset();
      onClose();
    }
  }

  const submitButtonIcon = applicationSendMutation.isLoading ? (
    <LoadingSpinner small />
  ) : (
    <IconCheck />
  );

  return (
    <Dialog
      id="application-send"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={handleClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="application-send-title"
        title={dialogTitle}
        iconLeft={<IconQuestionCircle aria-hidden="true" />}
      />
      <FormProvider {...formContext}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Dialog.Content>
            <Text tag="p" spacingBottom="s">
              {t('hakemus:sendDialog:instructions') +
                (paperDecisionFeatureEnabled
                  ? ' ' + t('hakemus:sendDialog:instructionsPaperDecision')
                  : '')}
            </Text>
            {paperDecisionFeatureEnabled && (
              <Box marginLeft="var(--spacing-xs)" marginBottom="var(--spacing-s)">
                <ToggleButton
                  {...register('orderPaperDecision')}
                  id="orderPaperDecision"
                  label={t('hakemus:sendDialog:orderPaperDecision')}
                  checked={showPaperDecision}
                  onChange={handleOrderPaperDecisionChange}
                  disabled={applicationSendMutation.isLoading}
                />
              </Box>
            )}
            {paperDecisionFeatureEnabled && showPaperDecision && (
              <Box>
                <Notification label={t('hakemus:sendDialog:paperDecisionNotificationLabel')}>
                  {t('hakemus:sendDialog:paperDecisionNotificationText')}
                </Notification>
                <Grid
                  templateRows="repeat(3, 1fr)"
                  templateColumns={{ sm: 'repeat(3, 1fr)', xs: 'repeat(1, 1fr)' }}
                  marginTop="var(--spacing-s)"
                  columnGap={4}
                  rowGap={3}
                >
                  <GridItem colSpan={2}>
                    <TextInput
                      {...register('paperDecisionReceiver.name')}
                      name="paperDecisionReceiver.name"
                      label={t('hakemus:sendDialog:name')}
                      required={showPaperDecision}
                      disabled={applicationSendMutation.isLoading}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <TextInput
                      {...register('paperDecisionReceiver.streetAddress')}
                      name="paperDecisionReceiver.streetAddress"
                      label={t('hakemus:sendDialog:streetAddress')}
                      required={showPaperDecision}
                      disabled={applicationSendMutation.isLoading}
                    />
                  </GridItem>
                  <GridItem colSpan={{ sm: 1, xs: 2 }} colStart={{ sm: 1, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.postalCode')}
                      name="paperDecisionReceiver.postalCode"
                      label={t('hakemus:sendDialog:postalCode')}
                      required={showPaperDecision}
                      disabled={applicationSendMutation.isLoading}
                    />
                  </GridItem>
                  <GridItem colSpan={2} colStart={{ sm: 2, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.city')}
                      name="paperDecisionReceiver.city"
                      label={t('hakemus:sendDialog:city')}
                      required={showPaperDecision}
                      disabled={applicationSendMutation.isLoading}
                    />
                  </GridItem>
                </Grid>
              </Box>
            )}
            {applicationSendMutation.isError && (
              <Box paddingTop="var(--spacing-s)">
                <Notification
                  type="error"
                  size="small"
                  label={
                    isMuutosilmoitus
                      ? t('muutosilmoitus:notification:sendErrorLabel')
                      : t('hakemus:notifications:sendErrorLabel')
                  }
                >
                  {isMuutosilmoitus ? (
                    <Trans i18nKey="muutosilmoitus:notification:sendErrorText">
                      <p>
                        Lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteyttä
                        Haitattoman tekniseen tukeen sähköpostiosoitteessa
                        <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
                      </p>
                    </Trans>
                  ) : (
                    <Trans i18nKey="hakemus:notifications:sendErrorText">
                      <p>
                        Hakemuksen lähettäminen käsittelyyn epäonnistui. Yritä lähettämistä
                        myöhemmin uudelleen tai ota yhteyttä Haitattoman tekniseen tukeen
                        sähköpostiosoitteessa
                        <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
                      </p>
                    </Trans>
                  )}
                </Notification>
              </Box>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button
              type="submit"
              iconLeft={submitButtonIcon}
              disabled={!isConfirmButtonEnabled || applicationSendMutation.isLoading}
            >
              {applicationSendMutation.isLoading
                ? t('common:buttons:sendingText')
                : t('common:confirmationDialog:confirmButton')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={applicationSendMutation.isLoading}
            >
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApplicationSendDialog;
