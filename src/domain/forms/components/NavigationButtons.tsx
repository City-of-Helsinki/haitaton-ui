import React from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';
import styles from './NavigationButtons.module.scss';

interface ButtonProps {
  nextPath?: string;
  previousPath?: string;
  onPageChange: (path: string) => void;
}

const NavigationButtons: React.FC<ButtonProps> = ({ nextPath, previousPath, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.navigationButtons}>
      <Button
        variant="secondary"
        className={!previousPath ? styles.hidden : ''}
        onClick={() => {
          onPageChange(`${previousPath}`);
        }}
      >
        {t('hankeForm:previousButton')}
      </Button>

      {nextPath && (
        <Button
          variant="secondary"
          onClick={() => {
            onPageChange(`${nextPath}`);
          }}
        >
          {t('hankeForm:nextButton')}
        </Button>
      )}
      {!nextPath && ( // Final page reached, provide an action to save
        <Button
          onClick={async () => {
            onPageChange(''); // TODO: navigate to hanke on map with a localized link
          }}
        >
          Tallenna
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
