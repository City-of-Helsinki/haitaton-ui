import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import {
  Button,
  ButtonVariant,
  Dialog,
  IconAlertCircle,
  RadioButton,
  SelectionGroup,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { HankeAlue } from '../../types/hanke';

type Props = {
  isOpen: boolean;
  hankeAreas: HankeAlue[];
  onClose: () => void;
  onConfirm: (selectedArea: HankeAlue) => void;
};

export default function AreaSelectDialog({
  isOpen,
  hankeAreas,
  onClose,
  onConfirm,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const dialogTitle = t('hakemus:areaSelectionDialog:title');

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  function handleAreaChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedAreaId(event.target.value);
  }

  return (
    <Dialog
      id="kaivuilmoitus-area-selection"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="kaivuilmoitus-area-selection-header"
        title={dialogTitle}
        iconStart={<IconAlertCircle />}
      />
      <Dialog.Content>
        <Box as="p" marginBottom="var(--spacing-s)">
          {t('hakemus:areaSelectionDialog:instructions')}
        </Box>

        <SelectionGroup label={t('hankeForm:labels:hankeAlue')}>
          {hankeAreas.map((area) => {
            const areaId = area.id!.toString();
            return (
              <RadioButton
                key={areaId}
                id={areaId}
                value={areaId}
                checked={selectedAreaId === areaId}
                label={area.nimi}
                onChange={handleAreaChange}
              />
            );
          })}
        </SelectionGroup>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button
          type="button"
          disabled={!selectedAreaId}
          onClick={() => onConfirm(hankeAreas.find((area) => area.id === Number(selectedAreaId))!)}
        >
          {t('common:confirmationDialog:confirmButton')}
        </Button>
        <Button type="button" variant={ButtonVariant.Secondary} onClick={onClose}>
          {t('hakemus:areaSelectionDialog:cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
}
