import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput as HdsTextInput } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from '../../types/tooltip';
import { getInputErrorText } from '../../utils/form';

type PropTypes = {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  tooltip?: TooltipProps;
};

const TextInput: React.FC<PropTypes> = ({ name, label, disabled, tooltip, required }) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { onChange, onBlur, value } }) => (
        <HdsTextInput
          id={name}
          name={name}
          label={label || t(`hankeForm:labels:${name}`)}
          value={value}
          helperText={getInputErrorText(t, errors, name)}
          invalid={!!errors[name]}
          onBlur={onBlur}
          onChange={onChange}
          disabled={disabled}
          data-testid={name}
          required={required}
          {...tooltip}
        />
      )}
    />
  );
};

export default TextInput;
