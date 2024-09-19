import { render, screen } from '../../testUtils/render';
import useDebouncedMutation from './useDebouncedMutation';

const mutationFn = jest.fn(() => {
  return Promise.resolve();
});

const buttonText = 'Test button';

function TestComponent() {
  const { mutate } = useDebouncedMutation(mutationFn);

  function handleClick() {
    mutate();
  }

  return <button onClick={handleClick}>{buttonText}</button>;
}

test('Should only call mutation function once even if trying to call it multiple times', async () => {
  const { user } = render(<TestComponent />);
  const testButton = screen.getByRole('button', { name: buttonText });
  await user.click(testButton);
  await user.click(testButton);
  await user.click(testButton);

  expect(mutationFn).toHaveBeenCalledTimes(1);
});
