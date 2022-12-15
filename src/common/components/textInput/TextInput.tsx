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
  placeholder?: string;
  helperText?: string;
  shouldUnregister?: boolean;
};

const TextInput: React.FC<PropTypes> = ({
  name,
  label,
  disabled,
  tooltip,
  required,
  placeholder,
  helperText,
  shouldUnregister,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
        <HdsTextInput
          id={name}
          name={name}
          label={label || t(`hankeForm:labels:${name}`)}
          value={value || ''}
          helperText={helperText}
          placeholder={placeholder}
          errorText={isTouched ? getInputErrorText(t, error) : undefined}
          invalid={isTouched && Boolean(error)}
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
