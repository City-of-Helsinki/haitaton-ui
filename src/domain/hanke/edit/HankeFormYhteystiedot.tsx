import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Accordion, Button, Fieldset, IconCross, IconPlusCircle, ToggleButton } from 'hds-react';
import { useFieldArray } from 'react-hook-form';
import { CONTACT_FORMFIELD, FORMFIELD, FormProps } from './types';
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
  'ytunnusTaiHetu',
  'osoite',
  'postinumero',
  'postitoimipaikka',
  'email',
  'puhelinnumero',
];
const REQUIRED_CONTACT_FIELDS: Array<keyof HankeContact> = [
  'tyyppi',
  'nimi',
  'ytunnusTaiHetu',
  'email',
];

function isRequiredContactField(field: keyof HankeContact) {
  return REQUIRED_CONTACT_FIELDS.includes(field);
}

function getEmptyContact(): Omit<HankeContact, 'id'> {
  return {
    nimi: '',
    tyyppi: null,
    ytunnusTaiHetu: '',
    osoite: '',
    postinumero: '',
    postitoimipaikka: '',
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
    nimi: '',
    osoite: '',
    postinumero: '',
    postitoimipaikka: '',
    email: '',
    puhelinnumero: '',
  };
}

const SubContactFields: React.FC<{ fieldPath: string; onRemove: () => void }> = ({
  fieldPath,
  onRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Fieldset
      heading={t('form:yhteystiedot:titles:subContactInformation')}
      border
      className="fieldset"
    >
      <ResponsiveGrid>
        <TextInput
          name={`${fieldPath}.${CONTACT_FORMFIELD.NIMI}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.NIMI}`)}
          required
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`${fieldPath}.${CONTACT_FORMFIELD.OSOITE}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.OSOITE}`)}
        />
        <TextInput
          name={`${fieldPath}.${CONTACT_FORMFIELD.POSTINRO}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.POSTINRO}`)}
        />
        <TextInput
          name={`${fieldPath}.${CONTACT_FORMFIELD.POSTITOIMIPAIKKA}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.POSTITOIMIPAIKKA}`)}
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
        <Button
          variant="supplementary"
          iconLeft={<IconCross aria-hidden />}
          onClick={onRemove}
          style={{ alignSelf: 'end' }}
        >
          {t(`form:yhteystiedot:buttons:removeSubContact`)}
        </Button>
      </ResponsiveGrid>
    </Fieldset>
  );
};

const ContactField: React.FC<{ field: keyof HankeContact; fieldName: string }> = ({
  field,
  fieldName,
}) => {
  const { t } = useTranslation();

  const isRequired = isRequiredContactField(field);
  const label = t(`form:yhteystiedot:labels:${field}`);

  if (field === 'tyyppi') {
    return (
      <Dropdown
        id={fieldName}
        name={fieldName}
        required={isRequired}
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

  return <TextInput name={fieldName} label={label} required={isRequired} />;
};

const HankeFormYhteystiedot: React.FC<FormProps> = () => {
  useFormPage();
  const { t } = useTranslation();
  const locale = useLocale();

  const [separateContact, setSeparateContact] = useState(false);

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

  const { fields: muutTahot, append: appendMuuTaho, remove: removeMuuTaho } = useFieldArray({
    name: FORMFIELD.MUUTTAHOT,
  });

  function toggleSeparateContact() {
    setSeparateContact((separateContactValue) => !separateContactValue);
  }

  const ownerSubContactFieldPath = `${FORMFIELD.OMISTAJAT}.0.${CONTACT_FORMFIELD.ALIKONTAKTIT}.0`;

  return (
    <div className="form2">
      <Text tag="p" styleAs="body-m" spacingBottom="s">
        {t(`form:yhteystiedot:instructions`)}
      </Text>
      <Text tag="h3" styleAs="h4" weight="bold" spacingBottom="xs">
        {t(`form:yhteystiedot:titles:omistaja`)}
      </Text>
      <ResponsiveGrid className="formWpr">
        {CONTACT_FIELDS.map((contactField) => {
          const fieldName = `${FORMFIELD.OMISTAJAT}.0.${contactField}`;
          return <ContactField key={contactField} field={contactField} fieldName={fieldName} />;
        })}
      </ResponsiveGrid>
      <div className="formWpr">
        <ToggleButton
          id="erillinen-yhteyshenkilo"
          label={t('form:yhteystiedot:labels:erillinenYhteyshenkilo')}
          onChange={toggleSeparateContact}
          checked={separateContact}
        />
      </div>
      {separateContact && (
        <Fieldset heading={t('form:yhteystiedot:titles:subContact')} border className="fieldset">
          <ResponsiveGrid>
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.NIMI}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.NIMI}`)}
              required
            />
          </ResponsiveGrid>
          <ResponsiveGrid>
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.OSOITE}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.OSOITE}`)}
            />
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.POSTINRO}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.POSTINRO}`)}
            />
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.POSTITOIMIPAIKKA}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.POSTITOIMIPAIKKA}`)}
            />
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.EMAIL}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.EMAIL}`)}
              required
            />
            <TextInput
              name={`${ownerSubContactFieldPath}.${CONTACT_FORMFIELD.PUHELINNUMERO}`}
              label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.PUHELINNUMERO}`)}
            />
          </ResponsiveGrid>
        </Fieldset>
      )}

      <Accordion language={locale} heading={t('form:yhteystiedot:titles:lisaaRakennuttajia')}>
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
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
            >
              <ResponsiveGrid>
                {CONTACT_FIELDS.map((contactField) => {
                  const fieldName = `${FORMFIELD.RAKENNUTTAJAT}.${index}.${contactField}`;
                  return (
                    <ContactField key={contactField} field={contactField} fieldName={fieldName} />
                  );
                })}
              </ResponsiveGrid>
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

      <Accordion language={locale} heading={t('form:yhteystiedot:titles:lisaaToteuttajia')}>
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
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
            >
              <ResponsiveGrid>
                {CONTACT_FIELDS.map((contactField) => {
                  const fieldName = `${FORMFIELD.TOTEUTTAJAT}.${index}.${contactField}`;
                  return (
                    <ContactField key={contactField} field={contactField} fieldName={fieldName} />
                  );
                })}
              </ResponsiveGrid>
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

      <Accordion language={locale} heading={t('form:yhteystiedot:titles:lisaaMuitaTahoja')}>
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
                    onRemove={() => removeSubContact(subContactIndex)}
                  />
                );
              }}
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
