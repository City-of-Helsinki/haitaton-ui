import React from 'react';
import {
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/core';
import Locale from '../../locale/Locale';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import { CommonGeoJSON } from '../../../types/hanke';

type TileLayer = {
  id: string;
  label: string;
  checked: boolean;
  onClick: () => void;
};

type DataLayer = {
  key: string;
  data: CommonGeoJSON;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  dataLayers: DataLayer[];
  // I dont want to import type from domain
  // eslint-disable-next-line
  onClickDataLayer: (key: any) => void;
};

const LayerControl: React.FC<Props> = ({ tileLayers, dataLayers, onClickDataLayer }) => (
  <ControlPanel className={styles.tileLayerControl}>
    <Menu closeOnSelect={false}>
      <MenuButton>
        <Icon name="copy" />
      </MenuButton>
      <MenuList>
        <MenuGroup>
          {tileLayers.map(({ id, onClick, label, checked }) => (
            <MenuItem key={id} onClick={() => onClick()} isDisabled={checked}>
              {label}
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          {dataLayers.map(({ key }) => (
            <MenuItem key={key} onClick={() => onClickDataLayer(key)}>
              <Locale id={`map:datalayers:${key}`} />
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuDivider />
      </MenuList>
    </Menu>
  </ControlPanel>
);

export default LayerControl;
