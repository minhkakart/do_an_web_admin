import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IUser {
    id: string;
    fullName: string;
    avatar: string;
    userRole: number;
}

export interface UserState {
    infoUser: IUser | null;
}

const initialState: UserState = {
    infoUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setInfoUser: (state, action: PayloadAction<IUser | null>) => {
            state.infoUser = action?.payload;
        },
    },
});

export const {setInfoUser} = userSlice.actions;
export default userSlice.reducer;
