import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import HankeDelete from '../edit/components/HankeDelete';
import useHanke from '../hooks/useHanke';
import HankeView from './HankeView';
import { usePermissionsForHanke } from '../hankeUsers/hooks/useUserRightsForHanke';

type Props = {
  hankeTunnus?: string;
};

const HankeViewContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const { data: hankeData } = useHanke(hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const getEditRightsPath = useLinkPath(ROUTES.ACCESS_RIGHTS);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function editHanke() {
    if (hankeTunnus) {
      navigate(getEditHankePath({ hankeTunnus }));
    }
  }

  function editRights() {
    if (hankeTunnus) {
      navigate(getEditRightsPath({ hankeTunnus }));
    }
  }

  function cancelHanke() {
    setDeleteDialogOpen(true);
  }

  function handleDeleteDialogClose() {
    setDeleteDialogOpen(false);
  }

  return (
    <>
      <HankeDelete
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        hankeTunnus={hankeTunnus}
      />
      <HankeView
        hankeData={hankeData}
        signedInUser={signedInUser}
        onEditHanke={editHanke}
        onCancelHanke={cancelHanke}
        onEditRights={editRights}
      />
    </>
  );
};

export default HankeViewContainer;
