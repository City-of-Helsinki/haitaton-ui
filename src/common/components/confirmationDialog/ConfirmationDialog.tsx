import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
  // eslint-disable-next-line
  const cancelRef = React.useRef<any>();
  const isDialogOpenVal = useSelector(getIsDialogOpen());
  const redirectUrl = useSelector(getRedirectUrl());
  const dispatch = useDispatch();
  const history = useHistory();
  function onClose(val: boolean) {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  function cancel(val: boolean) {
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  function exit(val: boolean) {
    history.push(redirectUrl);
    dispatch(actions.updateIsDialogOpen({ isDialogOpen: false, redirectUrl }));
  }
  return (
    <>
      <AlertDialog
        isOpen={isDialogOpenVal}
        leastDestructiveRef={cancelRef}
        onClose={() => onClose(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              Lomakkeella on tallentamattomia tietoja. Haluatko jatkaa jatkaa tietojen syöttämistä,
              vai poistua, jolloin syöttämäsi tiedot poistuvat
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button type="button" ref={cancelRef} onClick={() => cancel(false)}>
                Peruuta
              </Button>
              <Button type="button" variant="secondary" onClick={() => exit(false)}>
                Poistu
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
export default ConfirmationDialog;
