import { render, screen } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import {
  initApplicationAttachmentGetResponse,
  initHaittaindeksitPostResponse,
} from '../../testUtils/helperFunctions';
import {
  buildApplicationForSummary,
  getDefaultHanke,
  navigateToStep,
} from './kaivuilmoitusTestHelpers';
import { HAITTA_INDEX_TYPE } from '../common/haittaIndexes/types';

test('Summary displays key kaivuilmoitus information quickly', async () => {
  // Minimal deterministic mocks
  initApplicationAttachmentGetResponse([
    {
      id: 'upload-123',
      fileName: 'liikennejärjestelyt.pdf',
      contentType: 'application/pdf',
      size: 12345,
      createdByUserId: 'test-user',
      createdAt: new Date().toISOString(),
      applicationId: 1,
      attachmentType: 'LIIKENNEJARJESTELY',
    },
  ]);
  initHaittaindeksitPostResponse({
    liikennehaittaindeksi: { indeksi: 1.4, tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI },
    pyoraliikenneindeksi: 3,
    autoliikenne: {
      indeksi: 1.4,
      haitanKesto: 1,
      katuluokka: 0,
      liikennemaara: 0,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    linjaautoliikenneindeksi: 0,
    raitioliikenneindeksi: 1,
  });

  const application = buildApplicationForSummary();
  const { user } = render(
    <KaivuilmoitusContainer hankeData={getDefaultHanke()} application={application} />,
  );
  await navigateToStep(user, 6);

  // Confirm we are on summary step
  expect(screen.getByRole('button', { name: /vaihe 6\/6/i })).toBeInTheDocument();

  const bodyText = document.body.textContent || '';
  const expectedFragments = [
    application.applicationData.name,
    application.applicationData.workDescription,
    'Työalue 1',
    'Pinta-ala',
    'liikennejärjestelyt.pdf',
  ];
  expectedFragments.forEach((frag) => {
    expect(bodyText).toContain(frag);
  });
});
