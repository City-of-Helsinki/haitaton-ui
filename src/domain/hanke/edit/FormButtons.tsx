import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { IconAngleLeft, IconAngleRight } from 'hds-react/icons';

type Props = {
  goBack: () => void;
  goForward: () => void;
  saveDraft: () => void;
  formPage: number;
};

const FormButtons: React.FC<Props> = ({ goBack, goForward, saveDraft, formPage }) => {
  const { t } = useTranslation();
  const {
    formState: { isValid, isDirty },
    watch,
  } = useFormContext();

  watch(['geometriesChanged']);

  let previousButtonText = '';
  let nextButtonText = '';
  switch (formPage) {
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
      previousButtonText = '';
      nextButtonText = '';
      break;
    }
  }

  return (
    <div className="btnWpr">
      {formPage === 4 && (
        <Button
          className="btnWpr--next"
          type="submit"
          iconRight={<IconAngleRight />}
          variant="secondary"
          data-testid="finish"
          disabled={!isValid}
          theme="coat"
        >
          <span>{t('hankeForm:finishButton')}</span>
        </Button>
      )}
      {formPage < 4 && (
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
        theme="coat"
      >
        <span>{t('hankeForm:saveDraftButton')}</span>
      </Button>

      {formPage > 0 && (
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
