import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button } from 'hds-react';
import { IconAngleLeft, IconAngleRight, IconCross } from 'hds-react/icons';

import H1 from '../../../common/components/text/H1';

import { combineObj } from './utils';

import { getFormData, getHasFormChanged } from './selectors';
import { HankeDataDraft, HANKE_SAVETYPE } from './types';

import { actions } from './reducer';
import { actions as dialogActions } from '../../../common/components/confirmationDialog/reducer';
import { saveForm } from './thunks';

import Indicator from './indicator';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

import './Form.styles.scss';

const FormComponent: React.FC = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formData = useSelector(getFormData());
  const hasFormChanged = useSelector(getHasFormChanged());
  const history = useHistory();

  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), view: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), view: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), view: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), view: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), view: 4 },
  ];
  const [formPage, setFormPage] = useState<number>(0);

  const formContext = useForm<HankeDataDraft>({
    mode: 'all',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    defaultValues: formData,
  });

  const { handleSubmit, errors, control, register, formState, getValues, reset } = formContext;

  function goBack() {
    setFormPage((v) => v - 1);
    return false;
  }
  function saveDraftButton() {
    const data = combineObj(formData, getValues());
    reset(data);
    if (data) {
      dispatch(actions.updateFormData(data));
      try {
        dispatch(
          saveForm({
            data,
            saveType: HANKE_SAVETYPE.DRAFT,
          })
        );
      } catch (e) {
        // eslint-disable-next-line
        console.error(e.message);
      }
    }
  }

  const onSubmit = async (values: HankeDataDraft) => {
    const data = combineObj(formData, values);
    try {
      dispatch(
        saveForm({
          data,
          saveType: HANKE_SAVETYPE.DRAFT,
        })
      );
      // reset(data);
      setFormPage((v) => v + 1);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message);
    }
  };

  function closeForm() {
    if (hasFormChanged) {
      dispatch(dialogActions.updateIsDialogOpen({ isDialogOpen: true, redirectUrl: '/' }));
    } else {
      history.push('/');
    }
  }
  useEffect(() => {
    dispatch(actions.updateHasFormChanged(formState.isDirty));
  }, [formState.isDirty]);

  return (
    <FormProvider {...formContext}>
      <div className="hankeForm">
        <H1 stylesAs="h2">{t('hankeForm:pageHeader')}</H1>
        <div className="hankeForm__formWpr">
          <Indicator dataList={wizardStateData} view={formPage} />
          <div className="hankeForm__formWprRight">
            <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
              <div className="closeFormWpr">
                <button type="button" onClick={() => closeForm()}>
                  <IconCross />
                </button>
              </div>
              {formPage === 0 && (
                <Form0 errors={errors} control={control} register={register} formData={formData} />
              )}
              {formPage === 1 && (
                <Form1 errors={errors} control={control} register={register} formData={formData} />
              )}
              {formPage === 2 && (
                <Form2 errors={errors} control={control} register={register} formData={formData} />
              )}
              {formPage === 3 && (
                <Form3 errors={errors} control={control} register={register} formData={formData} />
              )}
              {formPage === 4 && (
                <Form4 errors={errors} control={control} register={register} formData={formData} />
              )}
              <div className="btnWpr">
                {formPage < 4 && (
                  <Button
                    className="btnWpr--next"
                    type="submit"
                    // disabled={!formState.isValid}
                    iconRight={<IconAngleRight />}
                    variant="secondary"
                  >
                    <span>{t('hankeForm:nextButton')}</span>
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => saveDraftButton()}
                  disabled={!formState.isValid}
                >
                  <span>{t('hankeForm:saveDraftButton')}</span>
                </Button>
                {formPage > 0 && (
                  <Button
                    className="btnWpr--previous"
                    type="button"
                    onClick={() => goBack()}
                    iconLeft={<IconAngleLeft />}
                    variant="secondary"
                  >
                    <span>{t('hankeForm:previousButton')}</span>
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default FormComponent;
