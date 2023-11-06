import React, { useState } from 'react';
import { Coordinate } from 'ol/coordinate';
import clsx from 'clsx';
import styles from './AddressSearchContainer.module.scss';
import AddressSearch from './AddressSearch';
import useCenterOnCoordinate from '../../hooks/useCenterOnCoordinate';

type PositionType = number | string;

type Props = {
  position?: {
    top?: PositionType;
    left?: PositionType;
    right?: PositionType;
    bottom?: PositionType;
  };
  zIndex?: number;
  className?: string;
};

const AddressSearchContainer: React.FC<React.PropsWithChildren<Props>> = ({
  position,
  zIndex,
  className,
}) => {
  const [addressCoordinate, setAddressCoordinate] = useState<Coordinate | undefined>();
  useCenterOnCoordinate(addressCoordinate);

  function handleAddressSelect(coordinate: Coordinate | undefined) {
    setAddressCoordinate(coordinate);
  }

  return (
    <div
      className={clsx([styles.container, className])}
      style={{
        top: position?.top,
        left: position?.left,
        right: position?.right,
        bottom: position?.bottom,
        zIndex,
      }}
    >
      <AddressSearch onAddressSelect={handleAddressSelect} />
    </div>
  );
};

export default AddressSearchContainer;
