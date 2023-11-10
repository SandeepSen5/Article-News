import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../redux/slice/userSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true
});

export default store;



