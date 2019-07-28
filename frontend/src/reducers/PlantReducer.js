//evalute any action committed, fetching/new post creation
//actions - have types (constants)

import { FETCH_PLANTS, NEW_PLANT } from "../actions/types";

const initialState = {
	//represents plants from action, where we put he fetch req 
	items: [],
	//single plant that we add
	item: {}
};

export default function(state=initialState, action) {
	switch(action.type) {
		case FETCH_PLANTS:
			return {
				...state,
				items: action.payload
			}
		default:
			return state;
	}
}
