import React from 'react';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'hds-react';
type Option = { value: string; label: string };
type PropTypes = {
  name: string;
  id: string;
  control: any;
  defaultValue: any;
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
