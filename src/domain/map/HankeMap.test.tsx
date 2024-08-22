import { render, screen } from '../../testUtils/render';
import { changeFilterDate } from '../../testUtils/helperFunctions';
import HankeMap from './HankeMap';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';
const countOfFilteredHankeAlueet = 'countOfFilteredHankeAlueet';

describe('HankeMap', () => {
  test('Render test', async () => {
    const { user } = render(<HankeMap />);

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await user.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    const renderedComponent = render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');
    await screen.findByText('Ajanjakson alku');

    changeFilterDate(startDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(endDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('0');
    changeFilterDate(endDateLabel, renderedComponent, '12.12.2023');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(startDateLabel, renderedComponent, '28.2.2023');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '1');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(startDateLabel, renderedComponent, '1.1');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(startDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    changeFilterDate(startDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
  });
});
