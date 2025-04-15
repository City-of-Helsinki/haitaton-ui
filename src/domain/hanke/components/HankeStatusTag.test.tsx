import { useState } from 'react';
import { fireEvent, render, screen } from '../../../testUtils/render';
import HankeStatusTag from './HankeStatusTag';
import { HANKE_STATUS_KEY } from '../../types/hanke';

test('Should show tag with default background (not have green background) when status is null', () => {
  render(<HankeStatusTag status={null} />);
  const tag = screen.getByTestId('hanke-status-tag');

  expect(tag).toHaveTextContent('Luonnos');
  expect(tag).not.toHaveClass('bgGreen');
});

test('Should show tag with default background (not have green background) when status is DRAFT', () => {
  render(<HankeStatusTag status="DRAFT" />);
  const tag = screen.getByTestId('hanke-status-tag');

  expect(tag).not.toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Luonnos');
});

test('Should show tag with green background when status is COMPLETED', () => {
  render(<HankeStatusTag status="COMPLETED" />);
  const tag = screen.getByTestId('hanke-status-tag');

  expect(tag).toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Valmis');
});

function TestComponent({ changedStatus }: Readonly<{ changedStatus: HANKE_STATUS_KEY }>) {
  const [status, setStatus] = useState<HANKE_STATUS_KEY | null>('DRAFT');

  function changeStatus() {
    setStatus(changedStatus);
  }

  return (
    <>
      <HankeStatusTag status={status} />
      <button onClick={changeStatus}>Change status</button>
    </>
  );
}

test('Should change background color from default to green when status changes from DRAFT to COMPLETED', async () => {
  render(<TestComponent changedStatus="COMPLETED" />);
  const tag = screen.getByTestId('hanke-status-tag');
  const button = screen.getByRole('button');

  expect(tag).not.toHaveClass('bgGreen');

  fireEvent.click(button);

  expect(tag).toHaveClass('bgGreen');
});
