import React from 'react';
import { useTranslation } from 'react-i18next';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type PropTypes = {
  formPage: number;
};

const StateIndicator: React.FC<PropTypes> = ({ formPage }) => {
  const { t } = useTranslation();

  const wizardStateData = [
    { label: t('hankeForm:perustiedotForm:header'), formPage: 0 },
    { label: t('hankeForm:hankkeenAlueForm:header'), formPage: 1 },
    { label: t('hankeForm:hankkeenYhteystiedotForm:header'), formPage: 2 },
    { label: t('hankeForm:tyomaanTiedotForm:header'), formPage: 3 },
    { label: t('hankeForm:hankkeenHaitatForm:header'), formPage: 4 },
  ];

  return (
    <ol className="hankeForm__indicator">
      {wizardStateData.map((val, i) => {
        let parentClasses = formPage === i ? 'hankeForm__indicator--selectedWpr' : '';
        parentClasses += formPage >= i ? ' hankeForm__indicator--color' : '';
        return (
          <li key={val.label} className={parentClasses}>
            {formPage > i && <p className="hankeForm__indicator--visuallyHidden">Completed: </p>}
            {formPage === i ? (
              <>
                <p className="hankeForm__indicator--visuallyHidden">Current: </p>
                <CircleSelected />
              </>
            ) : (
              <Circle />
            )}
            <span className="hankeForm__indicator__contentWpr">{val.label}</span>
            <div className="line" />
          </li>
        );
      })}
    </ol>
  );
};
export default StateIndicator;
