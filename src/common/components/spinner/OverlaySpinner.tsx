import React from 'react';
import { LoadingSpinner } from 'hds-react';
import { Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';

import styles from './Styles.module.scss';

const OverlaySpinner = () => {
  const { onClose } = useDisclosure();

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <div className={styles.spinner}>
        <LoadingSpinner />
      </div>
    </Modal>
  );
};

export default OverlaySpinner;
