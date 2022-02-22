import React from 'react';
import styles from './FormPageIndicator.module.scss';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type PropTypes = {
  currentFormPage: number;
};

const FormPagination: React.FC<PropTypes> = ({ currentFormPage }) => {
  const formSteps = [
    { label: 'perustiedot' },
    { label: 'yhteystiedot' },
    { label: 'aluetiedot' },
    { label: 'liitteet' },
  ];

  return (
    <>
      <ol className={styles.stepIndicator}>
        {formSteps.map((formStep, i) => {
          const isSeen = currentFormPage >= i;
          return (
            <li key={formStep.label} className={styles.step}>
              {currentFormPage > i && <p className={styles.hidden}>Completed: </p>}
              {currentFormPage === i ? (
                <>
                  <p className={styles.hidden}>Current: </p>
                  <CircleSelected />
                </>
              ) : (
                <Circle active={isSeen} />
              )}
              <div className={`${styles.line} ${isSeen ? styles.coloredLine : ''}`} />
              <span
                className={`${styles.label} ${currentFormPage === i ? styles.labelActive : ''}`}
              >
                {formStep.label}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default FormPagination;
