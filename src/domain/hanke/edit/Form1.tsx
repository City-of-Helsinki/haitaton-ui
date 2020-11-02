import React from 'react';
import { Button } from 'hds-react';

// eslint-disable-next-line
const Form1: React.FC<any> = (props) => {
  return (
    <div className="form1">
      <h2>Hankkeen alue</h2>
      <Button type="button" onClick={(e) => props.parentCallback(0)}>
        back
      </Button>
      <Button type="button" onClick={(e) => props.parentCallback(2)}>
        next
      </Button>
    </div>
  );
};
export default Form1;
