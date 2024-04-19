import React, { useCallback, useMemo, useState } from 'react';
import { Button, IconCross, IconEnvelope, IconSaveDiskette, StepState } from 'hds-react';
import { FormProvider, useForm, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';
import { merge } from 'lodash';
import { useBeforeUnload } from 'react-router-dom';

import { JohtoselvitysFormValues } from './types';
import { BasicInfo } from './BasicInfo';
import { Contacts } from './Contacts';
import { Geometries } from './Geometries';
import { ReviewAndSend } from './ReviewAndSend';
import MultipageForm from '../forms/MultipageForm';
import FormActions from '../forms/components/FormActions';
import { validationSchema } from './validationSchema';
import {
  convertApplicationDataToFormState,
  convertFormStateToApplicationData,
  findOrdererKey,
} from './utils';
import { changeFormStep, getFieldPaths, isPageValid } from '../forms/utils';
import { isApplicationDraft, saveApplication, sendApplication } from '../application/utils';
import { HankeContacts, HankeData } from '../types/hanke';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import { useNavigateToApplicationList } from '../hanke/hooks/useNavigateToApplicationList';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useApplicationSendNotification from '../application/hooks/useApplicationSendNotification';
import useHanke from '../hanke/hooks/useHanke';
import { AlluStatus, Application, JohtoselvitysData } from '../application/types/application';
import Attachments from './Attachments';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import useAttachments from '../application/hooks/useAttachments';
import { APPLICATION_ID_STORAGE_KEY } from '../application/constants';

type Props = {
  hankeData?: HankeData;
  application?: Application<JohtoselvitysData>;
};

const JohtoselvitysContainer: React.FC<React.PropsWithChildren<Props>> = ({
  hankeData,
  application,
}) => {
  let hanke = hankeData;
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const { showSendSuccess, showSendError } = useApplicationSendNotification();
  const queryClient = useQueryClient();
  const [attachmentUploadErrors, setAttachmentUploadErrors] = useState<JSX.Element[]>([]);

  const initialValues: JohtoselvitysFormValues = {
    id: null,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: hanke ? hanke.hankeTunnus : null,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: '',
      customerWithContacts: {
        customer: {
          type: null,
          name: '',
          country: 'FI',
          email: '',
          phone: '',
          registryKey: null,
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            orderer: true,
          },
        ],
      },
      areas: [],
      startTime: null,
      endTime: null,
      workDescription: '',
      contractorWithContacts: {
        customer: {
          type: null,
          name: '',
          country: 'FI',
          email: '',
          phone: '',
          registryKey: null,
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            orderer: false,
          },
        ],
      },
      postalAddress: { streetAddress: { streetName: '' }, city: '', postalCode: '' },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: null,
    },
  };

  const formContext = useForm<JohtoselvitysFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldUnregister: false,
    defaultValues: merge(initialValues, convertApplicationDataToFormState(application)),
    resolver: yupResolver(validationSchema),
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { isDirty },
    reset,
  } = formContext;

  // Setup a callback to save application id to session storage
  // when the page is about to be unloaded if the application
  // has been saved (id exists) and user is not editing
  // previously created application. This is done so that
  // user can be redirected to editing route if the page is refreshed.
  useBeforeUnload(
    useCallback(() => {
      const applicationId = getValues('id');
      if (applicationId && !application) {
        sessionStorage.setItem(APPLICATION_ID_STORAGE_KEY, applicationId.toString());
      }
    }, [getValues, application]),
  );

  // If application is created without hanke existing first, get generated hanke data
  // after first save when hankeTunnus is available
  const { data: generatedHanke } = useHanke(!hankeData ? getValues('hankeTunnus') : null);
  if (generatedHanke) {
    hanke = generatedHanke;
  }

  const { data: existingAttachments, isError: attachmentsLoadError } = useAttachments(
    getValues('id'),
  );

  const navigateToApplicationList = useNavigateToApplicationList(hanke?.hankeTunnus);

  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const [attachmentsUploading, setAttachmentsUploading] = useState(false);

  const applicationSaveMutation = useMutation(saveApplication, {
    onMutate() {
      setShowSaveNotification(false);
    },
    onSuccess(data) {
      setValue('id', data.id);
      setValue('alluStatus', data.alluStatus);
      setValue('hankeTunnus', data.hankeTunnus);
      reset({}, { keepValues: true });
    },
    onSettled() {
      setShowSaveNotification(true);
    },
  });

  const applicationSendMutation = useMutation(sendApplication, {
    onError() {
      showSendError();
    },
    async onSuccess() {
      showSendSuccess();
      await queryClient.invalidateQueries('application', { refetchInactive: true });
      navigateToApplicationList();
    },
  });

  function saveCableApplication() {
    const data = convertFormStateToApplicationData(getValues());
    applicationSaveMutation.mutate(data);
  }

  async function sendCableApplication() {
    const data = getValues();
    let { id } = data;
    // If for some reason application has not been saved before
    // sending, meaning id is null, save it before sending
    if (!id) {
      try {
        const responseData = await applicationSaveMutation.mutateAsync(
          convertFormStateToApplicationData(data),
        );
        setShowSaveNotification(false);
        id = responseData.id as number;
      } catch (error) {
        return;
      }
    }
    applicationSendMutation.mutate(id);
  }

  function handleStepChange() {
    // Save application when page is changed
    // only if something has changed
    if (isDirty) {
      saveCableApplication();
    }
  }

  function saveAndQuit() {
    applicationSaveMutation.mutate(convertFormStateToApplicationData(getValues()), {
      onSuccess(data) {
        navigateToApplicationList(data.hankeTunnus);

        setNotification(true, {
          position: 'top-right',
          dismissible: true,
          autoClose: true,
          autoCloseDuration: 5000,
          label: t('hakemus:notifications:saveSuccessLabel'),
          message: t('hakemus:notifications:saveSuccessText'),
          type: 'success',
          closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
        });
      },
    });
  }

  function handleAttachmentUpload(isUploading: boolean) {
    setAttachmentsUploading(isUploading);
  }

  function closeAttachmentUploadErrorDialog() {
    setAttachmentUploadErrors([]);
  }

  const ordererKey = findOrdererKey(getValues('applicationData'));

  const customer = getValues('applicationData.customerWithContacts.customer');
  const customersContacts = getValues('applicationData.customerWithContacts.contacts');
  const contractor = getValues('applicationData.contractorWithContacts.customer');
  const contractorsContacts = getValues('applicationData.contractorWithContacts.contacts');
  const propertyDeveloper = getValues('applicationData.propertyDeveloperWithContacts.customer');
  const propertyDevelopersContacts = getValues(
    'applicationData.propertyDeveloperWithContacts.contacts',
  );
  const representative = getValues('applicationData.representativeWithContacts.customer');
  const representativesContacts = getValues('applicationData.representativeWithContacts.contacts');

  // Fields that are validated in each page when moving forward in form
  const pageFieldsToValidate: FieldPath<JohtoselvitysFormValues>[][] = useMemo(
    () => [
      // Basic information page
      [
        'applicationData.name',
        'applicationData.postalAddress.streetAddress.streetName',
        'applicationData.constructionWork',
        'applicationData.rockExcavation',
        'applicationData.workDescription',
        `applicationData.${ordererKey}.contacts`,
      ],
      // Areas page
      [
        'applicationData.startTime',
        'applicationData.endTime',
        'applicationData.areas',
        'selfIntersectingPolygon',
      ],
      // Contacts page
      [
        ...getFieldPaths<JohtoselvitysFormValues>(
          customer,
          'applicationData.customerWithContacts.customer',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          customersContacts,
          'applicationData.customerWithContacts.contacts',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          contractor,
          'applicationData.contractorWithContacts.customer',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          contractorsContacts,
          'applicationData.contractorWithContacts.contacts',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          propertyDeveloper,
          'applicationData.propertyDeveloperWithContacts.customer',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          propertyDevelopersContacts,
          'applicationData.propertyDeveloperWithContacts.contacts',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          representative,
          'applicationData.representativeWithContacts.customer',
        ),
        ...getFieldPaths<JohtoselvitysFormValues>(
          representativesContacts,
          'applicationData.representativeWithContacts.contacts',
        ),
      ],
    ],
    [
      ordererKey,
      customer,
      customersContacts,
      contractor,
      contractorsContacts,
      propertyDeveloper,
      propertyDevelopersContacts,
      representative,
      representativesContacts,
    ],
  );

  const formSteps = useMemo(() => {
    const hankeContacts: HankeContacts | undefined = hankeData
      ? [hankeData.omistajat, hankeData.rakennuttajat, hankeData.toteuttajat, hankeData.muut]
      : undefined;

    const formValues = getValues();

    return [
      {
        element: <BasicInfo />,
        label: t('form:headers:perustiedot'),
        state: StepState.available,
      },
      {
        element: <Geometries />,
        label: t('form:headers:alueet'),
        /*
         * Determine initial state for the form step.
         * If all the fields in the previous page are valid, step is available,
         * otherwise it's disabled.
         */
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[0],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: <Contacts hankeContacts={hankeContacts} />,
        label: t('form:headers:yhteystiedot'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[1],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: (
          <Attachments
            existingAttachments={existingAttachments}
            attachmentsLoadError={attachmentsLoadError}
            onFileUpload={handleAttachmentUpload}
          />
        ),
        label: t('hankePortfolio:tabit:liitteet'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[2],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: <ReviewAndSend attachments={existingAttachments} />,
        label: t('form:headers:yhteenveto'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[2],
          formValues,
        )
          ? StepState.available
          : StepState.disabled,
      },
    ];
  }, [t, getValues, pageFieldsToValidate, hankeData, existingAttachments, attachmentsLoadError]);

  const hankeNameText = (
    <div style={{ visibility: hanke !== undefined ? 'visible' : 'hidden' }}>
      {`${hanke?.nimi} (${hanke?.hankeTunnus})`}
    </div>
  );

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    return changeFormStep(changeStep, pageFieldsToValidate[stepIndex], trigger);
  }

  const notificationLabel =
    getValues('alluStatus') === AlluStatus.PENDING
      ? t('form:notifications:labels:editSentApplication')
      : undefined;
  const notificationText =
    getValues('alluStatus') === AlluStatus.PENDING
      ? t('form:notifications:descriptions:editSentApplication')
      : undefined;
  const attachmentsUploadingText: string = t('common:components:fileUpload:loadingText');

  return (
    <FormProvider {...formContext}>
      {/* Notification for saving application */}
      {showSaveNotification && (
        <ApplicationSaveNotification
          saveSuccess={applicationSaveMutation.isSuccess}
          onClose={() => setShowSaveNotification(false)}
        />
      )}

      <MultipageForm
        heading={t('johtoselvitysForm:pageHeader')}
        subHeading={hankeNameText}
        formSteps={formSteps}
        isLoading={attachmentsUploading}
        isLoadingText={attachmentsUploadingText}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit(sendCableApplication)}
        stepChangeValidator={validateStepChange}
        notificationLabel={notificationLabel}
        notificationText={notificationText}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that current application page is valid before saving and quitting
            const applicationPageValid = await trigger(pageFieldsToValidate[activeStepIndex], {
              shouldFocus: true,
            });
            if (applicationPageValid) {
              saveAndQuit();
            }
          }

          const lastStep = activeStepIndex === formSteps.length - 1;
          const showSendButton =
            lastStep && isApplicationDraft(getValues('alluStatus') as AlluStatus | null);

          const saveAndQuitIsLoading = applicationSaveMutation.isLoading || attachmentsUploading;
          const saveAndQuitLoadingText = attachmentsUploading
            ? attachmentsUploadingText
            : t('common:buttons:savingText');
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              previousButtonIsLoading={attachmentsUploading}
              previousButtonLoadingText={attachmentsUploadingText}
              nextButtonIsLoading={attachmentsUploading}
              nextButtonLoadingText={attachmentsUploadingText}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hanke?.hankeTunnus}
                buttonIcon={<IconCross aria-hidden />}
                saveAndQuitIsLoading={saveAndQuitIsLoading}
                saveAndQuitIsLoadingText={saveAndQuitLoadingText}
              />

              <Button
                variant="supplementary"
                iconLeft={<IconSaveDiskette aria-hidden="true" />}
                data-testid="save-form-btn"
                onClick={handleSaveAndQuit}
                isLoading={saveAndQuitIsLoading}
                loadingText={saveAndQuitLoadingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>

              {showSendButton && (
                <Button
                  type="submit"
                  iconLeft={<IconEnvelope aria-hidden="true" />}
                  isLoading={applicationSendMutation.isLoading}
                  loadingText={t('common:buttons:sendingText')}
                >
                  {t('hakemus:buttons:sendApplication')}
                </Button>
              )}
            </FormActions>
          );
        }}
      </MultipageForm>

      {/* Attachment upload error dialog */}
      <ConfirmationDialog
        title={t('form:errors:fileLoadError')}
        description={attachmentUploadErrors}
        showSecondaryButton={false}
        showCloseButton
        isOpen={attachmentUploadErrors.length > 0}
        close={closeAttachmentUploadErrorDialog}
        mainAction={closeAttachmentUploadErrorDialog}
        mainBtnLabel={t('common:ariaLabels:closeButtonLabelText')}
        variant="primary"
      />
    </FormProvider>
  );
};

export default JohtoselvitysContainer;
