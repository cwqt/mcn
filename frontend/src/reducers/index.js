//root reducer
import { combineReducers } 	from "redux";
import { connectRouter } 		from 'connected-react-router'

import AuthReducer 					from './AuthReducer';
import ModalReducer 				from './ModalReducer';
import OverviewReducer	 		from "./OverviewReducer";
import PageReducer					from "./PageReducer";
import RecordableReducer 		from "./RecordableReducer";

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
	auth: AuthReducer,
	modal: ModalReducer,
	overview: OverviewReducer,
	page: PageReducer,
	recordable: RecordableReducer
})

export default createRootReducer