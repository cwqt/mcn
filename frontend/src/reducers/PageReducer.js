import { PageConsts } from "../actions/types";

const initialState = {
	isFetching: false,
	self: {},
	measurements: {},
	message: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case PageConsts.GET_SELF_LOADING:
			return {
				...state,
				isFetching: true,
				message: "Getting object..."
			}
		case PageConsts.GET_SELF_SUCCESS:
			return {
				...state,
				isFetching: false,
				self: action.payload.data,
				message: ""
			}
		case PageConsts.GET_SELF_FAILURE:
			return {
				...state,
				isFetching: false,
				self: {},
				message: action.payload.message
			}
			
		case PageConsts.GET_MEASUREMENTS_LOADING:
			return {
				...state,
				isFetching: true,
				message: "Getting measurements..."
			}
		case PageConsts.GET_MEASUREMENTS_SUCCESS:
			return {
				...state,
				isFetching: false,
				measurements: action.payload.data,
				message: ""
			}
		case PageConsts.GET_MEASUREMENTS_FAILURE:
			return {
				...state,
				isFetching: false,
				measurements: {},
				message: action.payload.message
			}
		default:
			return state;
	}
}
