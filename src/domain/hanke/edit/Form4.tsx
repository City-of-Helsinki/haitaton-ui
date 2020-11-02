import React from 'react';

const Form4: React.FC<any> = (props) => {
  return (
    <div className="form4">
      <h2>Hankkeen haitat</h2>
      <button type="button" onClick={(e) => props.parentCallback(3)}>
        back
      </button>
      <button type="button">Save</button>
    </div>
  );
};
export default Form4;
