import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Button, IconAngleDown, IconAngleUp, IconCross, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { UseFieldArrayRemove } from 'react-hook-form';
import NewContactPersonForm, { ContactPersonAddedNotification } from './NewContactPersonForm';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';
import styles from './FormContact.module.scss';
import Transition from '../../../common/components/transition/Transition';

interface Props<T> {
  contactType: T;
  hankeTunnus: string;
  hankeUsers: HankeUser[] | undefined;
  index?: number;
  canBeRemoved?: boolean;
  onRemove?: UseFieldArrayRemove;
  onContactPersonAdded?: (newHankeUser: HankeUser) => void;
  children: React.ReactNode;
}

const FormContact = <T,>({
  contactType,
  hankeTunnus,
  hankeUsers,
  index,
  canBeRemoved = true,
  onRemove,
  onContactPersonAdded,
  children,
}: Readonly<Props<T>>) => {
  const { t } = useTranslation();
  const [showNewContactPersonForm, setShowNewContactPersonForm] = useState(false);
  const [showContactPersonAddedNotification, setShowContactPersonAddedNotification] =
    useState<ContactPersonAddedNotification>(null);
  const addContactPersonIcon = !showNewContactPersonForm ? <IconAngleDown /> : <IconAngleUp />;

  function toggleNewContactForm() {
    setShowNewContactPersonForm((formOpen) => !formOpen);
  }

  function closeNewContactForm(notification: ContactPersonAddedNotification) {
    setShowNewContactPersonForm(false);
    setShowContactPersonAddedNotification(notification);
  }

  function closeContactAddedNotification() {
    setShowContactPersonAddedNotification(null);
  }

  return (
    <>
      <Flex justify="right" align="center" mb="var(--spacing-s)">
        {canBeRemoved && onRemove && (
          <Button
            variant="supplementary"
            iconLeft={<IconCross aria-hidden />}
            onClick={() => onRemove(index)}
          >
            {t(`form:yhteystiedot:buttons:remove:${contactType}`)}
          </Button>
        )}
      </Flex>

      {children}

      <Button
        variant="supplementary"
        iconLeft={addContactPersonIcon}
        onClick={toggleNewContactForm}
        style={{ marginBottom: 'var(--spacing-s)' }}
      >
        {t(`form:yhteystiedot:buttons:addNewContactPerson`)}
      </Button>

      <Transition
        showChildren={showNewContactPersonForm}
        animateInClass={styles.newContactPersonForm__in}
        animateOutClass={styles.newContactPersonForm__out}
        unmountDelay={400}
      >
        <NewContactPersonForm
          hankeTunnus={hankeTunnus}
          hankeUsers={hankeUsers}
          onContactPersonAdded={onContactPersonAdded}
          onClose={closeNewContactForm}
        />
      </Transition>

      {showContactPersonAddedNotification === 'success' && (
        <Notification
          position="top-right"
          dismissible
          autoClose
          autoCloseDuration={4000}
          type="success"
          label={t('form:yhteystiedot:notifications:labels:contactPersonSaved')}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={closeContactAddedNotification}
        >
          {t('form:yhteystiedot:notifications:descriptions:contactPersonSaved')}
        </Notification>
      )}
      {showContactPersonAddedNotification === 'error' && (
        <Notification
          position="top-right"
          dismissible
          type="error"
          label={t('form:yhteystiedot:notifications:labels:contactPersonSaveError')}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={closeContactAddedNotification}
        >
          {t('form:yhteystiedot:notifications:descriptions:contactPersonSaveError')}
        </Notification>
      )}
    </>
  );
};

export default FormContact;
