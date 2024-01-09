import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Button, Fieldset, IconCheck, IconCross } from 'hds-react';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import TextInput from '../../../common/components/textInput/TextInput';
import { createHankeUser } from '../../hanke/hankeUsers/hankeUsersApi';
import { contactPersonSchema } from '../../hanke/edit/hankeSchema';
import { ContactPerson, CONTACT_PERSON_FORMFIELD } from '../../hanke/edit/types';
import styles from './NewContactPersonForm.module.scss';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';

export type ContactPersonAddedNotification = 'success' | 'error' | null;

type Props = {
  hankeTunnus: string;
  onContactPersonAdded?: (newHankeUser: HankeUser) => void;
  onClose: (notification: ContactPersonAddedNotification) => void;
};

function NewContactPersonForm({ hankeTunnus, onContactPersonAdded, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
  const formContext = useForm<ContactPerson>({
    mode: 'onTouched',
    resolver: yupResolver(contactPersonSchema),
  });
  const { getValues, trigger } = formContext;
  const { mutate } = useMutation(createHankeUser);

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
        <ResponsiveGrid maxColumns={2}>
          <TextInput
            name={CONTACT_PERSON_FORMFIELD.ETUNIMI}
            label={t('hankeForm:labels:etunimi')}
            required
          />
          <TextInput
            name={CONTACT_PERSON_FORMFIELD.SUKUNIMI}
            label={t('hankeForm:labels:sukunimi')}
            required
          />
        </ResponsiveGrid>
        <ResponsiveGrid maxColumns={2}>
          <TextInput
            name={CONTACT_PERSON_FORMFIELD.EMAIL}
            label={t('hankeForm:labels:email')}
            required
          />
          <TextInput
            name={CONTACT_PERSON_FORMFIELD.PUHELINNUMERO}
            label={t('hankeForm:labels:puhelinnumero')}
            required
          />
        </ResponsiveGrid>
        <div className={styles.formButtons}>
          <Button iconLeft={<IconCheck />} onClick={saveContact}>
            {t('form:yhteystiedot:buttons:saveAndAddContactPerson')}
          </Button>
          <Button iconLeft={<IconCross />} variant="secondary" onClick={cancelContactAdd}>
            {t('common:confirmationDialog:cancelButton')}
          </Button>
        </div>
      </Fieldset>
    </FormProvider>
  );
}

export default NewContactPersonForm;
