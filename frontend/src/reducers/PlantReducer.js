//evalute any action committed, fetching/new post creation
//actions - have types (constants)

import { FETCH_PLANTS, NEW_PLANT, DELETE_PLANT } from "../actions/types";

const initialState = {
	//represents plants from action, where we put he fetch req 
	items: [],
	//single plant that we add
	item: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case FETCH_PLANTS:
			return {
				...state,
				items: action.payload
			}
		case DELETE_PLANT:
			console.log(action.payload._id)
		  return {
		  	...state,
		  	items: state.items.filter(item => item._id.$oid !== action.payload._id)
		  }
		case NEW_PLANT:
			return {
				...state,
				items: [action.payload, ...state.items]
			}		
		default:
			return state;
	}
}
