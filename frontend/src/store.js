import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import autoMergeLevel2 		from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage 						from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk 							from "redux-thunk";
import logger 						from 'redux-logger';

import createRootReducer 	from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: [],
   // blacklist: ["modal", "recordable", "overview"],
	stateReconciler: autoMergeLevel2
}

export const history = createBrowserHistory()
const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

const middleware = [routerMiddleware(history), thunk, logger];
const initialState = {};

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
