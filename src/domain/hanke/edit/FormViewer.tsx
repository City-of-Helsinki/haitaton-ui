import React, { Dispatch, SetStateAction } from 'react';

import Form0 from './Form0';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

interface IProps {
  view: number;
  changeWizardView: Dispatch<SetStateAction<number>>;
}
// eslint-disable-next-line
const FormViewer: React.FC<IProps> = (props) => {
  const { view, changeWizardView } = props;
  return (
    <div className="hankeForm__formWprRight">
      {view === 0 && <Form0 changeWizardView={changeWizardView} />}
      {view === 1 && <Form1 changeWizardView={changeWizardView} />}
      {view === 2 && <Form2 changeWizardView={changeWizardView} />}
      {view === 3 && <Form3 changeWizardView={changeWizardView} />}
      {view === 4 && <Form4 changeWizardView={changeWizardView} />}
    </div>
  );
};
export default FormViewer;
