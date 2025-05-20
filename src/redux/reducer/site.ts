import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SiteState {
	loading: boolean;
	saveStorage: boolean;
}

const initialState: SiteState = {
	loading: true,
	saveStorage: false
};

export const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action?.payload;
		},
		setSaveStorage: (state, action: PayloadAction<boolean>) => {
			state.saveStorage = action?.payload;
		},
	},
});

export const {setLoading, setSaveStorage} = siteSlice.actions;
// Action creators are generated for each case reducer function
export default siteSlice.reducer;
