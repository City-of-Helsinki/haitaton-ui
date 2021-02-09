import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { TextInput, Checkbox } from 'hds-react';
import { useTypedController } from '@hookform/strictly-typed';
import Autocomplete, { Option } from '../../../common/components/autocomplete/Autocomplete';
import { HankeContactKey, HankeContact } from '../../types/hanke';
import { HankeDataFormState, Organization } from './types';

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
  const { setValue, watch, register, control } = useFormContext();
  const TypedController = useTypedController<HankeDataFormState>({ control });
  const contactData: HankeContact | undefined = watch(`${contactType}[${index}]`);

  useEffect(() => {
    // Clear selections when changing from selected to own
    if (isOwn && contactData && contactData.organisaatioId !== null) {
      setValue(`${contactType}[${index}].organisaatioId`, null);
      setValue(`${contactType}[${index}].organisaatioNimi`, '');
    }
  }, [isOwn]);

  if (!contactData) {
    return null;
  }

  return (
    <div>
      <Autocomplete
        className="formItem"
        label={t(`hankeForm:labels:organisaatio`)}
        options={organizations.map((v) => ({
          value: v.id,
          label: v.nimi,
        }))}
        disabled={isOwn}
        defaultValue={
          isOwn
            ? {
                label: '',
                value: undefined,
              }
            : {
                label: contactData.organisaatioNimi || '',
                value: contactData.organisaatioId || undefined,
              }
        }
        onChange={(option?: Option): void => {
          if (option) {
            setValue(`${contactType}[${index}].organisaatioId`, option.value);
            setValue(`${contactType}[${index}].organisaatioNimi`, option.label);
          }
        }}
      />
      <Checkbox
        id={`${contactType}-isOwnOrganization`}
        label={t(`hankeForm:labels:omaOrganisaatio`)}
        checked={isOwn}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIsOwn(e.target.checked);
        }}
        data-testid={`${contactType}-isOmaOrganisaatio`}
      />
      <TypedController
        name={[contactType, index, 'organisaatioNimi']}
        defaultValue={isOwn ? contactData.organisaatioNimi : ''}
        render={({ value, onChange }) => (
          <TextInput
            className="formItem"
            label={t(`hankeForm:labels:InsertOmaOrganisaatio`)}
            id={`${contactType}-organisaatioNimi`}
            name={`${contactType}-organisaatioNimi`}
            data-testid={`${contactType}-organisaatioNimi`}
            ref={register}
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
