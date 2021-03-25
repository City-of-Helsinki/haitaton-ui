import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { IconAngleLeft, IconAngleRight } from 'hds-react/icons';
import { HankeTilat } from '../../types/hanke';
import ConfirmationDialogUI from '../../../common/components/confirmationDialog/ConfirmationDialogUI';

type Props = {
  goBack: () => void;
  onCalculateIndexes: (hankeTunnus: string) => void;
  goForward: () => void;
  saveDraft: () => void;
  formPage: number;
};

const FormButtons: React.FC<Props> = ({
  goBack,
  goForward,
  saveDraft,
  formPage,
  onCalculateIndexes,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const {
    watch,
    formState: { isValid, isDirty },
  } = useFormContext();
  const hankeTilat: HankeTilat | undefined = watch('tilat');
  const hankeTunnus: string = watch('hankeTunnus');

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
      <ConfirmationDialogUI
        body={t('hankeForm:calculateIndexDialogBody')}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      >
        <Button
          type="button"
          theme="coat"
          variant="secondary"
          onClick={() => {
            onCalculateIndexes(hankeTunnus);
            setIsOpen(false);
          }}
          data-testid="indexConfirmationOK"
        >
          {t('hankeForm:confirmIndexCalculationButton')}
        </Button>
      </ConfirmationDialogUI>
      {formPage === 4 && (
        <Button
          className="btnWpr--next"
          type="submit"
          iconRight={<IconAngleRight />}
          variant="secondary"
          data-testid="submitButton"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          disabled={
            !isValid ||
            !hankeTilat?.onTiedotLiikenneHaittaIndeksille ||
            hankeTilat?.onLiikenneHaittaIndeksi
          }
          theme="coat"
        >
          <span>{t('hankeForm:calculateIndexesButton')}</span>
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
        data-testid="save-draft-button"
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
