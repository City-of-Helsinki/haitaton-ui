import React from 'react';
import { Button } from 'hds-react';

// eslint-disable-next-line
const Form4: React.FC<any> = (props) => {
  return (
    <div className="form4">
      <h2>Hankkeen haitat</h2>
      <Button type="button" onClick={(e) => props.parentCallback(3)}>
        back
      </Button>
      <Button type="button">Save</Button>
    </div>
  );
};
export default Form4;
