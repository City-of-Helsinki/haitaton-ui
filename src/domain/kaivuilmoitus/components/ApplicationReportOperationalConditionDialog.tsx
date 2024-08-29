import { Button, Dialog, IconCheck, IconInfoCircleFill, Notification } from 'hds-react';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import {
  Application,
  Ilmoitus,
  ReportOperationalConditionData,
} from '../../application/types/application';
import useLocale from '../../../common/hooks/useLocale';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reportOperationalConditionSchema } from '../validationSchema';
import { useMutation } from 'react-query';
import { reportOperationalCondition } from '../../application/utils';
import { Box, VisuallyHiddenInput } from '@chakra-ui/react';
import useApplicationReportOperationalConditionNotification from '../hooks/useApplicationReportOperationalConditionNotification';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';

const Instructions = ({ previousReports }: { previousReports: Ilmoitus[] }) => {
  const { t } = useTranslation();

  // Generate the list of dates
  const previousReportsList =
    previousReports.length > 0 ? (
      <ul>
        {previousReports.map((report) => {
          const reportedAt = format(new Date(report.reportedAt), 'd.M.yyyy HH:mm', { locale: fi });
          const dateReported = format(new Date(report.dateReported), 'd.M.yyyy', { locale: fi });

          return (
            <li key={report.reportedAt.toString()}>
              {t('hakemus:operationalConditionDialog:previouslyReportedAt', {
                reportedAt,
                dateReported,
              })}
            </li>
          );
        })}
      </ul>
    ) : null;

  const previousReportsIntro =
    previousReports.length > 0 ? t('hakemus:operationalConditionDialog:previousReportsIntro') : '';

  return (
    <Box marginBottom="var(--spacing-m)">
      <Trans i18nKey="hakemus:operationalConditionDialog:instructions">
        {{ previousReportsIntro }}
      </Trans>
      {previousReports.length > 0 && <Box marginLeft="var(--spacing-m)">{previousReportsList}</Box>}
    </Box>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
};

const ApplicationReportOperationalConditionDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  application,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const formContext = useForm<ReportOperationalConditionData>({
    mode: 'onTouched',
    resolver: yupResolver(reportOperationalConditionSchema),
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
    isError,
  } = useMutation(reportOperationalCondition);
  const { showReportOperationalConditionSuccess, showReportOperationalConditionError } =
    useApplicationReportOperationalConditionNotification();
  const dialogTitle = t('hakemus:operationalConditionDialog:title');
  const { id, applicationData, ilmoitukset } = application;
  const previousReports = ilmoitukset?.TOIMINNALLINEN_KUNTO ?? ([] as Ilmoitus[]);
  const startDate = applicationData.startTime as Date;
  const today = new Date();

  useEffect(() => {
    formContext.setValue('applicationId', id as number);
  }, [formContext, id]);

  function handleClose() {
    resetForm();
    resetMutation();
    onClose();
  }

  async function submitForm(data: ReportOperationalConditionData) {
    mutate(data, {
      onSuccess() {
        showReportOperationalConditionSuccess();
        handleClose();
      },
      onError() {
        showReportOperationalConditionError();
      },
    });
  }

  return (
    <Dialog
      id="application-report-operational-condition"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="application-report-operational-condition-title"
        title={dialogTitle}
        iconLeft={<IconInfoCircleFill aria-hidden="true" />}
      />
      <FormProvider {...formContext}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Dialog.Content>
            <Instructions previousReports={previousReports} />
            <VisuallyHiddenInput
              name="applicationId"
              value={id as number}
              aria-hidden="true"
              readOnly
            />
            <DatePicker
              name="date"
              label={t(`hakemus:operationalConditionDialog:date`)}
              locale={locale}
              minDate={startDate}
              maxDate={today}
              initialMonth={today}
              helperText={t('form:helperTexts:dateInForm')}
              required
            />
            {isError && (
              <Box marginTop="var(--spacing-m)">
                <Notification label={t('form:validations:required')} type="error" />
              </Box>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button
              type="submit"
              iconLeft={<IconCheck />}
              isLoading={isLoading}
              loadingText={t('common:buttons:sendingText')}
              disabled={!isConsifmButtonEnabled}
            >
              {t('common:confirmationDialog:confirmButton')}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApplicationReportOperationalConditionDialog;
