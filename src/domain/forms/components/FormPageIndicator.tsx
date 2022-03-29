import React from 'react';
import styles from './FormPageIndicator.module.scss';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type PropTypes = {
  formPageLabels: string[];
  currentLabel: string;
  nextPath?: string;
  previousPath?: string;
};

const FormPagination: React.FC<PropTypes> = ({ formPageLabels, currentLabel }) => {
  return (
    <div className={styles.stepIndicatorContainer}>
      <ol className={styles.stepIndicator}>
        {/*
        <Button
          variant="secondary"
          size="small"
          className={styles.navButton}
          // eslint-disable-next-line no-unneeded-ternary
          disabled={previousPath ? false : true}
        >
          Edellinen
        </Button>
        */}
        {formPageLabels.map((formPageLabel, i) => {
          const isCurrent = currentLabel === formPageLabels[i];
          return (
            <li key={formPageLabel} className={styles.step}>
              {isCurrent ? (
                <>
                  <p className={styles.hidden}>Current: </p>
                  <CircleSelected />
                </>
              ) : (
                <Circle active={isCurrent} />
              )}
              <div className={`${styles.line} ${isCurrent ? styles.coloredLine : ''}`} />
              <span className={`${styles.label} ${isCurrent ? styles.labelActive : ''}`}>
                {formPageLabel}
              </span>
            </li>
          );
        })}
        {/*
        <Button
          variant="secondary"
          size="small"
          className={styles.navButton}
          // eslint-disable-next-line no-unneeded-ternary
          disabled={nextPath ? false : true}
        >
          Seuraava
        </Button>
        */}
      </ol>
    </div>
  );
};

export default FormPagination;
