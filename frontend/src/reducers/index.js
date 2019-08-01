//root reducer
import { combineReducers } from "redux";
import PlantReducer from './PlantReducer';
import AuthReducer from './AuthReducer';
import ModalReducer from './ModalReducer';

export default combineReducers({
	plants: PlantReducer,
	auth: AuthReducer,
	modal: ModalReducer
})