import React from 'react';
import { waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { render } from '../testUtils/render';
import { SKIP_TO_ELEMENT_ID } from '../common/constants/constants';
import AccessRightsViewContainer from '../domain/hanke/accessRights/AccessRightsViewContainer';
import { waitForLoadingToFinish } from '../testUtils/helperFunctions';
import NotFoundPage from './staticPages/404Page';
import AccessibilityPage from './staticPages/AccessibilityPage';
import InfoPage from './staticPages/InfoPage';
import ManualPage from './staticPages/ManualPage';
import PrivacyPolicyPage from './staticPages/PrivacyPolicyPage';
import ReferencesPage from './staticPages/ReferencesPage';
import MapPage from './MapPage';

const skipLinkQuery = `#${SKIP_TO_ELEMENT_ID}`;

/** More tests are needed for pages with user data, but this change is
 * needed to App.tsx to test those page components:
 * https://stackoverflow.com/questions/75531539/unit-test-cannot-render-a-router-inside-another-router
 */

describe('There should be a skip link in the page', () => {
  test('HomePage', async () => {
    const { container } = render(<HomePage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('AccessRightsPage', async () => {
    const { container } = render(<AccessRightsViewContainer hankeTunnus="HAI22-2" />);
    await waitForLoadingToFinish();
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('HomePage', async () => {
    const { container } = render(<HomePage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('Map and list page', async () => {
    const { container } = render(<MapPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('404 Page', async () => {
    const { container } = render(<NotFoundPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('Accessibility page', async () => {
    const { container } = render(<AccessibilityPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('Info Page', async () => {
    const { container } = render(<InfoPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('Manual Page', async () => {
    const { container } = render(<ManualPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('Privacy Policy Page', async () => {
    const { container } = render(<PrivacyPolicyPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
  test('References Page', async () => {
    const { container } = render(<ReferencesPage />);
    await waitFor(() => expect(container.querySelector(skipLinkQuery)).toBeInTheDocument());
  });
});
