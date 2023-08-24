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
  readOnly?: boolean;
  tooltip?: TooltipProps;
  placeholder?: string;
  helperText?: string;
  shouldUnregister?: boolean;
  className?: string;
};

const TextInput: React.FC<React.PropsWithChildren<PropTypes>> = ({
  name,
  label,
  disabled,
  tooltip,
  required,
  readOnly,
  placeholder,
  helperText,
  shouldUnregister,
  className,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onBlur, onChange, ref }, fieldState: { error } }) => (
        <HdsTextInput
          id={name}
          className={className}
          label={label || t(`hankeForm:labels:${name}`)}
          value={value || ''}
          helperText={helperText}
          placeholder={placeholder}
          errorText={getInputErrorText(t, error)}
          invalid={Boolean(error)}
          disabled={disabled}
          data-testid={name}
          required={required}
          readOnly={readOnly}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          {...tooltip}
        />
      )}
    />
  );
};

export default TextInput;
