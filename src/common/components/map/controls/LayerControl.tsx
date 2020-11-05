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

type TileLayer = {
  id: string;
  label: string;
  checked: boolean;
  onClick: () => void;
};

type DataLayer = {
  id: string;
  data: any;
  visible: boolean;
};

type Props = {
  tileLayers: TileLayer[];
  dataLayers: DataLayer[];
  onClickDatalayer: (id: string) => void;
};

const LayerControl: React.FC<Props> = ({ tileLayers, dataLayers, onClickDatalayer }) => (
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
          {dataLayers.map(({ id }) => (
            <MenuItem key={id} onClick={() => onClickDatalayer(id)}>
              <Locale id={`map:datalayers:${id}`} />
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuDivider />
      </MenuList>
    </Menu>
  </ControlPanel>
);

export default LayerControl;
