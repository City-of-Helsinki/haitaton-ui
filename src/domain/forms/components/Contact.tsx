/* eslint-disable react/require-default-props */
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Button, IconCross, IconPlusCircle, Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, UseFieldArrayRemove } from 'react-hook-form';
import Text from '../../../common/components/text/Text';
import styles from './Contact.module.scss';

interface Props<T> {
  contactType: T;
  index?: number;
  showContactTitle?: boolean;
  onRemoveContact?: UseFieldArrayRemove;
  renderSubContact?: (subContactIndex: number, remove: UseFieldArrayRemove) => JSX.Element;
  subContactPath: string;
  emptySubContact: unknown;
  children: React.ReactNode;
}

const Contact = <T extends unknown>({
  contactType,
  index,
  showContactTitle = true,
  onRemoveContact,
  renderSubContact,
  subContactPath,
  emptySubContact,
  children,
}: Props<T>) => {
  const { t } = useTranslation();

  const {
    fields: subContactFields,
    append: appendSubContact,
    remove: removeSubContact,
  } = useFieldArray({
    name: subContactPath,
  });

  function addSubContact() {
    appendSubContact(emptySubContact);
  }

  const renderSubContacts = subContactFields.length > 0 && renderSubContact;

  return (
    <>
      <Flex justify="space-between" align="center" mb="var(--spacing-s)">
        {showContactTitle && (
          <Text tag="h3" styleAs="body-l" weight="bold">
            {t(`form:yhteystiedot:titles:${contactType}`)}
          </Text>
        )}
        {onRemoveContact && (
          <Button
            variant="supplementary"
            iconLeft={<IconCross aria-hidden />}
            onClick={() => onRemoveContact(index)}
          >
            {t(`form:yhteystiedot:buttons:remove:${contactType}`)}
          </Button>
        )}
      </Flex>

      {children}

      {renderSubContacts && (
        <Tabs>
          <TabList className={styles.tabList}>
            {subContactFields.map((subContact, subContactIndex) => {
              return (
                <Tab key={subContact.id}>
                  {t('hankePortfolio:labels:yhteyshenkilo')}{' '}
                  {subContactIndex > 0 && subContactIndex + 1}
                </Tab>
              );
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
