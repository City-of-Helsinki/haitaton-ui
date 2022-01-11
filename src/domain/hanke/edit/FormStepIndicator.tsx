import React from 'react';
import { useTranslation } from 'react-i18next';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';
import styles from './FormStepIndicator.module.scss';

type PropTypes = {
  currentFormPage: number;
};

const FormStepIndicator: React.FC<PropTypes> = ({ currentFormPage }) => {
  const { t } = useTranslation();

  const formSteps = [
    { label: t('hankeForm:perustiedotForm:header') },
    { label: t('hankeForm:hankkeenAlueForm:header') },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header') },
    { label: t('hankeForm:tyomaanTiedotForm:header') },
    { label: t('hankeForm:hankkeenHaitatForm:header') },
  ];

  return (
    <div className={styles.stepIndicator}>
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
  );
};
export default FormStepIndicator;
