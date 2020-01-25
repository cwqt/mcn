import toaster from "toasted-notes";
import { push } from 'connected-react-router'

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
	console.log("hellooooo")	
	dispatch(push("/"))

// 	dispatch({ type: RecordableConsts.DELETE_LOADING })
// 
// 	fetch(`/api/${recordable.type}s/${recordable._id}`, {
// 		method: "DELETE",
// 		headers: {
// 			"x-access-token": getStore().auth.currentToken,
// 		}
// 	})
// 	.then(res => Promise.all([res.status, res.json()]))
// 	.then(([status, json]) => {
// 		if (status !== 200) {
// 			dispatch({
// 				type: RecordableConsts.DELETE_FAILURE,
// 				payload: { message: json.message }
// 			})
// 			return;
// 		}
// 
// 		dispatch({
// 			type: RecordableConsts.DELETE_SUCCESS,
// 			payload: {}
// 		})
// 	  // toaster.notify(getStore().recordable.message, {
// 	  //   duration: 2000,
// 	  //   position: "top-right"
// 	  // })
// })

}





