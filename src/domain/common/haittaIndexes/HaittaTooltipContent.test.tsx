import { render, screen } from '../../../testUtils/render';
import HaittaTooltipContent from './HaittaTooltipContent';

test.each([
  ['hankeIndexes:tooltips:PYORALIIKENNE'],
  ['hankeIndexes:tooltips:AUTOLIIKENNE'],
  ['hankeIndexes:tooltips:LINJAAUTOLIIKENNE'],
  ['hankeIndexes:tooltips:RAITIOLIIKENNE'],
  ['hankeIndexes:tooltips:MUUT'],
])('Should show correct tooltip for %s', (translationKey) => {
  const { container } = render(<HaittaTooltipContent translationKey={translationKey} />);
  expect(container).toMatchSnapshot();
});

test('Should not show heading when showHeading is false', () => {
  render(
    <HaittaTooltipContent
      translationKey="hankeIndexes:tooltips:PYORALIIKENNE"
      showHeading={false}
    />,
  );
  expect(screen.queryByText('Haittaindeksit:')).not.toBeInTheDocument();
});
