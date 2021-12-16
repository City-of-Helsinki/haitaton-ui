import { fireEvent, RenderResult } from '@testing-library/react';

export const changeFilterDate = (
  label: string,
  renderedComponent: RenderResult,
  value: string | null
) => {
  fireEvent.change(renderedComponent.getByLabelText(label, { exact: false }), {
    target: { value },
  });
};
