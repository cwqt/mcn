//root reducer
import { combineReducers } from "redux";
import PlantReducer from './PlantReducer'; 

export default combineReducers({
	plants: PlantReducer
})