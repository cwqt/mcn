import { AuthConsts } from "../actions/types";

const initialState = {
	isAuthorised: false,
	currentToken: "",
	message: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case AuthConsts.GET_TOKEN:
			switch(action.payload.status) {
				case "loading":
					return {
						...state,
						message: "Attempting to authenticate..."
					}
				case "success":
					return {
						...state,
						isAuthorised: true,
						currentToken: action.payload.token,
						message: ""
					}
				case "failure":
					return {
						...state,
						isAuthorised: false,
						currentToken: "",
						message: action.payload.message
					}
			}
		default:
			return state;
	}
}
