import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import rootReducer from './reducers' ;

const initialState = {};
const middleware = [thunk];

//root reducer, initial state, enhancer
const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(...middleware),
		//allow redux chrome extension to work
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);


export default store;