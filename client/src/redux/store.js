import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
// import {thunk} from "redux-thunk";

// import slices
import chatReducer from './slices/chatSlice'
import convoReducer from './slices/convoSlice'

// combine all reducers here(future also)
const rootReducer = combineReducers({
    chat: chatReducer,
    convo: convoReducer,
    // user: userReducer,   // (future)
    // settings: settingsReducer,
});

// persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["chat"], // only persist chat (can add user, settings later)
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
// export default store