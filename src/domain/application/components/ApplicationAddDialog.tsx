import { Box } from '@chakra-ui/react';
import {
  Button,
  ButtonVariant,
  Dialog,
  IconInfoCircleFill,
  Select,
  SupportedLanguage,
} from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { HankeData } from '../../types/hanke';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hanke: HankeData;
};

type Option = {
  label: string;
  value: string;
};

const ApplicationAddDialog: React.FC<Props> = ({ isOpen, onClose, hanke }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  const getKaivuilmoitusPath = useLinkPath(ROUTES.KAIVUILMOITUSHAKEMUS);

  const dialogTitle = t('hakemus:headers:pickApplication');
  const applicationTypeOptions: Option[] = [
    { label: t('hakemus:addApplicationTypes:CABLE_REPORT'), value: 'CABLE_REPORT' },
    {
      label: t('hakemus:addApplicationTypes:EXCAVATION_NOTIFICATION'),
      value: 'EXCAVATION_NOTIFICATION',
    },
  ];

  const [selectedApplicationType, setSelectedApplicationType] = useState<string | undefined>();

  function handleApplicationTypeChange(_: Option[], clickedOption: Option) {
    setSelectedApplicationType(clickedOption.value);
  }

  function continueToApplication() {
    if (selectedApplicationType === 'CABLE_REPORT') {
      navigate(`${JOHTOSELVITYSHAKEMUS.path}?hanke=${hanke.hankeTunnus}`);
    } else if (selectedApplicationType === 'EXCAVATION_NOTIFICATION') {
      navigate(getKaivuilmoitusPath({ hankeTunnus: hanke.hankeTunnus }));
    }
  }

  return (
    <Dialog
      id="application-create"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={onClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="application-create-title"
        title={dialogTitle}
        iconStart={<IconInfoCircleFill aria-hidden="true" />}
      />

      <Dialog.Content>
        <Text tag="p" spacingBottom="s">
          {t('hakemus:applicationTypeInstruction')}
        </Text>

        <Box marginBottom="var(--spacing-s)">
          <Select
            id="select-application-type"
            texts={{
              label: t('hakemus:labels:applicationType'),
              language: i18n.language as SupportedLanguage,
            }}
            options={applicationTypeOptions}
            value={selectedApplicationType}
            onChange={handleApplicationTypeChange}
          />
        </Box>
      </Dialog.Content>

      <Dialog.ActionButtons>
        <Button onClick={continueToApplication} disabled={!selectedApplicationType}>
          {t('hakemus:buttons:createApplication')}
        </Button>
        <Button variant={ButtonVariant.Secondary} onClick={onClose}>
          {t('common:confirmationDialog:cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ApplicationAddDialog;
