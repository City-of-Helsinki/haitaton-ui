import React from 'react';
import { LoadingSpinner } from 'hds-react';
import { Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';

import styles from './Styles.module.scss';
import { useTranslation } from 'react-i18next';

const OverlaySpinner = () => {
  const { onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <div className={styles.spinner}>
        <LoadingSpinner
          loadingText={t('common:components:loadingSpinner:loadingText')}
          loadingFinishedText={t('common:components:loadingSpinner:loadingFinishedText')}
        />
      </div>
    </Modal>
  );
};

export default OverlaySpinner;
