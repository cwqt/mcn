import { RecordableConsts } from "../actions/types";

const initialState = {
	isFetching: true,
	message: "",
};

export default function(state=initialState, action) {
	switch(action.type) {
		case RecordableConsts.CREATE_LOADING:
			return {
				...state,
				isFetching: true,
				message: "Creating..."
			}
		case RecordableConsts.CREATE_SUCCESS:
			return {
				...state,
				isFetching: false,
				message: `Created!`,
			}
		case RecordableConsts.CREATE_FAILURE:
			return {
				...state,
				isFetching: false,
				message: action.payload.message
			}

		case RecordableConsts.DELETE_LOADING:
			return {
				...state,
				isFetching: true,
				message: "Deleting..."
			}
		case RecordableConsts.DELETE_SUCCESS:
			return {
				...state,
				isFetching: false,
				message: "Deleted!"
			}
		case RecordableConsts.DELETE_FAILURE:
			return {
				...state,
				isFetching: false,
				message: action.payload.message
			}
		default:
			return state;
	}
}
