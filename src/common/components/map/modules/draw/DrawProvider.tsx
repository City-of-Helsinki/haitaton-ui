import React, { useReducer, useMemo } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { reducer, initialState } from './reducer';
import { DrawContext } from './DrawContext';
import { SelectedDrawToolType, SelectedFeature, ACTION } from './types';

type Props = {
  children: React.ReactNode;
  source: VectorSource;
};

const DrawProvider: React.FC<React.PropsWithChildren<Props>> = ({ children, source }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(
    () => ({
      state,
      source,
      actions: {
        setSelectedDrawToolType: (selectedDrawtoolType: SelectedDrawToolType) => {
          dispatch({ type: ACTION.SELECT_DRAW_TOOL, selectedDrawtoolType });
        },
        setSelectedFeature: (selectedFeature: SelectedFeature) => {
          dispatch({ type: ACTION.SELECT_FEATURE, selectedFeature });
        },
      },
    }),
    [state, source, dispatch],
  );

  return <DrawContext.Provider value={contextValue}>{children}</DrawContext.Provider>;
};

export default DrawProvider;
