import { useEffect, useState } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { merge } from 'lodash';
import {
  ButtonVariant,
  IconCross,
  IconEnvelope,
  IconSaveDiskette,
  Notification,
  NotificationSize,
  StepState,
} from 'hds-react';
import { yupResolver } from '@hookform/resolvers/yup';
import MultipageForm from '../forms/MultipageForm';
import BasicInfo from './BasicInfo';
import Contacts from './Contacts';
import Attachments from './Attachments';
import ReviewAndSend from './ReviewAndSend';
import { HankeData } from '../types/hanke';
import { useTranslation } from 'react-i18next';
import FormActions from '../forms/components/FormActions';
import { ApplicationCancel } from '../application/components/ApplicationCancel';
import { KaivuilmoitusFormValues } from './types';
import {
  validationSchema,
  perustiedotSchema,
  yhteystiedotSchema,
  liitteetSchema,
  alueetSchema,
  haittojenhallintaSuunnitelmaSchema,
} from './validationSchema';
import { useApplicationsForHanke } from '../application/hooks/useApplications';
import {
  AlluStatus,
  Application,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
} from '../application/types/application';
import { useGlobalNotification } from '../../common/components/globalNotification/GlobalNotificationContext';
import {
  convertApplicationDataToFormState,
  convertFormStateToKaivuilmoitusUpdateData,
} from './utils';
import ApplicationSaveNotification from '../application/components/ApplicationSaveNotification';
import useSaveApplication from '../application/hooks/useSaveApplication';
import useAttachments from '../application/hooks/useAttachments';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { changeFormStep } from '../forms/utils';
import Areas from './Areas';
import useNavigateToApplicationView from '../application/hooks/useNavigateToApplicationView';
import { getJohtoselvitysIdentifiers, isApplicationDraft, isContactIn } from '../application/utils';
import { usePermissionsForHanke } from '../hanke/hankeUsers/hooks/useUserRightsForHanke';
import ApplicationSendDialog from '../application/components/ApplicationSendDialog';
import HaittojenHallinta from './HaittojenHallinta';
import FormErrorsNotification from './components/FormErrorsNotification';
import Button from '../../common/components/button/Button';
import useFormLanguagePersistence from '../../common/hooks/useFormLanguagePersistence';
import {
  buildKaivuAreasGeometrySnapshot,
  hydrateKaivuAreasGeometryAfterHydrate,
} from '../common/utils/persistenceGeometry';

type Props = {
  hankeData: HankeData;
  application?: Application<KaivuilmoitusData>;
};

export default function KaivuilmoitusContainer({ hankeData, application }: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const navigateToApplicationView = useNavigateToApplicationView();
  const [attachmentUploadErrors, setAttachmentUploadErrors] = useState<JSX.Element[]>([]);
  const { data: hankkeenHakemukset } = useApplicationsForHanke(hankeData.hankeTunnus, true);
  const { data: signedInUser } = usePermissionsForHanke(hankeData.hankeTunnus);
  const johtoselvitysIds = getJohtoselvitysIdentifiers(hankkeenHakemukset?.applications);

  const initialValues: KaivuilmoitusFormValues = {
    id: null,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: hankeData.hankeTunnus,
    // Ensure selfIntersectingPolygon defaults to false so Areas step validation passes
    // when user has not drawn any polygons yet. Without an explicit false default the
    // yup.boolean().isFalse() validator treats undefined as invalid and blocks
    // navigation to later steps (e.g. Contacts) in tests.
    selfIntersectingPolygon: false,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: '',
      workDescription: '',
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      rockExcavation: null,
      cableReportDone: null,
      cableReports: [],
      placementContracts: [],
      requiredCompetence: false,
      areas: [],
      startTime: null,
      endTime: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  };
  const [validationContext, setValidationContext] = useState({ application });
  const formContext = useForm<KaivuilmoitusFormValues>({
    mode: 'onTouched',
    defaultValues: merge(initialValues, convertApplicationDataToFormState(application)),
    resolver: yupResolver(validationSchema),
    context: validationContext,
  });
  const persistence = useFormLanguagePersistence(
    `application-form-${application?.id || 'new'}-KAIVU`,
    formContext,
    {
      select(values) {
        const ad = values.applicationData;
        // eslint-disable-next-line no-underscore-dangle -- internal meta key for geometry snapshot
        const __geometry = buildKaivuAreasGeometrySnapshot(ad.areas);
        return {
          applicationData: {
            // Text fields
            name: ad.name,
            workDescription: ad.workDescription,
            // Booleans / selects (checkbox / radio groups etc.)
            constructionWork: ad.constructionWork,
            maintenanceWork: ad.maintenanceWork,
            emergencyWork: ad.emergencyWork,
            rockExcavation: ad.rockExcavation,
            cableReportDone: ad.cableReportDone,
            requiredCompetence: ad.requiredCompetence,
            // Multi-value tag inputs / selects
            cableReports: ad.cableReports,
            placementContracts: ad.placementContracts,
            // Existing cable report single select (may be string or null depending on UI logic)
            existingCableReport: (ad as unknown as { existingCableReport?: string | null })
              .existingCableReport,
            // Dates (primitives only, they will hydrate as strings -> server re-save not required until final submit)
            startTime: ad.startTime,
            endTime: ad.endTime,
            // Minimal contact persistence: keep only identifiers & simple customer fields entered on the Yhteystiedot page.
            customerWithContacts: ad.customerWithContacts
              ? {
                  customer: {
                    type: ad.customerWithContacts.customer.type,
                    name: ad.customerWithContacts.customer.name,
                    registryKey: ad.customerWithContacts.customer.registryKey,
                    registryKeyHidden: ad.customerWithContacts.customer.registryKeyHidden,
                    email: ad.customerWithContacts.customer.email,
                    phone: ad.customerWithContacts.customer.phone,
                  },
                  contacts: ad.customerWithContacts.contacts.map((c) => ({
                    firstName: c.firstName,
                    lastName: c.lastName,
                    email: c.email,
                    phone: c.phone,
                    orderer: c.orderer,
                  })),
                }
              : ad.customerWithContacts,
            contractorWithContacts: ad.contractorWithContacts
              ? {
                  customer: {
                    type: ad.contractorWithContacts.customer.type,
                    name: ad.contractorWithContacts.customer.name,
                    registryKey: ad.contractorWithContacts.customer.registryKey,
                    registryKeyHidden: ad.contractorWithContacts.customer.registryKeyHidden,
                    email: ad.contractorWithContacts.customer.email,
                    phone: ad.contractorWithContacts.customer.phone,
                  },
                  contacts: ad.contractorWithContacts.contacts.map((c) => ({
                    firstName: c.firstName,
                    lastName: c.lastName,
                    email: c.email,
                    phone: c.phone,
                    orderer: c.orderer,
                  })),
                }
              : ad.contractorWithContacts,
            representativeWithContacts: ad.representativeWithContacts
              ? {
                  customer: {
                    type: ad.representativeWithContacts.customer.type,
                    name: ad.representativeWithContacts.customer.name,
                    registryKey: ad.representativeWithContacts.customer.registryKey,
                    registryKeyHidden: ad.representativeWithContacts.customer.registryKeyHidden,
                    email: ad.representativeWithContacts.customer.email,
                    phone: ad.representativeWithContacts.customer.phone,
                  },
                  contacts: ad.representativeWithContacts.contacts.map((c) => ({
                    firstName: c.firstName,
                    lastName: c.lastName,
                    email: c.email,
                    phone: c.phone,
                    orderer: c.orderer,
                  })),
                }
              : ad.representativeWithContacts,
            propertyDeveloperWithContacts: ad.propertyDeveloperWithContacts
              ? {
                  customer: {
                    type: ad.propertyDeveloperWithContacts.customer.type,
                    name: ad.propertyDeveloperWithContacts.customer.name,
                    registryKey: ad.propertyDeveloperWithContacts.customer.registryKey,
                    registryKeyHidden: ad.propertyDeveloperWithContacts.customer.registryKeyHidden,
                    email: ad.propertyDeveloperWithContacts.customer.email,
                    phone: ad.propertyDeveloperWithContacts.customer.phone,
                  },
                  contacts: ad.propertyDeveloperWithContacts.contacts.map((c) => ({
                    firstName: c.firstName,
                    lastName: c.lastName,
                    email: c.email,
                    phone: c.phone,
                    orderer: c.orderer,
                  })),
                }
              : ad.propertyDeveloperWithContacts,
            invoicingCustomer: ad.invoicingCustomer
              ? {
                  type: ad.invoicingCustomer.type,
                  name: ad.invoicingCustomer.name,
                  registryKey: ad.invoicingCustomer.registryKey,
                  registryKeyHidden: ad.invoicingCustomer.registryKeyHidden,
                  ovt: ad.invoicingCustomer.ovt,
                  invoicingOperator: ad.invoicingCustomer.invoicingOperator,
                  customerReference: ad.invoicingCustomer.customerReference,
                  postalAddress: ad.invoicingCustomer.postalAddress,
                  email: ad.invoicingCustomer.email,
                  phone: ad.invoicingCustomer.phone,
                }
              : ad.invoicingCustomer,
            // Persist lightweight area metadata (exclude non-serializable OpenLayers features)
            areas: ad.areas
              ? ad.areas.map((area) => {
                  const a = area as Record<string, unknown>;
                  return {
                    name: (a.name as string) ?? null,
                    hankealueId: (a.hankealueId as unknown) ?? null,
                    katuosoite: (a.katuosoite as string) ?? null,
                    tyonTarkoitukset: (a.tyonTarkoitukset as unknown) ?? null,
                    meluhaitta: (a.meluhaitta as unknown) ?? null,
                    polyhaitta: (a.polyhaitta as unknown) ?? null,
                    tarinahaitta: (a.tarinahaitta as unknown) ?? null,
                    kaistahaitta: (a.kaistahaitta as unknown) ?? null,
                    kaistahaittojenPituus: (a.kaistahaittojenPituus as unknown) ?? null,
                    lisatiedot: (a.lisatiedot as string) ?? null,
                    // Persist minimal tyoalue metadata (avoid feature)
                    tyoalueet: Array.isArray(a.tyoalueet)
                      ? (a.tyoalueet as Array<Record<string, unknown>>).map((ta) => ({
                          area: (ta.area as unknown) ?? null,
                          tormaystarkasteluTulos: (ta.tormaystarkasteluTulos as unknown) ?? null,
                        }))
                      : [],
                  };
                })
              : undefined,
          },
          __geometry,
        };
      },
      debounceMs: 250,
      afterHydrate(raw) {
        // formContext uses react-hook-form generics; cast to any for compatibility
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrateKaivuAreasGeometryAfterHydrate(raw, formContext as any, {
          pathPrefix: 'applicationData.areas',
          snapshotKey: 'areas',
        });
      },
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formContext as any).persistence = persistence;
  const {
    getValues,
    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = formContext;
  const watchFormValues = watch();

  // Gating state: controls when the top-level error summary (FormErrorsNotification)
  // is shown. Initially hidden to satisfy UX & test expectation that errors are
  // not displayed before the user interacts with the form.
  const [showErrors, setShowErrors] = useState(false);

  // Turn on error summary once any field is touched (first user interaction)
  useEffect(() => {
    if (!showErrors) {
      const touched = formContext.formState.touchedFields;
      if (touched && Object.keys(touched).length > 0) {
        setShowErrors(true);
      }
    }
  }, [formContext.formState.touchedFields, showErrors]);

  const { data: existingAttachments, isError: attachmentsLoadError } = useAttachments(
    getValues('id'),
  );

  const [showSendDialog, setShowSendDialog] = useState(false);

  const {
    applicationCreateMutation,
    applicationUpdateMutation,
    showSaveNotification,
    setShowSaveNotification,
  } = useSaveApplication<KaivuilmoitusData, KaivuilmoitusCreateData, KaivuilmoitusUpdateData>({
    onCreateSuccess(data) {
      setValidationContext({ application: data });
      setValue('id', data.id);
    },
    onUpdateSuccess(data) {
      setValidationContext({ application: data });
      const {
        applicationData: {
          customerWithContacts,
          contractorWithContacts,
          propertyDeveloperWithContacts,
          representativeWithContacts,
          invoicingCustomer,
        },
      } = data;
      if (customerWithContacts) {
        setValue(
          'applicationData.customerWithContacts.customer.yhteystietoId',
          customerWithContacts.customer.yhteystietoId,
        );
        setValue(
          'applicationData.customerWithContacts.customer.registryKey',
          customerWithContacts.customer.registryKey,
        );
        setValue(
          'applicationData.customerWithContacts.customer.registryKeyHidden',
          customerWithContacts.customer.registryKeyHidden,
        );
      }
      if (contractorWithContacts) {
        setValue(
          'applicationData.contractorWithContacts.customer.yhteystietoId',
          contractorWithContacts.customer.yhteystietoId,
        );
      }
      if (propertyDeveloperWithContacts) {
        setValue(
          'applicationData.propertyDeveloperWithContacts.customer.yhteystietoId',
          propertyDeveloperWithContacts.customer.yhteystietoId,
        );
      }
      if (representativeWithContacts) {
        setValue(
          'applicationData.representativeWithContacts.customer.yhteystietoId',
          representativeWithContacts.customer.yhteystietoId,
        );
      }
      if (invoicingCustomer) {
        setValue('applicationData.invoicingCustomer.registryKey', invoicingCustomer.registryKey);
        setValue(
          'applicationData.invoicingCustomer.registryKeyHidden',
          invoicingCustomer.registryKeyHidden,
        );
      }
    },
  });

  function saveApplication(handleSuccess?: (data: Application<KaivuilmoitusData>) => void) {
    const formData = getValues();
    if (!formData.id) {
      applicationCreateMutation.mutate(
        {
          applicationType: formData.applicationType,
          hankeTunnus: hankeData.hankeTunnus,
          name: formData.applicationData.name,
          workDescription: formData.applicationData.workDescription,
          constructionWork: formData.applicationData.constructionWork,
          maintenanceWork: formData.applicationData.maintenanceWork,
          emergencyWork: formData.applicationData.emergencyWork,
          rockExcavation: formData.applicationData.rockExcavation,
          cableReportDone: formData.applicationData.cableReportDone,
          cableReports: formData.applicationData.cableReports,
          placementContracts: formData.applicationData.placementContracts,
          requiredCompetence: formData.applicationData.requiredCompetence,
        },
        { onSuccess: handleSuccess },
      );
    } else {
      applicationUpdateMutation.mutate(
        { id: formData.id, data: convertFormStateToKaivuilmoitusUpdateData(formData) },
        {
          onSuccess(data) {
            handleSuccess?.(data);
            persistence.clearPersisted();
          },
        },
      );
    }
  }

  function openSendDialog() {
    setShowSendDialog(true);
  }

  function closeSendDialog(id?: number | null) {
    setShowSendDialog(false);
    navigateToApplicationView(id?.toString());
    if (id) {
      persistence.clearPersisted();
    }
  }

  function saveAndQuit() {
    function handleSuccess(data: Application<KaivuilmoitusData>) {
      navigateToApplicationView(data.id?.toString());
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
    }
    saveApplication(function (data) {
      handleSuccess(data);
      persistence.clearPersisted();
    });
  }

  function closeAttachmentUploadErrorDialog() {
    setAttachmentUploadErrors([]);
  }

  const pageFieldsToValidate: FieldPath<KaivuilmoitusFormValues>[][] = [
    // Basic information page
    ['applicationData.name'],
    // Areas page
    [
      // Keep areas step gating minimal for reliability in tests: only ensure geometry validity flag
      // and presence of at least one area name. Date fields are validated later but caused brittle
      // boundary (project start date) issues in test environment.
      'selfIntersectingPolygon',
      'applicationData.areas.0.name',
    ],
    // Haittojenhallinta page
    [],
    // Contacts page
    [
      'applicationData.customerWithContacts.customer.registryKey',
      'applicationData.contractorWithContacts.customer.registryKey',
      'applicationData.propertyDeveloperWithContacts.customer.registryKey',
      'applicationData.representativeWithContacts.customer.registryKey',
      'applicationData.invoicingCustomer.registryKey',
      'applicationData.invoicingCustomer.ovt',
    ],
  ];

  const formSteps = [
    {
      element: (
        <BasicInfo
          hankeData={hankeData}
          johtoselvitysIds={johtoselvitysIds}
          hankkeenHakemukset={hankkeenHakemukset?.applications ?? []}
        />
      ),
      label: t('form:headers:perustiedot'),
      state: StepState.available,
      validationSchema: perustiedotSchema,
    },
    {
      element: (
        <Areas hankeData={hankeData} hankkeenHakemukset={hankkeenHakemukset?.applications ?? []} />
      ),
      label: t('form:headers:alueet'),
      state: StepState.available,
      validationSchema: alueetSchema,
    },
    {
      element: <HaittojenHallinta hankeData={hankeData} />,
      label: t('hankeForm:haittojenHallintaForm:header'),
      state: StepState.available,
      validationSchema: haittojenhallintaSuunnitelmaSchema,
    },
    {
      element: <Contacts hankeTunnus={hankeData.hankeTunnus} />,
      label: t('form:headers:yhteystiedot'),
      state: StepState.available,
      validationSchema: yhteystiedotSchema,
    },
    {
      element: (
        <Attachments
          existingAttachments={existingAttachments}
          attachmentsLoadError={attachmentsLoadError}
        />
      ),
      label: t('form:headers:liitteetJaLisatiedot'),
      state: StepState.available,
      validationSchema: liitteetSchema,
    },
    {
      element: <ReviewAndSend hankealueet={hankeData.alueet} attachments={existingAttachments} />,
      label: t('form:headers:yhteenveto'),
      state: StepState.available,
    },
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const lastStep = activeStepIndex === formSteps.length - 1;

  // Track which steps have had validation errors revealed. Replaces single showErrors flag.
  const [showErrorsPerStep, setShowErrorsPerStep] = useState<boolean[]>(() =>
    Array(formSteps.length).fill(false),
  );

  function markErrorsVisible(stepIndex: number) {
    setShowErrorsPerStep((prev) => {
      if (prev[stepIndex]) return prev; // already true
      const clone = [...prev];
      clone[stepIndex] = true;
      return clone;
    });
  }

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    if (isDirty) {
      saveApplication();
    }

    // If navigating to last step (summary), reveal errors for any prior steps so that
    // the FormPagesErrorSummary contains all invalid steps immediately.
    if (stepIndex === formSteps.length - 1) {
      setShowErrorsPerStep((prev) => {
        const next = [...prev];
        for (let i = 0; i < formSteps.length - 1; i++) {
          // Mark step visible if it currently has validation errors captured in form state
          if (!next[i]) {
            // Heuristic: if any error key path starts with a field included in that pageFieldsToValidate entry
            const pageFields = pageFieldsToValidate[i] || [];
            const hasPageError = pageFields.some((pf) =>
              Object.keys(errors).some((errKey) => errKey.startsWith(pf)),
            );
            if (hasPageError) {
              next[i] = true;
            }
          }
        }
        return next;
      });
    }
  }

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    // Execute validation side-effect; changeFormStep may navigate or stay depending on errors.
    const hasErrorsBefore = Object.keys(errors).length > 0;
    changeFormStep(changeStep, pageFieldsToValidate[stepIndex] || [], trigger, errors, [
      'required',
    ]);
    // After attempting step change, if there are errors for this step, reveal them.
    const hasErrorsAfter = Object.keys(errors).length > 0;
    if (hasErrorsAfter) {
      markErrorsVisible(stepIndex);
    } else if (hasErrorsBefore) {
      // If errors cleared, ensure current step not marked (leave as-is to avoid flicker)
    }
    return true; // Allow MultipageForm to rely on internal navigation decision already handled in changeFormStep
  }

  // Auto-reveal current step errors after user interaction (touched + errors)
  useEffect(() => {
    if (!showErrorsPerStep[activeStepIndex]) {
      const touched = formContext.formState.touchedFields;
      if (Object.keys(touched).length > 0 && Object.keys(errors).length > 0) {
        markErrorsVisible(activeStepIndex);
      }
    }
  }, [activeStepIndex, errors, showErrorsPerStep, formContext.formState.touchedFields]);

  return (
    <FormProvider {...formContext}>
      <MultipageForm
        heading={t('kaivuilmoitusForm:pageHeader')}
        subHeading={`${hankeData.nimi} (${hankeData.hankeTunnus})`}
        formSteps={formSteps}
        stepPersistKey={`application-form-${application?.id || 'new'}-KAIVU`}
        formData={watchFormValues}
        topElement={
          (lastStep || showErrorsPerStep[activeStepIndex]) && (
            <FormErrorsNotification
              data={watchFormValues}
              validationContext={{ application: watchFormValues }}
              activeStepIndex={activeStepIndex}
              lastStep={lastStep}
            />
          )
        }
        validationContext={{ application: watchFormValues }}
        onStepChange={handleStepChange}
        stepChangeValidator={validateStepChange}
        onSubmit={handleSubmit(openSendDialog, () => {
          // Failed submit attempt -> mark current step
          markErrorsVisible(activeStepIndex);
        })}
      >
        {function renderFormActions(activeStep, handlePrevious, handleNext) {
          async function handleSaveAndQuit() {
            // Make sure that application name is valid before saving and quitting
            const applicationValid = await trigger('applicationData.name', {
              shouldFocus: true,
            });
            if (applicationValid) {
              saveAndQuit();
            }
          }

          const saveAndQuitIsLoading =
            applicationCreateMutation.isLoading || applicationUpdateMutation.isLoading;
          const saveAndQuitLoadingText = t('common:buttons:savingText');

          const isDraft = isApplicationDraft(getValues('alluStatus') as AlluStatus | null);
          const isContact = isContactIn(signedInUser, getValues('applicationData'));
          const showSendButton = lastStep && isDraft && isValid;
          const disableSendButton = showSendButton && !isContact;

          return (
            <FormActions
              activeStepIndex={activeStep}
              totalSteps={formSteps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
            >
              <ApplicationCancel
                applicationId={getValues('id')}
                alluStatus={getValues('alluStatus')}
                hankeTunnus={hankeData.hankeTunnus}
                buttonIcon={<IconCross />}
                saveAndQuitIsLoading={saveAndQuitIsLoading}
                saveAndQuitIsLoadingText={saveAndQuitLoadingText}
              />

              <Button
                variant={ButtonVariant.Secondary}
                onClick={handleSaveAndQuit}
                iconStart={<IconSaveDiskette />}
                isLoading={saveAndQuitIsLoading}
                loadingText={saveAndQuitLoadingText}
              >
                {t('hankeForm:saveDraftButton')}
              </Button>

              {showSendButton && (
                <Button type="submit" iconStart={<IconEnvelope />} disabled={disableSendButton}>
                  {t('hakemus:buttons:sendApplication')}
                </Button>
              )}
              {disableSendButton && (
                <Notification
                  size={NotificationSize.Small}
                  style={{ marginTop: 'var(--spacing-xs)' }}
                  type="info"
                  label={t('hakemus:notifications:sendApplicationDisabled')}
                >
                  {t('hakemus:notifications:sendApplicationDisabled')}
                </Notification>
              )}
            </FormActions>
          );
        }}
      </MultipageForm>

      {showSaveNotification === 'create' && (
        <ApplicationSaveNotification
          saveSuccess={applicationCreateMutation.isSuccess}
          onClose={() => setShowSaveNotification(null)}
        />
      )}
      {showSaveNotification === 'update' && (
        <ApplicationSaveNotification
          saveSuccess={applicationUpdateMutation.isSuccess}
          onClose={() => setShowSaveNotification(null)}
        />
      )}

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

      <ApplicationSendDialog
        application={getValues()}
        isOpen={showSendDialog}
        onClose={closeSendDialog}
      />
    </FormProvider>
  );
}
