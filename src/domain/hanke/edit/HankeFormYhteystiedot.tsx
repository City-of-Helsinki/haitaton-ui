import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Accordion, Button, ButtonVariant, Fieldset, IconPlusCircle } from 'hds-react';
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
import TextInput from '../../../common/components/textInput/TextInput';
import useLocale from '../../../common/hooks/useLocale';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import './HankeForm.styles.scss';
import FormContact from '../../forms/components/FormContact';
import { useHankeUsers } from '../hankeUsers/hooks/useHankeUsers';
import { HankeUser } from '../hankeUsers/hankeUser';
import { useQueryClient } from 'react-query';
import { mapHankeUserToHankeYhteyshenkilo } from '../hankeUsers/utils';
import { Box } from '@chakra-ui/react';
import UserSearchInput from '../hankeUsers/UserSearchInput';

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
  const registryKey = watch(`${contactType}.${index}.ytunnus`);
  const isPrivatePerson = selectedContactType === CONTACT_TYYPPI.YKSITYISHENKILO;
  const registryKeyInputDisabled = isPrivatePerson;

  useEffect(() => {
    if (registryKeyInputDisabled) {
      setValue(`${contactType}.${index}.ytunnus`, null, {
        shouldValidate: true,
      });
    }
  }, [registryKeyInputDisabled, contactType, index, setValue]);

  useEffect(() => {
    if (registryKey === '') {
      // set the registry key to null when it is empty
      setValue(`${contactType}.${index}.ytunnus`, null);
    }
  }, [contactType, index, registryKey, setValue]);

  function handleUserSelect(user: HankeUser) {
    setValue(`${contactType}.${index}.${CONTACT_FORMFIELD.EMAIL}`, user.sahkoposti, {
      shouldValidate: true,
    });
    setValue(`${contactType}.${index}.${CONTACT_FORMFIELD.PUHELINNUMERO}`, user.puhelinnumero, {
      shouldValidate: true,
    });
  }

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
          required
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <UserSearchInput
          fieldName={`${contactType}.${index}.${CONTACT_FORMFIELD.NIMI}`}
          id={`${contactType}-${index}`}
          required
          hankeUsers={hankeUsers}
          onUserSelect={handleUserSelect}
          isPublic={!isPrivatePerson}
        />
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.TUNNUS}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.TUNNUS}`)}
          disabled={registryKeyInputDisabled}
          required={!registryKeyInputDisabled}
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.EMAIL}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.EMAIL}`)}
          required
        />
        <TextInput
          name={`${contactType}.${index}.${CONTACT_FORMFIELD.PUHELINNUMERO}`}
          label={t(`form:yhteystiedot:labels:${CONTACT_FORMFIELD.PUHELINNUMERO}`)}
        />
      </ResponsiveGrid>
    </Box>
  );
};

const HankeFormYhteystiedot: React.FC<Readonly<FormProps>> = ({ hanke }) => {
  const queryClient = useQueryClient();
  const { getValues, setValue } = useFormContext<HankeDataFormState>();
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: hankeUsers } = useHankeUsers(hanke.hankeTunnus);

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
    appendOmistaja(getEmptyContact(), { shouldFocus: true });
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

    void queryClient.invalidateQueries(['hankeUsers', hanke.hankeTunnus]);
  }

  function handleMuuTahoUserSelect(user: HankeUser, index: number) {
    setValue(`${FORMFIELD.MUUTTAHOT}.${index}.${CONTACT_FORMFIELD.EMAIL}`, user.sahkoposti, {
      shouldValidate: true,
    });
    setValue(
      `${FORMFIELD.MUUTTAHOT}.${index}.${CONTACT_FORMFIELD.PUHELINNUMERO}`,
      user.puhelinnumero,
      {
        shouldValidate: true,
      },
    );
  }

  return (
    <div className="form2">
      <Text tag="p" styleAs="body-m" spacingBottom="s">
        {t(`form:yhteystiedot:instructions`)}
      </Text>
      <Text tag="p" styleAs="body-m" spacingBottom="s">
        {t(`form:requiredForPublicationInstruction`)}
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
            <FormContact<HankeContactTypeKey, HankeYhteyshenkilo>
              name={`${HANKE_CONTACT_TYPE.OMISTAJAT}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.OMISTAJAT}
              hankeTunnus={hanke.hankeTunnus!}
              hankeUsers={hankeUsers}
              mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
              mapValueToLabel={mapHankeYhteyshenkiloToLabel}
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
          className="haitaton-button-icon-size-initial"
          variant={ButtonVariant.Supplementary}
          iconStart={<IconPlusCircle />}
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
            <FormContact<HankeContactTypeKey, HankeYhteyshenkilo>
              name={`${HANKE_CONTACT_TYPE.RAKENNUTTAJAT}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.RAKENNUTTAJAT}
              hankeTunnus={hanke.hankeTunnus!}
              hankeUsers={hankeUsers}
              mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
              mapValueToLabel={mapHankeYhteyshenkiloToLabel}
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
          className="haitaton-button-icon-size-initial"
          variant={ButtonVariant.Supplementary}
          iconStart={<IconPlusCircle />}
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
            <FormContact<HankeContactTypeKey, HankeYhteyshenkilo>
              name={`${HANKE_CONTACT_TYPE.TOTEUTTAJAT}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.TOTEUTTAJAT}
              hankeTunnus={hanke.hankeTunnus!}
              hankeUsers={hankeUsers}
              mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
              mapValueToLabel={mapHankeYhteyshenkiloToLabel}
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
          className="haitaton-button-icon-size-initial"
          variant={ButtonVariant.Supplementary}
          iconStart={<IconPlusCircle />}
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
            <FormContact<HankeContactTypeKey, HankeYhteyshenkilo>
              name={`${HANKE_CONTACT_TYPE.MUUTTAHOT}.${index}.${CONTACT_FORMFIELD.YHTEYSHENKILOT}`}
              key={item.id}
              contactType={HANKE_CONTACT_TYPE.MUUTTAHOT}
              hankeTunnus={hanke.hankeTunnus!}
              hankeUsers={hankeUsers}
              mapHankeUserToValue={mapHankeUserToHankeYhteyshenkilo}
              mapValueToLabel={mapHankeYhteyshenkiloToLabel}
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
                    required
                  />
                </ResponsiveGrid>
                <ResponsiveGrid>
                  <UserSearchInput
                    fieldName={`${fieldPath}.${CONTACT_FORMFIELD.NIMI}`}
                    id={`${HANKE_CONTACT_TYPE.MUUTTAHOT}-${index}`}
                    required
                    hankeUsers={hankeUsers}
                    onUserSelect={(user) => handleMuuTahoUserSelect(user, index)}
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
            </FormContact>
          );
        })}

        <Button
          className="haitaton-button-icon-size-initial"
          variant={ButtonVariant.Supplementary}
          iconStart={<IconPlusCircle />}
          onClick={() => appendMuuTaho(getEmptyOtherContact())}
        >
          {t('form:yhteystiedot:titles:lisaaMuuTaho')}
        </Button>
      </Accordion>
    </div>
  );
};

export default HankeFormYhteystiedot;
