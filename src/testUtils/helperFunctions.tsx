import { fireEvent, RenderResult, screen, waitForElementToBeRemoved } from '@testing-library/react';

export const changeFilterDate = (
  label: string,
  renderedComponent: RenderResult,
  value: string | null,
) => {
  fireEvent.change(renderedComponent.getByLabelText(label, { exact: false }), {
    target: { value },
  });
};

export function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(() => screen.queryByText(/page is loading/i), {
    timeout: 4000,
  });
}
