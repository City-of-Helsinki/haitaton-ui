import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Combobox, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { TooltipProps } from '../../types/tooltip';

import './dropDown.styles.scss';

type Option = { value: string; label: string };

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string[];
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
};

const Dropdown: React.FC<PropTypes> = ({
  name,
  id,
  control,
  rules,
  options,
  defaultValue,
  label,
  invalid,
  errorMsg,
  tooltip,
}) => {
  const { t } = useTranslation();
  return (
    <div className="dropdownComp">
      {!!tooltip && <Tooltip {...tooltip} />}

      <Controller
        name={name}
        id={id}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, value }) => {
          return (
            <Combobox<Option>
              options={options}
              label={label}
              invalid={invalid}
              defaultValue={value && options.filter((o) => value.includes(o.value))}
              onChange={(option: Option[]) => onChange(option.map((o) => o.value))}
              toggleButtonAriaLabel={t('common:components:multiselect:toggle')}
              selectedItemRemoveButtonAriaLabel={t('common:components:multiselect:removeSelected')}
              clearButtonAriaLabel={t('common:components:multiselect:clear')}
              multiselect
            />
          );
        }}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </div>
  );
};

export default Dropdown;
