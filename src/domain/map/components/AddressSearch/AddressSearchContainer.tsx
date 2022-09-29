import React, { useState } from 'react';
import { Coordinate } from 'ol/coordinate';
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
};

const AddressSearchContainer: React.FC<Props> = ({ position, zIndex }) => {
  const [addressCoordinate, setAddressCoordinate] = useState<Coordinate | undefined>();
  useCenterOnCoordinate(addressCoordinate);

  function handleAddressSelect(coordinate: Coordinate | undefined) {
    setAddressCoordinate(coordinate);
  }

  return (
    <div
      className={styles.container}
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
