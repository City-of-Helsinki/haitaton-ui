import { Box } from '@chakra-ui/react';
import { Button, Dialog, IconCheck, IconCross, IconInfoCircle, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../../../common/components/textInput/TextInput';
import { newHankeSchema } from '../edit/hankeSchema';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import { createHanke } from '../edit/hankeApi';
import { NewHankeData } from '../edit/types';
import OwnInformationFields from '../../forms/components/OwnInformationFields';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function HankeCreateDialog({ isOpen, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
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
            <OwnInformationFields />

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
