import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { SearchInput as HDSSearchInput, Notification, SearchInputProps } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { getInputErrorText } from '../../utils/form';
import styles from './SearchInput.module.scss';

type Props = {
  name: string;
  id: string;
};

export default function SearchInput<T>({
  name,
  id,
  ...searchInputProps
}: Readonly<Props & SearchInputProps<T>>) {
  const { t } = useTranslation();
  const inputClassName = `search-input-${id}`;
  const [inputElement] = useState(
    () => document.querySelector(`.${inputClassName} input`) as HTMLInputElement | null,
  );
  console.log('inputElement', inputElement);
  // const inputElement = document.querySelector(
  //   `.${inputClassName} input`,
  // ) as HTMLInputElement | null;
  const {
    field,
    fieldState: { error },
  } = useController({ name });
  const errorText = getInputErrorText(t, error);

  useEffect(() => {
    if (inputElement) {
      console.log('Adding event listener');
      inputElement.addEventListener('blur', field.onBlur);
      field.ref(inputElement);
    }

    return function cleanup() {
      if (inputElement) {
        console.log('Removing event listener');
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
        value={field.value}
        clearButtonAriaLabel={t('common:components:multiselect:clear')}
        className={clsx(inputClassName, {
          [styles.searchInputInvalid]: errorText !== undefined,
        })}
      />
      {errorText !== undefined && (
        <Notification
          type="error"
          label={t('form:validations:defined')}
          size="small"
          className={styles.errorNotification}
        >
          {errorText}
        </Notification>
      )}
    </Box>
  );
  // return (
  //   <Controller
  //     name={name}
  //     render={({ field, fieldState: { error } }) => {
  //       // Pitäisikö laittaa useEffectiin, että voisi removeEventListenerin?
  //       // Pitäisi varmaan käyttää useControlleria, jotta voisi tehdä sen.
  //       if (inputElement && !inputRegistered.current) {
  //         inputElement.addEventListener('blur', field.onBlur);
  //         field.ref(inputElement);
  //         inputRegistered.current = true;
  //       }

  //       const errorText = getInputErrorText(t, error);

  //       return (
  //         <Box>
  //           <HDSSearchInput
  //             {...searchInputProps}
  //             onChange={field.onChange}
  //             value={field.value}
  //             clearButtonAriaLabel={t('common:components:multiselect:clear')}
  //             className={clsx(inputClassName, {
  //               [styles.searchInputInvalid]: errorText !== undefined,
  //             })}
  //           />
  //           {errorText !== undefined && (
  //             <Notification
  //               type="error"
  //               label={t('form:validations:defined')}
  //               size="small"
  //               className={styles.errorNotification}
  //             >
  //               {errorText}
  //             </Notification>
  //           )}
  //         </Box>
  //       );
  //     }}
  //   />
  // );
}
