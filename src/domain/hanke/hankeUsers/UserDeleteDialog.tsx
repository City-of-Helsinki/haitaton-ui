import { Button, Dialog, IconInfoCircle, IconTrash, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DeleteInfo, HankeUser } from './hankeUser';
import { deleteUser } from './hankeUsersApi';
import { isApplicationPending } from '../../application/utils';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (user: HankeUser) => void;
  deleteInfo: DeleteInfo;
  userToDelete: HankeUser | null;
};

export default function UserDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  deleteInfo: { onlyOmistajanYhteyshenkilo, activeHakemukset, draftHakemukset },
  userToDelete,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const hasActiveHakemukset = activeHakemukset.length > 0;
  const canBeDeleted = !onlyOmistajanYhteyshenkilo && !hasActiveHakemukset;
  const dialogTitle = canBeDeleted
    ? t('hankeUsers:deleteDialog:title:canDelete')
    : t('hankeUsers:deleteDialog:title:cannotDelete');

  const { mutate, isLoading, isError, reset } = useDebouncedMutation(deleteUser, {
    onSuccess() {
      onDelete(userToDelete!);
    },
  });

  function getDialogText() {
    if (onlyOmistajanYhteyshenkilo) {
      return t('hankeUsers:deleteDialog:content:onlyOmistajanYhteyshenkilo');
    }
    if (hasActiveHakemukset) {
      const activeHakemuksetInfo = activeHakemukset
        .map((hakemus) => {
          const hakemusStatus = t(`hakemus:status:${hakemus.alluStatus}`);
          return `${hakemus.applicationIdentifier} ${hakemusStatus}`;
        })
        .join(', ');
      // If all active hakemukset are still pending, return different text than in the case some of them
      // have moved to other ALLU states
      if (activeHakemukset.every((hakemus) => isApplicationPending(hakemus.alluStatus))) {
        return t('hankeUsers:deleteDialog:content:activeHakemuksetPending', {
          hakemukset: activeHakemuksetInfo,
        });
      }
      return t('hankeUsers:deleteDialog:content:activeHakemuksetHandling', {
        hakemukset: activeHakemuksetInfo,
      });
    }
    if (draftHakemukset.length > 0) {
      const draftHakemusNames = draftHakemukset.map((hakemus) => hakemus.nimi).join(', ');
      return t('hankeUsers:deleteDialog:content:draftHakemukset', {
        hakemukset: draftHakemusNames,
      });
    }
    return t('hankeUsers:deleteDialog:content:confirmText');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function confirmDeleteUser() {
    mutate(userToDelete?.id);
  }

  return (
    <Dialog
      id="user-delete"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant={canBeDeleted ? 'danger' : 'primary'}
      close={handleClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header id="user-delete-title" title={dialogTitle} iconLeft={<IconInfoCircle />} />
      <Dialog.Content>
        {getDialogText()}
        {isError && (
          <Box marginTop="var(--spacing-m)">
            <Notification label={t('common:error')} type="error" />
          </Box>
        )}
      </Dialog.Content>

      <Dialog.ActionButtons>
        {canBeDeleted ? (
          <>
            <Button
              variant="secondary"
              style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
              onClick={handleClose}
            >
              {t('common:confirmationDialog:cancelButton')}
            </Button>
            <Button
              variant="danger"
              iconLeft={<IconTrash />}
              isLoading={isLoading}
              onClick={confirmDeleteUser}
            >
              {t('common:buttons:remove')}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose}>{t('common:ariaLabels:closeButtonLabelText')}</Button>
        )}
      </Dialog.ActionButtons>
    </Dialog>
  );
}
