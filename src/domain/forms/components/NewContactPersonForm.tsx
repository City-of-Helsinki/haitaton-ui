import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ButtonVariant,
  Fieldset,
  IconCheck,
  IconCross,
  Notification,
  NotificationSize,
} from 'hds-react';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import TextInput from '../../../common/components/textInput/TextInput';
import { createHankeUser } from '../../hanke/hankeUsers/hankeUsersApi';
import { yhteyshenkiloSchema } from '../../hanke/edit/hankeSchema';
import { Yhteyshenkilo, YHTEYSHENKILO_FORMFIELD } from '../../hanke/edit/types';
import styles from './NewContactPersonForm.module.scss';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';
import Button from '../../../common/components/button/Button';

export type ContactPersonAddedNotification = 'success' | 'error' | null;

type Props = {
  hankeTunnus: string;
  hankeUsers: HankeUser[] | undefined;
  onContactPersonAdded?: (newHankeUser: HankeUser) => void;
  onClose: (notification: ContactPersonAddedNotification) => void;
};

function NewContactPersonForm({
  hankeTunnus,
  hankeUsers,
  onContactPersonAdded,
  onClose,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const formContext = useForm<Yhteyshenkilo>({
    mode: 'onTouched',
    resolver: yupResolver(yhteyshenkiloSchema),
    context: { hankeUsers: hankeUsers, errorMessageKey: 'emailAlreadyUsedInContacts' },
  });
  const { getValues, trigger } = formContext;
  const { mutate, isLoading } = useDebouncedMutation(createHankeUser);

  async function saveContact() {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) {
      return;
    }

    mutate(
      { hankeTunnus, user: getValues() },
      {
        onSuccess(data) {
          if (onContactPersonAdded) {
            onContactPersonAdded(data);
          }
          onClose('success');
        },
        onError() {
          onClose('error');
        },
      },
    );
  }

  function cancelContactAdd() {
    onClose(null);
  }

  return (
    <FormProvider {...formContext}>
      <Fieldset
        heading={t('form:yhteystiedot:titles:subContactInformation')}
        border
        className={styles.fieldset}
      >
        <Notification
          type="info"
          position="inline"
          label={t('form:yhteystiedot:notifications:descriptions:contactPersonInfo')}
          size={NotificationSize.Small}
          className={styles.infoNotification}
        >
          {t('form:yhteystiedot:notifications:descriptions:contactPersonInfo')}
        </Notification>
        <ResponsiveGrid maxColumns={2}>
          <TextInput
            name={YHTEYSHENKILO_FORMFIELD.ETUNIMI}
            label={t('hankeForm:labels:etunimi')}
            required
          />
          <TextInput
            name={YHTEYSHENKILO_FORMFIELD.SUKUNIMI}
            label={t('hankeForm:labels:sukunimi')}
            required
          />
        </ResponsiveGrid>
        <ResponsiveGrid maxColumns={2}>
          <TextInput
            name={YHTEYSHENKILO_FORMFIELD.EMAIL}
            label={t('hankeForm:labels:email')}
            required
          />
          <TextInput
            name={YHTEYSHENKILO_FORMFIELD.PUHELINNUMERO}
            label={t('hankeForm:labels:puhelinnumero')}
            required
          />
        </ResponsiveGrid>
        <div className={styles.formButtons}>
          <Button iconStart={<IconCheck />} onClick={saveContact} isLoading={isLoading}>
            {t('form:yhteystiedot:buttons:saveAndAddContactPerson')}
          </Button>
          <Button
            iconStart={<IconCross />}
            variant={ButtonVariant.Secondary}
            onClick={cancelContactAdd}
          >
            {t('common:confirmationDialog:cancelButton')}
          </Button>
        </div>
      </Fieldset>
    </FormProvider>
  );
}

export default NewContactPersonForm;
