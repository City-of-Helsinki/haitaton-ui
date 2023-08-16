import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Button, IconCross, IconPlusCircle, Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, UseFieldArrayRemove } from 'react-hook-form';
import styles from './Contact.module.scss';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';

interface Props<T> {
  contactType: T;
  index?: number;
  onRemoveContact?: UseFieldArrayRemove;
  renderSubContact?: (subContactIndex: number, remove: UseFieldArrayRemove) => JSX.Element;
  subContactPath: string;
  emptySubContact: unknown;
  children: React.ReactNode;
}

const Contact = <T,>({
  contactType,
  index,
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
  const { tabRefs } = useSelectableTabs(subContactFields.length, { selectLastTabOnChange: true });

  return (
    <>
      <Flex justify="right" align="center" mb="var(--spacing-s)">
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
                  <div
                    data-testid={`${contactType}-${subContactIndex}`}
                    ref={tabRefs[subContactIndex]}
                  >
                    {t('hankePortfolio:labels:yhteyshenkilo')}{' '}
                    {subContactIndex > 0 && subContactIndex + 1}
                  </div>
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
