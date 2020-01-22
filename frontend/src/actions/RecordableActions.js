import { RecordableConsts } from "./types";

export const createItem = modal => dispatch => {
	dispatch({
			type: RecordableConsts.CREATE,
			payload: modal,
	})	
}
