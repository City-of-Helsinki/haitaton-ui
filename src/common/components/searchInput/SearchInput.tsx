import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { SearchInput as HDSSearchInput, Notification, SearchInputProps } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { getInputErrorText } from '../../utils/form';
import styles from './SearchInput.module.scss';

type Props = {
  id: string;
  name: string;
  defaultValue?: string;
};

export default function SearchInput<T>({
  id,
  name,
  defaultValue = '',
  ...searchInputProps
}: Readonly<Props & SearchInputProps<T>>) {
  const { t } = useTranslation();
  const inputClassName = `search-input-${id}`;
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
  const {
    field,
    fieldState: { error },
  } = useController({ name, defaultValue });
  const errorText = getInputErrorText(t, error);

  useEffect(() => {
    setInputElement(document.querySelector(`.${inputClassName} input`) as HTMLInputElement);
  }, [inputClassName]);

  useEffect(() => {
    if (inputElement) {
      inputElement.addEventListener('blur', field.onBlur);
      field.ref(inputElement);
      inputElement.setAttribute('id', name);
    }

    return function cleanup() {
      if (inputElement) {
        inputElement.removeEventListener('blur', field.onBlur);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputElement]);

  return (
    <Box>
      <HDSSearchInput
        {...searchInputProps}
        onChange={field.onChange}
        value={field.value || ''}
        clearButtonAriaLabel={t('common:components:multiselect:clear')}
        className={clsx(inputClassName, {
          [styles.searchInputInvalid]: errorText !== undefined,
        })}
      />
      {errorText !== undefined && (
        <Notification
          type="error"
          label={t('form:validations:default')}
          size="small"
          className={styles.errorNotification}
        >
          {errorText}
        </Notification>
      )}
    </Box>
  );
}
