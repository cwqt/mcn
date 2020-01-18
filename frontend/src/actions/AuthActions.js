import { AuthConsts } from "./types";
import { setModalWrapperState } from "./ModalActions";

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
	});
}
