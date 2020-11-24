import * as ol from 'ol';
import { DRAWTOOLTYPE } from './constants';
import { EmptyString } from '../../types/common';

export type SelectedDrawtoolType = DRAWTOOLTYPE | EmptyString;
export type MapInstance = ol.Map | null;
