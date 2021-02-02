import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { TextInput, Checkbox } from 'hds-react';
import { useTypedController } from '@hookform/strictly-typed';
import Autocomplete, { Option } from '../../../common/components/autocomplete/Autocomplete';
import { HANKE_CONTACT_TYPE_VAL } from '../../types/hanke';
import { HankeDataFormState } from './types';

type Organization = {
  id: number;
  nimi: string;
  tunnus: string;
};

type Props = {
  contactType: HANKE_CONTACT_TYPE_VAL;
  formData: HankeDataFormState;
  organizations: Organization[];
};

const OrganizationSelect: React.FC<Props> = ({ contactType, formData, organizations }) => {
  const initialContactData = formData[contactType] && formData[contactType][0];
  const [isOwn, setIsOwn] = useState(
    initialContactData?.organisaatioId === null && initialContactData?.organisaatioNimi.length > 0
  );
  const { t } = useTranslation();
  const { setValue, watch, register, control } = useFormContext();
  const TypedController = useTypedController<HankeDataFormState>({ control });

  const contactData = watch(`${contactType}[0]`);

  // console.log({ contactType, formData, contactData });

  useEffect(() => {
    if (isOwn) {
      setValue(`${contactType}[0].organisaatioId`, null);
    }
  }, [isOwn]);

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
          !isOwn
            ? {
                label: contactData?.organisaatioNimi || '',
                value: contactData?.organisaatioId || undefined,
              }
            : {
                label: '',
                value: undefined,
              }
        }
        onChange={(option?: Option): void => {
          if (option) {
            setValue(`${contactType}[0].organisaatioId`, option.value);
            setValue(`${contactType}[0].organisaatioNimi`, option.label);
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
        name={[contactType, 0, 'organisaatioNimi']}
        defaultValue={isOwn && contactData?.organisaatioNimi ? contactData.organisaatioNimi : ''}
        render={({ value, onChange }) => (
          <TextInput
            className="formItem"
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

export default React.memo(OrganizationSelect, () => true);
