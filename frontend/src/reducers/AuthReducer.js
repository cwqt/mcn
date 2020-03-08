import { AuthConsts } from "../actions/types";

const initialState = {
	isFetching: false,
	isAuthorised: false,
	currentToken: "",
	created_at: 0,
	message: "",
	keys: [],
	key: {}
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

		case AuthConsts.REVOKE_API_KEY_LOADING:
			return {
				...state,
				isFetching: true
			}
		case AuthConsts.REVOKE_API_KEY_SUCCESS:
			return {
				...state,
				isFetching: false,
				keys: state.keys.filter(key => key._id !== action.payload)
			}
		case AuthConsts.REVOKE_API_KEY_FAILURE:
			return {
				...state,
				isFetching: false,
				message: "Error"
			}

		case AuthConsts.CREATE_API_KEY_LOADING:
			return {
				...state,
				isFetching: true
			}
		case AuthConsts.CREATE_API_KEY_SUCCESS:
			return {
				...state,
				isFetching: false,
				keys: [...state.keys, action.payload.data],
				key: action.payload.data,
				message: `Created ${action.payload.title}`
			}
		case AuthConsts.CREATE_API_KEY_FAILURE:
			return {
				...state,
				isFetching: false,
				message: "Error"
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
						created_at: action.payload.created_at,
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
