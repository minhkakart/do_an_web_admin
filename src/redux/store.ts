import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';

import authReducer from './reducer/auth';
import userReducer from './reducer/user';
import siteReducer from './reducer/site';

const reducers = combineReducers({
	auth: authReducer,
	user: userReducer,
	site: siteReducer,
});

export const store = configureStore({
	reducer: reducers,
	devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
