import { AuthConsts } from "./types";
import { setModalWrapperState } from "./ModalActions";
import toaster from "toasted-notes";

export const getApiKeys = () => (dispatch, getStore) => {
	dispatch({
		type: AuthConsts.GET_API_KEYS_LOADING
	})

	fetch("/api/auth/key", { headers: { "x-access-token": getStore().auth.currentToken }})
		.then(res => res.json())
		.then(data => {
			dispatch({
				type: AuthConsts.GET_API_KEYS_SUCCESS,
				payload: data.data,
			})
		})
}

 export const createApiKey = (for_object, password) => dispatch => {
 	dispatch({
 		type: AuthConsts.CREATE_API_KEY_LOADING
 	})
 
 	fetch("/api/auth/key", {
 		method: "POST",
 		headers: {
 			"Auth-Password": password,
 			"Content-type": "application/json"
 		},
 		body: JSON.stringify({
 			for: for_object
 		})
 	})
 		.then(res => res.json())
 		.then(data => {
 			dispatch({
 				type: AuthConsts.CREATE_API_KEY_SUCCESS,
 				payload: {
 					data: data.data,
 					title: data.data.for
 				}
 			})
		  toaster.notify(`Created ${data.data.for}`, {
		    duration: 3000,
		    position: "top-right"
		  })
 		})
 }

export const revokeApiKey = _id => (dispatch, getStore) => {
	dispatch({
		type: AuthConsts.REVOKE_API_KEY_LOADING,
		payload: _id
	})

	fetch(`/api/auth/key/${_id}`, {
		method: "DELETE",
		headers: {
			"x-access-token": getStore().auth.currentToken,
		}
	})
		.then(res => res.json())
		.then(data => {
			dispatch({
				type: AuthConsts.REVOKE_API_KEY_SUCCESS,
				payload: _id
			})
		  toaster.notify("Revoked API key!", {
		    duration: 3000,
		    position: "top-right"
		  })
		})
}

export const generateAccessToken = password => dispatch => {
	dispatch({
		type: AuthConsts.GET_TOKEN,
		payload: { status: "loading" }
	})

	fetch("/api/auth", { headers: { 'Auth-Password': password } })
		.then(res => Promise.all([res.status, res.json()]))
		.then(([status, data]) => {
			var payload = {
				status: status !== 200 ? "failure" : "success",
				token: data.data || "",
				created_at: data.created_at,
				message: data.message || "200"
			}
			dispatch({
				type: "SET_MODAL_WRAPPER_STATE",
				payload: payload.status
			})
			dispatch({
					type: AuthConsts.GET_TOKEN,
					payload: payload,
			})
			if (payload.status == "success") {
			  toaster.notify("Authenticated!", {
			    duration: 3000,
			    position: "top-right"
			  })
			}
	});
}

// export deAuth = () => {}