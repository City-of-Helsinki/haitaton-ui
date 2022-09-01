import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Accordion } from 'hds-react';
import FormActions from './components/FormActions';
import styles from './GenericForm.module.scss';
import Notification from '../hanke/edit/components/Notification';
import FormPagination from './components/FormPageIndicator';
import NavigationButtons from './components/NavigationButtons';
import HankeIndexes from '../map/components/HankeSidebar/HankeIndexes';
import { HankeIndexData } from '../hanke/newForm/types';

type FormStep = {
  path: string;
  element: React.ReactNode;
  title: string;
  fieldsToValidate: string[];
};

type Props = {
  formSteps: FormStep[];
  showNotification: 'success' | 'error' | '';
  hankeIndexData: HankeIndexData | null;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
};

function GenericForm<T>({
  formSteps,
  showNotification,
  hankeIndexData,
  onDelete,
  onClose,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const formik = useFormikContext<T>();
  const navigate = useNavigate();

  function fieldsAreValid(fieldsToValidate: string[]) {
    return new Promise((resolve) => {
      fieldsToValidate.forEach((fieldname) => {
        formik.setFieldTouched(fieldname, true);
      });
      formik.validateForm().then((validationErrors) => {
        resolve(
          !fieldsToValidate.some((fieldToValidate) =>
            Object.keys(validationErrors).includes(fieldToValidate)
          )
        );
      });
    });
  }

  async function handleNavigation(path: string, fieldsToValidate: string[]) {
    if (await fieldsAreValid(fieldsToValidate)) {
      onSave();
      if (path !== '') {
        navigate(`.${path}`);
      }
    }
  }

  return (
    <div className={styles.formWrapper}>
      {showNotification === 'success' && (
        <Notification
          label={t('hankeForm:savingSuccessHeader')}
          typeProps="success"
          testId="formToastSuccess"
        >
          {t('hankeForm:savingSuccessText')}
        </Notification>
      )}
      {showNotification === 'error' && (
        <Notification
          label={t('hankeForm:savingFailHeader')}
          typeProps="error"
          testId="formToastError"
        >
          {t('hankeForm:savingFailText')}
        </Notification>
      )}
      <Routes>
        {formSteps.map((formStep, i) => {
          return (
            <Route
              key={formStep.path}
              path={formStep.path}
              element={
                <>
                  <div className={styles.pagination}>
                    <FormPagination
                      currentLabel={formStep.title}
                      formPageLabels={formSteps.map((formPage) => formPage.title)}
                      onPageChange={(pageIndex) => {
                        handleNavigation(`${formSteps[pageIndex].path}`, formStep.fieldsToValidate);
                      }}
                    />
                  </div>
                  <FormActions
                    onDelete={onDelete}
                    onClose={onClose}
                    onSave={async () => {
                      if (await fieldsAreValid(formStep.fieldsToValidate)) {
                        onSave();
                      }
                    }}
                  />
                  <Accordion heading="Haittaindeksit" card className={styles.index}>
                    <HankeIndexes hankeIndexData={hankeIndexData} displayTooltip loading={false} />
                  </Accordion>
                  <div className={styles.content}>
                    {formStep.element}
                    <NavigationButtons
                      nextPath={formSteps[i + 1]?.path}
                      previousPath={formSteps[i - 1]?.path}
                      onPageChange={(path) => {
                        handleNavigation(path, formStep.fieldsToValidate);
                      }}
                    />
                  </div>
                </>
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default GenericForm;
