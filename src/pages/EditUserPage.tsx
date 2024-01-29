import { useParams } from 'react-router-dom';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import EditUserContainer from '../domain/hanke/hankeUsers/EditUserContainer';

function EditUserPage() {
  const { hankeTunnus, id } = useParams();
  const { EDIT_USER } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={EDIT_USER} />
      <EditUserContainer hankeTunnus={hankeTunnus} id={id} />
    </>
  );
}

export default EditUserPage;
