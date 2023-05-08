import React, { useMemo, useState } from 'react';
import { Button, IconCross, IconEnvelope, IconSaveDiskette, StepState } from 'hds-react';
import { FormProvider, useForm, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';
import { merge } from 'lodash';
import { AxiosError } from 'axios';
import { Box } from '@chakra-ui/react';

import { JohtoselvitysFormValues } from './types';
import { BasicHankeInfo } from './BasicInfo';
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
import { changeFormStep, isPageValid } from '../forms/utils';
import { saveApplication, sendApplication } from '../application/utils';
import { HankeContacts, HankeData } from '../types/hanke';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useNavigateToApplicationList from '../hanke/hooks/useNavigateToApplicationList';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import useApplicationSendNotification from '../application/hooks/useApplicationSendNotification';
import useHanke from '../hanke/hooks/useHanke';
import { Application } from '../application/types/application';
import styles from './Johtoselvitys.module.scss';
import Attachments from './Attachments';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { uploadAttachment } from '../application/attatchments';
import useAttachments from '../application/hooks/useAttachments';

type Props = {
  hankeData?: HankeData;
  application?: Application;
};

const JohtoselvitysContainer: React.FC<Props> = ({ hankeData, application }) => {
  let hanke = hankeData;
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const { showSendSuccess, showSendError } = useApplicationSendNotification();
  const queryClient = useQueryClient();
  const { data: existingAttachments, isError: attachmentsLoadError } = useAttachments(
    application?.id
  );
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
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
            email: '',
            firstName: '',
            lastName: '',
            orderer: true,
            phone: '',
          },
        ],
      },
      areas: [],
      startTime: null,
      endTime: null,
      identificationNumber: 'HAI-123', // TODO: HAI-1160
      clientApplicationKind: 'HAITATON', // TODO: add to UI
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
            email: '',
            firstName: '',
            lastName: '',
            orderer: false,
            phone: '',
          },
        ],
      },
      postalAddress: null,
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
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
    shouldFocusError: false,
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

  // If application is created without hanke existing first, get generated hanke data
  // after first save when hankeTunnus is available
  const { data: generatedHanke } = useHanke(!hankeData ? getValues('hankeTunnus') : null);
  if (generatedHanke) {
    hanke = generatedHanke;
  }

  const navigateToApplicationList = useNavigateToApplicationList(hanke?.hankeTunnus);

  const [showSaveNotification, setShowSaveNotification] = useState(false);

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

  const attachmentUploadMutation = useMutation(uploadAttachment, {
    onMutate() {
      setAttachmentUploadErrors([]);
    },
    onError(error: AxiosError, { file }) {
      setAttachmentUploadErrors((errors) => {
        // TODO: Should show different error texts for different kinds of errors,
        // once those texts have been defined
        return errors.concat(
          <Box as="p" key={file.name} mb="var(--spacing-s)">
            {file.name}: {t('common:error')}
          </Box>
        );
      });
    },
    onSuccess() {
      queryClient.invalidateQueries('attachments');
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
          convertFormStateToApplicationData(data)
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
      onSuccess() {
        navigateToApplicationList();

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

  function handleAddAttachments(files: File[]) {
    setNewAttachments(files);
  }

  async function saveAttachments() {
    if (!application) {
      return Promise.resolve();
    }

    const mutations = newAttachments.map((file) =>
      attachmentUploadMutation.mutateAsync({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        applicationId: application.id!,
        attachmentType: 'MUU',
        file,
      })
    );

    const results = await Promise.allSettled(mutations);

    if (results.some((result) => result.status === 'rejected')) {
      throw new Error('Error uploading attachments');
    }

    return results;
  }

  function closeAttachmentUploadErrorDialog() {
    setAttachmentUploadErrors([]);
  }

  const ordererKey = findOrdererKey(getValues('applicationData'));

  // Fields that are validated in each page when moving forward in form
  const pageFieldsToValidate: FieldPath<JohtoselvitysFormValues>[][] = useMemo(
    () => [
      // Basic information page
      [
        'applicationData.name',
        'applicationData.postalAddress',
        'applicationData.workDescription',
        `applicationData.${ordererKey}.contacts`,
        'applicationData.rockExcavation',
        'applicationData.constructionWork',
      ],
      // Areas page
      ['applicationData.startTime', 'applicationData.endTime', 'applicationData.areas'],
      // Contacts page
      [
        'applicationData.customerWithContacts',
        'applicationData.contractorWithContacts',
        'applicationData.propertyDeveloperWithContacts',
        'applicationData.representativeWithContacts',
      ],
    ],
    [ordererKey]
  );

  const formSteps = useMemo(() => {
    const hankeContacts: HankeContacts | undefined = hankeData
      ? [hankeData.omistajat, hankeData.rakennuttajat, hankeData.toteuttajat, hankeData.muut]
      : undefined;

    const formValues = getValues();

    return [
      {
        element: <BasicHankeInfo />,
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
          formValues
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
          formValues
        )
          ? StepState.available
          : StepState.disabled,
      },
      {
        element: (
          <Attachments
            existingAttachments={existingAttachments}
            attachmentsLoadError={attachmentsLoadError}
            newAttachments={newAttachments}
            onAddAttachments={handleAddAttachments}
          />
        ),
        label: t('hankePortfolio:tabit:liitteet'),
        state: isPageValid<JohtoselvitysFormValues>(
          validationSchema,
          pageFieldsToValidate[2],
          formValues
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
          formValues
        )
          ? StepState.available
          : StepState.disabled,
      },
    ];
  }, [
    t,
    getValues,
    pageFieldsToValidate,
    hankeData,
    existingAttachments,
    attachmentsLoadError,
    newAttachments,
  ]);

  const hankeNameText = (
    <div style={{ visibility: hanke !== undefined ? 'visible' : 'hidden' }}>
      {`${hanke?.nimi} (${hanke?.hankeTunnus})`}
    </div>
  );

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
        onStepChange={handleStepChange}
        onSubmit={handleSubmit(sendCableApplication)}
      >
        {function renderFormActions(activeStepIndex, handlePrevious, handleNext) {
          async function handlePageChange(handlerFunction: () => void) {
            try {
              if (activeStepIndex === 3 && newAttachments.length > 0) {
                await saveAttachments();
                setNewAttachments([]);
              }
              handlerFunction();
              // eslint-disable-next-line no-empty
            } catch (error) {}
          }

          function handlePreviousPage() {
            handlePageChange(handlePrevious);
          }

          function handleNextPage() {
            handlePageChange(() =>
              changeFormStep(handleNext, pageFieldsToValidate[activeStepIndex], trigger)
            );
          }

          function handleSaveAndQuit() {
            handlePageChange(saveAndQuit);
          }

          const firstStep = activeStepIndex === 0;
          const lastStep = activeStepIndex === formSteps.length - 1;

          const saveAndQuitIsLoading =
            applicationSaveMutation.isLoading || attachmentUploadMutation.isLoading;
          const saveAndQuitLoadingText = attachmentUploadMutation.isLoading
            ? t('form:buttons:loadingAttachments')
            : t('common:buttons:savingText');
          return (
            <FormActions
              activeStepIndex={activeStepIndex}
              totalSteps={formSteps.length}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              previousButtonIsLoading={attachmentUploadMutation.isLoading}
              previousButtonLoadingText={t('form:buttons:loadingAttachments')}
              nextButtonIsLoading={attachmentUploadMutation.isLoading}
              nextButtonLoadingText={t('form:buttons:loadingAttachments')}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hanke?.hankeTunnus}
                buttonVariant="secondary"
                buttonIcon={<IconCross aria-hidden />}
                buttonClassName={styles.cancelButton}
              />

              {!firstStep && (
                <Button
                  variant="secondary"
                  iconLeft={<IconSaveDiskette aria-hidden="true" />}
                  data-testid="save-form-btn"
                  onClick={handleSaveAndQuit}
                  isLoading={saveAndQuitIsLoading}
                  loadingText={saveAndQuitLoadingText}
                >
                  {t('hankeForm:saveDraftButton')}
                </Button>
              )}

              {lastStep && (
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
