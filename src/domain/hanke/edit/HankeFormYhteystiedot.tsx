import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Accordion, Button, Fieldset, IconPlusCircle } from 'hds-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CONTACT_FORMFIELD, FORMFIELD, FormProps, HankeDataFormState } from './types';
import {
  HankeYhteystieto,
  CONTACT_TYYPPI,
  HANKE_CONTACT_TYPE,
  HankeContactTypeKey,
  HankeMuuTaho,
  HankeYhteyshenkilo,
} from '../../types/hanke';
import Text from '../../../common/components/text/Text';
import { useFormPage } from './hooks/useFormPage';
import TextInput from '../../../common/components/textInput/TextInput';
import useLocale from '../../../common/hooks/useLocale';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import './HankeForm.styles.scss';
import FormContact from '../../forms/components/FormContact';
import { useHankeUsers } from '../hankeUsers/hooks/useHankeUsers';
import { HankeUser } from '../hankeUsers/hankeUser';
import { useQueryClient } from 'react-query';
import ContactPersonSelect from '../hankeUsers/ContactPersonSelect';
import { mapHankeUserToHankeYhteyshenkilo } from '../hankeUsers/utils';
import { Box } from '@chakra-ui/react';

function getEmptyContact(): Omit<HankeYhteystieto, 'id'> {
  return {
    nimi: '',
    tyyppi: CONTACT_TYYPPI.YRITYS,
    ytunnus: '',
    email: '',
    puhelinnumero: '',
    yhteyshenkilot: [],
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
    yhteyshenkilot: [],
  };
}

function mapHankeYhteyshenkiloToLabel(yhteyshenkilo: HankeYhteyshenkilo) {
  return `${yhteyshenkilo.etunimi} ${yhteyshenkilo.sukunimi} (${yhteyshenkilo.sahkoposti})`;
}

const ContactFields: React.FC<
  Readonly<{
    contactType: HankeContactTypeKey;
    index: number;
    hankeUsers?: HankeUser[];
  }>
> = ({ contactType, index, hankeUsers }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const selectedContactType = watch(`${contactType}.${index}.tyyppi`);
  const registryKeyInputDisabled = selectedContactType === CONTACT_TYYPPI.YKSITYISHENKILO;

  useEffect(() => {
    if (registryKeyInputDisabled) {
      setValue(`${contactType}.${index}.ytunnus`, null, {
        shouldValidate: true,
      });
    }
  }, [registryKeyInputDisabled, contactType, index, setValue]);

  return (
    <Box maxWidth="var(--width-form-2-col)">
      <ResponsiveGrid maxColumns={2}>
        <Dropdown
          id={`${contactType}.${index}.${CONTACT_FORMFIELD.TYYPPI}`}
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.TYYPPI}`}
          defaultValue={CONTACT_TYYPPI.YRITYS}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.TYYPPI}`)}
          options={$enum(CONTACT_TYYPPI).map((value) => {
            return {
              value,
              label: t(`form:yhteystiedot:contactType:${value}`),
            };
          })}
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.NIMI}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.NIMI}`)}
        />
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.TUNNUS}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.TUNNUS}`)}
          disabled={registryKeyInputDisabled}
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.EMAIL}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.EMAIL}`)}
        />
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.PUHELINNUMERO}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.PUHELINNUMERO}`)}
        />
      </ResponsiveGrid>
      <ContactPersonSelect
        name={`${contactType}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
        hankeUsers={hankeUsers}
        mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
        mapValueToLabel={mapHankeYhteyshenkiloToLabel}
      />
    </Box>
  );
};

const HankeFormYhteystiedot: React.FC<Readonly<FormProps>> = ({ formData }) => {
  useFormPage();
  const queryClient = useQueryClient();
  const { getValues, setValue } = useFormContext<HankeDataFormState>();
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: hankeUsers } = useHankeUsers(formData.hankeTunnus);

  const {
    fields: omistajat,
    append: appendOmistaja,
    remove: removeOmistaja,
  } = useFieldArray({
    name: FORMFIELD.OMISTAJAT,
  });

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

  const addOmistaja = useCallback(() => {
    appendOmistaja(getEmptyContact());
  }, [appendOmistaja]);

  // initialize Omistaja to have at least one contact
  useEffect(() => {
    if (omistajat.length === 0) {
      addOmistaja();
    }
  }, [omistajat, addOmistaja]);

  function addContactPersonForContact(
    contactType: HankeContactTypeKey,
    index: number,
    contactPerson: HankeUser,
  ) {
    setValue(
      `${contactType}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`,
      getValues(`${contactType}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`)?.concat(
        mapHankeUserToHankeYhteyshenkilo(contactPerson),
      ),
    );

    queryClient.invalidateQueries(['hankeUsers', formData.hankeTunnus]);
  }

  return (
    <div className="form2">
      <Text tag="p" styleAs="body-m" spacingBottom="s">
        {t(`form:yhteystiedot:instructions`)}
      </Text>

      {/* Omistaja */}
      <Accordion
        language={locale}
        headingLevel={3}
        heading={t('form:yhteystiedot:titles:omistajaInfo')}
        initiallyOpen={true}
      >
        {omistajat.map((item, index) => {
          return (
            <FormContact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.OMISTAJAT}
              hankeTunnus={formData.hankeTunnus!}
              index={index}
              canBeRemoved={omistajat.length > 1}
              onRemove={removeOmistaja}
              onContactPersonAdded={(user) =>
                addContactPersonForContact(HANKE_CONTACT_TYPE.OMISTAJAT, index, user)
              }
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:omistaja', { count: index + 1 })}
                style={{ paddingTop: 'var(--spacing-s)', minInlineSize: 'auto' }}
              >
                <ContactFields
                  contactType={HANKE_CONTACT_TYPE.OMISTAJAT}
                  index={index}
                  hankeUsers={hankeUsers}
                />
              </Fieldset>
            </FormContact>
          );
        })}

        <Button
          variant="supplementary"
          iconLeft={<IconPlusCircle aria-hidden />}
          onClick={() => appendOmistaja(getEmptyContact())}
        >
          {t('form:yhteystiedot:titles:lisaaOmistaja')}
        </Button>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        headingLevel={3}
        heading={t('form:yhteystiedot:titles:propertyDeveloperInfo')}
        initiallyOpen={true}
      >
        {rakennuttajat.map((item, index) => {
          return (
            <FormContact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.RAKENNUTTAJAT}
              hankeTunnus={formData.hankeTunnus!}
              index={index}
              onRemove={removeRakennuttaja}
              onContactPersonAdded={(user) =>
                addContactPersonForContact(HANKE_CONTACT_TYPE.RAKENNUTTAJAT, index, user)
              }
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:rakennuttajat', { count: index + 1 })}
                style={{ paddingTop: 'var(--spacing-s)', minInlineSize: 'auto' }}
              >
                <ContactFields
                  contactType={HANKE_CONTACT_TYPE.RAKENNUTTAJAT}
                  index={index}
                  hankeUsers={hankeUsers}
                />
              </Fieldset>
            </FormContact>
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
        initiallyOpen={true}
      >
        {toteuttajat.map((item, index) => {
          return (
            <FormContact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.TOTEUTTAJAT}
              hankeTunnus={formData.hankeTunnus!}
              index={index}
              onRemove={removeToteuttaja}
              onContactPersonAdded={(user) =>
                addContactPersonForContact(HANKE_CONTACT_TYPE.TOTEUTTAJAT, index, user)
              }
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:toteuttajat', { count: index + 1 })}
                style={{ paddingTop: 'var(--spacing-s)', minInlineSize: 'auto' }}
              >
                <ContactFields
                  contactType={HANKE_CONTACT_TYPE.TOTEUTTAJAT}
                  index={index}
                  hankeUsers={hankeUsers}
                />
              </Fieldset>
            </FormContact>
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
        initiallyOpen={true}
      >
        {muutTahot.map((item, index) => {
          const fieldPath = `${FORMFIELD.MUUTTAHOT}.${index}`;

          return (
            <FormContact<HankeContactTypeKey>
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.MUUTTAHOT}
              hankeTunnus={formData.hankeTunnus!}
              index={index}
              onRemove={removeMuuTaho}
              onContactPersonAdded={(user) =>
                addContactPersonForContact(HANKE_CONTACT_TYPE.MUUTTAHOT, index, user)
              }
            >
              <Fieldset
                heading={t('form:yhteystiedot:titles:muut', { count: index + 1 })}
                style={{ paddingTop: 'var(--spacing-s)', minInlineSize: 'auto' }}
              >
                <ResponsiveGrid>
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.ROOLI}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.ROOLI}`)}
                    placeholder={t('form:yhteystiedot:placeholders:otherPartyRole')}
                    helperText={t('form:yhteystiedot:helperTexts:otherPartyRole')}
                  />
                </ResponsiveGrid>
                <ResponsiveGrid>
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.NIMI}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.NIMI}`)}
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
                  />
                  <TextInput
                    name={`${fieldPath}.${CONTACT_FORMFIELD.PUHELINNUMERO}`}
                    label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.PUHELINNUMERO}`)}
                  />
                </ResponsiveGrid>
                <ContactPersonSelect
                  name={`${fieldPath}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
                  hankeUsers={hankeUsers}
                  mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
                  mapValueToLabel={mapHankeYhteyshenkiloToLabel}
                />
              </Fieldset>
            </FormContact>
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
