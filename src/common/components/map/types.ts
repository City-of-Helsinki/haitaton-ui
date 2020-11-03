import * as ol from 'ol';
import { DrawTool } from './constants';
import { EmptyString } from '../../types/common';

export type SelectedDrawTool = DrawTool | EmptyString;
export type MapInstance = ol.Map | null;
