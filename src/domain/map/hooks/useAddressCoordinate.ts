import { useEffect, useState } from 'react';
import { Coordinate } from 'ol/coordinate';
import { doAddressSearch } from '../utils';

/**
 * Get coordinate for given address
 * @param address Address to get coordinates for
 * @returns Coordinate for address
 */
function useAddressCoordinate(address?: string | null) {
  const [addressCoordinate, setAddressCoordinate] = useState<Coordinate | undefined>();

  useEffect(() => {
    if (address) {
      doAddressSearch(address).then(({ data }) => {
        setAddressCoordinate(data.features[0]?.geometry.coordinates);
      });
    }
  }, [address]);

  return addressCoordinate;
}

export default useAddressCoordinate;
