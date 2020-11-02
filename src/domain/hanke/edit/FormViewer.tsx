import React from 'react';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

// eslint-disable-next-line
const FormViewer: React.FC<any> = (props) => {
  const { view, parentCallback } = props;
  return (
    <div className="hankeForm__formWprRight">
      {view === 0 && <Form0 parentCallback={parentCallback} />}
      {view === 1 && <Form1 parentCallback={parentCallback} />}
      {view === 2 && <Form2 parentCallback={parentCallback} />}
      {view === 3 && <Form3 parentCallback={parentCallback} />}
      {view === 4 && <Form4 parentCallback={parentCallback} />}
    </div>
  );
};
export default FormViewer;
