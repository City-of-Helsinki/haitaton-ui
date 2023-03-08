import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import { useApplicationsForHanke } from '../../application/hooks/useApplications';
import HankeDelete from '../edit/components/HankeDelete';
import useHanke from '../hooks/useHanke';
import HankeView from './HankeView';

type Props = {
  hankeTunnus?: string;
};

const HankeViewContainer: React.FC<Props> = ({ hankeTunnus }) => {
  const { data: hankeData } = useHanke(hankeTunnus);
  const { data: applications } = useApplicationsForHanke(hankeTunnus);
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function editHanke() {
    if (hankeTunnus) {
      navigate(getEditHankePath({ hankeTunnus }));
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
        onEditHanke={editHanke}
        onCancelHanke={cancelHanke}
        applications={applications}
      />
    </>
  );
};

export default HankeViewContainer;
