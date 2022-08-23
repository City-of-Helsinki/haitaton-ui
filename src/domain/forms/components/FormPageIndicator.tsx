import React from 'react';
import { Button } from 'hds-react';
import styles from './FormPageIndicator.module.scss';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type PropTypes = {
  formPageLabels: string[];
  currentLabel: string;
  onPageChange: (pageIndex: number) => void;
};

const FormPagination: React.FC<PropTypes> = ({ formPageLabels, currentLabel, onPageChange }) => {
  return (
    <div className={styles.stepIndicatorContainer}>
      <ol className={styles.stepIndicator}>
        <li className={styles.step}>
          <Button
            variant="secondary"
            size="small"
            className={`${styles.navButton} ${
              currentLabel === formPageLabels[0] ? styles.hiddenButton : ''
            }`}
            onClick={() => onPageChange(formPageLabels.indexOf(currentLabel) - 1)}
          >
            Edellinen
          </Button>
        </li>

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

        <li className={styles.step}>
          <Button
            variant="secondary"
            size="small"
            className={`${styles.navButton} ${
              currentLabel === formPageLabels[formPageLabels.length - 1] ? styles.hiddenButton : ''
            }`}
            onClick={() => onPageChange(formPageLabels.indexOf(currentLabel) + 1)}
          >
            Seuraava
          </Button>
        </li>
      </ol>
    </div>
  );
};

export default FormPagination;
