import { RecordableConsts } from "../actions/types";

const initialState = {
	isFetching: true,
	message: "",
	garden_child_ids: []
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
				message: `Created ${action.payload.type}!`,
				garden_child_ids: action.payload.data || []
			}
		case RecordableConsts.CREATE_FAILURE:
			return {
				...state,
				isFetching: false,
				message: action.payload.message
			}
		default:
			return state;
	}
}
