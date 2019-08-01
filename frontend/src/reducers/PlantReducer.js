//evalute any action committed, fetching/new post creation
//actions - have types (constants)

import {
	FETCH_PLANTS,
	NEW_PLANT,
	DELETE_PLANT,
	SELECT_PLANT
} from "../actions/types";

const initialState = {
	//represents plants from action, where we put he fetch req 
	items: [],
	//single plant that we add
	item: "",
	//item that has been selected for deletion
	selected_plant: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case FETCH_PLANTS:
			return {
				...state,
				items: action.payload
			}
		case SELECT_PLANT:
			return {
				...state,
				selected_plant: action.payload
			}
		case DELETE_PLANT:
		  return {
		  	...state,
		  	items: state.items.filter(item => item._id !== action.payload)
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
