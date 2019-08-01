import { AUTH_USER } from "../actions/types";

const initialState = {
	isAuthorised: false,
	currentToken: "",
	response: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case AUTH_USER:
			return {
				...state,
				isAuthorised: action.payload.isAuthorised,
				currentToken: action.payload.token,
				response: action.payload.response
			}
		default:
			return state;
	}
}
