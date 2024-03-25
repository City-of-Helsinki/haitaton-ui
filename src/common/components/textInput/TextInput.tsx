import React, { CSSProperties } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput as HdsTextInput } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from '../../types/tooltip';

import { getInputErrorText } from '../../utils/form';

type PropTypes = {
  name: string;
  label?: string;
  maxLength?: number | undefined;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  tooltip?: TooltipProps;
  placeholder?: string;
  helperText?: string;
  shouldUnregister?: boolean;
  className?: string;
  style?: CSSProperties;
  autoComplete?: string;
  defaultValue?: string;
};

const TextInput: React.FC<React.PropsWithChildren<PropTypes>> = ({
  name,
  label,
  maxLength = undefined,
  disabled,
  tooltip,
  required,
  readOnly,
  placeholder,
  helperText,
  shouldUnregister,
  className,
  style,
  autoComplete,
  defaultValue = '',
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onBlur, onChange, ref }, fieldState: { error } }) => (
        <HdsTextInput
          id={name}
          className={className}
          style={style}
          label={label || t(`hankeForm:labels:${name}`)}
          value={value || ''}
          maxLength={maxLength}
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
          autoComplete={autoComplete}
          {...tooltip}
        />
      )}
    />
  );
};

export default TextInput;
