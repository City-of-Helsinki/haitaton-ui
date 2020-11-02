import React from 'react';

const Form2: React.FC<any> = (props) => {
  return (
    <div className="form2">
      <h2>Hankkeen yhteystiedot</h2>
      <button type="button" onClick={(e) => props.parentCallback(1)}>
        back
      </button>
      <button type="button" onClick={(e) => props.parentCallback(3)}>
        next
      </button>
    </div>
  );
};
export default Form2;
