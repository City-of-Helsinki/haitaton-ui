import React from 'react';
import { Controller } from 'react-hook-form';
import { FileInput as HDSFileInput } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../../types/language';

type Props = {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  buttonLabel?: string;
};

const FileInput: React.FC<Props> = ({ name, label, accept, multiple, buttonLabel }) => {
  const { i18n } = useTranslation();

  return (
    <Controller
      name={name}
      render={({ field: { onChange } }) => {
        return (
          <HDSFileInput
            id={name}
            accept={accept}
            multiple={multiple}
            buttonLabel={buttonLabel}
            label={label}
            language={i18n.language as Language}
            onChange={onChange}
          />
        );
      }}
    />
  );
};

export default FileInput;
