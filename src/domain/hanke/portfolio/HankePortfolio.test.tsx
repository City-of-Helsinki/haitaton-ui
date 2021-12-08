import React from 'react';
import { cleanup } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render } from '../../../testUtils/render';
import hankeList from '../../mocks/hankeList';

afterEach(cleanup);

describe('HankePortfolio', () => {
  test('Should match snapshot', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent).toMatchSnapshot();
  });
});
