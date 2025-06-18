import {combineReducers} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import blogSlice from './blog/blogSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  blog: blogSlice
});

export default rootReducer;