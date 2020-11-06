import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line
type State = any;
type Inputs = {
  hankeenTunnus: string;
  YTKHanke: boolean;
  hankeenNimi: string;
  hankeenVaihe: string;
  endDate: string;
  omistajaOrganisaatio: string;
  omistajaOsasto: string;
  arvioijaOrganisaatio: string;
  arvioijaOsasto: string;
  example1: string;
};
const formData: CaseReducer<State, PayloadAction<Inputs>> = (state, action) => action.payload;

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {},
  reducers: {
    formData,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;
