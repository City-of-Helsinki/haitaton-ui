import React, { useState } from 'react';
import Indicator from './indicator';
import FormViewer from './FormViewer';

import './Form.styles.scss';

const FormComponent: React.FC = (props) => {
  const dummyData = [
    { label: 'Hankkeen perustiedot', view: 0 },
    { label: 'Hankkeen alue', view: 1 },
    { label: 'Hankkeen yhteystiedot', view: 2 },
    { label: 'Työmaan tiedot', view: 3 },
    { label: 'Hankkeen haitat', view: 4 },
  ];
  const [viewStatus, setviewStatus] = useState(0);
  return (
    <div className="hankeForm">
      <h1>Hanke</h1>
      <div className="hankeForm__formWpr">
        <Indicator dataList={dummyData} view={viewStatus} />
        <FormViewer parentCallback={setviewStatus} view={viewStatus} />
      </div>
    </div>
  );
};
export default FormComponent;
