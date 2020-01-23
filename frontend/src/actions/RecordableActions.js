import { RecordableConsts, ModalConsts } from "./types";

export const createRecordable = recordable => (dispatch, getStore) => {
	dispatch({ type: RecordableConsts.CREATE_LOADING })

	if (recordable.name == "") {
		dispatch({
			type: RecordableConsts.CREATE_FAILURE,
			payload: { message: "name cannot be empty!" }
		})
		return;
	}

	fetch(`/api/${recordable.type}s`, {
		method: "POST",
		headers: {
			"x-access-token": getStore().auth.currentToken,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: recordable.name,
			image: recordable.image
		})
	})
	.then(res => Promise.all([res.status, res.json()]))
	.then(([status, json]) => {
		console.log(json)
		if (status !== 201) {
			dispatch({
				type: RecordableConsts.CREATE_FAILURE,
				payload: { message: json.message }
			})
			return;
		}

		dispatch({
			type: RecordableConsts.CREATE_SUCCESS,
			payload: {}
		})
	})
}

export const deleteRecordable = recordable => (dispatch, getStore) => {
	
}