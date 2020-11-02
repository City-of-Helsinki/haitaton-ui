import React from 'react';
import { Button } from 'hds-react';

// eslint-disable-next-line
const Form2: React.FC<any> = (props) => {
  return (
    <div className="form2">
      <h2>Hankkeen yhteystiedot</h2>
      <Button type="button" onClick={(e) => props.parentCallback(1)}>
        back
      </Button>
      <Button type="button" onClick={(e) => props.parentCallback(3)}>
        next
      </Button>
    </div>
  );
};
export default Form2;
