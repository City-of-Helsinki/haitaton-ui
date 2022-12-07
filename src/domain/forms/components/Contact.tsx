import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Button, IconCross, IconPlusCircle, Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, UseFieldArrayRemove } from 'react-hook-form';
import Text from '../../../common/components/text/Text';
import styles from './Contact.module.scss';
import { CONTACT_FORMFIELD } from '../../hanke/edit/types';
import { HankeSubContact } from '../../types/hanke';

function getEmptySubContact(): HankeSubContact {
  return {
    nimi: '',
    osoite: '',
    postinumero: '',
    postitoimipaikka: '',
    email: '',
    puhelinnumero: '',
  };
}

interface Props<T> {
  contactType: T;
  index: number;
  onRemoveContact: UseFieldArrayRemove;
  // eslint-disable-next-line react/require-default-props
  renderSubContact?: (subContactIndex: number, remove: UseFieldArrayRemove) => JSX.Element;
  children: React.ReactNode;
}

const Contact = <T extends unknown>({
  contactType,
  index,
  onRemoveContact,
  renderSubContact,
  children,
}: Props<T>) => {
  const { t } = useTranslation();

  const {
    fields: subContactFields,
    append: appendSubContact,
    remove: removeSubContact,
  } = useFieldArray({
    name: `${contactType}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}`,
  });

  function addSubContact() {
    appendSubContact(getEmptySubContact());
  }

  const renderSubContacts = subContactFields.length > 0 && renderSubContact;

  return (
    <>
      <Flex justify="space-between" align="center" mb="var(--spacing-s)">
        <Text tag="h3" styleAs="body-l" weight="bold">
          {t(`form:yhteystiedot:titles:${contactType}`)}
        </Text>
        <Button
          variant="supplementary"
          iconLeft={<IconCross aria-hidden />}
          onClick={() => onRemoveContact(index)}
        >
          {t(`form:yhteystiedot:buttons:remove:${contactType}`)}
        </Button>
      </Flex>

      {children}

      {renderSubContacts && (
        <Tabs>
          <TabList className={styles.tabList}>
            {subContactFields.map((subContact) => {
              return <Tab key={subContact.id}>Yhteyshenkilö</Tab>;
            })}
          </TabList>

          {subContactFields.map((subContact, subContactIndex) => {
            return (
              <TabPanel key={subContact.id}>
                {renderSubContact(subContactIndex, removeSubContact)}
              </TabPanel>
            );
          })}
        </Tabs>
      )}

      <Button
        variant="supplementary"
        iconLeft={<IconPlusCircle aria-hidden />}
        onClick={addSubContact}
        className={styles.addSubContactButton}
      >
        {t(`form:yhteystiedot:buttons:addSubContact`)}
      </Button>
    </>
  );
};

export default Contact;
