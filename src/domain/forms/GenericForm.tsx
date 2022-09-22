import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import FormActions from './components/FormActions';
import styles from './GenericForm.module.scss';
import FormPagination from './components/FormPageIndicator';
import NavigationButtons from './components/NavigationButtons';

type FormStep = {
  path: string;
  element: React.ReactNode;
  title: string;
};

interface Props extends React.HTMLProps<HTMLFormElement> {
  formSteps: FormStep[];
  showDelete?: boolean;
  isFormValid?: boolean;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
}

const GenericForm: React.FC<Props> = ({
  formSteps,
  showDelete = false,
  isFormValid = false,
  onDelete,
  onClose,
  onSave,
}) => {
  const navigate = useNavigate();

  async function handleNavigation(path: string) {
    onSave();
    if (path !== '') {
      navigate(`.${path}`);
    }
  }

  return (
    <form className={styles.formWrapper}>
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
                      isFormValid={isFormValid}
                      onPageChange={(pageIndex) => {
                        handleNavigation(`${formSteps[pageIndex].path}`);
                      }}
                    />
                  </div>
                  <FormActions
                    showDelete={showDelete}
                    isFormValid={isFormValid}
                    onDelete={onDelete}
                    onClose={onClose}
                    onSave={onSave}
                  />
                  <div className={styles.content}>
                    {formStep.element}
                    <NavigationButtons
                      nextPath={formSteps[i + 1]?.path}
                      previousPath={formSteps[i - 1]?.path}
                      isFormValid={isFormValid}
                      onPageChange={(path) => {
                        handleNavigation(path);
                      }}
                    />
                  </div>
                </>
              }
            />
          );
        })}
      </Routes>
    </form>
  );
};

export default GenericForm;
