import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { Button } from 'hds-react';

const ConfirmationDialog: React.FC = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  // eslint-disable-next-line
  const cancelRef = React.useRef<any>();

  return (
    <>
      <div className="closeFormWpr">
        <button type="button" onClick={() => setIsOpen(true)}>
          X
        </button>
      </div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              Lomakkeella on tallentamattomia tietoja. Haluatko jatkaa jatkaa tietojen syöttämistä,
              vai poistua, jolloin syöttämäsi tiedot poistuvat
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button type="button" ref={cancelRef} onClick={onClose}>
                Peruuta
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
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
