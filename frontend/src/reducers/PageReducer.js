import { PageConsts } from "../actions/types";

const initialState = {
	isFetching: true,
	self: {},
	message: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
		case PageConsts.GET_SELF:
			switch(action.payload.status) {
				case "loading":
					return {
						...state,
						isFetching: true,
						message: "Getting object..."
					}
				case "success":
					return {
						...state,
						isFetching: false,
						self: action.payload.data,
						message: ""
					}
				case "failure":
					return {
						...state,
						isFetching: false,
						message: action.payload.message
					}
			}
		default:
			return state;
	}
}
