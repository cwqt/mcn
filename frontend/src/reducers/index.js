//root reducer
import { combineReducers } 	from "redux";

import AuthReducer 					from './AuthReducer';
import ModalReducer 				from './ModalReducer';
import OverviewReducer	 		from "./OverviewReducer";
import PageReducer					from "./PageReducer";
import RecordableReducer 		from "./RecordableReducer";

export default combineReducers({
	auth: AuthReducer,
	modal: ModalReducer,
	overview: OverviewReducer,
	page: PageReducer,
	recordable: RecordableReducer
})