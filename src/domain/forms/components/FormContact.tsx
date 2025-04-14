import React, { ReactElement, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import {
  Button,
  ButtonVariant,
  IconCross,
  IconPlusCircle,
  Notification,
  Tooltip,
  TooltipProps,
} from 'hds-react';
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
  tooltip?: ReactElement<TooltipProps, typeof Tooltip>;
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
    <div>
      <Flex justify="right" align="center" mb="var(--spacing-s)">
        {canBeRemoved && onRemove && (
          <Button
            className="haitaton-button-icon-size-initial"
            variant={ButtonVariant.Supplementary}
            iconStart={<IconCross />}
            onClick={() => onRemove(index)}
          >
            {t(`form:yhteystiedot:buttons:remove:${contactType}`)}
          </Button>
        )}
      </Flex>

      {children}

      <ResponsiveGrid maxColumns={3}>
        <Box gridColumn="span 2" maxWidth="var(--width-form-2-col)">
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
        <Flex alignItems="flex-start" mt={{ base: '0', lg: '28px' }}>
          <Button
            className="haitaton-button-icon-size-initial"
            variant={ButtonVariant.Secondary}
            iconStart={<IconPlusCircle />}
            onClick={toggleNewContactForm}
            disabled={showNewContactPersonForm}
          >
            {t(`form:yhteystiedot:buttons:addNewContactPerson`)}
          </Button>
        </Flex>
      </ResponsiveGrid>

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
    </div>
  );
};

export default FormContact;
