import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import { styleFunction } from '../../utils/geometryStyle';
import { useMapViewportBounds } from '../../../../common/components/map/hooks/useMapViewportBounds';
import api from '../../../api/api';
import { PublicHankeMinimal } from '../../../types/hanke';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { OverlayProps } from '../../../../common/components/map/types';
import { getGridCellsForViewport } from '../../utils/gridUtils';

export interface GridMetadata {
  cellSizeMeters: number;
  originX: number;
  originY: number;
  maxX: number;
  maxY: number;
}

interface Props {
  startDate: string | null;
  endDate: string | null;
}

function SimpleHankeLayer({ startDate, endDate }: Props) {
  const source = useRef(new VectorSource());
  const [metadata, setMetadata] = useState<GridMetadata | null>(null);
  const [, setLoading] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const bounds = useMapViewportBounds();
  const loadTimer = useRef<NodeJS.Timeout | null>(null);

  // Load grid metadata once
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await api.get<GridMetadata>('/public-hankkeet/grid/metadata');
        setMetadata(response.data);
      } catch (error) {
        console.error('Failed to load grid metadata:', error);
      }
    };

    loadMetadata();
  }, []);

  // Load hanke data for viewport
  const loadHankeData = useCallback(async () => {
    if (!metadata || !startDate || !endDate || !bounds) {
      return;
    }

    // Clear existing timer
    if (loadTimer.current) {
      clearTimeout(loadTimer.current);
    }

    // Debounce the loading
    loadTimer.current = setTimeout(async () => {
      try {
        setLoading(true);

        // Get grid cells for current viewport (increased limit for full coverage)
        const cells = getGridCellsForViewport(bounds, metadata, 1000);

        if (cells.length === 0) {
          console.warn('No grid cells generated - clearing map');
          source.current.clear();
          setFeatureCount(0);
          return;
        }

        // Fetch data from API
        const response = await api.post<PublicHankeMinimal[]>('/public-hankkeet/grid', {
          startDate: startDate || '',
          endDate: endDate || '',
          cells,
        });

        // Convert to OpenLayers features
        const geoJSON = new GeoJSON();
        const allFeatures: Feature<Geometry>[] = [];

        response.data.forEach((hanke) => {
          if (!hanke.alueet?.length) return;

          hanke.alueet.forEach((alue) => {
            if (!alue.geometriat?.featureCollection) return;

            try {
              const feature = geoJSON.readFeatures(
                alue.geometriat.featureCollection,
              )[0] as Feature<Geometry>;

              if (!feature.getGeometry()) return;

              // Set basic properties for hover/click functionality
              const props = {
                liikennehaittaindeksi:
                  alue.tormaystarkastelu?.liikennehaittaindeksi?.indeksi || null,
                areaName: alue.nimi,
                hankeName: hanke.nimi,
                id: alue.id,
                hankeTunnus: hanke.hankeTunnus,
                overlayProps: new OverlayProps({
                  heading: alue.nimi,
                  subHeading: `${hanke.nimi} (${hanke.hankeTunnus})`,
                  startDate: alue.haittaAlkuPvm,
                  endDate: alue.haittaLoppuPvm,
                  backgroundColor: 'var(--color-summer-light)',
                  enableCopyArea: true,
                }),
              };

              feature.setProperties(props, true);
              allFeatures.push(feature);
            } catch (error) {
              console.warn('Failed to process area feature:', error);
            }
          });
        });

        // Update source with new features
        source.current.clear();
        source.current.addFeatures(allFeatures);
        setFeatureCount(allFeatures.length);
      } catch (error) {
        console.error('Failed to load hanke data:', error);
        source.current.clear();
        setFeatureCount(0);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, [metadata, startDate, endDate, bounds]);

  // Load data when dependencies change
  useEffect(() => {
    loadHankeData();
  }, [loadHankeData]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (loadTimer.current) {
        clearTimeout(loadTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div style={{ display: 'none' }} data-testid="countOfFilteredHankeAlueet">
        {featureCount}
      </div>
      <VectorLayer
        source={source.current}
        zIndex={1}
        className="hankeGeometryLayer"
        style={styleFunction}
      />
    </>
  );
}

export default SimpleHankeLayer;
