import { Box } from '@chakra-ui/react';
import {
  Button,
  Dialog,
  TextInput as HDSTextInput,
  IconCheck,
  IconCross,
  IconInfoCircle,
  Notification,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../../../common/components/textInput/TextInput';
import { newHankeSchema } from '../edit/hankeSchema';
import useUser from '../../auth/useUser';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import { createHanke } from '../edit/hankeApi';
import { NewHankeData } from '../edit/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function HankeCreateDialog({ isOpen, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
  const user = useUser();
  const navigate = useNavigate();
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const formContext = useForm<NewHankeData>({
    mode: 'onTouched',
    resolver: yupResolver(newHankeSchema),
  });
  const { getValues, trigger, reset: resetForm } = formContext;
  const { mutate, reset: resetMutation, isLoading, isError } = useMutation(createHanke);
  const dialogTitle = t('homepage:hanke:title');

  function handleClose() {
    resetForm();
    resetMutation();
    onClose();
  }

  async function submitForm() {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) {
      return;
    }

    mutate(getValues(), {
      onSuccess({ hankeTunnus }) {
        handleClose();
        if (hankeTunnus) {
          navigate(getEditHankePath({ hankeTunnus }));
        }
      },
    });
  }

  return (
    <Dialog
      id="hanke-create"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={handleClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="hanke-create-title"
        title={dialogTitle}
        iconLeft={<IconInfoCircle aria-hidden="true" />}
      />
      <FormProvider {...formContext}>
        <form>
          <Dialog.Content>
            <Box marginBottom="var(--spacing-m)">
              <TextInput name="nimi" maxLength={100} required />
            </Box>
            <Box marginBottom="var(--spacing-s)">
              <h3 className="heading-s">{t('form:labels:omatTiedot')}</h3>
            </Box>
            <Box marginBottom="var(--spacing-m)">
              <HDSTextInput
                id="user-name"
                label={t('form:yhteystiedot:labels:nimi')}
                value={`${user.data?.profile?.name}`}
                helperText={t('form:labels:fromHelsinkiProfile')}
                readOnly
              />
            </Box>
            <Box marginBottom="var(--spacing-s)" maxWidth={328}>
              <TextInput name="perustaja.sahkoposti" label={t('hankeForm:labels:email')} required />
            </Box>
            <Box maxWidth={328}>
              <TextInput
                name="perustaja.puhelinnumero"
                label={t('hankeForm:labels:puhelinnumero')}
                required
              />
            </Box>

            {isError && (
              <Box marginTop="var(--spacing-m)">
                <Notification label={t('common:error')} type="error" />
              </Box>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button onClick={submitForm} iconLeft={<IconCheck />} isLoading={isLoading}>
              {t('hankeForm:buttons:create')}
            </Button>
            <Button variant="secondary" onClick={handleClose} iconLeft={<IconCross />}>
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default HankeCreateDialog;
