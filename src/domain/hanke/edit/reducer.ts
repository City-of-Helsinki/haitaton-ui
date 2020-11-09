import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

type HankeData = {
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

type State = {
  hankeData: HankeData | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeData>> = (state, action) => {
  state.hankeData = action.payload;
};

const initialState: State = {
  hankeData: null, // Null or write default HankeData
};

const projectsSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;
