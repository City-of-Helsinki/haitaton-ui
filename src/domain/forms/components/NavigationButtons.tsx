import React from 'react';
import { Button } from 'hds-react';
import styles from './NavigationButtons.module.scss';

interface ButtonProps {
  nextPath?: string;
  previousPath?: string;
  onPageChange: (path: string) => void;
}

const NavigationButtons: React.FC<ButtonProps> = ({ nextPath, previousPath, onPageChange }) => {
  return (
    <div className={styles.navigationButtons}>
      <Button
        variant="secondary"
        className={!previousPath ? styles.hidden : ''}
        onClick={() => {
          onPageChange(`${previousPath}`);
        }}
      >
        Edellinen
      </Button>

      {nextPath && (
        <Button
          variant="secondary"
          onClick={() => {
            onPageChange(`${nextPath}`);
          }}
        >
          Seuraava
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
