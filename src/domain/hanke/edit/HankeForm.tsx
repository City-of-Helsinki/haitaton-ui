import React, { useState, useEffect } from 'react';
import { Feature } from 'ol';
import {
  serializeFeatureGeometry,
  deserializeGeometry,
} from '../../../common/utils/geometrySerialization';
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
import { convertHankeAlueToFormState, mapValidationErrorToErrorListItem } from './utils';
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
  const persistence = useFormLanguagePersistence(
    `hanke-form-${formData.hankeTunnus || 'new'}`,
    formContext,
    {
      select(values) {
        const {
          hankeTunnus,
          nimi,
          kuvaus,
          tyomaaKatuosoite,
          vaihe,
          tyomaaTyyppi,
          onYKTHanke,
          alkuPvm,
          loppuPvm,
          omistajat,
          rakennuttajat,
          toteuttajat,
          muut,
        } = values as typeof values & { tyomaaTyyppi?: string[] };
        // Lightweight geometry snapshot (only polygon coordinates), separate meta key so hook skips applying directly
        // eslint-disable-next-line no-underscore-dangle -- internal meta key for persisted geometry snapshot
        const __geometry = {
          alueet: (values.alueet || []).map((a) => ({
            id: a.id ?? null,
            geometry: a.feature ? serializeFeatureGeometry(a.feature) : null,
            name: a.nimi ?? null,
          })),
        };
        return {
          hankeTunnus, // Include hankeTunnus to ensure it's preserved
          nimi,
          kuvaus,
          tyomaaKatuosoite,
          vaihe,
          tyomaaTyyppi,
          onYKTHanke,
          alkuPvm,
          loppuPvm,
          // Persist minimal subset of each alue (omit geometry + heavy objects)
          alueet: values.alueet?.map((a) => ({
            id: a.id,
            nimi: a.nimi,
            haittaAlkuPvm: a.haittaAlkuPvm,
            haittaLoppuPvm: a.haittaLoppuPvm,
            kaistaHaitta: a.kaistaHaitta,
            kaistaPituusHaitta: a.kaistaPituusHaitta,
            meluHaitta: a.meluHaitta,
            polyHaitta: a.polyHaitta,
            tarinaHaitta: a.tarinaHaitta,
          })),
          omistajat,
          rakennuttajat,
          toteuttajat,
          muut,
          __geometry,
        };
      },
      debounceMs: 200,
      afterHydrate(raw) {
        try {
          if (!raw || typeof raw !== 'object') return;
          interface PersistedAreaGeom {
            id: string | number | null;
            name?: string | null;
            geometry: { type: string; coordinates: unknown } | null;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention
          // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any
          // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any -- accessing internal meta key
          const geomSection = (raw as any)['__geometry'] as
            | { alueet?: PersistedAreaGeom[] }
            | undefined; // internal meta key
          if (!geomSection || !Array.isArray(geomSection.alueet)) return;
          const current = formContext.getValues('alueet');
          if (!current) return;
          geomSection.alueet.forEach((g, idx) => {
            if (!g || !g.geometry || !current[idx]) return;
            const geom = deserializeGeometry(g.geometry);
            if (!geom) return;
            const existingFeature = current[idx].feature || new Feature();
            existingFeature.setGeometry(geom);
            formContext.setValue(
              // cast path for TS; feature is virtual field
              `alueet.${idx}.feature` as unknown as FieldPath<HankeDataFormState>,
              existingFeature as unknown,
              { shouldDirty: false },
            );
          });
        } catch {
          // ignore
        }
      },
    },
  );
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

  function handleStepChange(stepIndex: number) {
    setActiveStepIndex(stepIndex);
    if (isDirty) {
      save();
    }
  }

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
  const formErrorsByPage = [
    perustiedotErrors,
    alueetErrors,
    haittojenHallintaErrors,
    yhteystiedotErrors,
    [],
    [],
  ];

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
    // Ignore 'required' errors in 'Yhteystiedot' step if hanke is not public
    const errorsToIgnore = stepIndex === 3 && !isHankePublic ? ['required'] : undefined;

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
