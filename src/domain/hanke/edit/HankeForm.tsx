import React, { useState, useEffect } from 'react';
// persistenceGeometry helpers no longer used directly here; we persist API-shaped Hanke data
// and rebuild form state via convertHankeDataToFormState.
import { FieldPath, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from 'react-query';
import { ButtonVariant, IconCross, IconPlusCircle, IconSaveDiskette, StepState } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VectorSource from 'ol/source/Vector';
import { FormNotification, HankeDataFormState } from './types';
import {
  hankeSchema,
  hankePerustiedotPublicSchema,
  hankeAlueetPublicSchema,
  haittojenhallintaPublicSchema,
  hankeYhteystiedotPublicSchema,
} from './hankeSchema';
import HankeFormAlueet from './HankeFormAlueet';
import HankeFormPerustiedot from './HankeFormPerustiedot';
import HankeFormYhteystiedot from './HankeFormYhteystiedot';
import HankeFormHaittojenHallinta from './HankeFormHaittojenHallinta';
import HankeFormLiitteet from './HankeFormLiitteet';
import HankeFormSummary from './HankeFormSummary';
import FormNotifications from './components/FormNotifications';
import './HankeForm.styles.scss';
import { HankeData } from '../../types/hanke';
import MultipageForm from '../../forms/MultipageForm';
import FormActions from '../../forms/components/FormActions';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import ApplicationAddDialog from '../../application/components/ApplicationAddDialog';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import { changeFormStep, getFieldPaths } from '../../forms/utils';
import { updateHanke } from './hankeApi';
import {
  convertHankeAlueToFormState,
  convertFormStateToHankeData,
  convertHankeDataToFormState,
  mapValidationErrorToErrorListItem,
} from './utils';
import { useValidationErrors } from '../../forms/hooks/useValidationErrors';
import DrawProvider from '../../../common/components/map/modules/draw/DrawProvider';
import FormPagesErrorSummary from '../../forms/components/FormPagesErrorSummary';
import FormFieldsErrorSummary from '../../forms/components/FormFieldsErrorSummary';
import { useApplicationsForHanke } from '../../application/hooks/useApplications';
import useFormLanguagePersistence from '../../../common/hooks/useFormLanguagePersistence';
import Button from '../../../common/components/button/Button';

type Props = {
  formData: HankeDataFormState;
  onIsDirtyChange: (isDirty: boolean) => void;
  onFormClose: (hankeTunnus?: string) => void;
  children: React.ReactNode;
};

const HankeForm: React.FC<React.PropsWithChildren<Props>> = ({
  formData,
  onIsDirtyChange,
  onFormClose,
  children,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const navigate = useNavigate();
  const { setNotification } = useGlobalNotification();
  const [showNotification, setShowNotification] = useState<FormNotification | null>(null);
  const [showAddApplicationDialog, setShowAddApplicationDialog] = useState(false);
  const hakemukset = useApplicationsForHanke(formData.hankeTunnus, true);
  const validationContext = {
    hanke: formData,
    hakemukset: hakemukset.data?.applications,
    dateConflictWithWorkAreasErrorKey: 'dateConflictWithWorkAreas',
  };
  const formContext = useForm<HankeDataFormState>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
    context: validationContext,
  });

  // Persist draft values so that switching language (which changes route & unmounts) does not lose unsaved edits
  const storageKey = `functional-hanke-form-${formData.hankeTunnus || 'new'}`;
  const stepPersistKey = `functional-hanke-form-step-${formData.hankeTunnus || 'new'}`;

  const persistence = useFormLanguagePersistence(storageKey, formContext, {
    hydratePhase: 'effect', // Hanke uses effect-phase to avoid layout hydration feedback loops
    // Persist the form as Hanke API shape (GeoJSON) so geometries serialize cleanly
    select(values) {
      try {
        // Persist the API-shaped HankeData only; do not include separate geometry snapshots.
        return convertFormStateToHankeData(values as HankeDataFormState);
      } catch {
        return {};
      }
    },
    debounceMs: 200,
    afterHydrate(raw) {
      try {
        if (!raw || typeof raw !== 'object') return;
        const parsed = raw as Record<string, unknown>;
        // Determine whether persisted object contains meaningful Hanke fields
        const meaningful = Object.keys(parsed).some((k) => parsed[k] != null);
        if (meaningful) {
          const converted = convertHankeDataToFormState(parsed as unknown as HankeData);
          // Replace whole form state with converted values (includes features from geometriat)
          formContext.reset(converted as HankeDataFormState);
        }
      } catch {
        // ignore malformed persisted data
      }
    },
  });
  // Expose persistence on formContext for nested map components to trigger saveSnapshot after geometry edits
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (formContext as any).persistence = persistence;

  const {
    register,
    formState: { errors, isDirty },
    getValues,
    setValue,
    trigger,
    watch,
    setFocus,
  } = formContext;

  const formValues = getValues();
  const watchFormValues = watch();
  const [
    nimi,
    kuvaus,
    tyomaaKatuosoite,
    vaihe,
    alueet,
    omistajat,
    rakennuttajat,
    toteuttajat,
    muut,
  ] = watch([
    'nimi',
    'kuvaus',
    'tyomaaKatuosoite',
    'vaihe',
    'alueet',
    'omistajat',
    'rakennuttajat',
    'toteuttajat',
    'muut',
  ]);
  const isHankePublic = formValues.status === 'PUBLIC';
  const formHeading = `${watch('nimi')} (${formData.hankeTunnus})`;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const hankeMutation = useMutation(updateHanke, {
    onMutate() {
      setShowNotification(null);
    },
    onError() {
      setShowNotification('error');
      // Attempt to restore persisted draft so the user sees their unsaved edits
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          const converted = convertHankeDataToFormState(parsed as unknown as HankeData);
          formContext.reset(converted as HankeDataFormState);
        }
      } catch {
        // ignore restore errors
      }
    },
    onSuccess(data) {
      queryClient.setQueryData(['hanke', data.hankeTunnus], data);
      setValue('hankeTunnus', data.hankeTunnus);
      setValue('tormaystarkasteluTulos', data.tormaystarkasteluTulos);
      setValue('status', data.status);
      setValue('alkuPvm', data.alkuPvm);
      setValue('loppuPvm', data.loppuPvm);
      setValue('alueet', data.alueet?.map(convertHankeAlueToFormState));
      setShowNotification('success');
      // Clear persisted draft after successful save
      persistence.clearPersisted();
    },
  });

  const saveAndQuitButtonIsLoading = hankeMutation.isLoading;
  const saveAndQuitButtonLoadingText = t('common:buttons:savingText');
  const saveAndQuitButtonIcon = <IconSaveDiskette />;

  const [drawSource] = useState<VectorSource>(new VectorSource());

  function save() {
    // Ensure snapshot prior to server mutation
    persistence.saveSnapshot?.();
    hankeMutation.mutate(getValues());
  }

  function saveAndAddApplication() {
    persistence.saveSnapshot?.();
    save();
    setShowAddApplicationDialog(true);
  }

  function closeAddApplicationDialog() {
    setShowAddApplicationDialog(false);
  }

  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  const formSteps = [
    {
      element: <HankeFormPerustiedot errors={errors} register={register} hanke={formValues} />,
      label: t('hankeForm:perustiedotForm:header'),
      state: StepState.available,
      validationSchema: hankePerustiedotPublicSchema,
    },
    {
      element: (
        <DrawProvider source={drawSource}>
          <HankeFormAlueet
            errors={errors}
            register={register}
            hanke={formValues}
            drawSource={drawSource}
          />
        </DrawProvider>
      ),
      label: t('hankeForm:hankkeenAlueForm:header'),
      state: StepState.available,
      validationSchema: hankeAlueetPublicSchema,
    },
    {
      element: (
        <HankeFormHaittojenHallinta errors={errors} register={register} hanke={formValues} />
      ),
      label: t('hankeForm:haittojenHallintaForm:header'),
      state: StepState.available,
      validationSchema: haittojenhallintaPublicSchema,
    },
    {
      element: <HankeFormYhteystiedot errors={errors} register={register} hanke={formValues} />,
      label: t('form:yhteystiedot:header'),
      state: StepState.available,
      validationSchema: hankeYhteystiedotPublicSchema,
    },
    {
      element: <HankeFormLiitteet />,
      label: t('hankePortfolio:tabit:liitteet'),
      state: StepState.available,
    },
    {
      element: <HankeFormSummary formData={formValues} />,
      label: t('hankeForm:hankkeenYhteenvetoForm:header'),
      state: StepState.available,
    },
  ];
  const perustiedotErrors = useValidationErrors(hankePerustiedotPublicSchema, {
    nimi,
    kuvaus,
    tyomaaKatuosoite,
    vaihe,
  });
  const alueetErrors = useValidationErrors(hankeAlueetPublicSchema, { alueet }, validationContext);
  const haittojenHallintaErrors = useValidationErrors(
    haittojenhallintaPublicSchema,
    {
      alueet,
    },
    validationContext,
  );
  const yhteystiedotErrors = useValidationErrors(hankeYhteystiedotPublicSchema, {
    omistajat,
    rakennuttajat,
    toteuttajat,
    muut,
  });

  const formErrorsByPage = React.useMemo(
    () => [perustiedotErrors, alueetErrors, haittojenHallintaErrors, yhteystiedotErrors, [], []],
    [perustiedotErrors, alueetErrors, haittojenHallintaErrors, yhteystiedotErrors],
  );

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    if (isDirty) {
      save();
    }
  }

  // When user changes language, the form is unmounted and remounted. We listen to the
  // same `haitaton:languageChanging` event so we can show the missing-items notification
  // when the user will land on the Areas page (or is currently on it) and required data is missing.
  useEffect(() => {
    const handler = () => {
      try {
        // Determine target step from persisted active step if available
        const raw = sessionStorage.getItem(
          `functional-hanke-form-step-${formData.hankeTunnus || 'new'}-activeStep`,
        );
        const persistedStep = raw ? Number.parseInt(raw, 10) : undefined;
        const targetStep =
          typeof persistedStep === 'number' && !Number.isNaN(persistedStep)
            ? persistedStep
            : activeStepIndex;
        if (
          formErrorsByPage &&
          formErrorsByPage[targetStep] &&
          formErrorsByPage[targetStep].length > 0
        ) {
          // Mark that the form should show the missing-fields summary after the
          // language change completes and the form remounts. We store a small
          // flag next to the step persist key which will be read on mount and
          // cause the local active step to be set so the topElement (error
          // summary) renders inside the form (no popup notification).
          try {
            sessionStorage.setItem(`${stepPersistKey}-showMissing`, '1');
          } catch {
            // ignore sessionStorage errors
          }
        }
      } catch {
        // ignore errors reading sessionStorage
      }
    };
    window.addEventListener('haitaton:languageChanging', handler);
    return () => window.removeEventListener('haitaton:languageChanging', handler);
  }, [formData.hankeTunnus, activeStepIndex, formErrorsByPage, setNotification, t, stepPersistKey]);

  // On mount (or when persisted errors/step are available) pick up the persisted
  // active step and a potential 'showMissing' flag set during language change.
  // Setting `activeStepIndex` here ensures the computed `formErrorsNotification`
  // (passed as `topElement` to `MultipageForm`) will render on initial mount
  // when the user returns after switching language.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`${stepPersistKey}-activeStep`);
      const persistedStep = raw ? Number.parseInt(raw, 10) : undefined;
      const targetStep =
        typeof persistedStep === 'number' && !Number.isNaN(persistedStep)
          ? persistedStep
          : undefined;

      const showMissing = sessionStorage.getItem(`${stepPersistKey}-showMissing`);
      if (typeof targetStep === 'number') {
        setActiveStepIndex(targetStep);
      }

      if (showMissing) {
        // Clear the transient flag so it doesn't trigger repeatedly.
        sessionStorage.removeItem(`${stepPersistKey}-showMissing`);
      }
    } catch {
      // ignore sessionStorage errors
    }
    // Intentionally only depend on the form identity and current validation
    // state so we re-run if validation results become available after mount.
  }, [formData.hankeTunnus, formErrorsByPage, stepPersistKey]);

  const saveAndQuit = () => {
    // Check if there is missing data in alueet
    // Do not bother with perustiedotErrors, haittojenHallintaErrors or yhteystiedotErrors
    if (alueetErrors.length > 0) {
      // Set notification for validation errors
      setNotification(true, {
        position: 'bottom-right',
        dismissible: true,
        autoClose: true,
        autoCloseDuration: 5000,
        label: t('hankeForm:validationError:header'),
        message: t('hankeForm:validationError:haittojenHallintaRequired'),
        type: 'error',
        closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
      });
      setActiveStepIndex(2);
      return;
    }
    // If hanke is public and there are missing fields dont save, focus on the first missing field
    if (isHankePublic && haittojenHallintaErrors.length > 0) {
      const firstErrorField = haittojenHallintaErrors[0]?.path;
      setActiveStepIndex(3);
      if (typeof firstErrorField === 'string') {
        setTimeout(() => {
          setFocus(firstErrorField as FieldPath<HankeDataFormState>);
        }, 100);
      }
      return;
    }

    // Ensure snapshot prior to server mutation
    persistence.saveSnapshot?.();

    hankeMutation.mutate(getValues(), {
      onSuccess(data) {
        persistence.clearPersisted();
        setNotification(true, {
          position: 'top-right',
          dismissible: true,
          autoClose: true,
          autoCloseDuration: 8000,
          label: t('hankeForm:saveAndQuitSuccessHeader'),
          message: t('hankeForm:saveAndQuitSuccessText', {
            name: data.nimi,
            hankeTunnus: data.hankeTunnus,
          }),
          type: 'success',
          closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
        });
        navigate(`${HANKEPORTFOLIO.path}/${data.hankeTunnus}`);
      },
    });
  };

  const formErrorsNotification =
    (activeStepIndex === 5 && (
      <FormPagesErrorSummary
        data={watchFormValues}
        schema={hankeSchema}
        validationContext={validationContext}
        notificationLabel={t('hankePortfolio:draftState:labels:insufficientPhases')}
      />
    )) ||
    (formErrorsByPage[activeStepIndex].length > 0 && (
      <FormFieldsErrorSummary
        notificationLabel={
          activeStepIndex === 2 &&
          haittojenHallintaErrors.length === 1 &&
          haittojenHallintaErrors[0].path === 'alueet'
            ? t('hankePortfolio:draftState:labels:missingInformationForHaittojenhallinta')
            : t('hankePortfolio:draftState:labels:missingFields')
        }
      >
        {formErrorsByPage[activeStepIndex].map((error) =>
          mapValidationErrorToErrorListItem(error, t, getValues),
        )}
      </FormFieldsErrorSummary>
    ));

  // Fields to validate when changing step.
  // When hanke is public, validate all fields required for public hanke in each step,
  // otherwise validate only hanke name in the first step.
  const pageFieldsToValidate: FieldPath<HankeDataFormState>[][] = isHankePublic
    ? [
        // Basic information page
        Object.keys(
          hankePerustiedotPublicSchema.describe().fields,
        ) as FieldPath<HankeDataFormState>[],
        // Areas page
        // Only get the nuisance fields from alueet
        getFieldPaths<HankeDataFormState>(getValues('alueet')!, 'alueet').filter((path) =>
          /haitta/i.test(path),
        ),
        // Haittojen hallinta page
        Object.keys(
          haittojenhallintaPublicSchema.describe().fields,
        ) as FieldPath<HankeDataFormState>[],
        // Contacts page
        Object.keys(
          hankeYhteystiedotPublicSchema.describe().fields,
        ) as FieldPath<HankeDataFormState>[],
      ]
    : [
        // Basic information page
        ['nimi'],
        // Areas page
        [],
        // Haittojen hallinta page
        [],
        // Contacts page
        // Only get the ytunnus fields from omistajat, rakennuttajat and toteuttajat
        [
          ...getFieldPaths<HankeDataFormState>(getValues('omistajat'), 'omistajat').filter((path) =>
            /ytunnus/i.test(path),
          ),
          ...getFieldPaths<HankeDataFormState>(getValues('rakennuttajat'), 'rakennuttajat').filter(
            (path) => /ytunnus/i.test(path),
          ),
          ...getFieldPaths<HankeDataFormState>(getValues('toteuttajat'), 'toteuttajat').filter(
            (path) => /ytunnus/i.test(path),
          ),
        ],
      ];

  function validateStepChange(changeStep: () => void, stepIndex: number) {
    // Relax navigation for draft hankkeet:
    //  - Ignore 'required' errors in 'Yhteystiedot' step (index 3) when not public (existing behavior)
    //  - NEW: Ignore 'required' errors in 'Haittojen hallinta' step (index 2) when not public so user can navigate away
    const errorsToIgnore =
      !isHankePublic && (stepIndex === 2 || stepIndex === 3) ? ['required'] : undefined;

    return changeFormStep(
      changeStep,
      pageFieldsToValidate[stepIndex] || [],
      trigger,
      errors,
      errorsToIgnore,
    );
  }

  return (
    <FormProvider {...formContext}>
      {/* persistence hook mounted */}
      <FormNotifications showNotification={showNotification} />
      <ApplicationAddDialog
        isOpen={showAddApplicationDialog}
        onClose={closeAddApplicationDialog}
        hanke={getValues() as HankeData}
      />
      <div className="hankeForm">
        <MultipageForm
          heading={formHeading}
          formSteps={formSteps}
          // IMPORTANT: use a distinct key for step index persistence to avoid
          // clobbering the form draft persistence JSON (which uses
          // `hanke-form-<id>`). A prior regression overwrote the draft object
          // (with __geometry snapshot) with a bare number, losing area
          // geometries on language change.
          stepPersistKey={`functional-hanke-form-step-${formData.hankeTunnus || 'new'}`}
          onStepChange={handleStepChange}
          topElement={formErrorsNotification}
          formData={watchFormValues}
          validationContext={validationContext}
          stepChangeValidator={validateStepChange}
        >
          {function renderFormActions(activeStep, handlePrevious, handleNext) {
            const lastStep = activeStep === formSteps.length - 1;

            return (
              <FormActions
                activeStepIndex={activeStep}
                totalSteps={formSteps.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
              >
                <Button
                  variant={ButtonVariant.Danger}
                  iconStart={<IconCross />}
                  onClick={() => {
                    persistence.clearPersisted();
                    onFormClose(formValues.hankeTunnus);
                  }}
                >
                  {t('hankeForm:cancelButton')}
                </Button>
                {!lastStep && (
                  <Button
                    variant={ButtonVariant.Supplementary}
                    iconStart={saveAndQuitButtonIcon}
                    onClick={saveAndQuit}
                    data-testid="save-form-btn"
                    isLoading={saveAndQuitButtonIsLoading}
                    loadingText={saveAndQuitButtonLoadingText}
                  >
                    {t('hankeForm:saveDraftButton')}
                  </Button>
                )}
                {lastStep && (
                  <>
                    {isHankePublic && (
                      <Button
                        variant={ButtonVariant.Secondary}
                        iconStart={<IconPlusCircle />}
                        onClick={saveAndAddApplication}
                      >
                        {t('hankeForm:saveAndAddButton')}
                      </Button>
                    )}
                    <Button
                      variant={ButtonVariant.Primary}
                      iconStart={saveAndQuitButtonIcon}
                      onClick={saveAndQuit}
                      isLoading={saveAndQuitButtonIsLoading}
                      loadingText={saveAndQuitButtonLoadingText}
                    >
                      {t('hankeForm:saveButton')}
                    </Button>
                  </>
                )}
              </FormActions>
            );
          }}
        </MultipageForm>
      </div>
      {children}
    </FormProvider>
  );
};
export default HankeForm;
