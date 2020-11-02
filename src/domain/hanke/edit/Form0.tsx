import React from 'react';

const Form0: React.FC<any> = (props) => {
  return (
    <div className="form0">
      <h2>Hankkeen perustiedot</h2>
      <button type="button" onClick={(e) => props.parentCallback(1)}>
        next
      </button>
    </div>
  );
};
export default Form0;
