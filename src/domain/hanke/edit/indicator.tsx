import React from 'react';
import Circle from '../../../common/components/icons/Circle';
import CircleSelected from '../../../common/components/icons/CircleSelected';

type List = { label: string; view: number };

type PropTypes = {
  view: number;
  dataList: Array<List>;
};

const Indicator: React.FC<PropTypes> = (props) => {
  const { dataList, view } = props;
  return (
    <ol className="hankeForm__indicator">
      {dataList.map((val, i) => {
        let parentClasses = view === i ? 'hankeForm__indicator--selectedWpr' : '';
        parentClasses += view >= i ? ' hankeForm__indicator--color' : '';
        return (
          <li key={val.label} className={parentClasses}>
            {view > i && <p className="hankeForm__indicator--visuallyHidden">Complited: </p>}

            {view === i ? (
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
export default Indicator;
