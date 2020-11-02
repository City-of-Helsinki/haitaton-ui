import React from 'react';

const Form3: React.FC<any> = (props) => {
  return (
    <div className="form3">
      <h2>Työmaan tiedot</h2>
      <button type="button" onClick={(e) => props.parentCallback(2)}>
        back
      </button>
      <button type="button" onClick={(e) => props.parentCallback(4)}>
        next
      </button>
    </div>
  );
};
export default Form3;
