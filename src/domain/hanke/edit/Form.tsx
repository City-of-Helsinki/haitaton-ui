import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { IconCross } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import H1 from '../../../common/components/text/H1';
import { HankeDataFormState, SaveFormArguments } from './types';
import StateIndicator from './StateIndicator';
import { hankeSchema } from './hankeSchema';
import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';
import FormButtons from './FormButtons';
import FinishedForm from './FinishedForm';
import Notification from './Notification';
import './Form.styles.scss';

type Props = {
  formData: HankeDataFormState;
  showNotification: string | null;
  onSave: (args: SaveFormArguments) => void;
  onSaveGeometry: (hankeTunnus: string) => void;
  onIsDirtyChange: (isDirty: boolean) => void;
  onUnmount: () => void;
  onFormClose: () => void;
};

const HankeForm: React.FC<Props> = ({
  formData,
  onSave,
  onSaveGeometry,
  onIsDirtyChange,
  onUnmount,
  onFormClose,
  showNotification,
}) => {
  const { t } = useTranslation();
  const [formPage, setFormPage] = useState<number>(0);
  const formContext = useForm<HankeDataFormState>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: formData,
    resolver: yupResolver(hankeSchema),
    context: {
      formPage,
    },
  });

  const {
    handleSubmit,
    errors,
    control,
    register,
    formState,
    getValues,
    reset,
    setValue,
  } = formContext;
  function iniateData() {
    if (formData.omistajat[0] && !formData.omistajat[0].organisaatioId) {
      setValue('omistajat[0].omaOrganisaatio', formData.omistajat[0].organisaatioNimi);
      if (formData.omistajat[0].organisaatioNimi) {
        setValue('omistajat[0].isOmaOrganisaatio', true);
      }
    }
    if (formData.arvioijat[0] && !formData.arvioijat[0].organisaatioId) {
      setValue('arvioijat[0].omaOrganisaatio', formData.arvioijat[0].organisaatioNimi);
      if (formData.arvioijat[0].organisaatioNimi) {
        setValue('arvioijat[0].isOmaOrganisaatio', true);
      }
    }
    if (formData.toteuttajat[0] && !formData.toteuttajat[0].organisaatioId) {
      setValue('toteuttajat[0].omaOrganisaatio', formData.toteuttajat[0].organisaatioNimi);
      if (formData.arvioijat[0].organisaatioNimi) {
        setValue('arvioijat[0].isOmaOrganisaatio', true);
      }
    }
  }

  useEffect(() => {
    reset(formData);
    iniateData();
  }, [formData]);

  function formatSendData() {
    if (getValues('omistajat[0].isOmaOrganisaatio')) {
      setValue(`omistajat[0].organisaatioId`, null);
      setValue(`omistajat[0].organisaatioNimi`, getValues('omistajat[0].omaOrganisaatio'));
    }
    if (getValues('arvioijat[0].isOmaOrganisaatio')) {
      setValue(`arvioijat[0].organisaatioId`, null);
      setValue(`arvioijat[0].organisaatioNimi`, getValues('arvioijat[0].omaOrganisaatio'));
    }
    if (getValues('toteuttajat[0].isOmaOrganisaatio')) {
      setValue(`toteuttajat[0].organisaatioId`, null);
      setValue(`toteuttajat[0].organisaatioNimi`, getValues('toteuttajat[0].omaOrganisaatio'));
    }
  }
  const saveDraft = useCallback(() => {
    formatSendData();
    onSave({
      data: getValues(),
      formPage,
    });
  }, [getValues, formPage]);

  const goBack = useCallback(() => {
    setFormPage((v) => v - 1);
  }, []);

  const goForward = useCallback(() => {
    if (formPage === 0) {
      saveDraft();
    }
    if (formPage === 1) {
      const values = getValues();
      if (values.hankeTunnus) {
        onSaveGeometry(values.hankeTunnus);
      }
    }
    setFormPage((v) => v + 1);
  }, [getValues, formPage]);

  const onSubmit = async (data: HankeDataFormState) => {
    // eslint-disable-next-line
    console.log(data);
    // Todo: Maybe save and redirect to haittojenHallinta?
  };
  useEffect(() => {
    onIsDirtyChange(formState.isDirty);
  }, [formState.isDirty]);

  useEffect(() => {
    return () => onUnmount();
  }, []);

  return (
    <FormProvider {...formContext}>
      {showNotification === 'success' && (
        <Notification label={t('hankeForm:savingSuccessHeader')} typeProps="success">
          {t('hankeForm:savingSuccessText')}
        </Notification>
      )}
      {showNotification === 'error' && (
        <Notification label={t('hankeForm:savingFailHeader')} typeProps="error">
          {t('hankeForm:savingFailText')}
        </Notification>
      )}
      <div className="hankeForm">
        <H1 data-testid="formPageHeader" stylesAs="h2">
          {t('hankeForm:pageHeader')}
        </H1>
        {formPage === 5 ? (
          <div className="hankeForm__formWpr">
            <div className="hankeForm__formWprRight">
              <FinishedForm />
            </div>
          </div>
        ) : (
          <div className="hankeForm__formWpr">
            <StateIndicator formPage={formPage} />
            <div className="hankeForm__formWprRight">
              <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
                <div className="closeFormWpr">
                  <button type="button" onClick={() => onFormClose()}>
                    <IconCross />
                  </button>
                </div>
                {formPage === 0 && (
                  <Form0
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 1 && (
                  <Form1
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 2 && (
                  <Form2
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 3 && (
                  <Form3
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                {formPage === 4 && (
                  <Form4
                    errors={errors}
                    control={control}
                    register={register}
                    formData={formData}
                  />
                )}
                <FormButtons
                  goBack={goBack}
                  goForward={goForward}
                  saveDraft={saveDraft}
                  formPage={formPage}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
};
export default HankeForm;
