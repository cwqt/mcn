import { AuthConsts } from "../actions/types";

const initialState = {
	isFetching: false,
	isAuthorised: false,
	currentToken: "",
	message: "",
	keys: {}
};

export default function(state=initialState, action) {
	switch(action.type) {
		case AuthConsts.GET_API_KEYS_LOADING:
			return {
				...state,
				isFetching: true
			}
		case AuthConsts.GET_API_KEYS_SUCCESS:
			return {
				...state,
				isFetching: false,
				keys: action.payload
			}
		case AuthConsts.GET_API_KEYS_FAILURE:
			return {
				...state,
				isFetching: false,
				keys: {}
			}

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
