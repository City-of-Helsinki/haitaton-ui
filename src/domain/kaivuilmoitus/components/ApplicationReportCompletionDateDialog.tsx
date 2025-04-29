import { ButtonVariant, Dialog, IconCheck, IconInfoCircleFill } from 'hds-react';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import {
  Application,
  Valmistumisilmoitus,
  ReportCompletionDateData,
  ValmistumisilmoitusType,
} from '../../application/types/application';
import useLocale from '../../../common/hooks/useLocale';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reportCompletionDateSchema } from '../validationSchema';
import { useMutation } from 'react-query';
import { reportOperationalCondition, reportWorkFinished } from '../../application/utils';
import { Box, VisuallyHiddenInput } from '@chakra-ui/react';
import useApplicationReportCompletionDateNotification from '../hooks/useApplicationReportCompletionDateNotification';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';
import { useApplication } from '../../application/hooks/useApplication';
import Button from '../../../common/components/button/Button';

const Instructions = ({
  type,
  previousReports,
}: {
  type: ValmistumisilmoitusType;
  previousReports: Valmistumisilmoitus[];
}) => {
  const { t } = useTranslation();
  const dialogType =
    type === 'TOIMINNALLINEN_KUNTO' ? 'operationalConditionDialog' : 'workFinishedDialog';

  // Generate the list of dates
  const previousReportsList =
    previousReports.length > 0 ? (
      <ul>
        {previousReports
          .sort(
            (a: Valmistumisilmoitus, b: Valmistumisilmoitus) =>
              new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
          )
          .map((report) => {
            const reportedAt = format(new Date(report.reportedAt), 'd.M.yyyy HH:mm', {
              locale: fi,
            });
            const dateReported = format(new Date(report.dateReported), 'd.M.yyyy', { locale: fi });

            return (
              <li key={report.reportedAt.toString()}>
                {t(`hakemus:${dialogType}:previouslyReportedAt`, {
                  reportedAt,
                  dateReported,
                })}
              </li>
            );
          })}
      </ul>
    ) : null;

  const previousReportsIntro =
    previousReports.length > 0 ? t(`hakemus:${dialogType}:previousReportsIntro`) : '';

  return (
    <Box marginBottom="var(--spacing-m)">
      <Trans i18nKey={`hakemus:${dialogType}:instructions`}>{{ previousReportsIntro }}</Trans>
      {previousReports.length > 0 && <Box marginLeft="var(--spacing-m)">{previousReportsList}</Box>}
    </Box>
  );
};

type Props = {
  type: ValmistumisilmoitusType;
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
};

const ApplicationReportCompletionDateDialog: React.FC<Props> = ({
  type,
  isOpen,
  onClose,
  applicationId,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: application, refetch } = useApplication(applicationId);
  const formContext = useForm<ReportCompletionDateData>({
    mode: 'onTouched',
    resolver: yupResolver(reportCompletionDateSchema),
    context: {
      application: application,
      dateBeforeStartErrorMessageKey: 'dateBeforeStart',
      dateInFutureErrorMessageKey: 'dateInFuture',
    },
  });
  const { handleSubmit, reset: resetForm, formState } = formContext;
  const isConsifmButtonEnabled = formState.isValid;
  const {
    mutate,
    reset: resetMutation,
    isLoading,
  } = useMutation(
    type === 'TOIMINNALLINEN_KUNTO' ? reportOperationalCondition : reportWorkFinished,
  );
  const { showReportCompletionDateSuccess, showReportCompletionDateError } =
    useApplicationReportCompletionDateNotification(
      type === 'TOIMINNALLINEN_KUNTO'
        ? 'hakemus:notifications:reportOperationalConditionSuccessText'
        : 'hakemus:notifications:reportWorkFinishedSuccessText',
    );
  const dialogType =
    type === 'TOIMINNALLINEN_KUNTO' ? 'operationalConditionDialog' : 'workFinishedDialog';
  const dialogTitle = t(`hakemus:${dialogType}:title`);
  const dialogId = `application-report-${type}`;
  const { id, applicationData, valmistumisilmoitukset } = application as Application;
  const previousReports =
    type === 'TOIMINNALLINEN_KUNTO'
      ? valmistumisilmoitukset?.TOIMINNALLINEN_KUNTO ?? ([] as Valmistumisilmoitus[])
      : valmistumisilmoitukset?.TYO_VALMIS ?? ([] as Valmistumisilmoitus[]);
  const startDate = new Date(applicationData.startTime?.toString() ?? 0);
  const today = new Date();

  useEffect(() => {
    if (isOpen) {
      refetch().then(() => {
        formContext.setValue('applicationId', applicationId);
      });
    }
  }, [isOpen, refetch, formContext, applicationId]);

  function handleClose() {
    resetForm();
    resetMutation();
    onClose();
  }

  async function submitForm(data: ReportCompletionDateData) {
    mutate(data, {
      onSuccess() {
        showReportCompletionDateSuccess();
        handleClose();
      },
      onError() {
        showReportCompletionDateError();
        handleClose();
      },
    });
  }

  return (
    <Dialog
      id={dialogId}
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id={`${dialogType}-title`}
        title={dialogTitle}
        iconStart={<IconInfoCircleFill />}
      />
      <FormProvider {...formContext}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Dialog.Content>
            <Instructions type={type} previousReports={previousReports} />
            <VisuallyHiddenInput
              name="applicationId"
              value={id as number}
              aria-hidden="true"
              readOnly
            />
            <DatePicker
              name="date"
              label={t(`hakemus:${dialogType}:date`)}
              locale={locale}
              minDate={startDate}
              maxDate={today}
              initialMonth={today}
              helperText={t('form:helperTexts:dateInForm')}
              required
            />
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button
              type="submit"
              iconStart={<IconCheck />}
              isLoading={isLoading}
              loadingText={t('common:buttons:sendingText')}
              disabled={!isConsifmButtonEnabled}
            >
              {t('common:confirmationDialog:confirmButton')}
            </Button>
            <Button variant={ButtonVariant.Secondary} onClick={onClose}>
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApplicationReportCompletionDateDialog;
