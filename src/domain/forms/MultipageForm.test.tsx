import { StepState, TextInput } from 'hds-react';
import MultipageForm from './MultipageForm';
import { render, screen } from '../../testUtils/render';
import FormActions from './components/FormActions';

function Page1() {
  return (
    <div>
      <h1>Page 1</h1>
      <TextInput
        id="testInput"
        label="Test input"
        errorText="Please enter a value for input"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        crossOrigin=""
      />
    </div>
  );
}

function Page2() {
  return (
    <div>
      <h1>Page 2</h1>
    </div>
  );
}

test('renders form heading and labels for form steps', () => {
  const formSteps = [
    {
      element: <Page1 />,
      label: 'Title 1',
      state: StepState.available,
    },
    {
      element: <Page2 />,
      label: 'Title 2',
      state: StepState.disabled,
    },
  ];

  const handleSave = jest.fn();

  render(<MultipageForm heading="Test form" formSteps={formSteps} onStepChange={handleSave} />);

  expect(screen.getByText('Test form')).toBeInTheDocument();
  expect(screen.getByText('Title 1')).toBeInTheDocument();
  expect(screen.getByText('Title 2')).toBeInTheDocument();
  expect(screen.getByText('Vaihe 1/2: Title 1')).toBeInTheDocument();
});

test('renders additional content to top of form if given', () => {
  const formSteps = [
    {
      element: <Page1 />,
      label: 'Title 1',
      state: StepState.available,
    },
    {
      element: <Page2 />,
      label: 'Title 2',
      state: StepState.disabled,
    },
  ];

  const handleSave = jest.fn();

  render(
    <MultipageForm
      heading="Test form"
      formSteps={formSteps}
      onStepChange={handleSave}
      topElement={<p>Additional content</p>}
    />,
  );

  expect(screen.getByText('Additional content')).toBeInTheDocument();
});

test('form pages can be navigated', async () => {
  const formSteps = [
    {
      element: <Page1 />,
      label: 'Title 1',
      state: StepState.available,
    },
    {
      element: <Page2 />,
      label: 'Title 2',
      state: StepState.available,
    },
  ];

  const handleSave = jest.fn();

  const { user } = render(
    <MultipageForm heading="Test form" formSteps={formSteps} onStepChange={handleSave}>
      {(activeStepIndex, handlePrevious, handleNext) => (
        <FormActions
          activeStepIndex={activeStepIndex}
          totalSteps={formSteps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </MultipageForm>,
  );

  const stepperStepTwoButton = screen.getByTestId('hds-stepper-step-1');
  await user.click(stepperStepTwoButton);
  expect(handleSave).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Vaihe 2/2: Title 2')).toBeDefined();
  expect(screen.getByText('Page 2')).toBeDefined();

  const stepperStepOneButton = screen.getByTestId('hds-stepper-step-0');
  await user.click(stepperStepOneButton);
  expect(handleSave).toHaveBeenCalledTimes(2);
  expect(screen.getByText('Vaihe 1/2: Title 1')).toBeDefined();
  expect(screen.getByText('Page 1')).toBeDefined();

  const nextButton = screen.getByRole('button', { name: 'Seuraava' });
  await user.click(nextButton);
  expect(handleSave).toHaveBeenCalledTimes(3);
  expect(screen.getByText('Vaihe 2/2: Title 2')).toBeDefined();
  expect(screen.getByText('Page 2')).toBeDefined();

  const prevButton = screen.getByRole('button', { name: 'Edellinen' });
  await user.click(prevButton);
  expect(handleSave).toHaveBeenCalledTimes(4);
  expect(screen.getByText('Vaihe 1/2: Title 1')).toBeDefined();
  expect(screen.getByText('Page 1')).toBeDefined();
});

test('displays loading spinner when isLoading', () => {
  const formSteps = [
    {
      element: <Page1 />,
      label: 'Title 1',
      state: StepState.available,
    },
  ];

  render(<MultipageForm heading="Test form" formSteps={formSteps} isLoading />);

  expect(screen.queryByTestId('multipage-form-loading-spinner')).toBeInTheDocument();
});

test('displays loading spinner with loading text when isLoading and loading text set', () => {
  const formSteps = [
    {
      element: <Page1 />,
      label: 'Title 1',
      state: StepState.available,
    },
  ];
  const loadingText = 'Loading...';

  render(
    <MultipageForm
      heading="Test form"
      formSteps={formSteps}
      isLoading
      isLoadingText={loadingText}
    />,
  );

  expect(screen.queryByTestId('multipage-form-loading-spinner')).toBeInTheDocument();
  expect(screen.queryByText(loadingText)).toBeInTheDocument();
});
