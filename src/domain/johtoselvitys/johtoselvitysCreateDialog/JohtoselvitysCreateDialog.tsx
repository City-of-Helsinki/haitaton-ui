import { Box } from '@chakra-ui/react';
import {
  ButtonVariant,
  Dialog,
  IconCheck,
  IconCross,
  IconInfoCircle,
  Notification,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../../../common/components/textInput/TextInput';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import { NewJohtoselvitysData } from '../../application/types/application';
import { newJohtoselvitysSchema } from '../validationSchema';
import { createJohtoselvitys } from '../../application/utils';
import OwnInformationFields from '../../forms/components/OwnInformationFields';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';
import Button from '../../../common/components/button/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function JohtoselvitysCreateDialog({ isOpen, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getEditJohtoselvitysPath = useLinkPath(ROUTES.EDIT_JOHTOSELVITYSHAKEMUS);
  const formContext = useForm<NewJohtoselvitysData>({
    mode: 'onTouched',
    resolver: yupResolver(newJohtoselvitysSchema),
  });
  const { handleSubmit, reset: resetForm } = formContext;
  const {
    mutate,
    reset: resetMutation,
    isLoading,
    isError,
  } = useDebouncedMutation(createJohtoselvitys, {
    onSuccess({ id }) {
      resetForm();
      onClose();
      if (id) {
        navigate(getEditJohtoselvitysPath({ id: id.toString() }));
      }
    },
  });
  const dialogTitle = t('johtoselvitysForm:createNewJohtoselvitys');

  function handleClose() {
    resetForm();
    resetMutation();
    onClose();
  }

  async function submitForm(data: NewJohtoselvitysData) {
    mutate(data);
  }

  return (
    <Dialog
      id="johtoselvitys-create"
      isOpen={isOpen}
      aria-labelledby={dialogTitle}
      variant="primary"
      close={handleClose}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header
        id="johtoselvitys-create-title"
        title={dialogTitle}
        iconStart={<IconInfoCircle />}
      />
      <FormProvider {...formContext}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Dialog.Content>
            <OwnInformationFields />
            <Box marginTop="var(--spacing-m)" marginBottom="var(--spacing-s)">
              <h3 className="heading-s">{t('hakemus:labels:applicationInfo')}</h3>
            </Box>
            <Box marginBottom="var(--spacing-2-xs)">
              <TextInput
                name="nimi"
                label={t('hakemus:labels:nimi')}
                maxLength={100}
                required
                helperText={t('hakemus:labels:nimiHelperText')}
              />
            </Box>

            {isError && (
              <Box marginTop="var(--spacing-m)">
                <Notification label={t('common:error')} type="error" />
              </Box>
            )}
          </Dialog.Content>

          <Dialog.ActionButtons>
            <Button type="submit" iconStart={<IconCheck />} isLoading={isLoading}>
              {t('homepage:hakemus:actionText')}
            </Button>
            <Button
              variant={ButtonVariant.Secondary}
              onClick={handleClose}
              iconStart={<IconCross />}
            >
              {t('common:confirmationDialog:cancelButton')}
            </Button>
          </Dialog.ActionButtons>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default JohtoselvitysCreateDialog;
