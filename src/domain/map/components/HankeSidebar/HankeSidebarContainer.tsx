import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HankeSidebar from './HankeSidebar';
import HankkeetContext from '../../HankkeetProviderContext';

type Props = {
  hankeTunnus?: string;
};

const HankeSidebarContainer: React.FC<React.PropsWithChildren<Props>> = ({ hankeTunnus }) => {
  const { hankkeetObject } = useContext(HankkeetContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hankkeenTunnus = hankeTunnus || new URLSearchParams(location.search).get('hanke');
  const hankealueNimi = new URLSearchParams(location.search).get('hankealue')!;

  useEffect(() => {
    setIsOpen(true);
  }, [hankkeenTunnus]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(location.pathname);
  };

  if (!hankkeenTunnus || !hankkeetObject[hankkeenTunnus]) {
    return null;
  }

  return (
    <HankeSidebar
      hanke={hankkeetObject[hankkeenTunnus]}
      hankealueNimi={hankealueNimi}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
};

export default HankeSidebarContainer;
