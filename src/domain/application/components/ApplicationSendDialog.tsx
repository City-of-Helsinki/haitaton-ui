import {
  Button,
  Dialog,
  IconCheck,
  IconQuestionCircle,
  Notification,
  TextInput,
  ToggleButton,
} from 'hds-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationSendData, PaperDecisionReceiver } from '../types/application';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendSchema } from '../yupSchemas';
import { Box, Grid, GridItem, VisuallyHiddenInput } from '@chakra-ui/react';
import Text from '../../../common/components/text/Text';

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSend: (paperDecisionReceiver?: PaperDecisionReceiver | null) => void;
  applicationId: number;
};

const ApplicationSendDialog: React.FC<Props> = ({
  isOpen,
  isLoading,
  onClose,
  onSend,
  applicationId,
}) => {
  const { t } = useTranslation();
  const formContext = useForm<ApplicationSendData>({
    resolver: yupResolver(sendSchema),
    defaultValues: {
      applicationId: applicationId,
      orderPaperDecision: false,
      paperDecisionReceiver: null,
    },
  });

  const { handleSubmit, formState, register, watch, setValue, resetField, reset } = formContext;
  const [orderPaperDecisionChecked] = watch(['orderPaperDecision']);
  const isConfirmButtonEnabled = formState.isValid;
  const dialogTitle = t('hakemus:sendDialog:title');

  useEffect(() => {
    formContext.setValue('applicationId', applicationId);
  }, [formContext, applicationId, setValue]);

  async function submitForm(data: ApplicationSendData) {
    const paperDecisionReceiver = data.orderPaperDecision
      ? (data.paperDecisionReceiver as PaperDecisionReceiver)
      : null;
    onSend(paperDecisionReceiver);
    onClose();
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
    reset();
    onClose();
  }

  return (
    <Dialog
      id="application-send"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
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
            <VisuallyHiddenInput
              name="applicationId"
              value={applicationId}
              aria-hidden="true"
              readOnly
            />
            <Text tag="p" spacingBottom="s">
              {t('hakemus:sendDialog:instructions')}
            </Text>
            <Box marginLeft="var(--spacing-xs)" marginBottom="var(--spacing-s)">
              <ToggleButton
                {...register('orderPaperDecision')}
                id="orderPaperDecision"
                label={t('hakemus:sendDialog:orderPaperDecision')}
                checked={orderPaperDecisionChecked}
                onChange={handleOrderPaperDecisionChange}
              />
            </Box>
            {orderPaperDecisionChecked && (
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
                      id="paperDecisionReceiver.name"
                      name="paperDecisionReceiver.name"
                      label={t('hakemus:sendDialog:name')}
                      required={orderPaperDecisionChecked}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <TextInput
                      {...register('paperDecisionReceiver.streetAddress')}
                      id="paperDecisionReceiver.streetAddress"
                      name="paperDecisionReceiver.streetAddress"
                      label={t('hakemus:sendDialog:streetAddress')}
                      required={orderPaperDecisionChecked}
                    />
                  </GridItem>
                  <GridItem colSpan={{ sm: 1, xs: 2 }} colStart={{ sm: 1, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.postalCode')}
                      id="paperDecisionReceiver.postalCode"
                      name="paperDecisionReceiver.postalCode"
                      label={t('hakemus:sendDialog:postalCode')}
                      required={orderPaperDecisionChecked}
                    />
                  </GridItem>
                  <GridItem colSpan={2} colStart={{ sm: 2, xs: 1 }}>
                    <TextInput
                      {...register('paperDecisionReceiver.city')}
                      id="paperDecisionReceiver.city"
                      name="paperDecisionReceiver.city"
                      label={t('hakemus:sendDialog:city')}
                      required={orderPaperDecisionChecked}
                    />
                  </GridItem>
                </Grid>
              </Box>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button
              type="submit"
              iconLeft={<IconCheck />}
              isLoading={isLoading}
              loadingText={t('common:buttons:sendingText')}
              disabled={!isConfirmButtonEnabled}
            >
              {t('common:confirmationDialog:confirmButton')}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApplicationSendDialog;
