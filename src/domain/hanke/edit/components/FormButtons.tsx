import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { IconAngleLeft, IconAngleRight } from 'hds-react/icons';

type Props = {
  goBack: () => void;
  goForward: () => void;
  saveDraft: () => void;
  currentFormPage: number;
};

const FormButtons: React.FC<React.PropsWithChildren<Props>> = ({
  goBack,
  goForward,
  saveDraft,
  currentFormPage,
}) => {
  const { t } = useTranslation();

  const {
    formState: { isValid, isDirty },
  } = useFormContext();

  let previousButtonText = '';
  let nextButtonText = '';
  switch (currentFormPage) {
    case 0: {
      nextButtonText = 'hankeForm:hankkeenAlueForm:header';
      break;
    }
    case 1: {
      previousButtonText = 'hankeForm:perustiedotForm:header';
      nextButtonText = 'hankeForm:hankkeenYhteystiedotForm:header';
      break;
    }
    case 2: {
      previousButtonText = 'hankeForm:hankkeenAlueForm:header';
      nextButtonText = 'hankeForm:tyomaanTiedotForm:header';
      break;
    }
    case 3: {
      previousButtonText = 'hankeForm:hankkeenYhteystiedotForm:header';
      nextButtonText = 'hankeForm:hankkeenHaitatForm:header';
      break;
    }
    case 4: {
      previousButtonText = 'hankeForm:tyomaanTiedotForm:header';
      break;
    }
    default: {
      break;
    }
  }

  return (
    <div className="btnWpr">
      {currentFormPage < 2 && (
        <Button
          className="btnWpr--next"
          type="button"
          onClick={() => goForward()}
          iconRight={<IconAngleRight />}
          variant="secondary"
          data-testid="forward"
          disabled={!isValid}
          theme="coat"
        >
          <span>{t(nextButtonText)}</span>
        </Button>
      )}
      <Button
        type="button"
        onClick={() => saveDraft()}
        disabled={!isValid || !isDirty}
        data-testid="save-draft-button"
        theme="coat"
      >
        <span>{t('hankeForm:saveDraftButton')}</span>
      </Button>

      {currentFormPage > 0 && (
        <Button
          className="btnWpr--previous"
          type="button"
          onClick={() => goBack()}
          iconLeft={<IconAngleLeft />}
          variant="secondary"
          data-testid="backward"
          theme="coat"
        >
          <span>{t(previousButtonText)}</span>
        </Button>
      )}
    </div>
  );
};

export default FormButtons;
