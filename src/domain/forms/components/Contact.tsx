import React, { useCallback, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import {
  Button,
  ButtonVariant,
  IconCross,
  IconPlusCircle,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { UseFieldArrayRemove } from 'react-hook-form';
import styles from './Contact.module.scss';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';
import useFieldArrayWithStateUpdate from '../../../common/hooks/useFieldArrayWithStateUpdate';

interface Props<T> {
  contactType: T;
  index?: number;
  canBeRemoved?: boolean;
  onRemove?: UseFieldArrayRemove;
  subContactTemplate?: boolean;
  renderSubContact?: (
    subContactIndex: number,
    subContactCount: number,
    remove: UseFieldArrayRemove,
  ) => JSX.Element;
  subContactPath: string;
  emptySubContact: unknown;
  children: React.ReactNode;
}

const Contact = <T,>({
  contactType,
  index,
  canBeRemoved = true,
  onRemove,
  renderSubContact,
  subContactTemplate = false,
  subContactPath,
  emptySubContact,
  children,
}: Props<T>) => {
  const { t } = useTranslation();

  const {
    fields: subContactFields,
    append: appendSubContact,
    remove: removeSubContact,
  } = useFieldArrayWithStateUpdate({
    name: subContactPath,
  });

  const addSubContact = useCallback(() => {
    appendSubContact(emptySubContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendSubContact]);

  useEffect(() => {
    if (subContactFields.length === 0 && subContactTemplate) {
      addSubContact();
    }
  }, [subContactFields, subContactTemplate, addSubContact]);

  const renderSubContacts = subContactFields.length > 0 && renderSubContact;
  const { tabRefs } = useSelectableTabs(subContactFields, { selectLastTabOnChange: true });

  return (
    <>
      <Flex justify="right" align="center" mb="var(--spacing-s)">
        {canBeRemoved && onRemove && (
          <Button
            variant={ButtonVariant.Supplementary}
            iconStart={<IconCross />}
            onClick={() => onRemove(index)}
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
                {renderSubContact(subContactIndex, subContactFields.length, removeSubContact)}
              </TabPanel>
            );
          })}
        </Tabs>
      )}

      <Button
        variant={ButtonVariant.Supplementary}
        iconStart={<IconPlusCircle />}
        onClick={addSubContact}
        className={styles.addSubContactButton}
      >
        {t(`form:yhteystiedot:buttons:addSubContact`)}
      </Button>
    </>
  );
};

export default Contact;
