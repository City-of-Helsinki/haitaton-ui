import React from 'react';
import { useTranslation } from 'react-i18next';
import Circle from '../../../../common/components/icons/Circle';
import CircleSelected from '../../../../common/components/icons/CircleSelected';
import HankeIndexes from '../../../map/components/HankeSidebar/HankeIndexes';
import styles from './FormStepIndicator.module.scss';
import { HankeDataFormState } from '../types';

type PropTypes = {
  currentFormPage: number;
  formData: HankeDataFormState;
  isSaving?: boolean;
};

const FormStepIndicator: React.FC<PropTypes> = ({ currentFormPage, formData, isSaving }) => {
  const { t } = useTranslation();

  const formSteps = [
    { label: t('hankeForm:perustiedotForm:header') },
    { label: t('hankeForm:hankkeenAlueForm:header') },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header') },
  ];

  return (
    <div className={styles.stepIndicatorContainer}>
      <div className={styles.stepIndicator} data-testid="formStepIndicator">
        <ol>
          {formSteps.map((formStep, i) => {
            const isSeen = currentFormPage >= i;
            return (
              <li key={formStep.label} className={isSeen ? styles.stepIndicator__colored : ''}>
                {currentFormPage > i && <p className={styles.hidden}>Completed: </p>}
                {currentFormPage === i ? (
                  <>
                    <p className={styles.hidden}>Current: </p>
                    <CircleSelected />
                  </>
                ) : (
                  <Circle active={isSeen} />
                )}
                <span className={styles.label}>{formStep.label}</span>
                <div className={`${styles.line} ${isSeen ? styles.coloredLine : ''}`} />
              </li>
            );
          })}
        </ol>
      </div>
      <div className={styles.hankeIndexes}>
        <HankeIndexes
          hankeIndexData={formData.tormaystarkasteluTulos}
          displayTooltip
          loading={isSaving}
        />
      </div>
    </div>
  );
};
export default FormStepIndicator;
