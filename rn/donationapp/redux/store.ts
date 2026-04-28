// Importing the combineReducers function from Redux
import { combineReducers } from 'redux';

// Importing the configureStore function from the Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Importing the User reducer from the ./reducers/User file
import UserReducer from './reducers/User';
import CategoriesReducer from './reducers/Categories';
import DonationsReducer from './reducers/Donations';

// import { logger } from 'redux-logger';
// Creating a rootReducer that combines all reducers in the app

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  // Here, we're combining the User reducer and calling it "user"
  user: UserReducer,
  categories: CategoriesReducer,
  donations: DonationsReducer,
});

// Configuring the redux-persist library to persist the root reducer with AsyncStorage
const configuration = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
};

// Creating a new persisted reducer with the configuration and root reducer
const persistedReducer = persistReducer(configuration, rootReducer);

// Creating a new Redux store using the configureStore function
// We're passing in the persisted reducer as the main reducer for the store
const store = configureStore({
  reducer: persistedReducer,
  // middleware: getDefaultMiddleware => {
  //   return getDefaultMiddleware().concat(logger);
  // },

  // Using the getDefaultMiddleware function from the Redux Toolkit to add default middleware to the store
  // We're passing in an object with the serializableCheck key set to false to avoid serialization errors with non-serializable data
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

// Exporting the store to be used in the app
export default store;

// RootState type
export type RootState = ReturnType<typeof store.getState>;

// exporting the persistor object created with the persistStore function from redux-persist
export const persistor = persistStore(store);
// persistor.purge();
