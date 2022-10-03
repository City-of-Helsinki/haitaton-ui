import React from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';
import styles from './FormPageIndicator.module.scss';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type PropTypes = {
  formPageLabels: string[];
  currentLabel: string;
  isFormValid?: boolean;
  onPageChange: (pageIndex: number) => void;
};

const FormPagination: React.FC<PropTypes> = ({
  formPageLabels,
  currentLabel,
  isFormValid,
  onPageChange,
}) => {
  const { t } = useTranslation();

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
            {t('hankeForm:previousButton')}
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
            disabled={!isFormValid}
            className={`${styles.navButton} ${
              currentLabel === formPageLabels[formPageLabels.length - 1] ? styles.hiddenButton : ''
            }`}
            onClick={() => onPageChange(formPageLabels.indexOf(currentLabel) + 1)}
          >
            {t('hankeForm:nextButton')}
          </Button>
        </li>
      </ol>
    </div>
  );
};

export default FormPagination;
