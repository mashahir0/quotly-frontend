import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../../data/api/userApi";
import authReducer, { authSlice } from '../redux/slilce/userSlice'; // ✅ Import `authSlice` from correct path
import { adminApi } from "../../data/api/adminApi";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { postApi } from "../../data/api/postApi";
import { chatApi } from "../../data/api/chatApi";



const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["U", "A"], // ✅ Persist both user & admin
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    auth: persistedAuthReducer, // ✅ Correctly persist auth reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(adminApi.middleware)
      .concat(postApi.middleware)
      .concat(chatApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
