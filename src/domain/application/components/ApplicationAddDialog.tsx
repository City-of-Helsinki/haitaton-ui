import { Box } from '@chakra-ui/react';
import { Button, Dialog, IconInfoCircleFill, Select } from 'hds-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { ApplicationType } from '../types/application';
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
  value: ApplicationType;
};

const ApplicationAddDialog: React.FC<Props> = ({ isOpen, onClose, hanke }) => {
  const { t } = useTranslation();
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

  const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationType | null>(
    null,
  );

  function handleApplicationTypeChange(value: Option) {
    setSelectedApplicationType(value.value);
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
        iconLeft={<IconInfoCircleFill aria-hidden="true" />}
      />

      <Dialog.Content>
        <Text tag="p" spacingBottom="s">
          {t('hakemus:applicationTypeInstruction')}
        </Text>

        <Box marginBottom="var(--spacing-s)">
          <Select<Option>
            id="select-application-type"
            label={t('hakemus:labels:applicationType')}
            defaultValue={null}
            options={applicationTypeOptions}
            onChange={handleApplicationTypeChange}
          />
        </Box>
      </Dialog.Content>

      <Dialog.ActionButtons>
        <Button onClick={continueToApplication} disabled={!selectedApplicationType}>
          {t('hakemus:buttons:createApplication')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('common:confirmationDialog:cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ApplicationAddDialog;
