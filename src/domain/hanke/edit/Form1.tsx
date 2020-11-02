import React from 'react';

const Form1: React.FC<any> = (props) => {
  return (
    <div className="form1">
      <h2>Hankkeen alue</h2>
      <button type="button" onClick={(e) => props.parentCallback(0)}>
        back
      </button>
      <button type="button" onClick={(e) => props.parentCallback(2)}>
        next
      </button>
    </div>
  );
};
export default Form1;
