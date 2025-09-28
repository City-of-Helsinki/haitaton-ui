import React from 'react';
import { render, screen } from '../../../../../testUtils/render';
import VectorSource from 'ol/source/Vector';
import DrawModule from './DrawModule';
import DrawProvider from './DrawProvider';
import { DRAWTOOLTYPE } from './types';

const mockSource = new VectorSource();

describe('DrawControl disabled state', () => {
  it('disables draw buttons and shows spinner when disableDraw is true', () => {
    render(
      <DrawProvider source={mockSource}>
        <DrawModule disableDraw />
      </DrawProvider>,
    );

    // Buttons are rendered for each draw tool
    const polygonButton = screen.getByTestId(`draw-control-${DRAWTOOLTYPE.POLYGON}`);
    const squareButton = screen.getByTestId(`draw-control-${DRAWTOOLTYPE.SQUARE}`);

    expect(polygonButton).toBeDisabled();
    expect(squareButton).toBeDisabled();

    // LoadingSpinner should be present inside buttons when disabled
    expect(
      screen.getByTestId(`draw-control-loading-spinner-${DRAWTOOLTYPE.POLYGON}`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`draw-control-loading-spinner-${DRAWTOOLTYPE.SQUARE}`),
    ).toBeInTheDocument();
  });

  it('enables draw buttons when disableDraw is false', () => {
    render(
      <DrawProvider source={mockSource}>
        <DrawModule />
      </DrawProvider>,
    );

    const polygonButton = screen.getByTestId(`draw-control-${DRAWTOOLTYPE.POLYGON}`);
    const squareButton = screen.getByTestId(`draw-control-${DRAWTOOLTYPE.SQUARE}`);

    expect(polygonButton).not.toBeDisabled();
    expect(squareButton).not.toBeDisabled();
  });
});
