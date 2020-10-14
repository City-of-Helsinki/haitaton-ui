import React from 'react';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'hds-react';

type propTypes = {
  name: string;
  id: string;
  control: any;
  defaultValue: any;
  label: string;
  options: any;
};
const DropdownComp: React.FC<propTypes> = (props) => {
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
