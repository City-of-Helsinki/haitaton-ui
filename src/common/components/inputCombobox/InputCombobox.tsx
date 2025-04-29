import { Select, SupportedLanguage, defaultFilter } from 'hds-react';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
  name: string;
  options: string[];
  label: string;
  helperText?: string;
  placeholder?: string;
  filterPlaceholder?: string;
  filterWithAnotherTerm?: string;
  className?: string;
  pattern?: RegExp;
  errorText?: string;
  uppercase?: boolean;
  required?: boolean;
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
  filterPlaceholder,
  filterWithAnotherTerm,
  className,
  pattern,
  errorText,
  uppercase,
  required,
}: Readonly<Props>) {
  const { i18n } = useTranslation();
  const { setValue, getValues } = useFormContext();
  const [rendered, setRendered] = useState(false);
  const [valid, setValid] = useState(true);
  const [comboboxOptions, setComboboxOptions] = useState(
    options.map((option) => ({ label: option })),
  );
  const inputElement = document.getElementById(`${id}-input-element`) as HTMLInputElement | null;

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
          <Select
            texts={{
              language: i18n.language as SupportedLanguage,
              assistive: helperText,
              label,
              placeholder,
              error: errorText,
              filterPlaceholder,
              filterWithAnotherTerm,
            }}
            className={className}
            style={{ maxWidth: 'none' }}
            id={id}
            multiSelect
            value={value.map((val: string) => ({ label: val }))}
            onChange={(updatedValue) => onChange(updatedValue.map((val) => val.label))}
            onBlur={onBlur}
            options={comboboxOptions}
            invalid={!valid}
            required={required}
            filter={defaultFilter}
          />
        );
      }}
    />
  );
}
