import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Dropdown } from 'hds-react';

type Option = { value: string; label: string };
// eslint-disable-next-line
type OptionDefault = { value: string; label: string } | any;
/*
type OptionType = {
  [key: string]: any;
};
*/
type PropTypes = {
  name: string;
  id: string;
  control: Control;
  defaultValue?: OptionDefault;
  label: string;
  options: Array<Option>;
};

const DropdownComp: React.FC<PropTypes> = (props) => {
  const { name, id, control, options, defaultValue, label } = props;
  return (
    <Controller
      name={name}
      id={id}
      control={control}
      defaultValue={defaultValue}
      render={({ onChange }) => (
        <Dropdown options={options} defaultValue={defaultValue} label={label} onChange={onChange} />
      )}
    />
  );
};
export default DropdownComp;
