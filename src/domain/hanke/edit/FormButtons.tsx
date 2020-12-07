import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { IconAngleLeft, IconAngleRight } from 'hds-react/icons';

import { ButtonProps } from './types';

const FormButtons: React.FC<ButtonProps> = ({ goBack, saveDraftButton, isValid, formPage }) => {
  let previousButtonText = '';

  let nextButtonText = '';
  switch (true) {
    case formPage === 0: {
      nextButtonText = 'hankeForm:hankkeenAlueForm:header';

      break;
    }

    case formPage === 1: {
      previousButtonText = 'hankeForm:perustiedotForm:header';
      nextButtonText = 'hankeForm:hankkeenYhteystiedotForm:header';
      break;
    }
    case formPage === 2: {
      previousButtonText = 'hankeForm:hankkeenAlueForm:header';
      nextButtonText = 'hankeForm:tyomaanTiedotForm:header';

      break;
    }
    case formPage === 3: {
      previousButtonText = 'hankeForm:hankkeenYhteystiedotForm:header';
      nextButtonText = 'hankeForm:hankkeenHaitatForm:header';
      break;
    }
    case formPage === 4: {
      previousButtonText = 'hankeForm:tyomaanTiedotForm:header';
      break;
    }
    default: {
      previousButtonText = '';
      nextButtonText = '';
      break;
    }
  }
  const { t } = useTranslation();
  return (
    <div className="btnWpr">
      {formPage === 4 && (
        <Button
          className="btnWpr--next"
          type="submit"
          // disabled={!formState.isValid}
          iconRight={<IconAngleRight />}
          variant="secondary"
          data-testid="finish"
        >
          <span>{t('hankeForm:finishButton')}</span>
        </Button>
      )}
      {formPage < 4 && (
        <Button
          className="btnWpr--next"
          type="submit"
          // disabled={!formState.isValid}
          iconRight={<IconAngleRight />}
          variant="secondary"
          data-testid="forward"
        >
          <span>{t(nextButtonText)}</span>
        </Button>
      )}
      <Button type="button" onClick={() => saveDraftButton()} disabled={!isValid}>
        <span>{t('hankeForm:saveDraftButton')}</span>
      </Button>
      {formPage > 0 && (
        <Button
          className="btnWpr--previous"
          type="button"
          onClick={() => goBack()}
          iconLeft={<IconAngleLeft />}
          variant="secondary"
        >
          <span>{t(previousButtonText)}</span>
        </Button>
      )}
    </div>
  );
};
export default FormButtons;
