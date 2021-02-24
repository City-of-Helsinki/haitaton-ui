import React, { useReducer, useMemo } from 'react';
import { reducer, initialState } from './reducer';
import { DrawContext } from './DrawContext';
import { SelectedDrawToolType, ACTION } from './types';

type Props = {
  children: React.ReactNode;
};

const DrawProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        setSelectedDrawToolType: (drawToolType: SelectedDrawToolType) => {
          dispatch({ type: ACTION.SELECT_DRAW_TOOL, drawToolType });
        },
      },
    }),
    [state, dispatch]
  );

  return <DrawContext.Provider value={contextValue}>{children}</DrawContext.Provider>;
};

export default DrawProvider;
