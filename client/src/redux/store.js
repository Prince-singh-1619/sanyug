import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
// import {thunk} from "redux-thunk";

// import slices
import userReducer from './slices/userSlice'
import chatReducer from './slices/chatSlice'
import convoReducer from './slices/convoSlice'
import onlineUsersReducer from './slices/onlineUsersSlice'
import settingReducer from './slices/settingSlice'

// combine all reducers here(future also)
const rootReducer = combineReducers({
    chat: chatReducer,
    convo: convoReducer,
    user: userReducer, 
    onlineUsers: onlineUsersReducer,
    settings: settingReducer,
});

// persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "chat", "settings"], // persist on refresh
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    // middleware: [thunk]  // already included by default
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)