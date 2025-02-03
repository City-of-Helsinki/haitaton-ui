import { useTranslation } from 'react-i18next';
import { AnyObject } from 'yup';
import FormFieldsErrorSummary from '../../forms/components/FormFieldsErrorSummary';
import FormPagesErrorSummary from '../../forms/components/FormPagesErrorSummary';
import { useFormErrorsByPage } from '../hooks/useFormErrorsByPage';
import { validationSchema } from '../validationSchema';
import { mapValidationErrorToErrorListItem } from '../mapValidationErrorToErrorListItem';
import { KaivuilmoitusFormValues } from '../types';
import { KaivuilmoitusTaydennysFormValues } from '../../kaivuilmoitusTaydennys/types';

type Props = {
  data: KaivuilmoitusFormValues | KaivuilmoitusTaydennysFormValues;
  validationContext: AnyObject;
  activeStepIndex: number;
  lastStep: boolean;
};

export default function FormErrorsNotification({
  data,
  validationContext,
  activeStepIndex,
  lastStep,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const formErrorsByPage = useFormErrorsByPage(data, validationContext);

  if (lastStep) {
    return (
      <FormPagesErrorSummary
        data={data}
        schema={validationSchema}
        validationContext={validationContext}
        notificationLabel={t('hakemus:missingFields:notification:hakemusLabel')}
      />
    );
  }

  return (
    <FormFieldsErrorSummary notificationLabel={t('hakemus:missingFields:notification:pageLabel')}>
      {formErrorsByPage[activeStepIndex].map((error) =>
        mapValidationErrorToErrorListItem(error, t, data),
      )}
    </FormFieldsErrorSummary>
  );
}
