import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Accordion, Button, Fieldset, IconCross, IconPlusCircle } from 'hds-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CONTACT_FORMFIELD, FORMFIELD, FormProps, SUBCONTACT_FORMFIELD } from './types';
import {
  HankeContact,
  CONTACT_TYYPPI,
  HANKE_CONTACT_TYPE,
  HankeContactTypeKey,
  HankeMuuTaho,
  HankeSubContact,
} from '../../types/hanke';
import Text from '../../../common/components/text/Text';
import { useFormPage } from './hooks/useFormPage';
import TextInput from '../../../common/components/textInput/TextInput';
import useLocale from '../../../common/hooks/useLocale';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import Contact from '../../forms/components/Contact';
import './HankeForm.styles.scss';

const CONTACT_FIELDS: Array<keyof HankeContact> = [
  'tyyppi',
  'nimi',
  'ytunnus',
  'email',
  'puhelinnumero',
];

function getEmptyContact(): Omit<HankeContact, 'id'> {
  return {
    nimi: '',
    tyyppi: null,
    ytunnus: '',
    email: '',
    puhelinnumero: '',
    alikontaktit: [],
  };
}

function getEmptyOtherContact(): HankeMuuTaho {
  return {
    rooli: '',
    nimi: '',
    organisaatioNimi: '',
    osasto: '',
    email: '',
    puhelinnumero: '',
    alikontaktit: [],
  };
}

function getEmptySubContact(): HankeSubContact {
  return {
    etunimi: '',
    sukunimi: '',
    email: '',
    puhelinnumero: '',
  };
}

const SubContactFields: React.FC<{
  fieldPath: string;
  canBeRemoved: boolean;
  onRemove: () => void;
}> = ({ fieldPath, canBeRemoved, onRemove }) => {
  const { t } = useTranslation();

  return (
    <Fieldset
      heading={t('form:yhteystiedot:titles:subContactInformation')}
      border
      className="fieldset"
    >
      <ResponsiveGrid>
        <TextInput
          name={`${fieldPath}.${SUBCONTACT_FORMFIELD.ETUNIMI}`}
          label={t(`form:yhteystiedot:labels:${SUBCONTACT_FORMFIELD.ETUNIMI}`)}
          required
        />
        <TextInput
          name={`${fieldPath}.${SUBCONTACT_FORMFIELD.SUKUNIMI}`}
          label={t(`form:yhteystiedot:labels:${SUBCONTACT_FORMFIELD.SUKUNIMI}`)}
          required
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`${fieldPath}.${SUBCONTACT_FORMFIELD.EMAIL}`}
          label={t(`form:yhteystiedot:labels:${SUBCONTACT_FORMFIELD.EMAIL}`)}
          required
        />
        <TextInput
          name={`${fieldPath}.${SUBCONTACT_FORMFIELD.PUHELINNUMERO}`}
          label={t(`form:yhteystiedot:labels:${SUBCONTACT_FORMFIELD.PUHELINNUMERO}`)}
          required
        />
        {canBeRemoved && (
          <Button
            variant="supplementary"
            iconLeft={<IconCross aria-hidden />}
            onClick={onRemove}
            style={{ alignSelf: 'end' }}
          >
            {t(`form:yhteystiedot:buttons:removeSubContact`)}
          </Button>
        )}
      </ResponsiveGrid>
    </Fieldset>
  );
};

const ContactField: React.FC<{
  field: keyof HankeContact;
  fieldName: string;
  contactType: HankeContactTypeKey;
  index: number;
}> = ({ field, fieldName, contactType, index }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const selectedContactType = watch(`${contactType}.${index}.tyyppi`);
  const inputDisabled =
    field === CONTACT_FORMFIELD.TUNNUS && selectedContactType === CONTACT_TYYPPI.YKSITYISHENKILO;

  useEffect(() => {
    if (inputDisabled) {
      setValue(`${contactType}.${index}.ytunnus`, null, {
        shouldValidate: true,
      });
    }
  }, [inputDisabled, contactType, index, setValue]);

  const label = t(`form:yhteystiedot:labels:${field}`);

  if (field === 'tyyppi') {
    return (
      <Dropdown
        id={fieldName}
        name={fieldName}
        defaultValue={null}
        label={label}
        options={$enum(CONTACT_TYYPPI).map((value) => {
          return {
            value,
            label: t(`form:yhteystiedot:contactType:${value}`),
          };
        })}
      />
    );
  }

  return <TextInput name={fieldName} label={label} disabled={inputDisabled} />;
};

const HankeFormYhteystiedot: React.FC<FormProps> = () => {
  useFormPage();
  const { t } = useTranslation();
  const locale = useLocale();

  const {
    fields: rakennuttajat,
    append: appendRakennuttaja,
    remove: removeRakennuttaja,
  } = useFieldArray({
    name: FORMFIELD.RAKENNUTTAJAT,
  });

  const {
    fields: toteuttajat,
    append: appendToteuttaja,
    remove: removeToteuttaja,
  } = useFieldArray({ name: FORMFIELD.TOTEUTTAJAT });

  const {
    fields: muutTahot,
    append: appendMuuTaho,
    remove: removeMuuTaho,
  } = useFieldArray({
    name: FORMFIELD.MUUTTAHOT,
  });

  const ownerSubContactFieldPath = `${FORMFIELD.OMISTAJAT}.0.${CONTACT_FORMFIELD.ALIKONTAKTIT}`;

  return (
    <div className="form2">
      <Text tag="p" styleAs="body-m" spacingBottom="s">
        {t(`form:yhteystiedot:instructions`)}
      </Text>
      <Text tag="h3" styleAs="h3" weight="light" spacingBottom="xs">
        {t(`form:yhteystiedot:titles:omistajaInfo`)}
      </Text>

      {/* Omistaja */}
      <Contact<HankeContactTypeKey>
        contactType={HANKE_CONTACT_TYPE.OMISTAJAT}
        subContactPath={ownerSubContactFieldPath}
        emptySubContact={getEmptySubContact()}
        showInitialEmpty={true}
        renderSubContact={(subContactIndex, removeSubContact) => {
          const fieldPath = `${ownerSubContactFieldPath}.${subContactIndex}`;
          return (
            <SubContactFields
              fieldPath={fieldPath}
              canBeRemoved={subContactIndex > 0}
              onRemove={() => removeSubContact(subContactIndex)}
            />
          );
        }}
      >
        <Fieldset
          heading={t('form:yhteystiedot:titles:omistaja')}
          style={{ paddingTop: 'var(--spacing-s)' }}
        >
          <ResponsiveGrid>
            {CONTACT_FIELDS.map((contactField) => {
              const fieldName = `${FORMFIELD.OMISTAJAT}.0.${contactField}`;
              return (
                <ContactField
                  key={contactField}
                  field={contactField}
                  fieldName={fieldName}
                  contactType={HANKE_CONTACT_TYPE.OMISTAJAT}
                  index={0}
                />
              );
            })}
          </ResponsiveGrid>
        </Fieldset>
      </Contact>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        headingLevel={3}
        heading={t('form:yhteystiedot:titles:propertyDeveloperInfo')}
      >
        {rakennuttajat.map((item, index) => {
          return (
            <Contact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.RAKENNUTTAJAT}
              index={index}
              onRemoveContact={removeRakennuttaja}
              subContactPath={`${HANKE_CONTACT_TYPE.RAKENNUTTAJAT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}`}
              emptySubContact={getEmptySubContact()}
              renderSubContact={(subContactIndex, removeSubContact) => {
                const fieldPath = `${HANKE_CONTACT_TYPE.RAKENNUTTAJAT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}.${subContactIndex}`;
                return (
                  <SubContactFields
                    fieldPath={fieldPath}
                    canBeRemoved={subContactIndex > 0}
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:rakennuttajat')}
                style={{ paddingTop: 'var(--spacing-s)' }}
              >
                <ResponsiveGrid>
                  {CONTACT_FIELDS.map((contactField) => {
                    const fieldName = `${FORMFIELD.RAKENNUTTAJAT}.${index}.${contactField}`;
                    return (
                      <ContactField
                        key={contactField}
                        field={contactField}
                        fieldName={fieldName}
                        contactType={HANKE_CONTACT_TYPE.RAKENNUTTAJAT}
                        index={index}
                      />
                    );
                  })}
                </ResponsiveGrid>
              </Fieldset>
            </Contact>
          );
        })}

        <Button
          variant="supplementary"
          iconLeft={<IconPlusCircle aria-hidden />}
          onClick={() => appendRakennuttaja(getEmptyContact())}
        >
          {t('form:yhteystiedot:titles:lisaaRakennuttaja')}
        </Button>
      </Accordion>

      {/* Toteuttaja */}
      <Accordion
        language={locale}
        headingLevel={3}
        heading={t('form:yhteystiedot:titles:implementerInfo')}
      >
        {toteuttajat.map((item, index) => {
          return (
            <Contact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.TOTEUTTAJAT}
              index={index}
              onRemoveContact={removeToteuttaja}
              subContactPath={`${HANKE_CONTACT_TYPE.TOTEUTTAJAT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}`}
              emptySubContact={getEmptySubContact()}
              renderSubContact={(subContactIndex, removeSubContact) => {
                const fieldPath = `${HANKE_CONTACT_TYPE.TOTEUTTAJAT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}.${subContactIndex}`;
                return (
                  <SubContactFields
                    fieldPath={fieldPath}
                    canBeRemoved={subContactIndex > 0}
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:toteuttajat')}
                style={{ paddingTop: 'var(--spacing-s)' }}
              >
                <ResponsiveGrid>
                  {CONTACT_FIELDS.map((contactField) => {
                    const fieldName = `${FORMFIELD.TOTEUTTAJAT}.${index}.${contactField}`;
                    return (
                      <ContactField
                        key={contactField}
                        field={contactField}
                        fieldName={fieldName}
                        contactType={HANKE_CONTACT_TYPE.TOTEUTTAJAT}
                        index={index}
                      />
                    );
                  })}
                </ResponsiveGrid>
              </Fieldset>
            </Contact>
          );
        })}

        <Button
          variant="supplementary"
          iconLeft={<IconPlusCircle aria-hidden />}
          onClick={() => appendToteuttaja(getEmptyContact())}
        >
          {t('form:yhteystiedot:titles:lisaaToteuttaja')}
        </Button>
      </Accordion>

      {/* Muut tahot */}
      <Accordion
        language={locale}
        headingLevel={3}
        heading={t('form:yhteystiedot:titles:otherInfo')}
      >
        {muutTahot.map((item, index) => {
          const fieldPath = `${FORMFIELD.MUUTTAHOT}.${index}`;

          return (
            <Contact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.MUUTTAHOT}
              index={index}
              onRemoveContact={removeMuuTaho}
              subContactPath={`${HANKE_CONTACT_TYPE.MUUTTAHOT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}`}
              emptySubContact={getEmptySubContact()}
              renderSubContact={(subContactIndex, removeSubContact) => {
                const subContactFieldPath = `${HANKE_CONTACT_TYPE.MUUTTAHOT}.${index}.${CONTACT_FORMFIELD.ALIKONTAKTIT}.${subContactIndex}`;
                return (
                  <SubContactFields
                    fieldPath={subContactFieldPath}
                    canBeRemoved={subContactIndex > 0}
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:muut')}
                style={{ paddingTop: 'var(--spacing-s)' }}
              >
                <ResponsiveGrid>
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.ROOLI}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.ROOLI}`)}
                    required
                    placeholder={t('form:yhteystiedot:placeholders:otherPartyRole')}
                    helperText={t('form:yhteystiedot:helperTexts:otherPartyRole')}
                  />
                </ResponsiveGrid>
                <ResponsiveGrid>
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.NIMI}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.NIMI}`)}
                    required
                  />
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.ORGANISAATIO}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.ORGANISAATIO}`)}
                  />
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.OSASTO}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.OSASTO}`)}
                  />
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.EMAIL}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.EMAIL}`)}
                    required
                  />
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.PUHELINNUMERO}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.PUHELINNUMERO}`)}
                  />
                </ResponsiveGrid>
              </Fieldset>
            </Contact>
          );
        })}

        <Button
          variant="supplementary"
          iconLeft={<IconPlusCircle aria-hidden />}
          onClick={() => appendMuuTaho(getEmptyOtherContact())}
        >
          {t('form:yhteystiedot:titles:lisaaMuuTaho')}
        </Button>
      </Accordion>
    </div>
  );
};

export default HankeFormYhteystiedot;
