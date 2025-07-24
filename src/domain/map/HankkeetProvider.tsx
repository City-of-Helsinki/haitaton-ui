import React, { useMemo, useEffect, useState } from 'react';
import api from '../api/api';
import HankkeetContext from './HankkeetProviderContext';
import { PublicHankeMinimal, toHankeDataMinimal } from '../types/hanke';
import {
  useMapViewportBounds,
  ViewportBounds,
} from '../../common/components/map/hooks/useMapViewportBounds';
import { useHankeCache } from './hooks/useHankeCache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertArrayToObject = (array: any[], key: string) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

type HankkeetProviderProps = {
  children: React.ReactNode;
};

const HankkeetProvider: React.FC<HankkeetProviderProps> = ({ children }) => {
  const viewportBounds = useMapViewportBounds();
  const { getMissingViewportAreas, addToCache, getCachedDataForViewport, cacheStats } =
    useHankeCache();

  const [combinedData, setCombinedData] = useState<PublicHankeMinimal[]>([]);

  // Function to fetch data for specific bounds
  const fetchPublicHankkeet = async (bounds: ViewportBounds): Promise<PublicHankeMinimal[]> => {
    const params = new URLSearchParams({
      minX: bounds.minX.toString(),
      maxX: bounds.maxX.toString(),
      minY: bounds.minY.toString(),
      maxY: bounds.maxY.toString(),
    });
    const response = await api.get<PublicHankeMinimal[]>(`/public-hankkeet?${params.toString()}`);
    return response.data;
  };

  // Effect to handle viewport changes and cache management
  useEffect(() => {
    if (!viewportBounds) return;

    // Get cached data for current viewport immediately
    const cachedData = getCachedDataForViewport(viewportBounds);
    setCombinedData(cachedData);

    // Check what areas need to be fetched
    const missingAreas = getMissingViewportAreas(viewportBounds);

    if (missingAreas.length === 0) {
      return;
    }

    // Fetch missing areas (for now, just the first one since we return max 1 area)
    const fetchMissingData = async () => {
      try {
        for (const area of missingAreas) {
          const newData = await fetchPublicHankkeet(area);

          // Add to cache
          addToCache(area, newData);

          // Update combined data with all cached data
          const updatedCachedData = getCachedDataForViewport(viewportBounds);
          setCombinedData(updatedCachedData);
        }
      } catch (error) {
        console.error('Error fetching missing hanke data:', error);
      }
    };

    fetchMissingData().catch((error) => {
      console.error('Failed to fetch missing hanke data:', error);
    });
  }, [viewportBounds, getMissingViewportAreas, addToCache, getCachedDataForViewport, cacheStats]);

  // Convert to the expected format
  const hankeData = useMemo(() => combinedData.map(toHankeDataMinimal), [combinedData]);
  const hankkeetObject = useMemo(() => convertArrayToObject(hankeData, 'hankeTunnus'), [hankeData]);

  const value = useMemo(
    () => ({ hankkeet: hankeData, hankkeetObject }),
    [hankeData, hankkeetObject],
  );

  return <HankkeetContext.Provider value={value}>{children}</HankkeetContext.Provider>;
};

export default HankkeetProvider;
