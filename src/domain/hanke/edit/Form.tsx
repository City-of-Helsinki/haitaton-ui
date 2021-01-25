import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconCross } from 'hds-react/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import H1 from '../../../common/components/text/H1';
import { actions as dialogActions } from '../../../common/components/confirmationDialog/reducer';
import { getFormData, getHasFormChanged, getShowNotification } from './selectors';
import { HankeDataFormState } from './types';
import { HANKE_SAVETYPE } from '../../types/hanke';
import { actions, hankeDataDraft } from './reducer';
import { saveForm } from './thunks';
import { saveGeometryData } from '../../map/thunks';
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

const FormComponent: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData());
  const hasFormChanged = useSelector(getHasFormChanged());
  const showNotification = useSelector(getShowNotification());
  const history = useHistory();
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
    trigger,
    setValue,
  } = formContext;

  useEffect(() => {
    reset(formData);
  }, [formData]);
  const [organizationState, setOrganizationState] = useState([
    {
      checked: formData.omistajat[0] && formData.omistajat[0].organisaatioId && true,
      name:
        formData.omistajat[0] && !formData.omistajat[0].organisaatioId
          ? formData.omistajat[0].organisaatioNimi
          : '',
    },

    {
      checked: formData.arvioijat[0] && formData.arvioijat[0].organisaatioId && true,
      name:
        formData.arvioijat[0] && !formData.arvioijat[0].organisaatioId
          ? formData.arvioijat[0].organisaatioNimi
          : '',
    },

    {
      checked: formData.toteuttajat[0] && formData.toteuttajat[0].organisaatioId && true,
      name:
        formData.toteuttajat[0] && !formData.toteuttajat[0].organisaatioId
          ? formData.toteuttajat[0].organisaatioNimi
          : '',
    },
  ]);
  function setOrganization(index: number, val: string) {
    if (typeof val === 'boolean') {
      setOrganizationState((prevState) => {
        // eslint-disable-next-line
        prevState[index].checked = val;
        return {
          ...prevState,
        };
      });
    } else {
      setOrganizationState((prevState) => {
        // eslint-disable-next-line
        prevState[index].name = val;
        return {
          ...prevState,
        };
      });
    }
  }
  function formatFormData() {
    organizationState.forEach((item, index) => {
      if (item.checked) {
        if (index === 0) {
          setValue(`omistajat[0].organisaatioId`, null);
          setValue(`omistajat[0].organisaatioNimi`, organizationState[index].name);
        }
        if (index === 1) {
          setValue(`arvioijat[0].organisaatioId`, null);
          setValue(`arvioijat[0].organisaatioNimi`, organizationState[index].name);
        }
        if (index === 2) {
          setValue(`toteuttajat[0].organisaatioId`, null);
          setValue(`toteuttajat[0].organisaatioNimi`, organizationState[index].name);
        }
      }
    });
  }

  const saveDraft = useCallback(() => {
    if (formPage === 2) {
      formatFormData();
    }
    dispatch(
      saveForm({
        data: getValues(),
        saveType: HANKE_SAVETYPE.DRAFT,
        formPage,
      })
    );
  }, [getValues, formPage]);

  const goBack = useCallback(() => {
    setFormPage((v) => v - 1);
    // Dirty fix to trigger validations after pageChage. Maybe should run in formPage useEffect instead?
    setTimeout(() => trigger(), 1);
  }, []);

  const goForward = useCallback(() => {
    if (formPage === 0) {
      saveDraft();
    }
    if (formPage === 1) {
      const values = getValues();
      if (values.hankeTunnus) {
        dispatch(saveGeometryData({ hankeTunnus: values.hankeTunnus }));
      }
    }
    setFormPage((v) => v + 1);
    // Dirty fix to trigger validations after pageChage
    setTimeout(() => trigger(), 1);
  }, [getValues, formPage]);

  const closeForm = useCallback(() => {
    if (hasFormChanged) {
      dispatch(dialogActions.updateIsDialogOpen({ isDialogOpen: true, redirectUrl: '/' }));
    } else {
      history.push('/');
    }
  }, [hasFormChanged]);

  const onSubmit = async (data: HankeDataFormState) => {
    // eslint-disable-next-line
    console.log(data);
    // Todo: Maybe save and redirect to haittojenHallinta?
  };
  useEffect(() => {
    dispatch(actions.updateHasFormChanged(formState.isDirty));
  }, [formState.isDirty]);

  // Clear form data on unmount
  useEffect(() => {
    return () => {
      dispatch(actions.updateFormData(hankeDataDraft));
    };
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
                  <button type="button" onClick={() => closeForm()}>
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
                    setOrganization={setOrganization}
                    organizationState={organizationState}
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
export default FormComponent;
