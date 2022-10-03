import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput, Checkbox } from 'hds-react';
import Autocomplete, { Option } from '../../../../common/components/autocomplete/Autocomplete';
import { HankeContactKey, HankeContact } from '../../../types/hanke';
import { Organization } from '../types';

type Props = {
  contactType: HankeContactKey;
  organizations: Organization[];
  isOwnOrganization: boolean;
  index?: number;
};

const OrganizationSelect: React.FC<Props> = ({
  contactType,
  organizations,
  isOwnOrganization,
  index = 0,
}) => {
  const [isOwn, setIsOwn] = useState(isOwnOrganization);
  const { t } = useTranslation();
  const { setValue, watch, register } = useFormContext();
  const contactData: HankeContact | null = watch(`${contactType}.${index}`);

  useEffect(() => {
    // Clear selections when changing from selected to own
    if (isOwn && contactData && contactData.organisaatioId !== null) {
      setValue(`${contactType}[${index}].organisaatioId`, null);
      setValue(`${contactType}[${index}].organisaatioNimi`, '');
    }
  }, [isOwn, contactType, index, contactData, setValue]);

  if (!contactData) {
    return null;
  }

  return (
    <div>
      <Autocomplete
        id={`${contactType}-${index}-organizationAutocomplete`}
        className="formItem"
        label={t(`hankeForm:labels:organisaatio`)}
        options={organizations.map((v) => ({
          value: v.id,
          label: v.nimi,
        }))}
        disabled={isOwn}
        value={
          isOwn
            ? null
            : {
                label: contactData.organisaatioNimi || '',
                value: contactData.organisaatioId || null,
              }
        }
        onChange={(option?: Option): void => {
          if (option === null) {
            setValue(`${contactType}[${index}].organisaatioId`, null);
            setValue(`${contactType}[${index}].organisaatioNimi`, '');
          }
          if (option) {
            setValue(`${contactType}[${index}].organisaatioId`, option.value);
            setValue(`${contactType}[${index}].organisaatioNimi`, option.label);
          }
        }}
      />
      <Checkbox
        id={`${contactType}.${index}.isOmaOrganisaatio`}
        label={t(`hankeForm:labels:omaOrganisaatio`)}
        checked={isOwn}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIsOwn(e.target.checked);
        }}
        data-testid={`${contactType}.${index}.isOmaOrganisaatio`}
      />
      <Controller
        name={`${contactType}.${index}.organisaatioNimi`}
        defaultValue={isOwn ? contactData.organisaatioNimi : ''}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className="formItem"
            {...register(`${contactType}.${index}.organisaatioNimi`)}
            label={t(`hankeForm:labels:insertOmaOrganisaatio`)}
            id={`${contactType}.${index}.organisaatioNimi`}
            data-testid={`${contactType}.${index}.organisaatioNimi`}
            disabled={!isOwn}
            value={isOwn ? value : ''}
            onChange={onChange}
          />
        )}
      />
    </div>
  );
};

export default OrganizationSelect;
