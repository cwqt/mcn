import toaster from "toasted-notes";
import { push } from 'connected-react-router';
import { fetchAllPlantsAndGardens } from "./OverviewActions"

import { RecordableConsts, ModalConsts, OverviewConsts } from "./types";

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
		console.log(status)
		if (status !== 200) {
			dispatch({
				type: RecordableConsts.CREATE_FAILURE,
				payload: { message: json.message }
			})
			return;
		}

		dispatch({ type: RecordableConsts.CREATE_SUCCESS })
		dispatch({ type: ModalConsts.SET_MODAL_VISIBILITY, payload: false})
		dispatch(fetchAllPlantsAndGardens())
	})
}

export const deleteRecordable = recordable => (dispatch, getStore) => {
 	dispatch({ type: RecordableConsts.DELETE_LOADING })
 
 	fetch(`/api/${recordable.type}s/${recordable._id}`, {
 		method: "DELETE",
 		headers: {
 			"x-access-token": getStore().auth.currentToken,
 		}
 	})
 	.then(res => Promise.all([res.status, res.json()]))
 	.then(([status, json]) => {
 		if (status !== 200) {
 			dispatch({
 				type: RecordableConsts.DELETE_FAILURE,
 				payload: { message: json.message }
 			})
 			return;
 		}
 
 		dispatch({ type: RecordableConsts.DELETE_SUCCESS })
 		dispatch({ type: OverviewConsts.REMOVE_ITEM, payload: recordable._id })

		toaster.notify(`Deleted ${recordable.name}!`, {
		 duration: 3000,
		 position: "top-right"
		})
		dispatch({ type: ModalConsts.SET_MODAL_VISIBILITY, payload: false})
		dispatch(push("/"))
 })
}

export const editRecordable = recordable => (dispatch, getStore) => {

}



