import React from 'react';
import { Button } from 'hds-react';

const Form3: React.FC<any> = (props) => {
  return (
    <div className="form3">
      <h2>Työmaan tiedot</h2>
      <Button type="button" onClick={(e) => props.parentCallback(2)}>
        back
      </Button>
      <Button type="button" onClick={(e) => props.parentCallback(4)}>
        next
      </Button>
    </div>
  );
};
export default Form3;
