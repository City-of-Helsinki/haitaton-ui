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
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';

type TileLayer = {
  id: string;
  label: string;
  checked: boolean;
  onClick: () => void;
};

type Props = {
  tileLayers: TileLayer[];
};

const LayerControl: React.FC<Props> = ({ tileLayers }) => (
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
          {tileLayers.map(({ id, onClick, label }) => (
            <MenuItem key={id} onClick={() => onClick()}>
              {label}
            </MenuItem>
          ))}
        </MenuGroup>
        <MenuDivider />
      </MenuList>
    </Menu>
  </ControlPanel>
);

export default LayerControl;
