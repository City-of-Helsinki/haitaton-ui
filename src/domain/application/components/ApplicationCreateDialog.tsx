import { Box } from '@chakra-ui/react';
import { Button, Dialog, IconInfoCircleFill, Select, ToggleButton } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { ApplicationType } from '../../johtoselvitys/types';
import { HankeData } from '../../types/hanke';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hanke: HankeData;
};

type Option = {
  label: string;
  value: ApplicationType;
};

const ApplicationCreateDialog: React.FC<Props> = ({ isOpen, onClose, hanke }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();

  const dialogTitle = t('hakemus:headers:pickApplication');
  const applicationTypeOptions: Option[] = [
    { label: t('hakemus:applicationTypes:CABLE_REPORT'), value: 'CABLE_REPORT' },
  ];

  const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationType | null>(
    null
  );

  function handleApplicationTypeChange(value: Option) {
    setSelectedApplicationType(value.value);
  }

  function continueToApplication() {
    if (selectedApplicationType === 'CABLE_REPORT') {
      navigate(`${JOHTOSELVITYSHAKEMUS.path}?hanke=${hanke.hankeTunnus}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function toggleUsePreviousApplication() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handlePreviousApplicationChange() {}

  return (
    <Dialog
      id="application-create"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
      closeButtonLabelText={t('common:closeButtonLabelText')}
    >
      <Dialog.Header
        id="application-create-title"
        title={dialogTitle}
        iconLeft={<IconInfoCircleFill aria-hidden="true" />}
      />

      <Dialog.Content>
        <Text tag="p" spacingBottom="l">
          {t('hakemus:applicationTypeInstruction')}
        </Text>

        <Box marginBottom="var(--spacing-l)">
          <Select<Option>
            id="select-application-type"
            label={t('hakemus:labels:applicationType')}
            defaultValue={null}
            options={applicationTypeOptions}
            onChange={handleApplicationTypeChange}
            required
          />
        </Box>

        {/* TODO: Selecting previous application as a
        base for new one will be implemented later */}
        <Box marginBottom="var(--spacing-l)">
          <ToggleButton
            checked={false}
            id="toggle-use-previous-application"
            label={t('hakemus:labels:copyPreviousApplication')}
            onChange={toggleUsePreviousApplication}
            disabled
          />
        </Box>

        <Box marginBottom="var(--spacing-m)">
          <Select
            id="select-previous-application"
            label={t('hakemus:labels:applicationToUseAsBase')}
            defaultValue={null}
            options={[]}
            onChange={handlePreviousApplicationChange}
            disabled
          />
        </Box>
      </Dialog.Content>

      <Dialog.ActionButtons>
        <Button onClick={continueToApplication} type="button" disabled={!selectedApplicationType}>
          {t('hakemus:buttons:continueToApplication')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('common:confirmationDialog:cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ApplicationCreateDialog;
