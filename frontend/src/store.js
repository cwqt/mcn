import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from "redux-thunk";
import logger from 'redux-logger';

import rootReducer from './reducers';

const initialState = {};
const middleware = [thunk, logger];

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: ["overview", "modal", "recordable", "page"],
	stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

//root reducer, initial state, enhancer
export const store = createStore(
	persistedReducer,
	initialState,
	compose(
		applyMiddleware(...middleware),
		//allow redux chrome extension to work
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

export const persistor = persistStore(store)
