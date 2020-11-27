import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { Button } from 'hds-react';
import { getIsDialogOpen, getRedirectUrl } from './selectors';
import { actions } from './reducer';

import './Dialog.styles.scss';

const ConfirmationDialog: React.FC = (props) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const isDialogOpenVal = useSelector(getIsDialogOpen());
  const redirectUrl = useSelector(getRedirectUrl());
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  function onClose() {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  function cancel() {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  function exit() {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
    history.push(redirectUrl);
  }
  return (
    <>
      <AlertDialog
        isOpen={isDialogOpenVal}
        leastDestructiveRef={cancelRef}
        onClose={() => onClose()}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>{t('common:confirmationDialog:bodyText')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button type="button" ref={cancelRef} onClick={() => cancel()}>
                {t('common:confirmationDialog:cancelButton')}
              </Button>
              <Button type="button" variant="secondary" onClick={() => exit()}>
                {t('common:confirmationDialog:exitButton')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
export default ConfirmationDialog;
