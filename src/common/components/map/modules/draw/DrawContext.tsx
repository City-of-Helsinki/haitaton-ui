import React from 'react';
import { DrawContextType } from './types';

export const DrawContext = React.createContext<DrawContextType | undefined>(undefined);
