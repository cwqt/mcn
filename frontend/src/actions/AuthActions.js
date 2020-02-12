import { AuthConsts } from "./types";
import { setModalWrapperState } from "./ModalActions";
import toaster from "toasted-notes";

export const removeAccessToken = () => dispatch => {

}

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

export const revokeApiKey = () => dispatch => {

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
