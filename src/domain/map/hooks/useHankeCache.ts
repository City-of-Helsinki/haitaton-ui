import { useCallback, useState, useMemo, useRef } from 'react';
import { PublicHankeMinimal } from '../../types/hanke';
import { ViewportBounds } from '../../../common/components/map/hooks/useMapViewportBounds';
import { calculateMissingViewportAreas } from '../utils/rectangleUtils';

export interface CachedViewport {
  bounds: ViewportBounds;
  data: PublicHankeMinimal[];
  timestamp: number;
}

export interface HankeCacheState {
  cachedViewports: CachedViewport[];
  allHankeData: Map<string, PublicHankeMinimal>; // hankeTunnus -> hanke data
}

export function useHankeCache() {
  const [cache, setCache] = useState<HankeCacheState>({
    cachedViewports: [],
    allHankeData: new Map(),
  });

  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  // Get viewport areas that need to be loaded (not cached)
  const getMissingViewportAreas = useCallback((bounds: ViewportBounds): ViewportBounds[] => {
    const cachedBounds = cacheRef.current.cachedViewports.map((cached) => cached.bounds);
    return calculateMissingViewportAreas(bounds, cachedBounds);
  }, []);

  // Add new data to cache
  const addToCache = useCallback((bounds: ViewportBounds, data: PublicHankeMinimal[]) => {
    setCache((prevCache) => {
      const newAllHankeData = new Map(prevCache.allHankeData);

      // Add new hanke data to the map (deduplicate by hankeTunnus)
      data.forEach((hanke) => {
        newAllHankeData.set(hanke.hankeTunnus, hanke);
      });

      const newCachedViewport: CachedViewport = {
        bounds,
        data,
        timestamp: Date.now(),
      };

      return {
        cachedViewports: [...prevCache.cachedViewports, newCachedViewport],
        allHankeData: newAllHankeData,
      };
    });
  }, []);

  // Get all cached hanke data as array
  const getAllCachedHankeData = useCallback((): PublicHankeMinimal[] => {
    return Array.from(cacheRef.current.allHankeData.values());
  }, []);

  // Get hanke data for current viewport from cache
  const getCachedDataForViewport = useCallback(
    (bounds: ViewportBounds): PublicHankeMinimal[] => {
      // Return all cached data that intersects with the viewport
      // For simplicity, return all cached data if viewport has any cached coverage
      const hasAnyCachedData = cacheRef.current.cachedViewports.some((cached) => {
        // Check if viewports intersect
        return !(
          cached.bounds.maxX < bounds.minX ||
          cached.bounds.minX > bounds.maxX ||
          cached.bounds.maxY < bounds.minY ||
          cached.bounds.minY > bounds.maxY
        );
      });

      return hasAnyCachedData ? getAllCachedHankeData() : [];
    },
    [getAllCachedHankeData],
  );

  // Clear cache (for testing or reset purposes)
  const clearCache = useCallback(() => {
    setCache({
      cachedViewports: [],
      allHankeData: new Map(),
    });
  }, []);

  const cacheStats = useMemo(
    () => ({
      cachedViewportsCount: cache.cachedViewports.length,
      totalHankeCount: cache.allHankeData.size,
    }),
    [cache.cachedViewports.length, cache.allHankeData.size],
  );

  return {
    getMissingViewportAreas,
    addToCache,
    getAllCachedHankeData,
    getCachedDataForViewport,
    clearCache,
    cacheStats,
  };
}
