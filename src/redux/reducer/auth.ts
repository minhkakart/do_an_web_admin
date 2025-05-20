import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IToken {
	accessToken: string | null;
	refreshToken: string | null;
}

const initialState: IToken = {
	accessToken: null,
	refreshToken: null
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAccessToken: (state, action: PayloadAction<string | null>) => {
			state.accessToken = action?.payload;
		},
		setRefreshToken: (state, action: PayloadAction<string | null>) => {
			state.refreshToken = action?.payload;
		},
		logout: (state) => {
			state.accessToken = null;
			state.refreshToken = null;
		}
	}
});

export const {setAccessToken, setRefreshToken, logout} = authSlice.actions;
export default authSlice.reducer;
