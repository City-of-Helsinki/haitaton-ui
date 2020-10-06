import React, { useRef, useEffect, useState } from 'react';
import * as ol from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { TileWMS, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

import styled from 'styled-components';
import 'ol/ol.css';
import { useProjects } from '../hooks/useProjects';

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Toolbox = styled.select`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const image = new CircleStyle({
  radius: 5,
  fill: undefined,
  stroke: new Stroke({ color: 'red', width: 1 }),
});

/* const vectorLayerStyles = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33',
    }),
  }),
}); */

const styles = {
  Point: new Style({
    image: image,
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  MultiPoint: new Style({
    image: image,
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2,
    }),
    fill: new Fill({
      color: 'magenta',
    }),
    image: new CircleStyle({
      radius: 10,
      fill: undefined,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
  LinearRing: {},
};
const styleFunction = (feature: ol.Feature) => styles[feature.getGeometry().getType()];

const OpenLayer: React.FC = (value: any, callback: any) => {
  const [map, setMap] = useState<any>(null);
  const [draw, setDraw] = useState<any>(null);
  const [snap, setSnap] = useState<any>(null);
  const [drawSource] = useState<any>(new VectorSource());

  const [selectVal, setSelectVal] = useState<any>('Point');
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { projects } = useProjects();

  console.log(projects);

  console.log(drawSource.getFeatures());

  const addInteractions = () => {
    if (!map) return;

    const draw = new Draw({
      source: drawSource,
      type: selectVal,
    });
    map.addInteraction(draw);
    const snap = new Snap({ source: drawSource });
    map.addInteraction(snap);

    setDraw(draw);
    setSnap(snap);
  };

  useEffect(() => {
    if (mapContainerRef.current == null) {
      return;
    }
    const raster = new TileLayer({
      source: new TileWMS({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
        params: {
          LAYERS: 'Kantakartta',
          FORMAT: 'image/jpeg',
          WIDTH: 256,
          HEIGHT: 256,
          VERSION: '1.1.1',
        },
        imageSmoothing: false,
        hidpi: false,
        serverType: 'geoserver',
        transition: 0,
      }),
      minZoom: 12,
      maxZoom: 18,
    });

    console.log(projects);

    drawSource.addFeatures(
      new GeoJSON().readFeatures(projects, {
        featureProjection: 'EPSG:3857',
      })
    );

    const vector = new VectorLayer({
      source: drawSource,
      // eslint-disable-next-line
      // @ts-ignore
      style: styleFunction,
    });

    if (!map) {
      const map = new Map({
        layers: [raster, vector],
        target: mapContainerRef.current,
        view: new View({
          center: [2776000, 8438000],
          zoom: 13,
          minZoom: 12,
          maxZoom: 18,
        }),
      });

      const modify = new Modify({ source: drawSource });
      map.addInteraction(modify);

      setMap(map);
    }

    if (map) {
      addInteractions();
    }
  }, [drawSource, projects]);

  useEffect(() => {
    if (!map) return;
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
  }, [selectVal, map]);

  console.log('fo');

  return (
    <div>
      <MapContainer ref={mapContainerRef}></MapContainer>
      <Toolbox
        onChange={(event) => {
          setSelectVal(event.target.value);
        }}
        value={selectVal}
      >
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
      </Toolbox>
    </div>
  );
};

export default OpenLayer;
