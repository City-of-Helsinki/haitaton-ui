import { Combobox } from 'hds-react';
import { uniqBy } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
  name: string;
  options: string[];
  label: ReactNode;
  helperText?: string;
  placeholder?: string;
  className?: string;
  pattern?: RegExp;
  errorText?: string;
  uppercase?: boolean;
};

/**
 * Combobox variant with possibility
 * to add new options by typing them to text input
 */
export default function InputCombobox({
  id,
  name,
  options,
  label,
  helperText,
  placeholder,
  className,
  pattern,
  errorText,
  uppercase,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setValue, getValues } = useFormContext();
  const [rendered, setRendered] = useState(false);
  const [valid, setValid] = useState(true);
  const [comboboxOptions, setComboboxOptions] = useState(
    options.map((option) => ({ label: option })),
  );
  const inputElement = document.getElementById(`${id}-input`) as HTMLInputElement | null;

  useEffect(() => {
    if (!rendered) {
      setRendered(true);
    }

    // Handle adding new values to the options list
    // when user types to the text input and hits Enter
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        let inputValue = (event.target as HTMLInputElement | null)?.value;
        if (uppercase) {
          inputValue = inputValue?.toUpperCase();
        }
        if (inputValue) {
          const inputValid = pattern?.test(inputValue) ?? true;
          if (inputValid) {
            setComboboxOptions((prevOptions) =>
              uniqBy(prevOptions.concat({ label: inputValue! }), 'label'),
            );
            setValue(name, getValues(name)?.concat(inputValue), { shouldDirty: true });
          }
          setValid(inputValid);
        }
      }
    };

    inputElement?.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      inputElement?.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputElement, rendered, getValues, setValue, name, pattern, uppercase]);

  return (
    <Controller
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <Combobox<{ label: string }>
            className={className}
            helper={helperText}
            id={id}
            label={label}
            multiselect
            value={value.map((val: string) => ({ label: val }))}
            onChange={(updatedValue) => onChange(updatedValue.map((val) => val.label))}
            onBlur={onBlur}
            options={comboboxOptions}
            placeholder={placeholder}
            toggleButtonAriaLabel={t('common:components:multiselect:toggle')}
            selectedItemRemoveButtonAriaLabel={t('common:components:multiselect:removeSelected')}
            clearButtonAriaLabel={t('common:components:multiselect:clear')}
            invalid={!valid}
            error={errorText}
          />
        );
      }}
    />
  );
}
