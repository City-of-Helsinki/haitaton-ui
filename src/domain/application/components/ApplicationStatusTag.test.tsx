import { useState } from 'react';
import { render, screen } from '../../../testUtils/render';
import ApplicationStatusTag from './ApplicationStatusTag';
import { AlluStatusStrings } from '../types/application';

test('Should show tag with default background (not have yellow or green background) when status is null', () => {
  render(<ApplicationStatusTag status={null} />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveTextContent('Luonnos');
  expect(tag).not.toHaveClass('bgYellow');
  expect(tag).not.toHaveClass('bgGreen');
});

test('Should show tag with default background (not have yellow or green background) when status is REPLACED', () => {
  render(<ApplicationStatusTag status="REPLACED" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).not.toHaveClass('bgYellow');
  expect(tag).not.toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Korvattu');
});

test('Should show tag with default background (not have yellow or green background) when status is CANCELLED', () => {
  render(<ApplicationStatusTag status="CANCELLED" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).not.toHaveClass('bgYellow');
  expect(tag).not.toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Hakemus peruttu');
});

test('Should show tag with default background (not have yellow or green background) when status is ARCHIVED', () => {
  render(<ApplicationStatusTag status="ARCHIVED" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).not.toHaveClass('bgYellow');
  expect(tag).not.toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Työ arkistoitu');
});

test('Should show tag with green background when status is DECISION', () => {
  render(<ApplicationStatusTag status="DECISION" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Päätös');
});

test('Should show tag with green background when status is FINISHED', () => {
  render(<ApplicationStatusTag status="FINISHED" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Työ valmis');
});

test('Should show tag with green background when status is OPERATIONAL_CONDITION', () => {
  render(<ApplicationStatusTag status="OPERATIONAL_CONDITION" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgGreen');
  expect(tag).toHaveTextContent('Toiminnallinen kunto');
});

test('Should show tag with yellow background when status is PENDING', () => {
  render(<ApplicationStatusTag status="PENDING" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgYellow');
  expect(tag).toHaveTextContent('Odottaa käsittelyä');
});

test('Should show tag with yellow background when status is PENDING_CLIENT', () => {
  render(<ApplicationStatusTag status="PENDING_CLIENT" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgYellow');
  expect(tag).toHaveTextContent('Näkyy viranomaiselle');
});

test('Should show tag with yellow background when status is HANDLING', () => {
  render(<ApplicationStatusTag status="HANDLING" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgYellow');
  expect(tag).toHaveTextContent('Käsittelyssä');
});

test('Should show tag with red background when status is WAITING_INFORMATION', () => {
  render(<ApplicationStatusTag status="WAITING_INFORMATION" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgRed');
  expect(tag).toHaveTextContent('Täydennyspyyntö');
});

test('Should show tag with yellow background when status is INFORMATION_RECEIVED', () => {
  render(<ApplicationStatusTag status="INFORMATION_RECEIVED" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgYellow');
  expect(tag).toHaveTextContent('Täydennetty käsittelyyn');
});

test('Should show tag with yellow background when status is RETURNED_TO_PREPARATION', () => {
  render(<ApplicationStatusTag status="RETURNED_TO_PREPARATION" />);
  const tag = screen.getByTestId('application-status-tag');

  expect(tag).toHaveClass('bgYellow');
  expect(tag).toHaveTextContent('Käsittelyssä');
});

function TestComponent({ changedStatus }: { changedStatus: AlluStatusStrings }) {
  const [alluStatus, setAlluStatus] = useState<AlluStatusStrings | null>(null);

  function changeStatus() {
    setAlluStatus(changedStatus);
  }

  return (
    <>
      <ApplicationStatusTag status={alluStatus} />
      <button onClick={changeStatus}>Change status</button>
    </>
  );
}

test('Should change background color from default to yellow when status changes from null to PENDING', async () => {
  const { user } = render(<TestComponent changedStatus="PENDING" />);
  const button = screen.getByRole('button');

  expect(screen.getByTestId('application-status-tag')).not.toHaveClass('bgYellow');

  await user.click(button);

  expect(screen.getByTestId('application-status-tag')).toHaveClass('bgYellow');
});
