import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';
import './Dialog.styles.scss';

type Props = {
  body: string;
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
};

const ConfirmationDialog: React.FC<Props> = ({ body, children, isOpen, handleClose }) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={handleClose} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent data-testid="confirmationDialog">
        <AlertDialogCloseButton />
        <AlertDialogBody>{body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            type="button"
            theme="coat"
            variant="primary"
            ref={cancelRef}
            onClick={handleClose}
          >
            {t('common:confirmationDialog:cancelButton')}
          </Button>
          {children}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmationDialog;
