import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Button, IconCross, IconPlusCircle, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { UseFieldArrayRemove } from 'react-hook-form';
import NewContactPersonForm, { ContactPersonAddedNotification } from './NewContactPersonForm';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';
import styles from './FormContact.module.scss';
import Transition from '../../../common/components/transition/Transition';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import ContactPersonSelect from '../../hanke/hankeUsers/ContactPersonSelect';

/**
 * Form component for adding and removing contact persons (yhteyshenkilö) for a contact (yhteystieto)
 */
interface Props<T, R> {
  name: string;
  contactType: T;
  hankeTunnus: string;
  hankeUsers: HankeUser[] | undefined;
  mapHankeUserToValue: ({ id, etunimi, sukunimi, sahkoposti, puhelinnumero }: HankeUser) => R;
  mapValueToLabel: (value: R) => string;
  transformValue?: (value: R) => R;
  index?: number;
  canBeRemoved?: boolean;
  onRemove?: UseFieldArrayRemove;
  onContactPersonAdded?: (newHankeUser: HankeUser) => void;
  required?: boolean;
  tooltip?: {
    tooltipButtonLabel: string;
    tooltipLabel: string;
    tooltipText: string;
  };
  children: React.ReactNode;
}

const FormContact = <T, R>({
  name,
  contactType,
  hankeTunnus,
  hankeUsers,
  mapHankeUserToValue,
  mapValueToLabel,
  transformValue,
  index,
  canBeRemoved = true,
  onRemove,
  onContactPersonAdded,
  required,
  tooltip,
  children,
}: Readonly<Props<T, R>>) => {
  const { t } = useTranslation();
  const [showNewContactPersonForm, setShowNewContactPersonForm] = useState(false);
  const [showContactPersonAddedNotification, setShowContactPersonAddedNotification] =
    useState<ContactPersonAddedNotification>(null);

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

      <Box maxWidth="var(--width-form-3-col)">
        <ResponsiveGrid maxColumns={3}>
          <Box style={{ gridColumn: 'span 2' }}>
            <ContactPersonSelect<R>
              name={name}
              hankeUsers={hankeUsers}
              mapHankeUserToValue={mapHankeUserToValue}
              mapValueToLabel={mapValueToLabel}
              transformValue={transformValue}
              required={required}
              tooltip={tooltip}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="start" mb="var(--spacing-m)">
            <Button
              variant="secondary"
              iconLeft={<IconPlusCircle aria-hidden />}
              onClick={toggleNewContactForm}
              disabled={showNewContactPersonForm}
            >
              {t(`form:yhteystiedot:buttons:addNewContactPerson`)}
            </Button>
          </Box>
        </ResponsiveGrid>
      </Box>

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
