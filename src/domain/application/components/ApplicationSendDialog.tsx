import {
  Button,
  Dialog,
  IconCheck,
  IconQuestionCircle,
  Link,
  Notification,
  ToggleButton,
} from 'hds-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ApplicationSendData, ApplicationType, PaperDecisionReceiver } from '../types/application';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendSchema } from '../yupSchemas';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import Text from '../../../common/components/text/Text';
import TextInput from '../../../common/components/textInput/TextInput';
import { useFeatureFlags } from '../../../common/components/featureFlags/FeatureFlagsContext';
import useSendApplication from '../hooks/useSendApplication';
import useApplicationSendNotification from '../hooks/useApplicationSendNotification';

type Props = {
  type: ApplicationType;
  id?: number | null;
  isOpen: boolean;
  onClose: (id?: number | null) => void;
};

const ApplicationSendDialog: React.FC<Props> = ({ type, id, isOpen, onClose }) => {
  const { t } = useTranslation();
  const features = useFeatureFlags();
  const formContext = useForm<ApplicationSendData>({
    resolver: yupResolver(sendSchema),
    defaultValues: {
      orderPaperDecision: false,
      paperDecisionReceiver: null,
    },
  });

  const { handleSubmit, formState, register, watch, setValue, resetField, reset } = formContext;
  const [orderPaperDecisionChecked] = watch(['orderPaperDecision']);
  const isConfirmButtonEnabled = formState.isValid;
  const dialogTitle = t('hakemus:sendDialog:title');
  const paperDecisionFeatureEnabled =
    type === 'EXCAVATION_NOTIFICATION' || features.cableReportPaperDecision;
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  const applicationSendMutation = useSendApplication();
  const { showSendSuccess } = useApplicationSendNotification();

  async function submitForm(data: ApplicationSendData) {
    const paperDecisionReceiver = data.orderPaperDecision
      ? (data.paperDecisionReceiver as PaperDecisionReceiver)
      : null;
    setIsError(false);
    setIsSending(true);
    applicationSendMutation.mutate(
      {
        id: id as number,
        paperDecisionReceiver: paperDecisionReceiver,
      },
      {
        onSuccess(applicationData) {
          setIsError(false);
          showSendSuccess();
          setIsSending(false);
          onClose(applicationData.id);
        },
        onError() {
          setIsError(true);
          setIsSending(false);
        },
      },
    );
  }

  function handleOrderPaperDecisionChange() {
    const newValue = !orderPaperDecisionChecked;
    setValue('orderPaperDecision', newValue, {
      shouldDirty: true,
    });
    if (!newValue) {
      resetField('paperDecisionReceiver', { defaultValue: null });
    }
  }

  function handleClose() {
    if (!isSending) {
      setIsError(false);
      reset();
      onClose();
    }
  }

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
                  checked={orderPaperDecisionChecked}
                  onChange={handleOrderPaperDecisionChange}
                  disabled={isSending}
                />
              </Box>
            )}
            {paperDecisionFeatureEnabled && orderPaperDecisionChecked && (
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
                      required={orderPaperDecisionChecked}
                      disabled={isSending}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <TextInput
                      {...register('paperDecisionReceiver.streetAddress')}
                      name="paperDecisionReceiver.streetAddress"
                      label={t('hakemus:sendDialog:streetAddress')}
                      required={orderPaperDecisionChecked}
                      disabled={isSending}
                    />
                  </GridItem>
                  <GridItem colSpan={{ sm: 1, xs: 2 }} colStart={{ sm: 1, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.postalCode')}
                      name="paperDecisionReceiver.postalCode"
                      label={t('hakemus:sendDialog:postalCode')}
                      required={orderPaperDecisionChecked}
                      disabled={isSending}
                    />
                  </GridItem>
                  <GridItem colSpan={2} colStart={{ sm: 2, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.city')}
                      name="paperDecisionReceiver.city"
                      label={t('hakemus:sendDialog:city')}
                      required={orderPaperDecisionChecked}
                      disabled={isSending}
                    />
                  </GridItem>
                </Grid>
              </Box>
            )}
            {isError && (
              <Notification
                type="error"
                size="small"
                label={t('hakemus:notifications:sendErrorLabel')}
              >
                <Trans i18nKey="hakemus:notifications:sendErrorText">
                  <p>
                    Hakemuksen lähettäminen käsittelyyn epäonnistui. Yritä lähettämistä myöhemmin
                    uudelleen tai ota yhteyttä Haitattoman tekniseen tukeen sähköpostiosoitteessa
                    <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
                  </p>
                </Trans>
              </Notification>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button
              type="submit"
              iconLeft={<IconCheck />}
              isLoading={isSending}
              loadingText={t('common:buttons:sendingText')}
              disabled={!isConfirmButtonEnabled || isSending}
            >
              {t('common:confirmationDialog:confirmButton')}
            </Button>
            <Button variant="secondary" onClick={handleClose} disabled={isSending}>
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApplicationSendDialog;
