import React from 'react';
import { createContext, useContext } from 'react';

const MuutosLabelContext = createContext<string | undefined>(undefined);

export function MuutosLabelProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string | undefined;
}) {
  return <MuutosLabelContext.Provider value={value}>{children}</MuutosLabelContext.Provider>;
}

export function useMuutosLabel() {
  return useContext(MuutosLabelContext);
}
