import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextArea as HdsTextArea } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { getInputErrorText } from '../../utils/form';

type Props = {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  shouldUnregister?: boolean;
  className?: string;
  testId?: string;
};

const TextArea: React.FC<Props> = ({
  name,
  label,
  disabled,
  required,
  placeholder,
  helperText,
  shouldUnregister,
  className,
  testId,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
        return (
          <HdsTextArea
            id={name}
            name={name}
            className={className}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            invalid={Boolean(error)}
            data-testid={testId}
            required={required}
            disabled={disabled}
            errorText={getInputErrorText(t, error)}
            ref={ref}
          />
        );
      }}
    />
  );
};

export default TextArea;
